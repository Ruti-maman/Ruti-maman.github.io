export class StorageService {
    private static instance: StorageService;
    
    private constructor() {}
    
    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
    
    public setItem<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Error saving to localStorage - silently fail
        }
    }
    
    public getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            // Error reading from localStorage - return null
            return null;
        }
    }
    
    public removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            // Error removing from localStorage - silently fail
        }
    }
    
    public clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            // Error clearing localStorage - silently fail
        }
    }
}