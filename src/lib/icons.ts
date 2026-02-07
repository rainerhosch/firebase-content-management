import {
    Tv,
    Film,
    LayoutDashboard,
    Database,
    Settings,
    Users,
    FileText,
    Image,
    Music,
    Video,
    Folder,
    Globe,
    BookOpen,
    MessageSquare,
    Bell,
    Calendar,
    ShoppingCart,
    CreditCard,
    BarChart,
    PieChart,
    type LucideIcon,
} from "lucide-react";

/**
 * Map of icon names to Lucide components
 * Add more icons as needed
 */
export const iconMap: Record<string, LucideIcon> = {
    Tv,
    Film,
    LayoutDashboard,
    Database,
    Settings,
    Users,
    FileText,
    Image,
    Music,
    Video,
    Folder,
    Globe,
    BookOpen,
    MessageSquare,
    Bell,
    Calendar,
    ShoppingCart,
    CreditCard,
    BarChart,
    PieChart,
};

/**
 * Get icon component by name
 */
export function getIconByName(name: string): LucideIcon {
    return iconMap[name] || Database;
}

/**
 * Get available icon names for selection
 */
export function getAvailableIconNames(): string[] {
    return Object.keys(iconMap);
}
