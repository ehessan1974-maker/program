(function () {
  const audio     = document.getElementById("iqama-audio");
  const iqamaEl   = document.getElementById("iqama-time");
  const currentEl = document.getElementById("current-time");
  const modal     = document.getElementById("audio-modal");
  const enableBtn = document.getElementById("enable-audio");

  if (!audio || !iqamaEl || !currentEl) return;

  // خطوة 1: طلب إذن الصوت عند أول ضغط
  enableBtn.addEventListener("click", () => {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      // إخفاء النافذة بعد التفعيل
      modal.style.display = "none";
    });
  }, { once: true });

  // دوال مساعدة
  function extractTime(str) {
    const match = str.match(/(\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : null;
  }

  function parseDiffToSeconds(str) {
    const clean = extractTime(str);
    if (!clean) return null;
    const parts = clean.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  function checkCountdown() {
    const txt = iqamaEl.textContent || "";
    const remainingSeconds = parseDiffToSeconds(txt);
    if (remainingSeconds === null) return;

    if (remainingSeconds <= 5) {
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3 * 60 * 1000);
    }
  }

  setInterval(checkCountdown, 1000);
})();
