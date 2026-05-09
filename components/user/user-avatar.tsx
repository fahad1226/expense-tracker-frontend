"use client";

import { getUserInitials } from "@/lib/user-initials";
import { cn } from "@/lib/utils";
import Image from "next/image";

const sizeClasses = {
    sm: "size-8 text-[11px]",
    md: "size-9 text-sm",
    lg: "size-20 text-lg",
} as const;

export type UserAvatarSize = keyof typeof sizeClasses;

type UserAvatarProps = {
    name: string;
    avatarUrl: string | null | undefined;
    size?: UserAvatarSize;
    className?: string;
};

export function UserAvatar({
    name,
    avatarUrl,
    size = "md",
    className,
}: UserAvatarProps) {
    const initials = getUserInitials(name);
    const dim = sizeClasses[size];

    console.log("avatarUrl: ", avatarUrl);

    if (avatarUrl) {
        return (
            <Image
                src={avatarUrl}
                alt={name + " avatar - Expense Tracker"}
                width={100}
                height={100}
                loading="lazy"
                className={cn(
                    "rounded-full object-cover shadow-sm ring-2 ring-white",
                    dim,
                    className,
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 font-semibold tracking-tight text-white shadow-sm ring-2 ring-white",
                dim,
                className,
            )}
            aria-hidden
        >
            {initials}
        </div>
    );
}
