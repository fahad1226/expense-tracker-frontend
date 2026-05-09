"use client";

import { useAuth } from "@/context/auth-context";
import {
    fetchSettings,
    patchSettings,
    removeAvatarApi,
    updatePasswordApi,
    uploadAvatarApi,
    type SettingsPayload,
} from "@/lib/settings";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";
import {
    CameraIcon,
    GlobeIcon,
    LockIcon,
    MonitorIcon,
    MoonIcon,
    PaletteIcon,
    SunIcon,
    Trash2Icon,
    UserIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { refetchUser, user: authUser } = useAuth();
    const [payload, setPayload] = useState<SettingsPayload | null>(null);
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("BDT");
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSettings();
            setPayload(data);
            setName(data.user.name);
            setCurrency(data.user.currency);
        } catch {
            toast.error("Could not load settings.");
            setPayload(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const saveProfile = async () => {
        if (!payload) return;
        setSavingProfile(true);
        try {
            const updated = await patchSettings({
                name: name.trim(),
                currency,
            });
            setPayload(updated);
            await refetchUser();
            toast.success("Profile updated");
        } catch {
            toast.error("Could not save profile.");
        } finally {
            setSavingProfile(false);
        }
    };

    const savePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setSavingPassword(true);
        try {
            await updatePasswordApi({
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated");
        } catch {
            toast.error("Could not update password. Check your current password.");
        } finally {
            setSavingPassword(false);
        }
    };

    const email = payload?.user.email ?? authUser?.email ?? "";
    const avatarUrl = payload?.user.avatar_url ?? authUser?.avatar_url ?? null;
    const displayName =
        name.trim() ||
        payload?.user.name ||
        authUser?.name ||
        "User";

    const pickAvatarFile = () => {
        avatarInputRef.current?.click();
    };

    const onAvatarSelected = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !payload) {
            return;
        }
        setUploadingAvatar(true);
        try {
            const updated = await uploadAvatarApi(file);
            setPayload(updated);
            await refetchUser();
            toast.success("Profile photo updated");
        } catch {
            toast.error("Could not upload photo. Try a JPG or PNG under 2 MB.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const removeAvatar = async () => {
        if (!avatarUrl) {
            return;
        }
        setUploadingAvatar(true);
        try {
            const updated = await removeAvatarApi();
            setPayload(updated);
            await refetchUser();
            toast.success("Profile photo removed");
        } catch {
            toast.error("Could not remove photo.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Settings
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    Account, currency, and preferences.
                </p>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Loading…</p>
            ) : (
                <>
                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <GlobeIcon className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Currency
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Used across amounts in the app (default:
                                    Bangladeshi Taka).
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <label
                                    htmlFor="settings-currency"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Display currency
                                </label>
                                <select
                                    id="settings-currency"
                                    value={currency}
                                    onChange={(e) =>
                                        setCurrency(e.target.value)
                                    }
                                    className="mt-2 w-full max-w-md rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                >
                                    {(payload?.currencies ?? []).map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.label} ({c.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <UserIcon className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Account
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Profile photo, name and email (email
                                    cannot be changed).
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4 p-6">
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="sr-only"
                                onChange={(e) => void onAvatarSelected(e)}
                            />
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <UserAvatar
                                    name={displayName}
                                    avatarUrl={avatarUrl}
                                    size="lg"
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={pickAvatarFile}
                                        disabled={uploadingAvatar}
                                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60"
                                    >
                                        <CameraIcon className="size-4" />
                                        {uploadingAvatar
                                            ? "Uploading…"
                                            : "Upload photo"}
                                    </button>
                                    {avatarUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => void removeAvatar()}
                                            disabled={uploadingAvatar}
                                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                                        >
                                            <Trash2Icon className="size-4" />
                                            Remove photo
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                JPG, PNG, WebP, or GIF · max 2 MB · appears in
                                the top bar next to your name.
                            </p>
                            <div>
                                <label
                                    htmlFor="settings-name"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Name
                                </label>
                                <input
                                    id="settings-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="mt-2 w-full max-w-md rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="settings-email"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Email
                                </label>
                                <input
                                    id="settings-email"
                                    type="email"
                                    value={email}
                                    readOnly
                                    disabled
                                    className="mt-2 w-full max-w-md cursor-not-allowed rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                    Contact support if you need to change your
                                    email.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => void saveProfile()}
                                disabled={savingProfile}
                                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-60"
                            >
                                {savingProfile ? "Saving…" : "Save profile & currency"}
                            </button>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/40 px-6 py-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <LockIcon className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Password
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Change your sign-in password.
                                </p>
                            </div>
                        </div>
                        <div className="grid max-w-md gap-4 p-6">
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Current password
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    New password
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Confirm new password
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => void savePassword()}
                                disabled={savingPassword}
                                className="w-fit rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
                            >
                                {savingPassword ? "Updating…" : "Update password"}
                            </button>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-white text-violet-600 ring-1 ring-gray-200">
                                    <PaletteIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Appearance
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Theme preference
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                                Coming soon
                            </span>
                        </div>
                        <div className="grid gap-3 p-6 sm:grid-cols-3">
                            <ThemeWireCard
                                icon={SunIcon}
                                title="Light"
                                description="Bright interface for daytime"
                            />
                            <ThemeWireCard
                                icon={MoonIcon}
                                title="Dark"
                                description="Easier on the eyes at night"
                            />
                            <ThemeWireCard
                                icon={MonitorIcon}
                                title="System"
                                description="Match your device setting"
                            />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

function ThemeWireCard({
    icon: Icon,
    title,
    description,
}: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            disabled
            className={cn(
                "flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left opacity-60",
                "cursor-not-allowed",
            )}
        >
            <Icon className="size-6 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            <span className="text-xs text-gray-500">{description}</span>
        </button>
    );
}
