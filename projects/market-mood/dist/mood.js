import { moods } from "./models/types.js";
const moodSelector = document.getElementById("mood-selector");
moods.forEach((mood) => {
    const btn = document.createElement("button");
    btn.textContent = mood.emoji + " " + mood.label;
    btn.onclick = () => {
        localStorage.setItem("selectedMood", mood.value);
        window.location.href = "product.html";
    };
    moodSelector.appendChild(btn);
});
