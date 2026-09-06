import { CartItem, Order, Product } from '../models/types.js';
import { StorageService } from './storage.service.js';
import { ProductService } from './product.service.js';

export class CartService {
    private static instance: CartService;
    private storageService: StorageService;
    private productService: ProductService;
    private readonly CART_KEY = 'cart';
    private readonly ORDERS_KEY = 'orders';

    private constructor() {
        this.storageService = StorageService.getInstance();
        this.productService = ProductService.getInstance();
    }

    public static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    public getCart(): CartItem[] {
        return this.storageService.getItem<CartItem[]>(this.CART_KEY) || [];
    }

    public addToCart(productId: string, quantity: number = 1): void {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        
        this.storageService.setItem(this.CART_KEY, cart);
        this.triggerCartUpdate();
    }

    public removeFromCart(productId: string): void {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.productId !== productId);
        this.storageService.setItem(this.CART_KEY, updatedCart);
        this.triggerCartUpdate();
    }

    public updateQuantity(productId: string, quantity: number): void {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.storageService.setItem(this.CART_KEY, cart);
                this.triggerCartUpdate();
            }
        }
    }

    public clearCart(): void {
        this.storageService.removeItem(this.CART_KEY);
        this.triggerCartUpdate();
    }

    public getCartTotal(): number {
        const cart = this.getCart();
        const products = this.productService.getAllProducts();
        
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    public getCartProducts(): Array<Product & { quantity: number }> {
        const cart = this.getCart();
        const products = this.productService.getAllProducts();
        
        return cart
            .map(item => {
                const product = products.find(p => p.id === item.productId);
                return product ? { ...product, quantity: item.quantity } : null;
            })
            .filter((item): item is Product & { quantity: number } => item !== null);
    }

    public checkout(userId: string): Order {
        const cart = this.getCart();
        const total = this.getCartTotal();
        
        const order: Order = {
            id: `order-${Date.now()}`,
            userId,
            items: [...cart],
            totalAmount: total,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // שמירת ההזמנה
        const orders = this.storageService.getItem<Order[]>(this.ORDERS_KEY) || [];
        orders.push(order);
        this.storageService.setItem(this.ORDERS_KEY, orders);
        
        // ניקוי העגלה
        this.clearCart();
        
        return order;
    }

    private triggerCartUpdate(): void {
        // שליחת אירוע לעדכון ממשק המשתמש
        const event = new CustomEvent('cartUpdate', {
            detail: {
                itemCount: this.getCart().reduce((sum, item) => sum + item.quantity, 0),
                total: this.getCartTotal()
            }
        });
        document.dispatchEvent(event);
    }

    public getOrders(userId: string): Order[] {
        const orders = this.storageService.getItem<Order[]>(this.ORDERS_KEY) || [];
        return orders.filter(order => order.userId === userId);
    }

    public getAllOrders(): Order[] {
        return this.storageService.getItem<Order[]>(this.ORDERS_KEY) || [];
    }

    public updateOrderStatus(orderId: string, status: Order['status']): boolean {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return false;
        
        order.status = status;
        this.storageService.setItem(this.ORDERS_KEY, orders);
        return true;
    }
}