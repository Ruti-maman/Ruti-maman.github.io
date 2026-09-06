// פונקציות עזר פשוטות לשימוש בקוד קיים (retro-compatibility)
export const moods = [
    {
        value: "happy",
        emoji: "😄",
        label: "שמח",
        videoUrl: "https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4" // פרחים צבעוניים בשדה
    },
    {
        value: "sad",
        emoji: "😢",
        label: "עצוב",
        videoUrl: "https://videos.pexels.com/video-files/1108544/1108544-hd_1920_1080_25fps.mp4" // גשם עדין על חלון
    },
    {
        value: "neutral",
        emoji: "😐",
        label: "נייטרלי",
        videoUrl: "https://videos.pexels.com/video-files/854190/854190-hd_1920_1080_25fps.mp4" // נוף טבע רגוע
    },
    {
        value: "angry",
        emoji: "😡",
        label: "כועס",
        videoUrl: "https://videos.pexels.com/video-files/856998/856998-hd_1920_1080_25fps.mp4" // ים גועש, גלים
    },
    {
        value: "love",
        emoji: "😍",
        label: "מאושר",
        videoUrl: "https://videos.pexels.com/video-files/857209/857209-hd_1920_1080_25fps.mp4" // שקיעה רומנטית
    }
];

export const productRx = {
    name: /^[A-Za-z\u0590-\u05FF0-9 ]{2,20}$/,
    src: /^https?:\/\/.{5,}/
};

export function getProducts(): Product[] {
    return JSON.parse(localStorage.getItem("products") || "[]");
}
export function saveProducts(products: Product[]): void {
    localStorage.setItem("products", JSON.stringify(products));
}
export function saveFormData(form: HTMLFormElement, storageKey: string): void {
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem(storageKey, JSON.stringify(data));
}
export interface Mood {
    id: string;
    emoji: string;
    name: string;
    description: string;
    backgroundColor: string;
    textColor: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    moodIds: string[];
    popularity: number;
    dateAdded: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    date: string;
    status: 'pending' | 'completed' | 'cancelled';
}