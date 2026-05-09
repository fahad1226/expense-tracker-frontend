export function getUserInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return "?";
    }
    if (parts.length === 1) {
        const word = parts[0]!;
        return word.slice(0, Math.min(2, word.length)).toUpperCase();
    }
    const first = parts[0]!;
    const last = parts[parts.length - 1]!;
    return (first[0]! + last[0]!).toUpperCase();
}
