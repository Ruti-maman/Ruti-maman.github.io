import { moods } from "./models/types.js";

const moodSelector: HTMLElement = document.getElementById("mood-selector")!;

moods.forEach((mood): void => {
  const btn: HTMLButtonElement = document.createElement("button");
  btn.textContent = mood.emoji + " " + mood.label;
  btn.onclick = (): void => {
    localStorage.setItem("selectedMood", mood.value);
    window.location.href = "product.html";
  };
  moodSelector.appendChild(btn);
});
