import { getProducts, moods } from "./models/types";
const productsSection = document.getElementById("products");
const mood = localStorage.getItem("selectedMood") || "neutral";
const moodObj = moods.find((m) => m.value === mood);
// הצגת וידאו מתאים למצב הרוח
if (moodObj && moodObj.videoUrl) {
    const video = document.createElement("video");
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
const products = getProducts().filter((p) => p.moodIds.includes(mood));
const list = document.createElement("div");
list.innerHTML = products.length ?
    products.map((p) => `<div><b>${p.name}</b> (${p.category})<br><a href="${p.imageUrl}" target="_blank">לצפייה/האזנה</a> - ${p.price}₪</div>`).join("") :
    "אין מוצרים מתאימים";
productsSection.appendChild(list);
