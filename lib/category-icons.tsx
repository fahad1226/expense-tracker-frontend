import {
    CarIcon,
    CircleDollarSignIcon,
    FilmIcon,
    GraduationCapIcon,
    HeartPulseIcon,
    type LucideIcon,
    PlaneIcon,
    ShoppingBagIcon,
    TagIcon,
    UtensilsCrossedIcon,
    ZapIcon,
} from "lucide-react";

/**
 * Stable ids persisted on the server (`categories.icon`) and resolved to Lucide components in the UI.
 * Keep ids backward-compatible once shipped; add new icons at the end or with new ids only.
 */
export const CATEGORY_ICON_OPTIONS: ReadonlyArray<{
    id: string;
    Icon: LucideIcon;
    label: string;
}> = [
    { id: "utensils", Icon: UtensilsCrossedIcon, label: "Food & dining" },
    { id: "car", Icon: CarIcon, label: "Transport" },
    { id: "shopping", Icon: ShoppingBagIcon, label: "Shopping" },
    { id: "film", Icon: FilmIcon, label: "Entertainment" },
    { id: "zap", Icon: ZapIcon, label: "Bills & utilities" },
    { id: "heart", Icon: HeartPulseIcon, label: "Healthcare" },
    { id: "graduation", Icon: GraduationCapIcon, label: "Education" },
    { id: "plane", Icon: PlaneIcon, label: "Travel" },
    { id: "dollar", Icon: CircleDollarSignIcon, label: "Money" },
    { id: "tag", Icon: TagIcon, label: "General" },
];

const iconById: Record<string, LucideIcon> = Object.fromEntries(
    CATEGORY_ICON_OPTIONS.map(({ id, Icon }) => [id, Icon]),
);

export const DEFAULT_CATEGORY_ICON_ID = CATEGORY_ICON_OPTIONS[0]?.id ?? "tag";

export function getCategoryLucideIcon(
    iconId: string | null | undefined,
): LucideIcon {
    if (iconId != null && iconId !== "" && iconById[iconId]) {
        return iconById[iconId];
    }
    return TagIcon;
}

type CategoryIconProps = {
    iconId: string | null | undefined;
    className?: string;
};

export function CategoryGlyph({ iconId, className }: CategoryIconProps) {
    const Icon = getCategoryLucideIcon(iconId);
    return <Icon className={className} aria-hidden />;
}
