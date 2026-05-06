import { HELP_CENTER_PAYLOAD } from "@/lib/help-content";
import { NextResponse } from "next/server";

/**
 * GET /api/help
 * Public help center payload (JSON). Mirror on Laravel as GET /api/help if you centralize content.
 */
export async function GET() {
    return NextResponse.json(HELP_CENTER_PAYLOAD, {
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });
}
