export class StorageService {
    constructor() { }
    static getInstance() {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            // Error saving to localStorage - silently fail
        }
    }
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            // Error reading from localStorage - return null
            return null;
        }
    }
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            // Error removing from localStorage - silently fail
        }
    }
    clear() {
        try {
            localStorage.clear();
        }
        catch (error) {
            // Error clearing localStorage - silently fail
        }
    }
}
