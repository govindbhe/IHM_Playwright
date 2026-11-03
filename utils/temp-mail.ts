/**
 * Disposable-inbox client backed by the mail.tm API.
 *
 * Used to automate buyer OTP login: create a throwaway inbox, use its address as the
 * login identifier (the login field accepts "Mobile Number / Email"), then read the
 * delivered OTP back out of that inbox. Verified live against indiahandmade.com, which
 * accepts these addresses and emails the OTP from noreply@indiahandmade.com.
 *
 * No credentials or configuration required — each inbox is created on demand.
 */

const MAILTM_BASE = process.env.TEMPMAIL_BASE || "https://api.mail.tm";

export interface TempInbox {
    address: string;
    token: string;
    /** Cutoff for OTP freshness; set to inbox-creation time. */
    createdAt: number;
}

async function apiJson(url: string, init?: RequestInit): Promise<{ status: number; body: any }> {
    const res = await fetch(url, init);
    const text = await res.text();
    let body: any = text;
    try {
        body = text ? JSON.parse(text) : {};
    } catch {
        /* leave body as raw text */
    }
    return { status: res.status, body };
}

/** Creates a fresh disposable inbox and returns its address + auth token. */
export async function createTempInbox(): Promise<TempInbox> {
    const domains = await apiJson(`${MAILTM_BASE}/domains`);
    const domain: string | undefined = domains.body?.["hydra:member"]?.[0]?.domain;
    if (!domain) {
        throw new Error(`temp-mail: no domain available (status ${domains.status})`);
    }

    const address = `ihm_${Date.now()}_${Math.floor(Math.random() * 1e4)}@${domain}`;
    const password = `Ihm@${Date.now()}`;

    const account = await apiJson(`${MAILTM_BASE}/accounts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, password }),
    });
    if (account.status >= 400) {
        throw new Error(`temp-mail: account creation failed (status ${account.status}): ${JSON.stringify(account.body)}`);
    }

    const tokenRes = await apiJson(`${MAILTM_BASE}/token`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, password }),
    });
    const token: string | undefined = tokenRes.body?.token;
    if (!token) {
        throw new Error(`temp-mail: token request failed (status ${tokenRes.status})`);
    }

    return { address, token, createdAt: Date.now() };
}

/** Pulls out a numeric OTP, preferring codes near OTP-ish wording. */
function extractOtp(text: string, digits: number): string | null {
    const labelled = new RegExp(
        `(?:otp|one[\\s-]*time|verification|code|password)[^0-9]{0,40}(\\d{${digits}})`,
        "i"
    );
    const standalone = new RegExp(`(?<!\\d)(\\d{${digits}})(?!\\d)`);
    return text.match(labelled)?.[1] ?? text.match(standalone)?.[1] ?? null;
}

/**
 * Polls the inbox until an OTP arrives.
 *
 * @param inbox     inbox returned by createTempInbox
 * @param since     only accept mail received at/after this time (default: inbox creation)
 * @param options   timeout / poll interval / expected digit count
 */
export async function waitForOtp(
    inbox: TempInbox,
    since: number = inbox.createdAt,
    options: { timeoutMs?: number; pollIntervalMs?: number; digits?: number } = {}
): Promise<string> {
    const { timeoutMs = 90000, pollIntervalMs = 3000, digits = 6 } = options;
    const auth = { headers: { authorization: `Bearer ${inbox.token}` } };
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const list = await apiJson(`${MAILTM_BASE}/messages`, auth);
        const messages: any[] = list.body?.["hydra:member"] ?? [];

        // Newest first so a fresh code wins over any older one.
        for (const meta of messages) {
            const receivedAt = new Date(meta.createdAt).getTime();
            if (receivedAt < since - 60000) continue;

            const full = await apiJson(`${MAILTM_BASE}/messages/${meta.id}`, auth);
            const htmlParts: string[] = Array.isArray(full.body?.html) ? full.body.html : [];
            const haystack = [meta.subject, meta.intro, full.body?.text, ...htmlParts]
                .filter(Boolean)
                .join("\n");

            const otp = extractOtp(haystack, digits);
            if (otp) {
                console.log(`✓ OTP received in temp inbox (subject: "${meta.subject}")`);
                return otp;
            }
        }

        await new Promise((r) => setTimeout(r, pollIntervalMs));
    }

    throw new Error(
        `temp-mail: no ${digits}-digit OTP arrived for ${inbox.address} within ${timeoutMs}ms of ${new Date(since).toISOString()}`
    );
}
