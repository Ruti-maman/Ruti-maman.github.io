import { productRx, getProducts, saveProducts } from "./models/types";
const form = document.getElementById("add-product-form");
const productsList = document.getElementById("products-list");
form.onsubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    if (!productRx.name.test(formData.name) || !productRx.src.test(formData.src))
        return alert("שדות לא תקינים");
    const product = {
        id: crypto.randomUUID(),
        name: formData.name,
        description: formData.description || '',
        price: +formData.price,
        imageUrl: formData.src,
        category: formData.category || '',
        moodIds: formData.mood ? [formData.mood] : [],
        popularity: 0,
        dateAdded: new Date().toISOString()
    };
    const products = getProducts();
    products.push(product);
    saveProducts(products);
    renderProducts();
    form.reset();
};
function renderProducts() {
    const products = getProducts();
    productsList.innerHTML = products.map((p) => `<div>${p.name} (${p.category}) - ₪${p.price} <button data-id="${p.id}">מחק</button></div>`).join("");
    productsList.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const products = getProducts().filter((p) => p.id !== id);
            saveProducts(products);
            renderProducts();
        });
    });
}
renderProducts();
