const $ = (s) => document.querySelector(s);
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const rand = (a,b)=>Math.random()*(b-a)+a;
const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];

const arena = $("#arena");
const heart = $("#heart");
const scorePill = $("#scorePill");
const arenaHint = $("#arenaHint");

const resetBtn = $("#resetBtn");
const skipBtn  = $("#skipBtn");

const overlay = $("#overlay");
const closeBtn = $("#closeBtn");
const yesBtn = $("#yesBtn");
const result = $("#result");

const confetti = $("#confetti");

let score = 0;
const target = 7;
let moveTimer = null;
let active = true;

function setScore(v){
  score = v;
  scorePill.textContent = `Сердца: ${score} / ${target}`;

  if(score >= target){
    active = false;
    heart.style.display = "none";
    arenaHint.textContent = "Победа! Открываю важный вопрос…";
    setTimeout(openQuestion, 650);
  }
}

function placeHeart(){
  const r = arena.getBoundingClientRect();
  const pad = 40; // чуть больше — чтобы не прилипало к краям на телефоне
  const x = rand(pad, r.width - pad);
  const y = rand(pad, r.height - pad);
  heart.style.left = x + "px";
  heart.style.top  = y + "px";
}

function scheduleMove(){
  clearTimeout(moveTimer);
  if(!active) return;

  // быстрее к финалу
  const base = clamp(1200 - score*140, 320, 1200);

  moveTimer = setTimeout(()=>{
    placeHeart();
    arenaHint.textContent = pick([
      "Лови! 💘",
      "Быстрее 😄",
      "Почти! ✨",
      "Ещё чуть-чуть 💖",
      "Сердце убегает 🙈"
    ]);
    scheduleMove();
  }, base);
}

heart.addEventListener("click", ()=>{
  if(!active) return;
  heart.textContent = pick(["💖","💘","💗","💞"]);
  setScore(score + 1);
  placeHeart();
  scheduleMove();
});

function openQuestion(){
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden","false");
}

function closeQuestion(){
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden","true");
}

closeBtn.addEventListener("click", closeQuestion);
overlay.addEventListener("click", (e)=>{ if(e.target === overlay) closeQuestion(); });

yesBtn.addEventListener("click", ()=>{
  result.hidden = false;
  throwConfetti(180);
  $("#qTitle").textContent = "Урааа! 🥰";
  $("#qText").textContent = "Алиса, тогда это официально: ты моя валентинка 💖";
});

resetBtn.addEventListener("click", ()=>{
  resetGame();
});

skipBtn.addEventListener("click", ()=>{
  active = false;
  clearTimeout(moveTimer);
  openQuestion();
});

function resetGame(){
  clearTimeout(moveTimer);
  score = 0;
  active = true;
  result.hidden = true;

  $("#qTitle").textContent = "Итак…";
  $("#qText").textContent = "Алиса, хочешь стать моей валентинкой? 💘";

  heart.style.display = "grid";
  heart.textContent = "💖";
  arenaHint.textContent = "Кликай по сердечку, пока оно не убежало!";
  setScore(0);
  placeHeart();
  scheduleMove();
}

// Confetti
function throwConfetti(n=140){
  const colors = [
    "rgba(255,77,141,.95)",
    "rgba(138,92,255,.95)",
    "rgba(69,255,181,.95)",
    "rgba(255,255,255,.85)"
  ];
  for(let i=0;i<n;i++){
    const el = document.createElement("i");
    const x = rand(0, innerWidth);
    const dx = (rand(-1,1)*240).toFixed(0) + "px";
    const rot = (rand(-720,720)).toFixed(0) + "deg";
    const dur = rand(1.8, 3.2);

    el.style.left = x + "px";
    el.style.top = "-30px";
    el.style.background = pick(colors);
    el.style.animationDuration = dur + "s";
    el.style.setProperty("--dx", dx);
    el.style.setProperty("--rot", rot);
    el.style.opacity = rand(0.65, 1);
    el.style.width = rand(7, 12) + "px";
    el.style.height = rand(10, 18) + "px";

    confetti.appendChild(el);
    setTimeout(()=>el.remove(), dur*1000 + 250);
  }
}

// init
placeHeart();
scheduleMove();
setScore(0);
