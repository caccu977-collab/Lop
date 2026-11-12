// Đổi mã PIN tại đây trước khi đăng trang lên GitHub Pages.
const CONFIG = {
  pin: "1402",
};

const gate = document.querySelector("#gate");
const letter = document.querySelector("#letter");
const pinDots = [...document.querySelectorAll(".pin-dot")];
const pinMessage = document.querySelector("#pin-message");
const pinPanel = document.querySelector(".pin-panel");
const keypad = document.querySelector("#keypad");
const heartsLayer = document.querySelector("#hearts-layer");
let pin = "";

function updatePin() {
  pinDots.forEach((dot, index) => dot.classList.toggle("filled", index < pin.length));
  document.querySelector("#pin-dots").setAttribute("aria-label", `${pin.length} trên 4 số đã nhập`);
}

function setMessage(message, isError = false) {
  pinMessage.textContent = message;
  pinMessage.classList.toggle("error", isError);
}

function unlock() {
  gate.classList.add("leaving");
  window.setTimeout(() => {
    gate.hidden = true;
    letter.hidden = false;
    letter.scrollIntoView({ behavior: "smooth", block: "start" });
    createHearts(12);
  }, 260);
}

function enterDigit(digit) {
  if (pin.length >= 4) return;
  pin += digit;
  updatePin();
  setMessage("Mã này chỉ hai chúng ta biết thôi ♡");
  if (pin.length === 4) {
    if (pin === CONFIG.pin) {
      window.setTimeout(unlock, 180);
    } else {
      setMessage("Hình như chưa đúng rồi, thử lại nhé ♡", true);
      pinPanel.classList.remove("shake");
      void pinPanel.offsetWidth;
      pinPanel.classList.add("shake");
      window.setTimeout(() => {
        pin = "";
        updatePin();
      }, 620);
    }
  }
}

function deleteDigit() {
  pin = pin.slice(0, -1);
  updatePin();
  if (!pinMessage.classList.contains("error")) setMessage("Mã này chỉ hai chúng ta biết thôi ♡");
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.key) enterDigit(button.dataset.key);
  if (button.dataset.action === "delete") deleteDigit();
});

document.addEventListener("keydown", (event) => {
  if (gate.hidden) return;
  if (/^\d$/.test(event.key)) enterDigit(event.key);
  if (event.key === "Backspace" || event.key === "Delete") deleteDigit();
});

function createHearts(amount) {
  const symbols = ["♡", "♥", "✿"];
  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.animationDelay = `${Math.random() * 1.4}s`;
    heart.style.fontSize = `${12 + Math.random() * 15}px`;
    heartsLayer.append(heart);
    window.setTimeout(() => heart.remove(), 5000);
  }
}

const photoUpload = document.querySelector("#photo-upload");
const memoryPhoto = document.querySelector("#memory-photo");
const memoryPlaceholder = document.querySelector("#memory-placeholder");
let currentPhotoUrl = null;

photoUpload.addEventListener("change", () => {
  const file = photoUpload.files?.[0];
  if (!file) return;
  if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
  currentPhotoUrl = URL.createObjectURL(file);
  memoryPhoto.src = currentPhotoUrl;
  memoryPhoto.hidden = false;
  memoryPlaceholder.hidden = true;
});

function showAnswer(message, hearts = false) {
  const response = document.querySelector("#answer-response");
  response.textContent = message;
  response.hidden = false;
  if (hearts) createHearts(18);
}

document.querySelector("#answer-yes").addEventListener("click", () => {
  showAnswer("Vậy thì mình cùng bắt đầu bằng một buổi hẹn thật vui nhé. Cảm ơn cậu vì đã cho mình cơ hội ♡", true);
});

document.querySelector("#answer-later").addEventListener("click", () => {
  showAnswer("Cảm ơn cậu đã đọc đến đây. Cậu cứ trả lời khi nào đã sẵn sàng nhé — mình vẫn quý cậu như vậy ♡");
});
