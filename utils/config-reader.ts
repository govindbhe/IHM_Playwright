import configData from "../config/config.json" with { type: "json" };

const resolveVal = (val: string | undefined): string => {
    if (val && val.startsWith("${") && val.endsWith("}")) {
        const envKey = val.slice(2, -1);
        return process.env[envKey] || "";
    }
    return val || "";
};

export const config = {
    url: process.env.URL || process.env.url || resolveVal(configData.app.url) || "https://www.indiahandmade.com/",
    sellerEmail: process.env.SELLER_EMAIL || process.env.seller_email || resolveVal(configData.app.seller_email),
    sellerPassword: process.env.SELLER_PASSWORD || process.env.seller_password || resolveVal(configData.app.seller_password),
    giSellerEmail: process.env.GI_SELLER_EMAIL || process.env.gi_seller_email || resolveVal(configData.app.gi_seller_email),
    giSellerPassword: process.env.GI_SELLER_PASSWORD || process.env.gi_seller_password || resolveVal(configData.app.gi_seller_password),
    buyerMobile: process.env.BUYER_MOBILE || process.env.buyer_mobile || resolveVal(configData.app.buyer_mobile) || "9763274722",
    buyerEmail: process.env.BUYER_EMAIL || process.env.buyer_email || resolveVal(configData.app.buyer_email),
    buyerOtpEmailPassword: process.env.BUYER_OTP_EMAIL_PASSWORD || process.env.buyer_otp_email_password || resolveVal(configData.app.buyer_otp_email_password),
    /* IMAP settings used to read the login OTP from the buyer mailbox. */
    imapHost: process.env.IMAP_HOST || process.env.imap_host || "imap.gmail.com",
    imapPort: Number(process.env.IMAP_PORT || process.env.imap_port || 993)
};

export class ConfigReader {
    static getProperty(key: string): string | undefined {
        const k = key.toLowerCase();
        if (k === "url" || k === "app.url") {
            return config.url;
        }
        if (k === "seller_email" || k === "seller_email") {
            return config.sellerEmail;
        }
        if (k === "seller_password" || k === "seller_password") {
            return config.sellerPassword;
        }
        if (k === "gi_seller_email" || k === "gi_seller_email") {
            return config.giSellerEmail;
        }
        if (k === "gi_seller_password" || k === "gi_seller_password") {
            return config.giSellerPassword;
        }
        if (k === "buyer_mobile" || k === "buyer_mobile") {
            return config.buyerMobile;
        }
        if (k === "buyer_email") {
            return config.buyerEmail;
        }
        if (k === "buyer_otp_email_password") {
            return config.buyerOtpEmailPassword;
        }
        return process.env[key];
    }
}

export default ConfigReader;
