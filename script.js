/* ======== ELEMENT REFERENCES ======== */
const parts   = [...document.querySelectorAll('.part')];
const targets = [...document.querySelectorAll('#stage div[data-tag]')];
const sndBeep = document.getElementById('snd-beep');
const sndDing = document.getElementById('snd-ding');
const overlay = document.getElementById('overlay');
const ovMsg   = document.getElementById('ov-msg');
const btn1    = document.getElementById('ov-btn1');
const btn2    = document.getElementById('ov-btn2');

let placed = 0;
let started = false;
let time    = 30;           // seconds
let countdown;

/* ======== TIMER ======== */
function startTimer() {
  if (started) return;
  started = true;
  countdown = setInterval(() => {
    time--;
    document.getElementById('timer').textContent = `Time left: ${time} s`;
    if (time <= 0) end(false);
  }, 1000);
}

/* ======== DRAG & DROP ======== */
parts.forEach((p) => {
  p.onpointerdown = (e) => {
    startTimer();
    if (p.classList.contains('placed')) return;

    sndBeep.currentTime = 0;
    sndBeep.play();

    const shiftX = e.clientX - p.offsetLeft;
    const shiftY = e.clientY - p.offsetTop;
    p.setPointerCapture(e.pointerId);

    const move = (ev) => {
      p.style.left = ev.clientX - shiftX + 'px';
      p.style.top  = ev.clientY - shiftY + 'px';
    };

    const up = () => {
      p.releasePointerCapture(e.pointerId);
      document.removeEventListener('pointermove', move);
      snap(p);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up, { once: true });
  };
});

/* ======== SNAP-IN-PLACE CHECK ======== */
function snap(el) {
  const tag = el.dataset.tag;
  const tgt = targets.find((t) => t.dataset.tag === tag);
  const dx  = el.offsetLeft - tgt.offsetLeft;
  const dy  = el.offsetTop  - tgt.offsetTop;

  if (Math.hypot(dx, dy) < 25) {
    el.style.left = tgt.offsetLeft + 'px';
    el.style.top  = tgt.offsetTop  + 'px';
    el.classList.add('placed');
    placed++;
    if (placed === parts.length) end(true);
  }
}

/* ======== GAME END ======== */
function end(win) {
  clearInterval(countdown);
  overlay.style.visibility = 'visible';
  overlay.style.animation  = 'none'; // freeze flicker

  if (win) {
    sndDing.play();
    ovMsg.innerHTML = '<span style="color:#009900">✔ 404 VERIFIED</span><br>You rebuilt the bot!';
    btn1.textContent = 'Tweet Proof';
    btn1.onclick = () => window.open(
      'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent('I passed the 404 CAPTCHA and became the bot! https://your404site.com'),
      '_blank'
    );
    btn2.style.display = 'inline-block';
    btn2.textContent   = 'Enter Telegram';
    btn2.onclick       = () => window.open('https://t.me/YOUR_SECRET_TG', '_blank');
  } else {
    ovMsg.innerHTML = '<span style="color:#d00000">✖ SYSTEM FAILURE</span><br>You ran out of time.';
    btn1.textContent = 'Retry';
    btn1.onclick     = () => location.reload();
    btn2.style.display = 'none';
  }
}

/* ======== INIT ON PAGE LOAD ======== */
window.onload = () => {
  document.getElementById('timer').textContent = `Time left: ${time} s`;
};
