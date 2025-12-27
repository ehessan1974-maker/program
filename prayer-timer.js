function updateTime() {
  const now = new Date();
  // تنسيق الوقت: ساعات:دقائق:ثواني
  const timeString = now.toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById("current-time").textContent =  timeString;
}

// تحديث كل ثانية
setInterval(updateTime, 1000);
updateTime();
