// קובץ זה טוען את המוצרים ל-localStorage כדי שהם יהיו זמינים בכל האפליקציה
// הוא רץ אוטומטית בטעינת העמוד

(function() {
    // המוצרים המלאים
    const allProducts = [
        // מוצרים לשמחה
        { id: 'happy-1', name: 'פלייליסט אנרגטי', desc: 'אוסף שירים מרימי מצב רוח להמשך היום', price: 29, mood: 'happy', emoji: '🎵' },
        { id: 'happy-2', name: 'משחק קלפים כיפי', desc: 'משחק קבוצתי מצחיק לערב עם חברים', price: 89, mood: 'happy', emoji: '🎮' },
        { id: 'happy-3', name: 'קורס יוגה צחוק', desc: 'סדרת וידאו ליוגה משולבת צחוק', price: 149, mood: 'happy', emoji: '🧘' },
        { id: 'happy-4', name: 'ערכת פיקניק משפחתי', desc: 'כל מה שצריך לפיקניק מושלם בטבע', price: 199, mood: 'happy', emoji: '🧺' },
        { id: 'happy-5', name: 'סדנת ריקוד לטינו', desc: 'סדרת שיעורי ריקוד משמחים אונליין', price: 179, mood: 'happy', emoji: '💃' },
        { id: 'happy-6', name: 'משחק קופסה למשפחה', desc: 'משחק אסטרטגיה מהנה לכל המשפחה', price: 129, mood: 'happy', emoji: '🎲' },
        { id: 'happy-7', name: 'אוזניות בלוטוס צבעוניות', desc: 'אוזניות איכותיות עם צבעים עליזים', price: 249, mood: 'happy', emoji: '🎧' },
        { id: 'happy-8', name: 'קורס צילום כיפי', desc: 'למד לצלם רגעים שמחים בצורה מקצועית', price: 299, mood: 'happy', emoji: '📸' },
        { id: 'happy-9', name: 'ערכת יצירה לילדים', desc: 'כלים ליצירה משפחתית משותפת', price: 159, mood: 'happy', emoji: '🎨' },
        { id: 'happy-10', name: 'מנוי למופעי סטנדאפ', desc: 'גישה למופעי קומדיה מצחיקים אונליין', price: 99, mood: 'happy', emoji: '😂' },
        { id: 'happy-11', name: 'כדור פעילות ואנרגיה', desc: 'כדור כושר צבעוני למשחקים ופעילות', price: 119, mood: 'happy', emoji: '⚽' },
        { id: 'happy-12', name: 'ספר בדיחות ופאנצ׳ים', desc: 'אוסף הבדיחות המצחיק בעברית', price: 69, mood: 'happy', emoji: '📖' },
        { id: 'happy-13', name: 'פלייליסט מסיבות', desc: 'מוזיקה להתחלת מסיבה בכל מקום', price: 39, mood: 'happy', emoji: '🎉' },
        { id: 'happy-14', name: 'ערכת בועות סבון ענקיות', desc: 'כיף לילדים ומבוגרים בחצר', price: 79, mood: 'happy', emoji: '🫧' },
        { id: 'happy-15', name: 'מנוי לאפליקציית משחקים', desc: 'מאות משחקים משעשעים לכל הגילאים', price: 149, mood: 'happy', emoji: '🎮' },
        
        // מוצרים לעצב
        { id: 'sad-1', name: 'שוקולד מריר איכותי', desc: 'מארז שוקולדים בלגיים מעולים', price: 79, mood: 'sad', emoji: '🍫' },
        { id: 'sad-2', name: 'יומן רגשות מודרך', desc: 'מחברת עם שאלות מנחות לעיבוד רגשי', price: 49, mood: 'sad', emoji: '📔' },
        { id: 'sad-3', name: 'נר ריח מרגיע', desc: 'נר לבנדר וקמומיל להרגעת החושים', price: 65, mood: 'sad', emoji: '🕯️' },
        { id: 'sad-4', name: 'פלייליסט מנחם', desc: 'מוזיקה עדינה ומרגיעה לרגעים קשים', price: 29, mood: 'sad', emoji: '🎵' },
        { id: 'sad-5', name: 'שמיכה רכה ומחממת', desc: 'שמיכת פליז איכותית לחיבוק', price: 189, mood: 'sad', emoji: '🛋️' },
        { id: 'sad-6', name: 'קורס עיבוד רגשי', desc: 'מפגשים מוקלטים עם פסיכולוג', price: 299, mood: 'sad', emoji: '💭' },
        { id: 'sad-7', name: 'תה צמחים מרגיע', desc: 'מבחר תה איכותי להרגעה', price: 59, mood: 'sad', emoji: '🍵' },
        { id: 'sad-8', name: 'ספר שירה מרגש', desc: 'אוסף שירים מנחמים ויפים', price: 79, mood: 'sad', emoji: '📚' },
        { id: 'sad-9', name: 'מדיטציה מודרכת להרגעה', desc: 'קבצי אודיו להרגעה עמוקה', price: 99, mood: 'sad', emoji: '🧘' },
        { id: 'sad-10', name: 'כרית חיבוק טיפולית', desc: 'כרית רכה ומנחמת בצורת לב', price: 129, mood: 'sad', emoji: '💜' },
        { id: 'sad-11', name: 'פאזל 1000 חלקים', desc: 'פעילות מרגיעה ומפרגנת', price: 89, mood: 'sad', emoji: '🧩' },
        { id: 'sad-12', name: 'מארז טיפוח ספא ביתי', desc: 'מסכות ומוצרי טיפוח מפנקים', price: 169, mood: 'sad', emoji: '🧴' },
        { id: 'sad-13', name: 'סרטונים מרגיעים מהטבע', desc: 'נופים ושקטים מדהימים', price: 49, mood: 'sad', emoji: '🏞️' },
        { id: 'sad-14', name: 'ספר צביעה למבוגרים', desc: 'דפי מנדלה להרגעה ויצירה', price: 69, mood: 'sad', emoji: '🎨' },
        { id: 'sad-15', name: 'מנוי לסיפורי שינה', desc: 'סיפורים מרגיעים לשינה טובה', price: 79, mood: 'sad', emoji: '📻' },
        
        // מוצרים לניטרלי
        { id: 'neutral-1', name: 'ספר מדיטציה למתחילים', desc: 'מדריך פשוט להתחלת תרגול מדיטציה', price: 89, mood: 'neutral', emoji: '📖' },
        { id: 'neutral-2', name: 'אפליקציית מיינדפולנס', desc: 'גישה שנתית לאפליקציית הרגעה', price: 199, mood: 'neutral', emoji: '📱' },
        { id: 'neutral-3', name: 'תה ירוק אורגני', desc: 'מבחר תה איכותי מרגיע', price: 55, mood: 'neutral', emoji: '🍃' },
        { id: 'neutral-4', name: 'משטח יוגה איכותי', desc: 'משטח נוח ואיכותי לתרגול', price: 149, mood: 'neutral', emoji: '🧘' },
        { id: 'neutral-5', name: 'קורס נשימה ורוגע', desc: 'טכניקות נשימה למיקוד וזרימה', price: 179, mood: 'neutral', emoji: '🌬️' },
        { id: 'neutral-6', name: 'נר שעווה טבעי', desc: 'נר לטיהור אוויר ואווירה שקטה', price: 69, mood: 'neutral', emoji: '🕯️' },
        { id: 'neutral-7', name: 'מחברת bullet journal', desc: 'מחברת מעוצבת לארגון ומחשבות', price: 59, mood: 'neutral', emoji: '📓' },
        { id: 'neutral-8', name: 'מנוי פודקאסט פילוסופיה', desc: 'שיחות מעמיקות על החיים', price: 99, mood: 'neutral', emoji: '🎧' },
        { id: 'neutral-9', name: 'ערכת זרעים לגינה', desc: 'גינון כטיפול וחיבור לטבע', price: 79, mood: 'neutral', emoji: '🌱' },
        { id: 'neutral-10', name: 'אוזניות סינון רעשים', desc: 'לשקט מוחלט במהלך היום', price: 299, mood: 'neutral', emoji: '🎧' },
        { id: 'neutral-11', name: 'קורס מיינדפולנס מודרך', desc: 'תוכנית 30 יום להכרות עם המיינדפולנס', price: 249, mood: 'neutral', emoji: '🧘' },
        { id: 'neutral-12', name: 'שטיח מדיטציה', desc: 'שטיח נוח לישיבה ממושכת', price: 119, mood: 'neutral', emoji: '🧘‍♀️' },
        { id: 'neutral-13', name: 'ספר קריאה קלה', desc: 'רומן נעים לקריאה רגועה', price: 69, mood: 'neutral', emoji: '📚' },
        { id: 'neutral-14', name: 'מוזיקה אמביינט', desc: 'רקע מוזיקלי לעבודה או מנוחה', price: 39, mood: 'neutral', emoji: '🎵' },
        { id: 'neutral-15', name: 'בקבוק מים מעוצב', desc: 'עידוד לשתייה בריאה לאורך היום', price: 89, mood: 'neutral', emoji: '💧' },
        
        // מוצרים לכעס
        { id: 'angry-1', name: 'כדור לחץ טיפולי', desc: 'כדור סיליקון לשחרור מתחים', price: 39, mood: 'angry', emoji: '⚾' },
        { id: 'angry-2', name: 'תרגילי נשימה מודרכים', desc: 'קורס אודיו לטכניקות הרגעה', price: 99, mood: 'angry', emoji: '🌬️' },
        { id: 'angry-3', name: 'מחברת כתיבה טיפולית', desc: 'מחברת מעוצבת לשחרור רגשות בכתב', price: 59, mood: 'angry', emoji: '✍️' },
        { id: 'angry-4', name: 'שק אגרוף ביתי', desc: 'שק אימון קל להתקנה בבית', price: 299, mood: 'angry', emoji: '🥊' },
        { id: 'angry-5', name: 'קורס ניהול כעסים', desc: 'כלים מעשיים להתמודדות עם כעס', price: 249, mood: 'angry', emoji: '📚' },
        { id: 'angry-6', name: 'כרית צעקות', desc: 'כרית מיוחדת לשחרור מתחים בצעקה', price: 89, mood: 'angry', emoji: '🛡️' },
        { id: 'angry-7', name: 'משחק ניפוץ צלחות וירטואלי', desc: 'שחרר כעסים במציאות מדומה', price: 49, mood: 'angry', emoji: '💥' },
        { id: 'angry-8', name: 'כדורי עיסוי טיפולי', desc: 'כדורים לשחרור מתחים פיזיים', price: 79, mood: 'angry', emoji: '💪' },
        { id: 'angry-9', name: 'פלייליסט מוזיקה אגרסיבית', desc: 'רוק ומטאל לשחרור אנרגיות', price: 29, mood: 'angry', emoji: '🎵' },
        { id: 'angry-10', name: 'ערכת גבס לשבירה', desc: 'לוחות גבס קטנים לשבירה בטוחה', price: 119, mood: 'angry', emoji: '🔨' },
        { id: 'angry-11', name: 'אפליקציית מעקב כעסים', desc: 'זיהוי טריגרים ודפוסים', price: 99, mood: 'angry', emoji: '📊' },
        { id: 'angry-12', name: 'חבל קפיצה כבד', desc: 'פעילות אירובית לשחרור מתחים', price: 69, mood: 'angry', emoji: '🏃' },
        { id: 'angry-13', name: 'ספר CBT לכעסים', desc: 'טיפול קוגניטיבי התנהגותי', price: 89, mood: 'angry', emoji: '📖' },
        { id: 'angry-14', name: 'סדנת אומנויות לחימה', desc: 'ערוצי וידאו לאימוני קראטה', price: 199, mood: 'angry', emoji: '🥋' },
        { id: 'angry-15', name: 'כפפות אגרוף מקצועיות', desc: 'כפפות איכותיות לאימוני בוקס', price: 179, mood: 'angry', emoji: '🥊' },
        
        // מוצרים לאהבה
        { id: 'love-1', name: 'כרטיס מתנה רומנטי', desc: 'כרטיס מתנה לארוחה זוגית', price: 299, mood: 'love', emoji: '💝' },
        { id: 'love-2', name: 'סט נרות לזוג', desc: 'מארז נרות ריח רומנטי', price: 129, mood: 'love', emoji: '🕯️' },
        { id: 'love-3', name: 'ספר שירה וציטוטי אהבה', desc: 'אוסף שירים ומחשבות על אהבה', price: 69, mood: 'love', emoji: '💐' },
        { id: 'love-4', name: 'פלייליסט רומנטי', desc: 'שירים לערב רומנטי', price: 29, mood: 'love', emoji: '🎵' },
        { id: 'love-5', name: 'שוקולדים בקופסת לב', desc: 'שוקולדים איכותיים באריזה מיוחדת', price: 99, mood: 'love', emoji: '🍫' },
        { id: 'love-6', name: 'קורס עיסוי זוגי', desc: 'וידאו הדרכה לעיסוי רומנטי', price: 149, mood: 'love', emoji: '💆' },
        { id: 'love-7', name: 'זר פרחים משלוח', desc: 'זר ורדים אדומים עד הבית', price: 189, mood: 'love', emoji: '🌹' },
        { id: 'love-8', name: 'ספר בישול רומנטי', desc: 'מתכונים לארוחה זוגית', price: 79, mood: 'love', emoji: '🍳' },
        { id: 'love-9', name: 'יין אדום מובחר', desc: 'בקבוק יין איכותי לערב מיוחד', price: 159, mood: 'love', emoji: '🍷' },
        { id: 'love-10', name: 'תכנון דייט מפתיע', desc: 'מדריך דיגיטלי לדייט מושלם', price: 49, mood: 'love', emoji: '🗓️' },
        { id: 'love-11', name: 'ערכת ספא זוגית', desc: 'מוצרי טיפוח לזוג', price: 219, mood: 'love', emoji: '🧴' },
        { id: 'love-12', name: 'משחק זוגי אינטימי', desc: 'משחק שאלות לחיבור עמוק', price: 89, mood: 'love', emoji: '🎲' },
        { id: 'love-13', name: 'אפליקציית תכנון דייטים', desc: 'רעיונות מפתיעים לדייטים', price: 99, mood: 'love', emoji: '📱' },
        { id: 'love-14', name: 'מסגרת תמונה זוגית', desc: 'מסגרת דיגיטלית לתמונות משותפות', price: 249, mood: 'love', emoji: '🖼️' },
        { id: 'love-15', name: 'קורס שפת אהבה', desc: 'למד לתקשר אהבה טוב יותר', price: 179, mood: 'love', emoji: '💬' }
    ];

    // שמירה ב-localStorage
    try {
        localStorage.setItem('allProducts', JSON.stringify(allProducts));
        console.log('✅ המוצרים נטענו בהצלחה ל-localStorage:', allProducts.length, 'מוצרים');
    } catch (error) {
        console.error('❌ שגיאה בטעינת המוצרים:', error);
    }
})();
