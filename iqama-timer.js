(function () {
  const iqamaEl = document.getElementById("iqama-time");
  if (!iqamaEl) return;

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

  // تنسيق الفرق بصيغة HH:MM:SS
  function formatDiff(diffMs) {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  function updateIqama() {
    const now = new Date();
    let nextIqama = null;

    for (const name of order) {
      const el = document.getElementById(ids[name]);
      const txt = el ? el.textContent : "";
      const baseTime = parseTimeToDate(txt, now);
      if (!baseTime) continue;

      // وقت الإقامة = وقت الصلاة + الإزاحة
      const iqamaTime = new Date(baseTime.getTime() + iqamaOffsets[name] * 60000);

      if (iqamaTime > now) {
        nextIqama = { name, diffMs: iqamaTime - now, time: iqamaTime };
        break;
      }
    }

    if (nextIqama) {
      const diffStr = formatDiff(nextIqama.diffMs);
      iqamaEl.textContent =
        "باقي لإقامة صلاة " + nextIqama.name + " - (" + diffStr + ")";

      // إذا دخل وقت الإقامة (فرق صفر أو أقل)
      if (nextIqama.diffMs <= 0) {
        console.log("🚨 دخل وقت إقامة صلاة " + nextIqama.name);
      }
    } else {
      // إذا خلص اليوم → إقامة الفجر غداً
      const fajrEl = document.getElementById(ids["الفجر"]);
      const txt = fajrEl ? fajrEl.textContent : "";
      const fajrToday = parseTimeToDate(txt, now);
      if (fajrToday) {
        const tomorrowFajrIqama = new Date(fajrToday.getTime() + 30 * 60000);
        tomorrowFajrIqama.setDate(tomorrowFajrIqama.getDate() + 1);
        const diffMs = tomorrowFajrIqama - now;
        iqamaEl.textContent =
          "باقي لإقامة صلاة الفجر غداً - (" + formatDiff(diffMs) + ")";
      }
    }
  }

  setInterval(updateIqama, 1000);
  updateIqama();
})();
