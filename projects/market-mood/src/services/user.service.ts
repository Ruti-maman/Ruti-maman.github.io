import { User } from '../models/types.js';
import { StorageService } from './storage.service.js';

export class UserService {
    private static instance: UserService;
    private storageService: StorageService;
    private readonly USERS_KEY = 'users';
    private readonly CURRENT_USER_KEY = 'currentUser';

    private constructor() {
        this.storageService = StorageService.getInstance();
        this.initializeUsers();
    }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private initializeUsers(): void {
        const users = this.storageService.getItem<User[]>(this.USERS_KEY);
        if (!users) {
            // יצירת משתמש מנהל ראשוני
            const adminUser: User = {
                id: 'admin-1',
                name: 'מנהל המערכת',
                email: 'admin@marketmood.com',
                isAdmin: true
            };
            this.storageService.setItem(this.USERS_KEY, [adminUser]);
        }
    }

    public registerUser(name: string, email: string): User | null {
        const users = this.storageService.getItem<User[]>(this.USERS_KEY) || [];
        
        // בדיקה אם המשתמש כבר קיים
        if (users.some(user => user.email === email)) {
            return null;
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            isAdmin: false
        };

        users.push(newUser);
        this.storageService.setItem(this.USERS_KEY, users);
        return newUser;
    }

    public loginUser(email: string): User | null {
        const users = this.storageService.getItem<User[]>(this.USERS_KEY) || [];
        const user = users.find(u => u.email === email);
        
        if (user) {
            this.storageService.setItem(this.CURRENT_USER_KEY, user);
            return user;
        }
        
        return null;
    }

    public getCurrentUser(): User | null {
        return this.storageService.getItem<User>(this.CURRENT_USER_KEY);
    }

    public logoutUser(): void {
        this.storageService.removeItem(this.CURRENT_USER_KEY);
    }

    public getAllUsers(): User[] {
        return this.storageService.getItem<User[]>(this.USERS_KEY) || [];
    }
}