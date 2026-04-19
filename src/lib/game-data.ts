import roomWater from "@/assets/room-water.jpg";
import roomFood from "@/assets/room-food.jpg";
import roomOxygen from "@/assets/room-oxygen.jpg";
import roomTemp from "@/assets/room-temp.jpg";
import roomLight from "@/assets/room-light.jpg";
import roomSoil from "@/assets/room-soil.jpg";
import roomDefense from "@/assets/room-defense.jpg";

export type Room = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  accent: "cyan" | "magenta" | "green" | "amber" | "violet" | "red" | "blue";
  question: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
};

export const rooms: Room[] = [
  {
    id: "water",
    number: 1,
    title: "מעבדה הידרולוגית",
    subtitle: "מים",
    icon: "💧",
    image: roomWater,
    accent: "cyan",
    question: "מי לא מותאם למחסור במים?",
    options: [
      { label: "🌿 צמח המלוח", correct: false },
      { label: "🐁 ירבוע", correct: false },
      { label: "🦊 שועל מצוי", correct: true },
    ],
    explanation:
      "השועל המצוי תלוי במקורות שתייה זמינים. המלוח מפריש מלח ושומר מים, והירבוע מפיק מים מהמזון ויכול לשרוד בלי לשתות כלל.",
  },
  {
    id: "food",
    number: 2,
    title: "מעבדה ביוכימית",
    subtitle: "מזון",
    icon: "🍞",
    image: roomFood,
    accent: "green",
    question: "אם כל החומרים האורגניים ייעלמו מהסביבה – מי ייפגע יותר מכל?",
    options: [
      { label: "🧫 חיידק מפרק חומר אורגני", correct: true },
      { label: "🌿 צמח מים", correct: false },
      { label: "🦅 עיט", correct: false },
    ],
    explanation:
      "החיידק המפרק תלוי לחלוטין בחומר אורגני כדי להתקיים — בלעדיו הוא נכחד ראשון. צמחים מייצרים אנרגיה מהשמש ועיטים יכולים לחפש מזון אחר.",
  },
  {
    id: "oxygen",
    number: 3,
    title: "מעבדת אטמוספירה",
    subtitle: "חמצן",
    icon: "🫧",
    image: roomOxygen,
    accent: "blue",
    question: "מי מהיצורים יכול לשרוד הכי הרבה זמן ללא חמצן?",
    options: [
      { label: "🐋 לוויתן", correct: false },
      { label: "🪱 תולעת מעי", correct: true },
      { label: "🐎 סוס", correct: false },
    ],
    explanation:
      "תולעי מעיים מסוימות הן אנאירוביות — הן חיות בסביבות נטולות חמצן ומפיקות אנרגיה בדרכים אחרות לחלוטין.",
  },
  {
    id: "temperature",
    number: 4,
    title: "מעבדה תרמית",
    subtitle: "טמפרטורה",
    icon: "🌡️",
    image: roomTemp,
    accent: "red",
    question: "איזו התאמה עוזרת לבעלי חיים לשרוד בקור קיצוני?",
    options: [
      { label: "❄️ שכבת שומן עבה", correct: true },
      { label: "🦷 שיניים חדות", correct: false },
      { label: "👀 ראייה לילית", correct: false },
    ],
    explanation:
      "שכבת שומן עבה (בלובר) מבודדת את הגוף ושומרת על חום פנימי — זו ההתאמה הקלאסית של דובי קוטב, פוקות ולווייתנים.",
  },
  {
    id: "light",
    number: 5,
    title: "מעבדת פוטוניקה",
    subtitle: "אור",
    icon: "💡",
    image: roomLight,
    accent: "violet",
    question: "מי מבין הבאים אינו זקוק לאור שמש כדי להתקיים?",
    options: [
      { label: "🌳 עץ אלון", correct: false },
      { label: "🌊 אצה ירוקה", correct: false },
      { label: "🦠 חיידק מערות", correct: true },
    ],
    explanation:
      "חיידקי מערות חיים בחושך מוחלט ומפיקים אנרגיה מתהליכים כימיים (כמוסינתזה). צמחים ואצות חייבים אור לפוטוסינתזה.",
  },
  {
    id: "soil",
    number: 6,
    title: "מעבדה גיאולוגית",
    subtitle: "מצע",
    icon: "🪨",
    image: roomSoil,
    accent: "amber",
    question: "איזה מצע מתאים ביותר ליצור שחי במחילות תת-קרקעיות?",
    options: [
      { label: "🏖️ חול נייד", correct: false },
      { label: "🌱 קרקע חולית-חרסיתית", correct: true },
      { label: "🪨 סלע מוצק", correct: false },
    ],
    explanation:
      "קרקע חולית-חרסיתית מאפשרת חפירת מחילות יציבות שלא קורסות ושומרות על לחות — תנאים אידיאליים ליונקים חופרים.",
  },
  {
    id: "defense",
    number: 7,
    title: "מעבדת הגנה",
    subtitle: "אמצעי הגנה",
    icon: "🛡️",
    image: roomDefense,
    accent: "magenta",
    question: "איזה אמצעי הגנה הוא הכי יעיל מול טורף שמסתמך על ראייה?",
    options: [
      { label: "🦎 הסוואה (קמופלאז')", correct: true },
      { label: "🔊 רעש חזק", correct: false },
      { label: "💨 ריצה מהירה", correct: false },
    ],
    explanation:
      "הסוואה גורמת לטורף פשוט לא לראות את הטרף — עדיף למנוע גילוי מאשר לברוח אחרי שכבר זוהית.",
  },
];
