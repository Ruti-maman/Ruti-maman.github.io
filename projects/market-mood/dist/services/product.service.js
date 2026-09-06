import { StorageService } from './storage.service.js';
export class ProductService {
    constructor() {
        this.PRODUCTS_KEY = 'products';
        this.storageService = StorageService.getInstance();
        this.initializeProducts();
    }
    static getInstance() {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }
    initializeProducts() {
        const products = this.storageService.getItem(this.PRODUCTS_KEY);
        if (!products) {
            const initialProducts = [
                {
                    id: 'product-1',
                    name: 'נרות ארומטיים מרגיעים',
                    description: 'סט נרות בניחוח לבנדר להרגעה ורוגע',
                    price: 79.99,
                    imageUrl: 'assets/images/candles.jpg',
                    category: 'ריח',
                    moodIds: ['sad', 'neutral'],
                    popularity: 4.5,
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 'product-2',
                    name: 'רמקול בלוטוס צבעוני',
                    description: 'רמקול עם תאורה משתנה למסיבות',
                    price: 199.99,
                    imageUrl: 'assets/images/speaker.jpg',
                    category: 'מוזיקה',
                    moodIds: ['happy', 'loved'],
                    popularity: 4.8,
                    dateAdded: new Date().toISOString()
                }
            ];
            this.storageService.setItem(this.PRODUCTS_KEY, initialProducts);
        }
    }
    getAllProducts() {
        return this.storageService.getItem(this.PRODUCTS_KEY) || [];
    }
    getProductsByMood(moodId) {
        const products = this.getAllProducts();
        return products.filter(product => product.moodIds.includes(moodId));
    }
    addProduct(product) {
        const products = this.getAllProducts();
        const newProduct = {
            ...product,
            id: `product-${Date.now()}`,
            dateAdded: new Date().toISOString()
        };
        products.push(newProduct);
        this.storageService.setItem(this.PRODUCTS_KEY, products);
        return newProduct;
    }
    updateProduct(id, updates) {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1)
            return null;
        products[index] = { ...products[index], ...updates };
        this.storageService.setItem(this.PRODUCTS_KEY, products);
        return products[index];
    }
    deleteProduct(id) {
        const products = this.getAllProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (filteredProducts.length === products.length)
            return false;
        this.storageService.setItem(this.PRODUCTS_KEY, filteredProducts);
        return true;
    }
    searchProducts(query) {
        const products = this.getAllProducts();
        const searchTerm = query.toLowerCase();
        return products.filter(product => product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm));
    }
    filterByCategory(category) {
        const products = this.getAllProducts();
        return category ? products.filter(p => p.category === category) : products;
    }
    sortProducts(sortBy) {
        const products = this.getAllProducts();
        switch (sortBy) {
            case 'popularity':
                return [...products].sort((a, b) => b.popularity - a.popularity);
            case 'new':
                return [...products].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            case 'random':
                return [...products].sort(() => Math.random() - 0.5);
            default:
                return products;
        }
    }
}
