import { Mood, Product, User } from './models/types.js';
import { StorageService } from './services/storage.service.js';
import { UserService } from './services/user.service.js';
import { ProductService } from './services/product.service.js';
import { CartService } from './services/cart.service.js';

class App {
    private storageService: StorageService;
    private userService: UserService;
    private productService: ProductService;
    private cartService: CartService;
    private currentUser: User | null = null;
    
    private moods: Mood[] = [
        {
            id: 'happy',
            emoji: '😄',
            name: 'שמח',
            description: 'מצב רוח מרומם ואופטימי',
            backgroundColor: '#FFE15D',
            textColor: '#333333'
        },
        {
            id: 'sad',
            emoji: '😢',
            name: 'עצוב',
            description: 'מצב רוח ירוד',
            backgroundColor: '#A8E6CF',
            textColor: '#333333'
        },
        {
            id: 'neutral',
            emoji: '😐',
            name: 'נייטרלי',
            description: 'מצב רוח מאוזן',
            backgroundColor: '#DCEDC1',
            textColor: '#333333'
        },
        {
            id: 'angry',
            emoji: '😡',
            name: 'כועס',
            description: 'מצב רוח כועס',
            backgroundColor: '#FFB6B9',
            textColor: '#333333'
        },
        {
            id: 'loved',
            emoji: '😍',
            name: 'מאושר',
            description: 'מצב רוח מאוהב ומאושר',
            backgroundColor: '#FF9AA2',
            textColor: '#333333'
        }
    ];

    constructor() {
        this.storageService = StorageService.getInstance();
        this.userService = UserService.getInstance();
        this.productService = ProductService.getInstance();
        this.cartService = CartService.getInstance();
        this.initializeApp();
    }

    private initializeApp(): void {
        this.renderMoodSelector();
        this.setupEventListeners();
        this.updateUserInterface();
        this.initializeModals();
    }

    private initializeModals(): void {
        // טיפול בפתיחה וסגירה של מודלים
        ['login', 'register', 'cart'].forEach(modalType => {
            const modal = document.getElementById(`${modalType}-modal`);
            const btn = document.getElementById(`${modalType}-btn`);
            const closeBtn = modal?.querySelector('.close');

            btn?.addEventListener('click', () => {
                modal?.style.setProperty('display', 'block');
            });

            closeBtn?.addEventListener('click', () => {
                modal?.style.setProperty('display', 'none');
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal && modal) {
                    modal.style.setProperty('display', 'none');
                }
            });
        });

        // טיפול בטפסים
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email') as HTMLInputElement;
            this.handleLogin(emailInput.value);
        });

        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('register-name') as HTMLInputElement;
            const emailInput = document.getElementById('register-email') as HTMLInputElement;
            this.handleRegister(nameInput.value, emailInput.value);
        });

        // עדכון עגלת הקניות
        document.addEventListener('cartUpdate', ((e: CustomEvent) => {
            this.updateCartUI(e.detail);
        }) as EventListener);
    }

    private handleLogin(email: string): void {
        const user = this.userService.loginUser(email);
        if (user) {
            this.currentUser = user;
            this.updateUserInterface();
            this.hideModal('login-modal');
            alert('התחברת בהצלחה!');
        } else {
            alert('המשתמש לא נמצא.');
        }
    }

    private handleRegister(name: string, email: string): void {
        const user = this.userService.registerUser(name, email);
        if (user) {
            this.currentUser = user;
            this.updateUserInterface();
            this.hideModal('register-modal');
            alert('נרשמת בהצלחה!');
        } else {
            alert('כתובת האימייל כבר קיימת במערכת.');
        }
    }

    private updateUserInterface(): void {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        
        if (this.currentUser) {
            loginBtn?.style.setProperty('display', 'none');
            registerBtn?.style.setProperty('display', 'none');
            // הוספת כפתור התנתקות
            if (!document.getElementById('logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'nav-btn';
                logoutBtn.textContent = 'התנתק';
                logoutBtn.addEventListener('click', () => this.handleLogout());
                loginBtn?.parentElement?.appendChild(logoutBtn);
            }
        } else {
            loginBtn?.style.removeProperty('display');
            registerBtn?.style.removeProperty('display');
            document.getElementById('logout-btn')?.remove();
        }
    }

    private handleLogout(): void {
        this.userService.logoutUser();
        this.currentUser = null;
        this.updateUserInterface();
        this.cartService.clearCart();
        window.location.reload();
    }

    private hideModal(modalId: string): void {
        document.getElementById(modalId)?.style.setProperty('display', 'none');
    }

    private updateCartUI(detail: { itemCount: number; total: number }): void {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            cartCount.textContent = detail.itemCount.toString();
        }
        
        if (cartItems && cartTotal) {
            const items = this.cartService.getCartProducts();
            cartItems.innerHTML = items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₪${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="app.updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="app.updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button onclick="app.removeFromCart('${item.id}')">🗑️</button>
                    </div>
                </div>
            `).join('');
            
            cartTotal.textContent = `סה"כ: ₪${detail.total.toFixed(2)}`;
        }
    }

    private renderMoodSelector(): void {
        const moodGrid = document.querySelector('.mood-grid');
        if (!moodGrid) return;

        const fileMap: Record<string, string> = {
            happy: 'rad',
            sad: 'bad',
            neutral: 'meh',
            angry: 'awful',
            loved: 'good'
        };

        // show English short labels like Daylio (rad, good, meh, bad, awful)
        const shortLabels: Record<string, string> = {
            happy: 'rad',
            sad: 'good',
            neutral: 'meh',
            angry: 'bad',
            loved: 'awful'
        };

        moodGrid.innerHTML = this.moods.map(mood => `
            <div class="mood-item" data-mood-id="${mood.id}" aria-label="${mood.name}" role="button" tabindex="0">
                <img class="mood-svg" src="src/assets/moods/${fileMap[mood.id] || mood.id}.svg" alt="${mood.name}">
                <div class="mood-name">${shortLabels[mood.id] || mood.name}</div>
            </div>
        `).join('');

        // add keyboard accessibility and click selection
        moodGrid.querySelectorAll('.mood-item').forEach(item => {
            item.addEventListener('keydown', (evt: Event) => {
                const e = evt as KeyboardEvent;
                if (e.key === 'Enter' || e.key === ' ') {
                    (e.target as HTMLElement).click();
                }
            });

            item.addEventListener('click', (e) => {
                const target = (e.currentTarget as HTMLElement);
                // toggle selected class
                moodGrid.querySelectorAll('.mood-item').forEach(i => i.classList.remove('selected'));
                target.classList.add('selected');
                const moodId = target.getAttribute('data-mood-id');
                if (moodId) this.handleMoodSelection(moodId);
            });
        });

        // set dynamic date label
        const dateEl = document.querySelector('.date-line');
        if (dateEl) {
            dateEl.textContent = this.getDateLabel(new Date());
        }
    }

    private getDateLabel(d: Date): string {
        const now = new Date();
        const isSameDay = now.toDateString() === d.toDateString();
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const monthDay = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        if (isSameDay) {
            return `Today, ${monthDay}, ${time}`;
        }
        return `${monthDay}, ${time}`;
    }

    private setupEventListeners(): void {
        // מאזין לבחירת מצב רוח
        document.querySelector('.mood-grid')?.addEventListener('click', (e) => {
            const moodItem = (e.target as Element).closest('.mood-item');
            if (moodItem) {
                const moodId = moodItem.getAttribute('data-mood-id');
                if (moodId) {
                    this.handleMoodSelection(moodId);
                }
            }
        });

        // מאזין לחיפוש מוצרים
        document.querySelector('#search')?.addEventListener('input', (e) => {
            const searchTerm = (e.target as HTMLInputElement).value;
            this.filterProducts(searchTerm);
        });

        // מאזין למיון מוצרים
        document.querySelector('#sort-filter')?.addEventListener('change', (e) => {
            const sortBy = (e.target as HTMLSelectElement).value;
            this.sortProducts(sortBy);
        });
    }

    private handleMoodSelection(moodId: string): void {
        const selectedMood = this.moods.find((mood: Mood): boolean => mood.id === moodId);
        if (!selectedMood) return;

        // שמירת מצב הרוח הנבחר ב-localStorage
        this.storageService.setItem('currentMood', selectedMood);

        // הצגת מסך המוצרים
        document.querySelector('#mood-selector')?.classList.add('hidden');
        document.querySelector('#products')?.classList.remove('hidden');

        // טעינת מוצרים מתאימים
        this.loadProductsForMood(moodId);
    }

    private loadProductsForMood(moodId: string): void {
        const products = this.productService.getProductsByMood(moodId);
        this.renderProducts(products);
    }

    private renderProducts(products: Product[]): void {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">₪${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn">הוסף לעגלה</button>
                </div>
            </div>
        `).join('');

        // הוספת מאזיני לחיצה לכפתורי "הוסף לעגלה"
        productsGrid.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = (e.target as Element).closest('.product-card');
                if (productCard) {
                    const productId = productCard.getAttribute('data-product-id');
                    if (productId) {
                        this.addToCart(productId);
                    }
                }
            });
        });
    }

    private addToCart(productId: string): void {
        if (!this.currentUser) {
            alert('יש להתחבר כדי להוסיף מוצרים לעגלה');
            return;
        }

        this.cartService.addToCart(productId);
        alert('המוצר נוסף לעגלה בהצלחה!');
    }

    private filterProducts(searchTerm: string): void {
        const products = searchTerm ? 
            this.productService.searchProducts(searchTerm) :
            this.productService.getAllProducts();
        
        this.renderProducts(products);
    }

    private sortProducts(sortBy: string): void {
        const products = this.productService.sortProducts(sortBy as 'popularity' | 'new' | 'random');
        this.renderProducts(products);
    }

    public updateCartItemQuantity(productId: string, quantity: number): void {
        this.cartService.updateQuantity(productId, quantity);
    }

    public removeFromCart(productId: string): void {
        this.cartService.removeFromCart(productId);
    }
}

// הפעלת האפליקציה
document.addEventListener('DOMContentLoaded', () => {
    new App();
});