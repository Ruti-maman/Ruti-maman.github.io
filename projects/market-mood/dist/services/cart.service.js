import { StorageService } from './storage.service.js';
import { ProductService } from './product.service.js';
export class CartService {
    constructor() {
        this.CART_KEY = 'cart';
        this.ORDERS_KEY = 'orders';
        this.storageService = StorageService.getInstance();
        this.productService = ProductService.getInstance();
    }
    static getInstance() {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }
    getCart() {
        return this.storageService.getItem(this.CART_KEY) || [];
    }
    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.push({ productId, quantity });
        }
        this.storageService.setItem(this.CART_KEY, cart);
        this.triggerCartUpdate();
    }
    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.productId !== productId);
        this.storageService.setItem(this.CART_KEY, updatedCart);
        this.triggerCartUpdate();
    }
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            }
            else {
                this.storageService.setItem(this.CART_KEY, cart);
                this.triggerCartUpdate();
            }
        }
    }
    clearCart() {
        this.storageService.removeItem(this.CART_KEY);
        this.triggerCartUpdate();
    }
    getCartTotal() {
        const cart = this.getCart();
        const products = this.productService.getAllProducts();
        return cart.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }
    getCartProducts() {
        const cart = this.getCart();
        const products = this.productService.getAllProducts();
        return cart
            .map(item => {
            const product = products.find(p => p.id === item.productId);
            return product ? { ...product, quantity: item.quantity } : null;
        })
            .filter((item) => item !== null);
    }
    checkout(userId) {
        const cart = this.getCart();
        const total = this.getCartTotal();
        const order = {
            id: `order-${Date.now()}`,
            userId,
            items: [...cart],
            totalAmount: total,
            date: new Date().toISOString(),
            status: 'pending'
        };
        // שמירת ההזמנה
        const orders = this.storageService.getItem(this.ORDERS_KEY) || [];
        orders.push(order);
        this.storageService.setItem(this.ORDERS_KEY, orders);
        // ניקוי העגלה
        this.clearCart();
        return order;
    }
    triggerCartUpdate() {
        // שליחת אירוע לעדכון ממשק המשתמש
        const event = new CustomEvent('cartUpdate', {
            detail: {
                itemCount: this.getCart().reduce((sum, item) => sum + item.quantity, 0),
                total: this.getCartTotal()
            }
        });
        document.dispatchEvent(event);
    }
    getOrders(userId) {
        const orders = this.storageService.getItem(this.ORDERS_KEY) || [];
        return orders.filter(order => order.userId === userId);
    }
    getAllOrders() {
        return this.storageService.getItem(this.ORDERS_KEY) || [];
    }
    updateOrderStatus(orderId, status) {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order)
            return false;
        order.status = status;
        this.storageService.setItem(this.ORDERS_KEY, orders);
        return true;
    }
}
