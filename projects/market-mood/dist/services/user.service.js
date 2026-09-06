import { StorageService } from './storage.service.js';
export class UserService {
    constructor() {
        this.USERS_KEY = 'users';
        this.CURRENT_USER_KEY = 'currentUser';
        this.storageService = StorageService.getInstance();
        this.initializeUsers();
    }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    initializeUsers() {
        const users = this.storageService.getItem(this.USERS_KEY);
        if (!users) {
            // יצירת משתמש מנהל ראשוני
            const adminUser = {
                id: 'admin-1',
                name: 'מנהל המערכת',
                email: 'admin@marketmood.com',
                isAdmin: true
            };
            this.storageService.setItem(this.USERS_KEY, [adminUser]);
        }
    }
    registerUser(name, email) {
        const users = this.storageService.getItem(this.USERS_KEY) || [];
        // בדיקה אם המשתמש כבר קיים
        if (users.some(user => user.email === email)) {
            return null;
        }
        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            isAdmin: false
        };
        users.push(newUser);
        this.storageService.setItem(this.USERS_KEY, users);
        return newUser;
    }
    loginUser(email) {
        const users = this.storageService.getItem(this.USERS_KEY) || [];
        const user = users.find(u => u.email === email);
        if (user) {
            this.storageService.setItem(this.CURRENT_USER_KEY, user);
            return user;
        }
        return null;
    }
    getCurrentUser() {
        return this.storageService.getItem(this.CURRENT_USER_KEY);
    }
    logoutUser() {
        this.storageService.removeItem(this.CURRENT_USER_KEY);
    }
    getAllUsers() {
        return this.storageService.getItem(this.USERS_KEY) || [];
    }
}
