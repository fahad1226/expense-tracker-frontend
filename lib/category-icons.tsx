import {
    BabyIcon,
    BikeIcon,
    BookOpenIcon,
    BriefcaseIcon,
    Building2Icon,
    BusIcon,
    CameraIcon,
    CarIcon,
    CatIcon,
    CircleDollarSignIcon,
    CoinsIcon,
    CoffeeIcon,
    CreditCardIcon,
    DogIcon,
    DumbbellIcon,
    FilmIcon,
    Flower2Icon,
    FuelIcon,
    Gamepad2Icon,
    GiftIcon,
    GraduationCapIcon,
    HeadphonesIcon,
    HeartPulseIcon,
    HomeIcon,
    LandmarkIcon,
    LaptopIcon,
    type LucideIcon,
    MusicIcon,
    PawPrintIcon,
    PiggyBankIcon,
    PlaneIcon,
    PizzaIcon,
    ReceiptIcon,
    ShirtIcon,
    ShoppingBagIcon,
    SmartphoneIcon,
    SparklesIcon,
    TagIcon,
    TrainFrontIcon,
    TvIcon,
    UtensilsCrossedIcon,
    WalletIcon,
    WifiIcon,
    WrenchIcon,
    ZapIcon,
} from "lucide-react";

/** How many icons to show before “Show more” in category pickers. */
export const CATEGORY_ICON_INITIAL_COUNT = 10;

/**
 * Stable ids persisted on the server (`categories.icon`) and resolved to Lucide components in the UI.
 * Keep ids backward-compatible once shipped; add new icons at the end or with new ids only.
 * The first {@link CATEGORY_ICON_INITIAL_COUNT} entries are the default visible set in the modal.
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
    { id: "home", Icon: HomeIcon, label: "Home & rent" },
    { id: "coffee", Icon: CoffeeIcon, label: "Coffee & cafes" },
    { id: "dumbbell", Icon: DumbbellIcon, label: "Fitness & gym" },
    { id: "baby", Icon: BabyIcon, label: "Kids & baby" },
    { id: "paw", Icon: PawPrintIcon, label: "Pets" },
    { id: "wrench", Icon: WrenchIcon, label: "Repairs & DIY" },
    { id: "briefcase", Icon: BriefcaseIcon, label: "Work & business" },
    { id: "book", Icon: BookOpenIcon, label: "Books & learning" },
    { id: "music", Icon: MusicIcon, label: "Music" },
    { id: "camera", Icon: CameraIcon, label: "Photo & media" },
    { id: "gamepad", Icon: Gamepad2Icon, label: "Games" },
    { id: "phone", Icon: SmartphoneIcon, label: "Phone & mobile" },
    { id: "wifi", Icon: WifiIcon, label: "Internet" },
    { id: "fuel", Icon: FuelIcon, label: "Gas & fuel" },
    { id: "piggy", Icon: PiggyBankIcon, label: "Savings" },
    { id: "landmark", Icon: LandmarkIcon, label: "Bank & fees" },
    { id: "receipt", Icon: ReceiptIcon, label: "Receipts" },
    { id: "shirt", Icon: ShirtIcon, label: "Clothing" },
    { id: "gift", Icon: GiftIcon, label: "Gifts" },
    { id: "sparkles", Icon: SparklesIcon, label: "Fun & misc" },
    { id: "building", Icon: Building2Icon, label: "Office" },
    { id: "card", Icon: CreditCardIcon, label: "Card payments" },
    { id: "wallet", Icon: WalletIcon, label: "Wallet & cash" },
    { id: "coins", Icon: CoinsIcon, label: "Coins & change" },
    { id: "train", Icon: TrainFrontIcon, label: "Train & rail" },
    { id: "bike", Icon: BikeIcon, label: "Cycling" },
    { id: "bus", Icon: BusIcon, label: "Bus" },
    { id: "pizza", Icon: PizzaIcon, label: "Pizza & takeout" },
    { id: "dog", Icon: DogIcon, label: "Dog" },
    { id: "cat", Icon: CatIcon, label: "Cat" },
    { id: "laptop", Icon: LaptopIcon, label: "Tech & software" },
    { id: "tv", Icon: TvIcon, label: "TV & streaming" },
    { id: "headphones", Icon: HeadphonesIcon, label: "Audio" },
    { id: "flower", Icon: Flower2Icon, label: "Garden & plants" },
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
