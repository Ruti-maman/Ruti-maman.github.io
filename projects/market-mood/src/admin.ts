import { Product, productRx, saveFormData, getProducts, saveProducts } from "./models/types";

const form = document.getElementById("add-product-form") as HTMLFormElement;
const productsList = document.getElementById("products-list")!;

form.onsubmit = (e: Event): void => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form)) as Record<string, string>;
  if (!productRx.name.test(formData.name) || !productRx.src.test(formData.src)) return alert("שדות לא תקינים");
  const product: Product = { 
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

function renderProducts(): void {
  const products: Product[] = getProducts();
  productsList.innerHTML = products.map((p: Product) => `<div>${p.name} (${p.category}) - ₪${p.price} <button data-id="${p.id}">מחק</button></div>`).join("");
  productsList.querySelectorAll("button").forEach((btn: Element): void => {
    btn.addEventListener("click", (e: Event): void => {
      const id: string = (e.target as HTMLButtonElement).dataset.id!;
      const products: Product[] = getProducts().filter((p: Product) => p.id !== id);
      saveProducts(products);
      renderProducts();
    });
  });
}
renderProducts();
