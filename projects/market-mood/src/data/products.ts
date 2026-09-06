// מוצרים מותאמים לכל מצב רוח
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  mood: string;
  category: string;
}

export const products: Product[] = [
  // מוצרים לשמחה 😄
  {
    id: 'happy-1',
    name: 'פלייליסט אנרגטי',
    description: 'אוסף שירים מרימי מצב רוח להמשך היום',
    price: 29,
    imageUrl: 'https://via.placeholder.com/200/FFD93D/000?text=Music',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-2',
    name: 'משחק קלפים כיפי',
    description: 'משחק קבוצתי מצחיק לערב עם חברים',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/6BCB77/FFF?text=Game',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-3',
    name: 'קורס יוגה צחוק',
    description: 'סדרת וידאו ליוגה משולבת צחוק',
    price: 149,
    imageUrl: 'https://via.placeholder.com/200/FF6B9D/FFF?text=Yoga',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-4',
    name: 'ערכת פיקניק משפחתי',
    description: 'כל מה שצריך לפיקניק מושלם בטבע',
    price: 199,
    imageUrl: 'https://via.placeholder.com/200/FFD93D/000?text=Picnic',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-5',
    name: 'סדנת ריקוד לטינו',
    description: 'סדרת שיעורי ריקוד משמחים אונליין',
    price: 179,
    imageUrl: 'https://via.placeholder.com/200/6BCB77/FFF?text=Dance',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-6',
    name: 'משחק קופסה למשפחה',
    description: 'משחק אסטרטגיה מהנה לכל המשפחה',
    price: 129,
    imageUrl: 'https://via.placeholder.com/200/FF6B9D/FFF?text=Board+Game',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-7',
    name: 'אוזניות בלוטוס צבעוניות',
    description: 'אוזניות איכותיות עם צבעים עליזים',
    price: 249,
    imageUrl: 'https://via.placeholder.com/200/FFD93D/000?text=Headphones',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-8',
    name: 'קורס צילום כיפי',
    description: 'למד לצלם רגעים שמחים בצורה מקצועית',
    price: 299,
    imageUrl: 'https://via.placeholder.com/200/6BCB77/FFF?text=Photo',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-9',
    name: 'ערכת יצירה לילדים',
    description: 'כלים ליצירה משפחתית משותפת',
    price: 159,
    imageUrl: 'https://via.placeholder.com/200/FF6B9D/FFF?text=Art+Kit',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-10',
    name: 'מנוי למופעי סטנדאפ',
    description: 'גישה למופעי קומדיה מצחיקים אונליין',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/FFD93D/000?text=Comedy',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-11',
    name: 'כדור פעילות ואנרגיה',
    description: 'כדור כושר צבעוני למשחקים ופעילות',
    price: 119,
    imageUrl: 'https://via.placeholder.com/200/6BCB77/FFF?text=Ball',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-12',
    name: 'ספר בדיחות ופאנצ׳ים',
    description: 'אוסף הבדיחות המצחיק בעברית',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/FF6B9D/FFF?text=Jokes',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-13',
    name: 'פלייליסט מסיבות',
    description: 'מוזיקה להתחלת מסיבה בכל מקום',
    price: 39,
    imageUrl: 'https://via.placeholder.com/200/FFD93D/000?text=Party',
    mood: 'happy',
    category: 'digital'
  },
  {
    id: 'happy-14',
    name: 'ערכת בועות סבון ענקיות',
    description: 'כיף לילדים ומבוגרים בחצר',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/6BCB77/FFF?text=Bubbles',
    mood: 'happy',
    category: 'physical'
  },
  {
    id: 'happy-15',
    name: 'מנוי לאפליקציית משחקים',
    description: 'מאות משחקים משעשעים לכל הגילאים',
    price: 149,
    imageUrl: 'https://via.placeholder.com/200/FF6B9D/FFF?text=Games+App',
    mood: 'happy',
    category: 'digital'
  },
  
  // מוצרים לעצב 😢
  {
    id: 'sad-1',
    name: 'שוקולד מריר איכותי',
    description: 'מארז שוקולדים בלגיים מעולים',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/6F4E37/FFF?text=Chocolate',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-2',
    name: 'יומן רגשות מודרך',
    description: 'מחברת עם שאלות מנחות לעיבוד רגשי',
    price: 49,
    imageUrl: 'https://via.placeholder.com/200/B4A7D6/FFF?text=Journal',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-3',
    name: 'נר ריח מרגיע',
    description: 'נר לבנדר וקמומיל להרגעת החושים',
    price: 65,
    imageUrl: 'https://via.placeholder.com/200/9B59B6/FFF?text=Candle',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-4',
    name: 'פלייליסט מנחם',
    description: 'מוזיקה עדינה ומרגיעה לרגעים קשים',
    price: 29,
    imageUrl: 'https://via.placeholder.com/200/6F4E37/FFF?text=Comfort+Music',
    mood: 'sad',
    category: 'digital'
  },
  {
    id: 'sad-5',
    name: 'שמיכה רכה ומחממת',
    description: 'שמיכת פליז איכותית לחיבוק',
    price: 189,
    imageUrl: 'https://via.placeholder.com/200/B4A7D6/FFF?text=Blanket',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-6',
    name: 'קורס עיבוד רגשי',
    description: 'מפגשים מוקלטים עם פסיכולוג',
    price: 299,
    imageUrl: 'https://via.placeholder.com/200/9B59B6/FFF?text=Therapy',
    mood: 'sad',
    category: 'digital'
  },
  {
    id: 'sad-7',
    name: 'תה צמחים מרגיע',
    description: 'מבחר תה איכותי להרגעה',
    price: 59,
    imageUrl: 'https://via.placeholder.com/200/6F4E37/FFF?text=Herbal+Tea',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-8',
    name: 'ספר שירה מרגש',
    description: 'אוסף שירים מנחמים ויפים',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/B4A7D6/FFF?text=Poetry',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-9',
    name: 'מדיטציה מודרכת להרגעה',
    description: 'קבצי אודיו להרגעה עמוקה',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/9B59B6/FFF?text=Meditation',
    mood: 'sad',
    category: 'digital'
  },
  {
    id: 'sad-10',
    name: 'כרית חיבוק טיפולית',
    description: 'כרית רכה ומנחמת בצורת לב',
    price: 129,
    imageUrl: 'https://via.placeholder.com/200/6F4E37/FFF?text=Pillow',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-11',
    name: 'פאזל 1000 חלקים',
    description: 'פעילות מרגיעה ומפרגנת',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/B4A7D6/FFF?text=Puzzle',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-12',
    name: 'מארז טיפוח ספא ביתי',
    description: 'מסכות ומוצרי טיפוח מפנקים',
    price: 169,
    imageUrl: 'https://via.placeholder.com/200/9B59B6/FFF?text=Spa+Kit',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-13',
    name: 'סרטונים מרגיעים מהטבע',
    description: 'נופים ושקטים מדהימים',
    price: 49,
    imageUrl: 'https://via.placeholder.com/200/6F4E37/FFF?text=Nature',
    mood: 'sad',
    category: 'digital'
  },
  {
    id: 'sad-14',
    name: 'ספר צביעה למבוגרים',
    description: 'דפי מנדלה להרגעה ויצירה',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/B4A7D6/FFF?text=Coloring',
    mood: 'sad',
    category: 'physical'
  },
  {
    id: 'sad-15',
    name: 'מנוי לסיפורי שינה',
    description: 'סיפורים מרגיעים לשינה טובה',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/9B59B6/FFF?text=Stories',
    mood: 'sad',
    category: 'digital'
  },
  
  // מוצרים לניטרלי 😐
  {
    id: 'neutral-1',
    name: 'ספר מדיטציה למתחילים',
    description: 'מדריך פשוט להתחלת תרגול מדיטציה',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/3498DB/FFF?text=Book',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-2',
    name: 'אפליקציית מיינדפולנס',
    description: 'גישה שנתית לאפליקציית הרגעה',
    price: 199,
    imageUrl: 'https://via.placeholder.com/200/2ECC71/FFF?text=App',
    mood: 'neutral',
    category: 'digital'
  },
  {
    id: 'neutral-3',
    name: 'תה ירוק אורגני',
    description: 'מבחר תה איכותי מרגיע',
    price: 55,
    imageUrl: 'https://via.placeholder.com/200/27AE60/FFF?text=Tea',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-4',
    name: 'משטח יוגה איכותי',
    description: 'משטח נוח ואיכותי לתרגול',
    price: 149,
    imageUrl: 'https://via.placeholder.com/200/3498DB/FFF?text=Yoga+Mat',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-5',
    name: 'קורס נשימה ורוגע',
    description: 'טכניקות נשימה למיקוד וזרימה',
    price: 179,
    imageUrl: 'https://via.placeholder.com/200/2ECC71/FFF?text=Breathing',
    mood: 'neutral',
    category: 'digital'
  },
  {
    id: 'neutral-6',
    name: 'נר שעווה טבעי',
    description: 'נר לטיהור אוויר ואווירה שקטה',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/27AE60/FFF?text=Candle',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-7',
    name: 'מחברת bullet journal',
    description: 'מחברת מעוצבת לארגון ומחשבות',
    price: 59,
    imageUrl: 'https://via.placeholder.com/200/3498DB/FFF?text=Journal',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-8',
    name: 'מנוי פודקאסט פילוסופיה',
    description: 'שיחות מעמיקות על החיים',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/2ECC71/FFF?text=Podcast',
    mood: 'neutral',
    category: 'digital'
  },
  {
    id: 'neutral-9',
    name: 'ערכת זרעים לגינה',
    description: 'גינון כטיפול וחיבור לטבע',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/27AE60/FFF?text=Seeds',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-10',
    name: 'אוזניות סינון רעשים',
    description: 'לשקט מוחלט במהלך היום',
    price: 299,
    imageUrl: 'https://via.placeholder.com/200/3498DB/FFF?text=Headphones',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-11',
    name: 'קורס מיינדפולנס מודרך',
    description: 'תוכנית 30 יום להכרות עם המיינדפולנס',
    price: 249,
    imageUrl: 'https://via.placeholder.com/200/2ECC71/FFF?text=Mindfulness',
    mood: 'neutral',
    category: 'digital'
  },
  {
    id: 'neutral-12',
    name: 'שטיח מדיטציה',
    description: 'שטיח נוח לישיבה ממושכת',
    price: 119,
    imageUrl: 'https://via.placeholder.com/200/27AE60/FFF?text=Mat',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-13',
    name: 'ספר קריאה קלה',
    description: 'רומן נעים לקריאה רגועה',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/3498DB/FFF?text=Novel',
    mood: 'neutral',
    category: 'physical'
  },
  {
    id: 'neutral-14',
    name: 'מוזיקה אמביינט',
    description: 'רקע מוזיקלי לעבודה או מנוחה',
    price: 39,
    imageUrl: 'https://via.placeholder.com/200/2ECC71/FFF?text=Ambient',
    mood: 'neutral',
    category: 'digital'
  },
  {
    id: 'neutral-15',
    name: 'בקבוק מים מעוצב',
    description: 'עידוד לשתייה בריאה לאורך היום',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/27AE60/FFF?text=Bottle',
    mood: 'neutral',
    category: 'physical'
  },
  
  // מוצרים לכעס 😡
  {
    id: 'angry-1',
    name: 'כדור לחץ טיפולי',
    description: 'כדור סיליקון לשחרור מתחים',
    price: 39,
    imageUrl: 'https://via.placeholder.com/200/E74C3C/FFF?text=Ball',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-2',
    name: 'תרגילי נשימה מודרכים',
    description: 'קורס אודיו לטכניקות הרגעה',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/E67E22/FFF?text=Breath',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-3',
    name: 'מחברת כתיבה טיפולית',
    description: 'מחברת מעוצבת לשחרור רגשות בכתב',
    price: 59,
    imageUrl: 'https://via.placeholder.com/200/C0392B/FFF?text=Write',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-4',
    name: 'שק אגרוף ביתי',
    description: 'שק אימון קל להתקנה בבית',
    price: 299,
    imageUrl: 'https://via.placeholder.com/200/E74C3C/FFF?text=Punching',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-5',
    name: 'קורס ניהול כעסים',
    description: 'כלים מעשיים להתמודדות עם כעס',
    price: 249,
    imageUrl: 'https://via.placeholder.com/200/E67E22/FFF?text=Anger',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-6',
    name: 'כרית צעקות',
    description: 'כרית מיוחדת לשחרור מתחים בצעקה',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/C0392B/FFF?text=Pillow',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-7',
    name: 'משחק ניפוץ צלחות וירטואלי',
    description: 'שחרר כעסים במציאות מדומה',
    price: 49,
    imageUrl: 'https://via.placeholder.com/200/E74C3C/FFF?text=VR+Game',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-8',
    name: 'כדורי עיסוי טיפולי',
    description: 'כדורים לשחרור מתחים פיזיים',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/E67E22/FFF?text=Massage',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-9',
    name: 'פלייליסט מוזיקה אגרסיבית',
    description: 'רוק ומטאל לשחרור אנרגיות',
    price: 29,
    imageUrl: 'https://via.placeholder.com/200/C0392B/FFF?text=Rock',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-10',
    name: 'ערכת גבס לשבירה',
    description: 'לוחות גבס קטנים לשבירה בטוחה',
    price: 119,
    imageUrl: 'https://via.placeholder.com/200/E74C3C/FFF?text=Break',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-11',
    name: 'אפליקציית מעקב כעסים',
    description: 'זיהוי טריגרים ודפוסים',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/E67E22/FFF?text=Tracker',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-12',
    name: 'חבל קפיצה כבד',
    description: 'פעילות אירובית לשחרור מתחים',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/C0392B/FFF?text=Jump+Rope',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-13',
    name: 'ספר CBT לכעסים',
    description: 'טיפול קוגניטיבי התנהגותי',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/E74C3C/FFF?text=CBT',
    mood: 'angry',
    category: 'physical'
  },
  {
    id: 'angry-14',
    name: 'סדנת אומנויות לחימה',
    description: 'ערוצי וידאו לאימוני קראטה',
    price: 199,
    imageUrl: 'https://via.placeholder.com/200/E67E22/FFF?text=Martial',
    mood: 'angry',
    category: 'digital'
  },
  {
    id: 'angry-15',
    name: 'כפפות אגרוף מקצועיות',
    description: 'כפפות איכותיות לאימוני בוקס',
    price: 179,
    imageUrl: 'https://via.placeholder.com/200/C0392B/FFF?text=Gloves',
    mood: 'angry',
    category: 'physical'
  },
  
  // מוצרים לאהבה 💕
  {
    id: 'love-1',
    name: 'כרטיס מתנה רומנטי',
    description: 'כרטיס מתנה לארוחה זוגית',
    price: 299,
    imageUrl: 'https://via.placeholder.com/200/E91E63/FFF?text=Gift',
    mood: 'love',
    category: 'digital'
  },
  {
    id: 'love-2',
    name: 'סט נרות לזוג',
    description: 'מארז נרות ריח רומנטי',
    price: 129,
    imageUrl: 'https://via.placeholder.com/200/F06292/FFF?text=Candles',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-3',
    name: 'ספר שירה וציטוטי אהבה',
    description: 'אוסף שירים ומחשבות על אהבה',
    price: 69,
    imageUrl: 'https://via.placeholder.com/200/EC407A/FFF?text=Poetry',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-4',
    name: 'פלייליסט רומנטי',
    description: 'שירים לערב רומנטי',
    price: 29,
    imageUrl: 'https://via.placeholder.com/200/E91E63/FFF?text=Romance',
    mood: 'love',
    category: 'digital'
  },
  {
    id: 'love-5',
    name: 'שוקולדים בקופסת לב',
    description: 'שוקולדים איכותיים באריזה מיוחדת',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/F06292/FFF?text=Chocolate',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-6',
    name: 'קורס עיסוי זוגי',
    description: 'וידאו הדרכה לעיסוי רומנטי',
    price: 149,
    imageUrl: 'https://via.placeholder.com/200/EC407A/FFF?text=Massage',
    mood: 'love',
    category: 'digital'
  },
  {
    id: 'love-7',
    name: 'זר פרחים משלוח',
    description: 'זר ורדים אדומים עד הבית',
    price: 189,
    imageUrl: 'https://via.placeholder.com/200/E91E63/FFF?text=Flowers',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-8',
    name: 'ספר בישול רומנטי',
    description: 'מתכונים לארוחה זוגית',
    price: 79,
    imageUrl: 'https://via.placeholder.com/200/F06292/FFF?text=Cooking',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-9',
    name: 'יין אדום מובחר',
    description: 'בקבוק יין איכותי לערב מיוחד',
    price: 159,
    imageUrl: 'https://via.placeholder.com/200/EC407A/FFF?text=Wine',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-10',
    name: 'תכנון דייט מפתיע',
    description: 'מדריך דיגיטלי לדייט מושלם',
    price: 49,
    imageUrl: 'https://via.placeholder.com/200/E91E63/FFF?text=Date',
    mood: 'love',
    category: 'digital'
  },
  {
    id: 'love-11',
    name: 'ערכת ספא זוגית',
    description: 'מוצרי טיפוח לזוג',
    price: 219,
    imageUrl: 'https://via.placeholder.com/200/F06292/FFF?text=Spa',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-12',
    name: 'משחק זוגי אינטימי',
    description: 'משחק שאלות לחיבור עמוק',
    price: 89,
    imageUrl: 'https://via.placeholder.com/200/EC407A/FFF?text=Game',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-13',
    name: 'אפליקציית תכנון דייטים',
    description: 'רעיונות מפתיעים לדייטים',
    price: 99,
    imageUrl: 'https://via.placeholder.com/200/E91E63/FFF?text=App',
    mood: 'love',
    category: 'digital'
  },
  {
    id: 'love-14',
    name: 'מסגרת תמונה זוגית',
    description: 'מסגרת דיגיטלית לתמונות משותפות',
    price: 249,
    imageUrl: 'https://via.placeholder.com/200/F06292/FFF?text=Frame',
    mood: 'love',
    category: 'physical'
  },
  {
    id: 'love-15',
    name: 'קורס שפת אהבה',
    description: 'למד לתקשר אהבה טוב יותר',
    price: 179,
    imageUrl: 'https://via.placeholder.com/200/EC407A/FFF?text=Language',
    mood: 'love',
    category: 'digital'
  },
];

export function getProductsByMood(mood: string): Product[] {
  return products.filter(p => p.mood === mood);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
