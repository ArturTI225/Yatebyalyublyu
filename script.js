const heart = document.getElementById("heart");
const arena = document.getElementById("arena");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const final = document.getElementById("final");
const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");

let score = 0;

function moveHeart(){
  const x = Math.random() * (arena.clientWidth - 50);
  const y = Math.random() * (arena.clientHeight - 50);
  heart.style.left = x + "px";
  heart.style.top = y + "px";
}

heart.addEventListener("click", () => {
  score++;
  scoreEl.textContent = score;
  if (navigator.vibrate) navigator.vibrate(15);

  if(score >= 7){
    overlay.style.display = "flex";
  } else {
    moveHeart();
  }
});

moveHeart();

yesBtn.addEventListener("click", () => {
  if (navigator.vibrate) navigator.vibrate([30,50,30]);
  final.hidden = false;
  noBtn.style.display = "none";
  spawnPetals();
});

noBtn.addEventListener("mouseover", () => {
  noBtn.style.position = "relative";
  noBtn.style.left = Math.random()*60 - 30 + "px";
});

function spawnPetals(){
  setInterval(()=>{
    const petal = document.createElement("div");
    petal.className="petal";
    petal.textContent="🌷";
    petal.style.left=Math.random()*100+"vw";
    petal.style.fontSize=20+Math.random()*20+"px";
    petal.style.animationDuration=3+Math.random()*2+"s";
    document.body.appendChild(petal);
    setTimeout(()=>petal.remove(),5000);
  },300);
}

musicToggle.addEventListener("click", async ()=>{
  if(music.paused){
    music.volume = 0.4;
    await music.play();
    musicToggle.textContent = "🔊 Музыка";
  } else {
    music.pause();
    musicToggle.textContent = "🔈 Музыка";
  }
});
