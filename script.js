const heart = document.getElementById("heart");
const arena = document.getElementById("arena");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const final = document.getElementById("final");
const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");
const resetBtn = document.getElementById("resetBtn");
const skipBtn = document.getElementById("skipBtn");
const arenaNote = document.getElementById("arenaNote");
const hintLine = document.getElementById("hintLine");

const TARGET = 7;

let score = 0;
let moveTimer = null;

function speedMs(){
  // 0 -> 1200ms, 6 -> ~420ms
  return Math.max(380, 1200 - score * 130);
}

function moveHeart(){
  const maxX = arena.clientWidth - 60;
  const maxY = arena.clientHeight - 60;

  const x = Math.random() * Math.max(0, maxX);
  const y = Math.random() * Math.max(0, maxY);

  heart.style.left = x + "px";
  heart.style.top  = y + "px";
  return {x, y};
}

function spawnFlash(clientX, clientY){
  const r = arena.getBoundingClientRect();
  const x = clientX - r.left;
  const y = clientY - r.top;

  const el = document.createElement("div");
  el.className = "flash";
  el.style.left = x + "px";
  el.style.top  = y + "px";
  arena.appendChild(el);
  setTimeout(()=>el.remove(), 450);
}

function spawnTrail(x, y){
  for(let i=0;i<3;i++){
    const t = document.createElement("div");
    t.className = "trail";
    t.style.left = (x + (Math.random()*12 - 6)) + "px";
    t.style.top  = (y + (Math.random()*12 - 6)) + "px";
    t.style.animationDuration = (550 + Math.random()*300) + "ms";
    arena.appendChild(t);
    setTimeout(()=>t.remove(), 800);
  }
}

function burstHearts(){
  const hx = parseFloat(heart.style.left || "0") + 30;
  const hy = parseFloat(heart.style.top  || "0") + 30;

  for(let i=0;i<28;i++){
    const p = document.createElement("div");
    p.className = "burst-heart";
    p.style.left = hx + "px";
    p.style.top  = hy + "px";

    const angle = Math.random() * Math.PI * 2;
    const dist  = 120 + Math.random()*170;

    p.style.setProperty("--dx", Math.cos(angle)*dist + "px");
    p.style.setProperty("--dy", Math.sin(angle)*dist + "px");
    p.style.animationDuration = (700 + Math.random()*450) + "ms";

    arena.appendChild(p);
    setTimeout(()=>p.remove(), 1400);
  }
}

function updateNearWinUI(){
  if(score === TARGET - 1){
    heart.classList.add("shake");
    arenaNote.textContent = "ещё чуть-чуть… ✨";
    hintLine.textContent = "Ещё одно — и я задам вопрос… 💖";
    if (navigator.vibrate) navigator.vibrate(10);
  } else {
    heart.classList.remove("shake");
    arenaNote.textContent = "Кликай по сердечку, пока оно не убежало!";
  }
}

function startAutoMove(){
  stopAutoMove();
  moveTimer = setInterval(()=>{
    if (heart.style.display === "none") return;
    const pos = moveHeart();
    spawnTrail(pos.x + 30, pos.y + 30);
  }, speedMs());
}

function stopAutoMove(){
  if(moveTimer) clearInterval(moveTimer);
  moveTimer = null;
}

function showWinTransition(){
  arenaNote.textContent = "Ура! ✨";
  hintLine.textContent = "Открываю важный вопрос…";
  overlay.classList.add("showFlash");
  setTimeout(()=> overlay.classList.remove("showFlash"), 800);
}

function openModal(){
  overlay.style.display = "grid";
  overlay.setAttribute("aria-hidden","false");
  // мягкая вибрация
  if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
}
function closeModal(){
  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden","true");
}

function spawnPetals(durationMs = 8000){
  const start = Date.now();
  const timer = setInterval(()=>{
    const petal = document.createElement("div");
    petal.className="petal";
    petal.textContent = Math.random() < 0.85 ? "🌷" : "✨";
    petal.style.left = Math.random()*100 + "vw";
    petal.style.fontSize = (18 + Math.random()*22) + "px";
    petal.style.animationDuration = (3 + Math.random()*2.5) + "s";
    petal.style.opacity = (0.35 + Math.random()*0.55);
    document.body.appendChild(petal);
    setTimeout(()=>petal.remove(), 6500);

    if(Date.now() - start > durationMs){
      clearInterval(timer);
    }
  }, 200);
}

function resetGame(){
  score = 0;
  scoreEl.textContent = "0";
  heart.style.display = "block";
  arenaNote.textContent = "Кликай по сердечку, пока оно не убежало!";
  hintLine.textContent = "Подсказка: чем ближе к победе — тем быстрее 💫";
  final.hidden = true;
  noBtn.style.display = "inline-flex";
  updateNearWinUI();
  moveHeart();
  startAutoMove();
}

heart.addEventListener("click", (e) => {
  score++;
  scoreEl.textContent = score;
  if (navigator.vibrate) navigator.vibrate(15);

  spawnFlash(e.clientX, e.clientY);

  if(score >= TARGET){
    stopAutoMove();
    burstHearts();
    heart.style.display = "none";
    showWinTransition();
    setTimeout(openModal, 650);
    return;
  }

  updateNearWinUI();

  const pos = moveHeart();
  spawnTrail(pos.x + 30, pos.y + 30);

  startAutoMove(); // ускорение применяется сразу
});

// “Нет” слегка убегает (только на hover)
noBtn.addEventListener("mouseover", () => {
  noBtn.style.position = "relative";
  noBtn.style.left = (Math.random()*70 - 35) + "px";
});

// YES
yesBtn.addEventListener("click", () => {
  if (navigator.vibrate) navigator.vibrate([30,50,30]);
  final.hidden = false;
  noBtn.style.display = "none";
  hintLine.textContent = "🌷 Этот момент — теперь мой любимый.";
  spawnPetals(8000);
});

// Music toggle
musicToggle.addEventListener("click", async ()=>{
  try{
    if(music.paused){
      music.volume = 0.35;
      await music.play();
      musicToggle.textContent = "🔊 Музыка";
    } else {
      music.pause();
      musicToggle.textContent = "🔈 Музыка";
    }
  }catch(e){
    // если iOS не дал — просто попробуй ещё раз после любого тапа
  }
});

resetBtn.addEventListener("click", resetGame);
skipBtn.addEventListener("click", () => {
  score = TARGET;
  scoreEl.textContent = String(TARGET);
  heart.style.display = "none";
  stopAutoMove();
  showWinTransition();
  setTimeout(openModal, 650);
});

// init
moveHeart();
updateNearWinUI();
startAutoMove();
