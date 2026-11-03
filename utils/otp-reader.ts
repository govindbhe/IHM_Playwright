import { ImapFlow } from "imapflow";
import { config } from "./config-reader";

export interface FetchOtpOptions {
    /**
     * Only accept messages received at/after this time. Capture this *before*
     * clicking "Get OTP" so a previously delivered code is never reused.
     */
    since: Date;
    /** How long to keep polling for the mail to arrive. Default 180s. */
    timeoutMs?: number;
    /** Gap between inbox polls. Default 3s. */
    pollIntervalMs?: number;
    /** Expected OTP length. Default 6. */
    digits?: number;
    /** Mailbox to search. Default "INBOX". */
    mailbox?: string;
    /**
     * Optional callback to re-request the OTP (e.g. click "Resend OTP" in the UI)
     * if no code has arrived yet. Invoked once, after `resendAfterMs` has elapsed
     * without a match. Lets us recover when the first send request is silently
     * dropped or throttled by the site.
     */
    onResend?: () => Promise<void>;
    /** Delay before invoking `onResend`. Default 60s. */
    resendAfterMs?: number;
}

/** Decodes a single MIME part body according to its Content-Transfer-Encoding. */
function decodePart(raw: string): string {
    const headerSplit = raw.search(/\r?\n\r?\n/);
    if (headerSplit === -1) return raw;

    const headers = raw.slice(0, headerSplit).toLowerCase();
    const body = raw.slice(headerSplit).replace(/^\r?\n\r?\n/, "");

    if (/content-transfer-encoding:\s*base64/.test(headers)) {
        try {
            return Buffer.from(body.replace(/[\r\n]/g, ""), "base64").toString("utf8");
        } catch {
            return body;
        }
    }

    if (/content-transfer-encoding:\s*quoted-printable/.test(headers)) {
        return body
            .replace(/=\r?\n/g, "")
            .replace(/=([0-9A-Fa-f]{2})/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
    }

    return body;
}

/**
 * Pulls every plausible text representation out of a raw RFC822 message:
 * the raw source plus each decoded MIME part. Cheap, and avoids needing a
 * full MIME parser just to find a numeric code.
 */
function candidateTexts(source: string): string[] {
    const texts: string[] = [source];

    const boundaryMatch = source.match(/boundary="?([^"\r\n;]+)"?/i);
    if (boundaryMatch) {
        const parts = source.split("--" + boundaryMatch[1]);
        for (const part of parts) {
            texts.push(decodePart(part));
        }
    } else {
        texts.push(decodePart(source));
    }

    return texts;
}

/**
 * Placeholder / boilerplate numbers that appear in the OTP email template but are NOT
 * the real code. The indiahandmade OTP mail contains several 6-digit runs; some are
 * fixed template values (e.g. 010901, 000000) and only one is the live OTP. Picking a
 * placeholder was the cause of "Incorrect otp".
 */
const OTP_PLACEHOLDERS = new Set(["000000", "010901", "123456", "111111"]);

function extractOtp(texts: string[], digits: number): string | null {
    const standalone = new RegExp(`(?<!\\d)(\\d{${digits}})(?!\\d)`, "g");

    // Gather every N-digit run across all representations, dropping known placeholders.
    const realCandidates: string[] = [];
    for (const text of texts) {
        for (const m of text.matchAll(standalone)) {
            const code = m[1];
            if (!OTP_PLACEHOLDERS.has(code)) {
                realCandidates.push(code);
            }
        }
    }

    if (realCandidates.length === 0) {
        return null;
    }

    // The real OTP is the only run that changes between emails. In this template the
    // live code is the LAST non-placeholder 6-digit run, so prefer that.
    return realCandidates[realCandidates.length - 1];
}

/**
 * Connects to the configured mailbox over IMAP and returns the newest OTP
 * delivered at/after `since`.
 *
 * Requires BUYER_EMAIL and BUYER_OTP_EMAIL_PASSWORD in .env. For Gmail the
 * password must be an app-specific password (Google blocks basic auth), and
 * IMAP must be enabled on the account.
 */
export async function fetchLatestOtp(options: FetchOtpOptions): Promise<string> {
    const {
        since,
        timeoutMs = 180000,
        pollIntervalMs = 3000,
        digits = 6,
        mailbox = "INBOX",
        onResend,
        resendAfterMs = 60000,
    } = options;

    const user = config.buyerEmail;
    const pass = config.buyerOtpEmailPassword;

    if (!user || !pass) {
        throw new Error(
            "OTP email retrieval is not configured. Set BUYER_EMAIL and " +
            "BUYER_OTP_EMAIL_PASSWORD in .env. For Gmail, BUYER_OTP_EMAIL_PASSWORD " +
            "must be an app-specific password and IMAP must be enabled."
        );
    }

    const client = new ImapFlow({
        host: config.imapHost,
        port: config.imapPort,
        secure: true,
        auth: { user, pass },
        logger: false,
    });

    await client.connect();

    try {
        const start = Date.now();
        const deadline = start + timeoutMs;
        // IMAP SINCE has date-only granularity, so search broadly from today and do the
        // precise time filtering in code below.
        const searchSince = new Date(since.getTime() - 24 * 60 * 60_000);
        let resendDone = false;

        while (Date.now() < deadline) {
            // If nothing has arrived after resendAfterMs, re-request the OTP once.
            if (onResend && !resendDone && Date.now() - start >= resendAfterMs) {
                resendDone = true;
                try {
                    console.log("No OTP yet; re-requesting via onResend callback.");
                    await onResend();
                } catch (err) {
                    console.log("onResend callback failed: " + (err as Error).message);
                }
            }

            const lock = await client.getMailboxLock(mailbox);
            try {
                const uids = await client.search({ since: searchSince }, { uid: true });

                if (uids && uids.length) {
                    // Collect only messages that arrived AFTER the OTP was requested, so a
                    // previously delivered code can never be reused (that was causing
                    // "Incorrect otp"). Then pick the single newest one.
                    type Candidate = { uid: number; received: number; otp: string };
                    const candidates: Candidate[] = [];

                    for (const uid of uids) {
                        const message = await client.fetchOne(
                            String(uid),
                            { source: true, envelope: true, internalDate: true },
                            { uid: true }
                        );
                        if (!message) continue;

                        const received = message.internalDate ?? new Date(0);
                        // Strict cutoff: must be at/after the request time (small 5s skew
                        // allowance for mail-server vs local clock differences).
                        if (received.getTime() < since.getTime() - 5_000) continue;

                        const source = message.source?.toString("utf8") ?? "";
                        const subject = message.envelope?.subject ?? "";
                        const otp = extractOtp([subject, ...candidateTexts(source)], digits);
                        if (otp) {
                            candidates.push({ uid: Number(uid), received: received.getTime(), otp });
                        }
                    }

                    if (candidates.length) {
                        // Newest by actual receive time (fall back to highest UID on ties).
                        candidates.sort((a, b) => b.received - a.received || b.uid - a.uid);
                        const best = candidates[0];
                        console.log(
                            `OTP retrieved from mailbox (uid ${best.uid}, received ${new Date(best.received).toISOString()})`
                        );
                        return best.otp;
                    }
                }
            } finally {
                lock.release();
            }

            await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        }

        throw new Error(
            `No ${digits}-digit OTP found in ${mailbox} within ${timeoutMs}ms of ${since.toISOString()}. ` +
            "Confirm the OTP is delivered by email (not only SMS) to " + user + "."
        );
    } finally {
        await client.logout().catch(() => { });
    }
}

export default fetchLatestOtp;
