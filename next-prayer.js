(function () {
  const nextPrayerEl = document.getElementById("next-prayer");
  if (!nextPrayerEl) return;

  // أسماء الخانات المرتبطة بالصلوات
  const ids = {
    الفجر: "fajr-time",
    الظهر: "dhuhr-time",
    العصر: "asr-time",
    المغرب: "maghrib-time",
    العشاء: "isha-time",
  };

  const order = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];

  // استخراج الوقت من النص داخل الأقواس (مثال: "الظهر - (12:34)" → "12:34")
  function extractTime(str) {
    if (!str) return null;
    const match = str.match(/\((\d{1,2}:\d{2})\)/);
    return match ? match[1] : null;
  }

  // تحويل النص HH:MM إلى كائن Date بنفس يومك الحالي
  function parseTimeToDate(str, refDate) {
    const clean = extractTime(str);
    if (!clean) return null;
    const parts = clean.split(":").map(Number);
    if (parts.length < 2 || parts.some(isNaN)) return null;
    const d = new Date(refDate);
    d.setHours(parts[0], parts[1], 0, 0);
    return d;
  }

  // تنسيق الفرق بصيغة HH:MM:SS
  function formatDiff(diffMs) {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  function updateNextPrayer() {
    const now = new Date();
    let nextPrayer = null;

    // البحث عن أول صلاة وقتها أكبر من الآن
    for (const name of order) {
      const el = document.getElementById(ids[name]);
      const txt = el ? el.textContent : "";
      const dt = parseTimeToDate(txt, now);
      if (dt && dt > now) {
        nextPrayer = { name, diffMs: dt - now };
        break;
      }
    }

    if (nextPrayer) {
      nextPrayerEl.textContent =
        "باقي لصلاة " + nextPrayer.name + " - (" + formatDiff(nextPrayer.diffMs) + ")";
    } else {
      // إذا خلص اليوم → الفجر غداً
      const fajrEl = document.getElementById(ids["الفجر"]);
      const fajrTxt = fajrEl ? fajrEl.textContent : "";
      const fajrToday = parseTimeToDate(fajrTxt, now);
      if (fajrToday) {
        const tomorrowFajr = new Date(now);
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        tomorrowFajr.setHours(
          fajrToday.getHours(),
          fajrToday.getMinutes(),
          0,
          0
        );
        const diffMs = tomorrowFajr - now;
        nextPrayerEl.textContent =
          "باقي لصلاة الفجر غداً - (" + formatDiff(diffMs) + ")";
      }
    }
  }

  // تحديث حي كل ثانية
  setInterval(updateNextPrayer, 1000);
  updateNextPrayer();
})();
