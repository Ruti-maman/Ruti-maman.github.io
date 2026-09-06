import { getProducts, moods, Product } from "./models/types";

const productsSection: HTMLElement = document.getElementById("products")!;
const mood: string = localStorage.getItem("selectedMood") || "neutral";
const moodObj = moods.find((m): boolean => m.value === mood);

// הצגת וידאו מתאים למצב הרוח
if (moodObj && moodObj.videoUrl) {
  const video: HTMLVideoElement = document.createElement("video");
  video.src = moodObj.videoUrl;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.style.width = "100%";
  video.style.maxHeight = "250px";
  video.style.borderRadius = "16px";
  video.setAttribute("playsinline", "true");
  productsSection.appendChild(video);
}

const products: Product[] = getProducts().filter((p: Product): boolean => p.moodIds.includes(mood));
const list: HTMLDivElement = document.createElement("div");
list.innerHTML = products.length ?
  products.map((p: Product): string => `<div><b>${p.name}</b> (${p.category})<br><a href="${p.imageUrl}" target="_blank">לצפייה/האזנה</a> - ${p.price}₪</div>`).join("") :
  "אין מוצרים מתאימים";
productsSection.appendChild(list);
