// tanbih_kabl_alsalat.js
(function () {
  const audio15 = document.getElementById("alert-15"); // باقي 15 دقيقة
  const audio10 = document.getElementById("alert-10"); // باقي 10 دقائق
  const audio5  = document.getElementById("alert-5");  // باقي 5 دقائق

  // ترتيب الصلوات حسب اليوم
  const ids = {
    الفجر: "fajr-time",
    الشروق: "sunrise-time",
    الظهر: "dhuhr-time",
    العصر: "asr-time",
    المغرب: "maghrib-time",
    العشاء: "isha-time",
  };
  const order = ["الفجر","الشروق","الظهر","العصر","المغرب","العشاء"];

  let played15 = false;
  let played10 = false;
  let played5  = false;
  let currentTarget = null;

  // استخراج الوقت من النص داخل الأقواس (مثال: "الظهر - (12:34)" → "12:34")
  function extractTime(str) {
    const match = str.match(/\((\d{1,2}:\d{2})\)/);
    return match ? match[1] : null;
  }

  // تحويل HH:MM إلى كائن Date بنفس يومك الحالي
  function parseTimeToDate(str, refDate) {
    const [h, m] = str.split(":").map(Number);
    const d = new Date(refDate);
    d.setHours(h, m, 0, 0);
    return d;
  }

  function playAudio(audio) {
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 20 * 1000);
  }

  function getNextPrayerTime() {
    const now = new Date();
    for (const name of order) {
      const el = document.getElementById(ids[name]);
      const txt = el ? el.textContent : "";
      const timeStr = extractTime(txt);
      if (!timeStr) continue;
      const dt = parseTimeToDate(timeStr, now);
      if (dt > now) return dt;
    }
    return null;
  }

  function checkAlerts() {
    const now = new Date();
    const adhanTime = getNextPrayerTime();
    if (!adhanTime) return;

    const diffSeconds = Math.floor((adhanTime - now) / 1000);

    // إذا تغيّرت الصلاة القادمة → إعادة ضبط
    if (!currentTarget || adhanTime.getTime() !== currentTarget.getTime()) {
      played15 = false;
      played10 = false;
      played5  = false;
      currentTarget = adhanTime;
    }

    // تنبيه قبل الأذان بـ 15 دقيقة ±5 ثواني
    if (!played15 && Math.abs(diffSeconds - 15*60) <= 5) {
      playAudio(audio15);
      played15 = true;
    }

    // تنبيه قبل الأذان بـ 10 دقائق ±5 ثواني
    if (!played10 && Math.abs(diffSeconds - 10*60) <= 5) {
      playAudio(audio10);
      played10 = true;
    }

    // تنبيه قبل الأذان بـ 5 دقائق ±5 ثواني
    if (!played5 && Math.abs(diffSeconds - 5*60) <= 5) {
      playAudio(audio5);
      played5 = true;
    }
  }

  setInterval(checkAlerts, 1000);
})();
