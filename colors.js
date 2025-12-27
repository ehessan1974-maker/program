(function () {
  const nextPrayerEl = document.getElementById("next-prayer");
  const iqamaEl = document.getElementById("iqama-time");
  if (!nextPrayerEl || !iqamaEl) return;

  const iqamaOffsets = {
    الفجر: 30,
    الظهر: 20,
    العصر: 20,
    المغرب: 10,
    العشاء: 10,
  };

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
    const match = str.match(/\((\d{1,2}:\d{2})\)/);
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

  function isWithinIqama(now, baseTime, offsetMinutes) {
    const iqamaStart = baseTime; // وقت الصلاة
    const iqamaEnd = new Date(baseTime.getTime() + offsetMinutes * 60000);
    return now >= iqamaStart && now <= iqamaEnd;
  }

  function updateColors() {
    const now = new Date();

    for (const name of order) {
      const el = document.getElementById(ids[name]);
      const txt = el ? el.textContent : "";
      const baseTime = parseTimeToDate(txt, now);
      if (!baseTime) continue;

      const offset = iqamaOffsets[name];
      const iqamaTime = new Date(baseTime.getTime() + offset * 60000);

      if (iqamaTime > now) {
        // تحقق إذا الوقت ضمن فترة الإقامة
        if (isWithinIqama(now, baseTime, offset)) {
          nextPrayerEl.style.color = "silver";
          iqamaEl.style.color = "darkgreen";
        } else {
          nextPrayerEl.style.color = "darkgreen";
          iqamaEl.style.color = "silver";
        }
        break;
      }
    }
  }

  setInterval(updateColors, 1000);
  updateColors();
})();
