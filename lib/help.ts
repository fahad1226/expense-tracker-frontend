import type { HelpCenterPayload } from "@/lib/help-content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    const res = await fetch(`${API_BASE_URL}/support/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
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
        errors?: Record<string, string[]>;
        id?: string;
        receivedAt?: string;
    };

    if (!res.ok) {
        const first =
            data.message ??
            (data.errors && Object.values(data.errors).flat()[0]) ??
            "Could not send message.";
        throw new Error(first);
    }

    if (!data.id || !data.receivedAt) {
        throw new Error("Invalid response from server.");
    }

    return { id: data.id, receivedAt: data.receivedAt };
}
