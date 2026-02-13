const text = document.getElementById("text");
const nextBtn = document.getElementById("nextBtn");
const overlay = document.getElementById("overlay");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const final = document.getElementById("final");

const messages = [
  "Иногда среди миллионов огней\nважна только одна звезда.",
  "И для меня этой звездой стала ты.",
  "Алиса… есть кое-что, что я давно хотел спросить."
];

let index = 0;

nextBtn.addEventListener("click", () => {
  if (navigator.vibrate) navigator.vibrate(20);

  index++;

  if(index < messages.length){
    text.style.opacity = 0;
    setTimeout(()=>{
      text.innerText = messages[index];
      text.style.opacity = 1;
    },300);
  } else {
    overlay.style.display = "flex";
  }
});

yesBtn.addEventListener("click", () => {
  if (navigator.vibrate) navigator.vibrate([30,50,30]);
  final.hidden = false;
  noBtn.style.display = "none";
});

noBtn.addEventListener("mouseover", () => {
  noBtn.style.position = "relative";
  noBtn.style.left = Math.random()*60 - 30 + "px";
});
