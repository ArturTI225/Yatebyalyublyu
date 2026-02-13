const heart = document.getElementById("heart");
const arena = document.getElementById("arena");
const scoreEl = document.getElementById("score");
const arenaNote = document.getElementById("arenaNote");
const hintLine = document.getElementById("hintLine");

const overlayQ = document.getElementById("overlayQ");
const overlayFinal = document.getElementById("overlayFinal");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noHint = document.getElementById("noHint");
const closeBtn = document.getElementById("closeBtn");

const resetBtn = document.getElementById("resetBtn");
const skipBtn  = document.getElementById("skipBtn");

const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");

const TARGET = 7;
let score = 0;
let moveTimer = null;

let noClicks = 0;

function speedMs(){
  return Math.max(380, 1200 - score * 130);
}

function moveHeart(){
  const w = 82; // width of photoHeart
  const h = 74;

  const maxX = arena.clientWidth - w;
  const maxY = arena.clientHeight - h;

  const x = Math.random() * Math.max(0, maxX);
  const y = 42 + Math.random() * Math.max(0, maxY - 42); // чтобы не перекрывать подсказку сверху

  heart.style.left = x + "px";
  heart.style.top  = y + "px";
  return {x, y};
}

function startAutoMove(){
  stopAutoMove();
  moveTimer = setInterval(()=>{
    if (heart.style.display === "none") return;
    const pos = moveHeart();
    spawnTrail(pos.x + 41, pos.y + 37);
  }, speedMs());
}

function stopAutoMove(){
  if(moveTimer) clearInterval(moveTimer);
  moveTimer = null;
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

function updateNearWinUI(){
  if(score === TARGET - 1){
    heart.classList.add("shake");
    arenaNote.textContent = "ещё чуть-чуть… ✨";
    hintLine.textContent = "Ещё одно — и я задам вопрос… 💖";
    if (navigator.vibrate) navigator.vibrate(10);
  } else {
    heart.classList.remove("shake");
    arenaNote.textContent = "Кликай по сердечку, пока оно не убежало!";
    hintLine.textContent = "Подсказка: чем ближе к победе — тем быстрее 💫";
  }
}

function openOverlay(el){
  el.style.display = "grid";
  el.setAttribute("aria-hidden","false");
  el.classList.add("showFlash");
  setTimeout(()=> el.classList.remove("showFlash"), 800);
}

function closeOverlay(el){
  el.style.display = "none";
  el.setAttribute("aria-hidden","true");
}

function win(){
  stopAutoMove();
  heart.style.display = "none";
  arenaNote.textContent = "Ура! ✨";
  hintLine.textContent = "Открываю важный вопрос…";
  setTimeout(()=> openOverlay(overlayQ), 450);
}

/* Дождь из сердечек (с фото) + цветов */
function createRainHeart(){
  const wrap = document.createElement("div");
  wrap.className = "rainItem rainHeart";
  wrap.style.left = Math.random()*100 + "vw";
  wrap.style.animationDuration = (3 + Math.random()*2.8) + "s";
  wrap.style.opacity = (0.35 + Math.random()*0.6);

  // SVG сердце с фото внутри (как в игре)
  wrap.innerHTML = `
    <svg viewBox="0 0 100 90" aria-hidden="true">
      <defs>
        <clipPath id="hc${Math.random().toString(16).slice(2)}">
          <path d="M50 84C30 66 6 52 6 28C6 12 18 4 30 4C40 4 48 12 50 16C52 12 60 4 70 4C82 4 94 12 94 28C94 52 70 66 50 84Z"/>
        </clipPath>
      </defs>
      <image href="IMG_1218.png" x="0" y="0" width="100" height="90"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#${wrap.querySelector ? '' : ''})"></image>
    </svg>
  `;

  // Из-за уникального id клип-паса проставим его корректно:
  const svg = wrap.querySelector("svg");
  const clip = svg.querySelector("clipPath");
  const id = clip.getAttribute("id");
  svg.querySelector("image").setAttribute("clip-path", `url(#${id})`);

  document.body.appendChild(wrap);
  setTimeout(()=>wrap.remove(), 6500);
}

function createRainEmoji(){
  const el = document.createElement("div");
  el.className = "rainItem";
  el.textContent = Math.random() < 0.72 ? "🌷" : "✨";
  el.style.left = Math.random()*100 + "vw";
  el.style.fontSize = (18 + Math.random()*26) + "px";
  el.style.animationDuration = (3 + Math.random()*3.2) + "s";
  el.style.opacity = (0.35 + Math.random()*0.65);
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 6500);
}

function rainParty(durationMs = 9000){
  const start = Date.now();
  const timer = setInterval(()=>{
    // больше сердечек, но и цветочки тоже
    if(Math.random() < 0.6) createRainHeart();
    else createRainEmoji();

    if(Date.now() - start > durationMs){
      clearInterval(timer);
    }
  }, 170);
}

/* Клик по сердцу */
heart.addEventListener("click", (e)=>{
  score++;
  scoreEl.textContent = score;

  if(navigator.vibrate) navigator.vibrate(15);

  spawnFlash(e.clientX, e.clientY);

  if(score >= TARGET){
    win();
    return;
  }

  updateNearWinUI();
  const pos = moveHeart();
  spawnTrail(pos.x + 41, pos.y + 37);
  startAutoMove();
});

/* “Нет” убегает + исчезает после 5 нажатий */
noBtn.addEventListener("mouseover", ()=>{
  const dx = (Math.random()*160 - 80);
  const dy = (Math.random()*80 - 40);
  noBtn.style.position = "relative";
  noBtn.style.left = dx + "px";
  noBtn.style.top  = dy + "px";
});

noBtn.addEventListener("click", ()=>{
  noClicks++;
  if(navigator.vibrate) navigator.vibrate(10);

  const left = 5 - noClicks;
  if(left > 0){
    noHint.textContent = `Хмм… почти 😄 Осталось поймать «нет» ещё ${left} раз`;
    // и убегаем сразу
    const dx = (Math.random()*200 - 100);
    const dy = (Math.random()*90 - 45);
    noBtn.style.position = "relative";
    noBtn.style.left = dx + "px";
    noBtn.style.top  = dy + "px";
  }else{
    noHint.textContent = "Ладно… оставлю только «Да» 😌";
    noBtn.style.display = "none";
  }
});

/* Да → следующая табличка + дождь сердечек и цветов */
yesBtn.addEventListener("click", ()=>{
  if(navigator.vibrate) navigator.vibrate([30,50,30]);
  closeOverlay(overlayQ);
  openOverlay(overlayFinal);
  rainParty(9000);
});

/* Закрыть финал */
closeBtn.addEventListener("click", ()=>{
  closeOverlay(overlayFinal);
});

/* музыка */
musicToggle.addEventListener("click", async ()=>{
  try{
    if(music.paused){
      music.volume = 0.35;
      await music.play();
      musicToggle.textContent = "🔊 Музыка";
    }else{
      music.pause();
      musicToggle.textContent = "🔈 Музыка";
    }
  }catch(e){}
});

/* сброс */
function resetGame(){
  score = 0;
  noClicks = 0;
  noBtn.style.display = "inline-flex";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  noHint.textContent = "";

  scoreEl.textContent = "0";
  heart.style.display = "block";
  updateNearWinUI();
  moveHeart();
  startAutoMove();
  closeOverlay(overlayQ);
  closeOverlay(overlayFinal);
}

resetBtn.addEventListener("click", resetGame);

skipBtn.addEventListener("click", ()=>{
  score = TARGET;
  scoreEl.textContent = String(TARGET);
  win();
});

/* init */
moveHeart();
updateNearWinUI();
startAutoMove();
