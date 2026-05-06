"use client";

import { useAuth } from "@/context/auth-context";
import { setActiveCurrency } from "@/lib/currency";
import { useEffect } from "react";

/** Keeps Intl currency formatting in sync with the signed-in user. */
export function CurrencySync() {
    const { user } = useAuth();

    useEffect(() => {
        setActiveCurrency(user?.currency);
    }, [user?.currency]);

    return null;
}
