(function () {
  const ids = {
    الفجر: "fajr-time",
    الظهر: "dhuhr-time",
    العصر: "asr-time",
    المغرب: "maghrib-time",
    العشاء: "isha-time",
  };

  const order = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];

  function extractTime(str) {
    if (!str) return null;
    // يقبل صيغة (HH:MM) أو HH:MM
    let match = str.match(/\((\d{1,2}:\d{2})\)/);
    if (match) return match[1];
    match = str.match(/(\d{1,2}:\d{2})/);
    return match ? match[1] : null;
  }

  function parseTimeToDate(str, refDate) {
    const clean = extractTime(str);
    if (!clean) return null;
    const parts = clean.split(":").map(Number);
    if (parts.length < 2 || parts.some(isNaN)) return null;
    const d = new Date(refDate);
    d.setHours(parts[0], parts[1], 0, 0);
    return d;
  }

  function checkAndPlayAdhan() {
    const now = new Date();

    for (const name of order) {
      const el = document.getElementById(ids[name]);
      const txt = el ? el.textContent : "";
      const prayerTime = parseTimeToDate(txt, now);
      if (!prayerTime) continue;

      const diffSeconds = Math.abs((prayerTime - now) / 1000);
      if (diffSeconds <= 5) {
        const audio = document.getElementById("adhan-audio");
        if (audio) {
          audio.play();

          // إيقاف الأذان بعد 3 دقائق
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0; // رجع الصوت للبداية
          }, 3 * 60 * 1000);
        }
        break; // وقف عند أول صلاة تطابق الشرط
      }
    }
  }

  setInterval(checkAndPlayAdhan, 1000);
})();
