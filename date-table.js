function gregorianToHijri(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
             Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
             Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
             day - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const j = l - 10631 * n + 354;
  const q = (Math.floor((10985 - j) / 5316)) * (Math.floor((50 * j) / 17719)) +
            (Math.floor(j / 5670)) * (Math.floor((43 * j) / 15238));
  const r = j - (Math.floor((30 - q) / 15)) * (Math.floor((17719 * q) / 50)) -
            (Math.floor(q / 16)) * (Math.floor((15238 * q) / 43)) + 29;
  const m = Math.floor((24 * r) / 709);
  const d = r - Math.floor((709 * m) / 24);
  const y = 30 * n + q - 30;

  return {hDay: d, hMonth: m, hYear: y};
}

// أسماء الأشهر الهجرية
const hijriMonths = [
  "المحرّم","صَفَر","رَبيع الأوَّل","رَبيع الآخر",
  "جُمادى الأولى","جُمادى الآخرة","رَجَب","شَعبان",
  "رَمَضان","شَوَّال","ذو القَعدة","ذو الحِجّة"
];

// أسماء الأشهر الميلادية (شامي + عالمي)
const gregorianMonthsArabic = [
  "كانون الثاني","شباط","آذار","نيسان","أيار","حزيران",
  "تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"
];

const gregorianMonthsGlobal = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

// دالة تحويل رقم إلى أرقام عربية شرقية
function toArabicNumerals(num) {
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)]).join('');
}

const today = new Date();
const gYear = today.getFullYear();
const gMonthIndex = today.getMonth(); // رقم الشهر من 0 إلى 11
const gMonthArabic = gregorianMonthsArabic[gMonthIndex];
const gMonthGlobal = gregorianMonthsGlobal[gMonthIndex];
const gMonthNumber = gMonthIndex + 1;

const hijriDate = gregorianToHijri(today);
const hijriYear = hijriDate.hYear;
const hijriMonthName = hijriMonths[hijriDate.hMonth - 1];
const hijriMonthNumber = hijriDate.hMonth; // رقم الشهر الهجري

// أسماء الأيام
const days = ["الأَحَدُ","الاِثْنَيْنُ","الثُّلَاثَاءُ","الأَرْبِعَاءُ","الخَمِيسُ","الجُمُعَةُ","السَّبْتُ"];
const dayName = days[today.getDay()];

// رقم اليوم الهجري بالأرقام العربية
const hijriDayArabic = toArabicNumerals(hijriDate.hDay);

// رقم اليوم الميلادي بالأرقام العربية
const gregorianDayArabic = toArabicNumerals(today.getDate());

// كتابة السنة الميلادية في الخانة اليسرى بالصف الأول
document.getElementById("gregorian-year").textContent = gYear + " (ميلادي)";

// كتابة اسم اليوم في الخانة الوسطى بالصف الأول
document.getElementById("day-name").textContent = dayName;

// كتابة السنة الهجرية في الخانة اليمنى بالصف الأول
document.getElementById("hijri-year").textContent = hijriYear + " (هجري)";

// كتابة اسم الشهر الهجري مع رقمه في الخانة الأولى من الصف الثاني
document.getElementById("hijri-month").textContent =
  hijriMonthName + " - " + hijriMonthNumber;

// كتابة اسم الشهر الميلادي بصيغة (شامي - عالمي - رقم) في الخانة الثانية من الصف الثاني
document.getElementById("gregorian-month").textContent =
  gMonthArabic + " - " + gMonthGlobal + " - " + gMonthNumber;

// كتابة رقم اليوم الهجري بالأرقام العربية في الخانة الأولى من الصف الثالث
document.getElementById("arabic-day-number").textContent = hijriDayArabic;

// كتابة رقم اليوم الميلادي بالأرقام العربية في الخانة الثانية من الصف الثالث
document.getElementById("gregorian-day-number").textContent = gregorianDayArabic;

