(function () {
  const currentEl = document.getElementById("current-time"); // خانة الوقت الحالي
  const iqamaEl   = document.getElementById("iqama-time");   // خانة الإقامة
  const audio     = document.getElementById("iqama-audio");  // عنصر الصوت للإقامة
  if (!currentEl || !iqamaEl || !audio) return;

  // استخراج العدّاد بصيغة HH:MM:SS
  function extractTime(str) {
    if (!str) return null;
    const match = str.match(/(\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : null;
  }

  // تحويل العدّاد إلى ثواني
  function parseDiffToSeconds(str) {
    const clean = extractTime(str);
    if (!clean) return null;
    const parts = clean.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  function checkCountdown() {
    const txt = iqamaEl.textContent || "";
    const remainingSeconds = parseDiffToSeconds(txt);
    if (remainingSeconds === null) return;

    // إذا الباقي 5 ثواني أو أقل
    if (remainingSeconds <= 5) {
    
      // تشغيل صوت الإقامة
      audio.play();

      // إيقاف الصوت بعد 3 دقائق
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3 * 60 * 1000);
    }
  }

  setInterval(checkCountdown, 1000);
})();
