fetch("https://api.aladhan.com/v1/timingsByCity?city=Safita&country=Syria&method=2")
  .then(res => res.json())
  .then(data => {
    const timings = data.data.timings;

    document.getElementById("fajr-time").textContent   = "الفجر - (" + timings.Fajr + ")";
    document.getElementById("sunrise-time").textContent = "الشروق - (" + timings.Sunrise + ")";
    document.getElementById("dhuhr-time").textContent   = "الظهر - (" + timings.Dhuhr + ")";
    document.getElementById("asr-time").textContent     = "العصر - (" + timings.Asr + ")";
    document.getElementById("maghrib-time").textContent = "المغرب - (" + timings.Maghrib + ")";
    document.getElementById("isha-time").textContent    = "العشاء - (" + timings.Isha + ")";
  })
  .catch(err => console.error("خطأ في جلب الأوقات:", err));



