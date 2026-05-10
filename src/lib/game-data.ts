import roomWater from "@/assets/room-water.jpg";
import roomFood from "@/assets/room-food.jpg";
import roomOxygen from "@/assets/room-oxygen.jpg";
import roomTemp from "@/assets/room-temp.jpg";
import roomLight from "@/assets/room-light.jpg";
import roomSoil from "@/assets/room-soil.jpg";
import roomDefense from "@/assets/room-defense.jpg";

import holoMaluach from "@/assets/holo-maluach.png";
import holoJerboa from "@/assets/holo-jerboa.png";
import holoFox from "@/assets/holo-fox.png";
import holoBacteria from "@/assets/holo-bacteria.png";
import holoWaterplant from "@/assets/holo-waterplant.png";
import holoEagle from "@/assets/holo-eagle.png";
import holoWhale from "@/assets/holo-whale.png";
import holoYeast from "@/assets/holo-yeast.png";
import holoHorse from "@/assets/holo-horse.png";
import holoBlubber from "@/assets/holo-blubber.png";
import holoDesertMouse from "@/assets/holo-desert-mouse.png";
import holoFennec from "@/assets/holo-fennec.png";
import holoOak from "@/assets/holo-oak.png";
import holoAlgae from "@/assets/holo-algae.png";
import holoCaveBacteria from "@/assets/holo-cave-bacteria.png";
import holoSand from "@/assets/holo-sand.png";
import holoSoil from "@/assets/holo-soil.png";
import holoRock from "@/assets/holo-rock.png";
import holoCamouflage from "@/assets/holo-camouflage.png";
import holoNoise from "@/assets/holo-noise.png";
import holoGazelle from "@/assets/holo-gazelle.png";

export type AnimalFact = {
  name: string;
  fact: string;
  image: string;
};

export type Option = {
  label: string;
  correct: boolean;
  /** Why this option is wrong (shown only if user picks it) */
  wrongReason?: string;
};

export type Room = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  image: string;
  accent: "cyan" | "magenta" | "green" | "amber" | "violet" | "red" | "blue";
  /** Intro text about the survival need — shown highlighted before the question */
  intro: string;
  question: string;
  options: Option[];
  /** Explanation shown after answering correctly */
  explanation: string;
  /** Short factual snippets about each subject in the question */
  facts: AnimalFact[];
};

export const rooms: Room[] = [
  {
    id: "water",
    number: 1,
    title: "מעבדה הידרולוגית",
    subtitle: "מים",
    image: roomWater,
    accent: "cyan",
    intro:
      "המים חשובים לתפקוד הגוף שלנו. הם עוזרים להוליך חומרים בתאים, שומרים על טמפרטורת הגוף ומפנים פסולת מהגוף. בגלל צורך קיום חשוב זה הותאמו יצורים מיוחדים למחסור במים.",
    question: "מי לא מותאם למחסור במים?",
    options: [
      {
        label: "צמח המלוח",
        correct: false,
        wrongReason:
          "המלוח דווקא מותאם מצוין למחסור במים — הוא צמח מדברי שמפריש מלח דרך עליו ובכך שומר על מאזן המים בגוף שלו.",
      },
      {
        label: "ירבוע",
        correct: false,
        wrongReason:
          "הירבוע מותאם בצורה יוצאת דופן למחסור במים — הוא מפיק את כל המים שהוא צריך מהמזון שלו ויכול לחיות חיים שלמים בלי לשתות אפילו טיפה.",
      },
      { label: "שועל מצוי", correct: true },
    ],
    explanation:
      "השועל המצוי תלוי במקורות שתייה זמינים והוא חי בעיקר באזורים עם נגישות למים. בניגוד אליו, יצורי מדבר אמיתיים פיתחו מנגנונים מתוחכמים לחיסכון במים.",
    facts: [
      {
        name: "צמח המלוח",
        image: holoMaluach,
        fact: "צמח שיחי המצוי באזורים מלוחים ויבשים. סופג מים מליחים מהקרקע ומפריש את עודפי המלח דרך בלוטות מיוחדות בעלים — מה שמאפשר לו לשרוד שם שצמחים אחרים אינם יכולים.",
      },
      {
        name: "ירבוע",
        image: holoJerboa,
        fact: "מכרסם מדברי קטן שחי בנגב ובסהרה. אינו שותה מים כלל — מפיק את הנוזלים מהמזון היבש (זרעים ועלים) ושומר עליהם דרך כליות יעילות במיוחד ושתן מרוכז ביותר.",
      },
      {
        name: "שועל מצוי",
        image: holoFox,
        fact: "טורף בינוני שחי במגוון בתי גידול בארץ ובעולם. זקוק לשתייה סדירה ולכן נמצא בעיקר ליד מקורות מים — נחלים, שדות מושקים ויישובים.",
      },
    ],
  },
  {
    id: "food",
    number: 2,
    title: "מעבדה ביוכימית",
    subtitle: "מזון",
    image: roomFood,
    accent: "green",
    intro:
      "המזון נותן לנו את האנרגיה והחומרים הדרושים לבניית הגוף ולשמירה על הבריאות. הוא חיוני לכל יצור חי. יצורים שונים מפיקים או מקבלים את המזון שלהם בדרכים שונות.",
    question: "אם כל החומרים האורגניים ייעלמו מהסביבה – מי ייפגע יותר מכל?",
    options: [
      { label: "חיידק מפרק חומר אורגני", correct: true },
      {
        label: "צמח מים",
        correct: false,
        wrongReason:
          "צמח מים מייצר את המזון שלו בעצמו דרך פוטוסינתזה — מים, אור שמש ופחמן דו-חמצני. הוא לא תלוי בחומר אורגני קיים.",
      },
      {
        label: "עיט",
        correct: false,
        wrongReason:
          "העיט הוא טורף — הוא תלוי במזון אורגני חי, אבל כל עוד יש בעלי חיים אחרים בסביבה יש לו מזון. הוא לא הראשון להיפגע מהיעלמות החומר האורגני המפורר בקרקע.",
      },
    ],
    explanation:
      "החיידק המפרק תלוי לחלוטין בחומר אורגני קיים — בלעדיו אין לו ממה להפיק אנרגיה והוא נכחד ראשון. כל מערכת המחזור של חומרים בטבע נשענת עליו.",
    facts: [
      {
        name: "חיידק מפרק חומר אורגני",
        image: holoBacteria,
        fact: "מיקרואורגניזם שתפקידו לפרק שאריות של צמחים ובעלי חיים מתים ולהחזיר את המינרלים לקרקע. ללא חומר אורגני קיים — אין לו מקור אנרגיה והוא הראשון להיכחד.",
      },
      {
        name: "צמח מים",
        image: holoWaterplant,
        fact: "צמח אוטוטרופי החי במים. מייצר את האנרגיה שלו עצמאית דרך פוטוסינתזה — אינו זקוק לחומר אורגני קיים אלא רק לאור, מים ופחמן דו-חמצני.",
      },
      {
        name: "עיט",
        image: holoEagle,
        fact: "עוף דורס גדול הניזון מבעלי חיים אחרים (לעיתים גם נבלות). הוא תלוי בשרשרת המזון אבל לא ייפגע מיד מהיעלמות חומר אורגני מפורר.",
      },
    ],
  },
  {
    id: "oxygen",
    number: 3,
    title: "מעבדת אטמוספירה",
    subtitle: "חמצן",
    image: roomOxygen,
    accent: "blue",
    intro:
      "יצור חי זקוק לחמצן כדי לנשום ולהפיק אנרגיה מהמזון. החמצן מאפשר לנו לחיות ולהתפקד. הדרכים להשגת החמצן מגוונות וישנם מקרים בהם לטבע אפשרות להסתדר גם ללא חמצן.",
    question: "מי מהיצורים יכול לשרוד הכי הרבה זמן ללא חמצן?",
    options: [
      {
        label: "לוויתן",
        correct: false,
        wrongReason:
          "לוויתן יכול לעצור נשימה לזמן ארוך (עד שעתיים) — אבל בסופו של דבר הוא חייב לעלות לאוויר. הוא יונק נושם חמצן.",
      },
      { label: "שמרים", correct: true },
      {
        label: "סוס",
        correct: false,
        wrongReason:
          "הסוס הוא יונק יבשתי — מערכת הנשימה שלו דורשת חמצן רציף. כמה דקות בלי חמצן וזה גורם לנזק מוחי בלתי הפיך.",
      },
    ],
    explanation:
      "שמרים יכולים לחיות גם בלי חמצן — בהיעדרו הם מבצעים תסיסה והופכים סוכר לאתנול ולפחמן דו-חמצני. תהליך זה מנוצל באפיית לחם ובהכנת יין ובירה.",
    facts: [
      {
        name: "לוויתן",
        image: holoWhale,
        fact: "יונק ימי ענק שיכול לעצור נשימה לזמנים ארוכים (לוויתן הזרע — עד שעתיים בצלילה). אבל הוא חייב לעלות לפני המים כדי לנשום אוויר.",
      },
      {
        name: "שמרים",
        image: holoYeast,
        fact: "שמרים הם פטריות חד-תאיות זעירות שיכולות לחיות גם בלי חמצן. בנוכחות חמצן הם מפיקים אנרגיה ביעילות, ובהיעדרו מבצעים תסיסה — הופכים סוכר לאתנול ולפחמן דו-חמצני. כך אופים לחם ומכינים יין ובירה.",
      },
      {
        name: "סוס",
        image: holoHorse,
        fact: "יונק יבשתי גדול עם מערכת נשימה ולב חזקים, אבל תלוי לחלוטין באוויר עשיר בחמצן — חוסר חמצן פוגע בו תוך דקות בודדות.",
      },
    ],
  },
  {
    id: "temperature",
    number: 4,
    title: "מעבדה תרמית",
    subtitle: "טמפרטורה",
    image: roomTemp,
    accent: "red",
    intro:
      "לכל יצור חי יש צורך בטמפרטורה יציבה בגוף כדי שהמערכות הפיזיולוגיות יתפקדו כראוי. אנחנו צריכים לשמור על חום הגוף. יש יצורים שמותאמים לחום גבוה ויש כאלו שדווקא לקור.",
    question: "איזו התאמה עוזרת לבעלי חיים לשרוד בקור קיצוני?",
    options: [
      { label: "שכבת שומן עבה", correct: true },
      {
        label: "עכבר חולות פעיל בלילה",
        correct: false,
        wrongReason:
          "עכברי החול במדבר פעילים בשעות הלילה הקרירות כדי להימנע מחום היום — זו התאמה לחום קיצוני, לא לקור.",
      },
      {
        label: "אוזניים גדולות של שועל החולות",
        correct: false,
        wrongReason:
          "האוזניים הגדולות של שועל החולות מסייעות לפזר חום מהגוף ולשמור על טמפרטורה יציבה בחום — זו התאמה לחום מדברי, לא לקור קיצוני.",
      },
    ],
    explanation:
      "שכבת שומן עבה (בלובר) מבודדת את הגוף מהסביבה הקרה ושומרת על חום פנימי קבוע — זו ההתאמה הקלאסית של דובי קוטב, פוקות ולווייתנים.",
    facts: [
      {
        name: "שכבת שומן עבה",
        image: holoBlubber,
        fact: "רקמה שומנית שמבודדת את הגוף משינויי טמפרטורה חיצוניים. יעילה במיוחד באזורים קרים — לוויתנים ופוקות עטופים בשכבת בלובר של עד 30 ס\"מ.",
      },
      {
        name: "עכבר חולות",
        image: holoDesertMouse,
        fact: "עכברי החול במדבר משתמשים בשעות הלילה הקרירות כדי להיות פעילים, כשהחום פחות חזק, ובכך נמנעים מחשיפה לשמש הקופחת של היום.",
      },
      {
        name: "שועל החולות",
        image: holoFennec,
        fact: "האוזניים הגדולות של שועל החולות מסייעות לו לפזר חום מהגוף ולשמור על טמפרטורה יציבה — מנגנון שעוזר לו להימנע מחום קיצוני במהלך היום החם במדבר.",
      },
    ],
  },
  {
    id: "light",
    number: 5,
    title: "מעבדת פוטוניקה",
    subtitle: "אור",
    image: roomLight,
    accent: "violet",
    intro:
      "אור הוא צורך קיומי מאוד חשוב לכל החיים. בלי אור, לא היו יכולים לצמוח צמחים, וזה היה משפיע על כל שאר היצורים החיים.",
    question: "מי מבין הבאים אינו זקוק לאור שמש כדי להתקיים?",
    options: [
      {
        label: "עץ אלון",
        correct: false,
        wrongReason:
          "עץ אלון הוא צמח גדול שמייצר אנרגיה דרך פוטוסינתזה — בלי אור שמש העלים שלו לא יכולים לייצר סוכרים והעץ ימות.",
      },
      {
        label: "אצה ירוקה",
        correct: false,
        wrongReason:
          "אצות ירוקות הן מהיצרנים הראשיים בים — הן מבצעות פוטוסינתזה בדיוק כמו צמחים. בלי אור שמש הן לא יכולות לחיות.",
      },
      { label: "חיידק מערות", correct: true },
    ],
    explanation:
      "חיידקי מערות חיים בחושך מוחלט ומפיקים אנרגיה מתהליכים כימיים (כמוסינתזה) — למשל מתחמוצת של גופרית או ברזל. צמחים ואצות חייבים אור לפוטוסינתזה.",
    facts: [
      {
        name: "עץ אלון",
        image: holoOak,
        fact: "עץ נשיר גדול ועמיד שחי מאות שנים. עליו מבצעים פוטוסינתזה ויוצרים סוכרים מאור השמש — בלי אור הוא לא יכול לייצר אנרגיה.",
      },
      {
        name: "אצה ירוקה",
        image: holoAlgae,
        fact: "צמח מימי פשוט המכיל כלורופיל. מהווה בסיס של שרשראות מזון ימיות — מייצרת חמצן ואנרגיה דרך פוטוסינתזה.",
      },
      {
        name: "חיידק מערות",
        image: holoCaveBacteria,
        fact: "מיקרואורגניזם שחי בחושך מוחלט עמוק במערות. במקום פוטוסינתזה — משתמש בכמוסינתזה: מפיק אנרגיה מתגובות כימיות עם מינרלים בסלע.",
      },
    ],
  },
  {
    id: "soil",
    number: 6,
    title: "מעבדה גיאולוגית",
    subtitle: "מצע",
    image: roomSoil,
    accent: "amber",
    intro:
      "צמחים זקוקים לקרקע כדי לשתול את שורשיהם ולקבל ממנה מים ומינרלים. בעלי חיים משתמשים גם בקרקע כמקום מחיה ומסתור.",
    question: "איזה מצע מתאים ביותר ליצור שחי במחילות תת-קרקעיות?",
    options: [
      {
        label: "חול נייד",
        correct: false,
        wrongReason:
          "חול נייד מתפורר ומחילות שנחפרות בו קורסות מיד — לא ניתן לבנות בו מערכת מחילות יציבה.",
      },
      { label: "קרקע חולית-חרסיתית", correct: true },
      {
        label: "סלע מוצק",
        correct: false,
        wrongReason:
          "סלע מוצק לא ניתן לחפירה כמעט על ידי בעלי חיים. אפילו עם ציפורניים חזקות, חפירת מחילה בסלע דורשת אנרגיה אדירה.",
      },
    ],
    explanation:
      "קרקע חולית-חרסיתית מאפשרת חפירת מחילות יציבות שלא קורסות ושומרות על לחות וטמפרטורה קבועה — תנאים אידיאליים ליונקים חופרים כמו חולד וקיפוד.",
    facts: [
      {
        name: "חול נייד",
        image: holoSand,
        fact: "חול דק וזורם המצוי בדיונות מדבריות. הגרגירים לא נדבקים זה לזה ולכן מחילות בתוכו מתמוטטות מיידית — בעלי חיים שחיים שם נעים על פני השטח ולא מתחתיו.",
      },
      {
        name: "קרקע חולית-חרסיתית",
        image: holoSoil,
        fact: "תערובת אופטימלית של חול וחרסית — מספיק רכה לחפירה אבל מספיק יציבה כדי שמחילות לא יקרסו. בית הגידול האידיאלי ליונקים חופרים.",
      },
      {
        name: "סלע מוצק",
        image: holoRock,
        fact: "מסה מינרלית קשיחה. רק יצורים מיקרוסקופיים או כאלה עם כלים מיוחדים מאוד (כמו צדפת אבן) מצליחים לחיות בתוכו.",
      },
    ],
  },
  {
    id: "defense",
    number: 7,
    title: "מעבדת הגנה",
    subtitle: "אמצעי הגנה",
    image: roomDefense,
    accent: "magenta",
    intro:
      "ההגנה חיונית להישרדות ולהמשכיות המין, ומאפשרת ליצורים חיים להתמודד עם איומים מהסביבה.",
    question: "איזה אמצעי הגנה הוא הכי יעיל מול טורף שמסתמך על ראייה?",
    options: [
      { label: "הסוואה (קמופלאז')", correct: true },
      {
        label: "רעש חזק",
        correct: false,
        wrongReason:
          "רעש חזק עלול דווקא למשוך תשומת לב של טורף שמסתמך על ראייה — הוא ירצה לראות מה מקור הרעש.",
      },
      {
        label: "ריצה מהירה",
        correct: false,
        wrongReason:
          "ריצה מהירה היא טובה — אבל היא דורשת קודם שהטורף יבחין בך. עדיף שלא יראה אותך מלכתחילה.",
      },
    ],
    explanation:
      "הסוואה גורמת לטורף פשוט לא לראות את הטרף — עדיף למנוע גילוי מאשר לברוח אחרי שכבר זוהית. זו אסטרטגיית ההגנה היעילה ביותר נגד טורפים חזותיים.",
    facts: [
      {
        name: "הסוואה",
        image: holoCamouflage,
        fact: "התאמה של צבע, צורה ותבנית הגוף לסביבה — כך שהטורף פשוט לא מבחין בטרף. נפוצה בלטאות, חרקים, דגים וציפורים.",
      },
      {
        name: "רעש חזק",
        image: holoNoise,
        fact: "אסטרטגיית הגנה שמתאימה נגד טורפים שמתבססים על שמיעה או נגד תוקפים שמתבהלים — אבל מול טורף חזותי היא חושפת את הטרף.",
      },
      {
        name: "ריצה מהירה",
        image: holoGazelle,
        fact: "התאמה של הצבי ושל הגזלים — מאפשרת בריחה אחרי שזוהית. יעילה כשמשולבת עם זריזות תמרון, אבל פחות אפקטיבית מהסוואה כאסטרטגיה ראשונית.",
      },
    ],
  },
];
