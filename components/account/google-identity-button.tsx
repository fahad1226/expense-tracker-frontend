"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

type GoogleIdentityButtonProps = {
    onCredential: (credential: string) => void;
    disabled?: boolean;
    /** Maps to GIS `text` option */
    variant?: "continue_with" | "signup_with" | "signin_with";
    className?: string;
};

export function GoogleIdentityButton({
    onCredential,
    disabled,
    variant = "continue_with",
    className,
}: GoogleIdentityButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const callbackRef = useRef(onCredential);
    callbackRef.current = onCredential;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const render = useCallback(() => {
        if (disabled || !clientId) return;
        const el = containerRef.current;
        const g = window.google?.accounts?.id;
        if (!el || !g) return;

        el.innerHTML = "";
        g.initialize({
            client_id: clientId,
            callback: (res) => {
                if (res.credential) callbackRef.current(res.credential);
            },
            auto_select: false,
        });

        const width = Math.min(
            400,
            Math.max(280, Math.floor(el.getBoundingClientRect().width) || 320),
        );

        g.renderButton(el, {
            theme: "outline",
            size: "large",
            text: variant,
            width,
            shape: "rectangular",
            logo_alignment: "left",
        });
    }, [clientId, disabled, variant]);

    useEffect(() => {
        if (!clientId) return;

        let cancelled = false;

        const boot = () => {
            if (cancelled) return;
            requestAnimationFrame(() => render());
        };

        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${SCRIPT_SRC}"]`,
        );

        if (window.google?.accounts?.id) {
            boot();
        } else if (existing) {
            existing.addEventListener("load", boot, { once: true });
        } else {
            const script = document.createElement("script");
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = boot;
            document.body.appendChild(script);
        }

        window.addEventListener("resize", render);

        return () => {
            cancelled = true;
            window.removeEventListener("resize", render);
        };
    }, [clientId, render]);

    if (!clientId) {
        return (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-center text-xs text-amber-900/80">
                Add{" "}
                <span className="font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</span> to
                enable Google. Use the same OAuth client ID as{" "}
                <span className="font-mono">GOOGLE_CLIENT_ID</span> on the API.
            </p>
        );
    }

    return (
        <div
            className={cn(
                "flex min-h-[44px] w-full items-center justify-center [&>div]:w-full",
                disabled && "pointer-events-none opacity-50",
                className,
            )}
        >
            <div ref={containerRef} className="w-full" />
        </div>
    );
}
