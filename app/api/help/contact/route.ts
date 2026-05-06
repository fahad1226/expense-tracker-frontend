import { NextResponse } from "next/server";

type ContactBody = {
    category?: string;
    subject?: string;
    message?: string;
    replyEmail?: string;
    /** Honeypot — must be empty */
    website?: string;
};

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_EMAIL = 254;

function isValidEmail(s: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

/**
 * POST /api/help/contact
 * Accepts support messages. Wire Laravel later: same shape → persist ticket + optional email.
 */
export async function POST(request: Request) {
    let body: ContactBody;
    try {
        body = (await request.json()) as ContactBody;
    } catch {
        return NextResponse.json(
            { message: "Invalid JSON body." },
            { status: 400 },
        );
    }

    if (body.website && body.website.trim() !== "") {
        return NextResponse.json(
            { id: crypto.randomUUID(), receivedAt: new Date().toISOString() },
            { status: 201 },
        );
    }

    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();
    const category = (body.category ?? "other").trim().slice(0, 64);
    const replyEmail = (body.replyEmail ?? "").trim();

    if (subject.length < 3 || subject.length > MAX_SUBJECT) {
        return NextResponse.json(
            {
                message: `Subject must be between 3 and ${MAX_SUBJECT} characters.`,
            },
            { status: 422 },
        );
    }

    if (message.length < 20 || message.length > MAX_MESSAGE) {
        return NextResponse.json(
            {
                message: `Message must be between 20 and ${MAX_MESSAGE} characters.`,
            },
            { status: 422 },
        );
    }

    if (replyEmail && replyEmail.length > MAX_EMAIL) {
        return NextResponse.json(
            { message: "Reply email is too long." },
            { status: 422 },
        );
    }

    if (replyEmail && !isValidEmail(replyEmail)) {
        return NextResponse.json(
            { message: "Please enter a valid reply email." },
            { status: 422 },
        );
    }

    const id = crypto.randomUUID();
    const receivedAt = new Date().toISOString();

    if (process.env.NODE_ENV === "development") {
        console.info("[support/contact]", {
            id,
            receivedAt,
            category,
            subject,
            replyEmail: replyEmail || null,
            messagePreview: message.slice(0, 120) + (message.length > 120 ? "…" : ""),
        });
    }

    const webhook = process.env.SUPPORT_CONTACT_WEBHOOK_URL;
    if (webhook) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    receivedAt,
                    category,
                    subject,
                    message,
                    replyEmail: replyEmail || null,
                }),
            });
        } catch {
            // Still acknowledge to user; ops can retry via logs if needed
        }
    }

    return NextResponse.json({ id, receivedAt }, { status: 201 });
}
