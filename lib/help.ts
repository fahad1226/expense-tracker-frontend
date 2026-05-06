import type { HelpCenterPayload } from "@/lib/help-content";

export type SupportContactPayload = {
    category: string;
    subject: string;
    message: string;
    replyEmail?: string;
};

export async function fetchHelpContent(): Promise<HelpCenterPayload> {
    const res = await fetch("/api/help", {
        credentials: "same-origin",
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`Help API error: ${res.status}`);
    }
    return res.json() as Promise<HelpCenterPayload>;
}

export type SupportContactResponse = {
    id: string;
    receivedAt: string;
};

export async function submitSupportContact(
    payload: SupportContactPayload & { website?: string },
): Promise<SupportContactResponse> {
    const res = await fetch("/api/help/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            category: payload.category,
            subject: payload.subject,
            message: payload.message,
            replyEmail: payload.replyEmail || undefined,
            website: payload.website ?? "",
        }),
    });

    const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        id?: string;
        receivedAt?: string;
    };

    if (!res.ok) {
        throw new Error(data.message ?? "Could not send message.");
    }

    if (!data.id || !data.receivedAt) {
        throw new Error("Invalid response from server.");
    }

    return { id: data.id, receivedAt: data.receivedAt };
}
