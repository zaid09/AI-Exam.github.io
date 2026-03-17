// ===== AUTHORIZED STUDENTS LIST =====
// قائمة الطلاب المصرح لهم بأداء الامتحان
// Only these students can take the exam

export const authorizedStudents = [
    "ابراهيم جاسم عبدالاله مهدي",
    "ابراهيم نوح احمد عبد الوهاب",
    "اسراء ياسر صالح أحمد",
    "انتظار رحيم لوله كاظم",
    "أحمد منتظر هاشم تبان",
    "أسيل مجيد كاطع دهموس",
    "باقر داخل محسن شندي",
    "بنت الهدى فؤاد عبد الأمير عبد الحسين",
    "بنين حسين كاظم حسين",
    "بنين حسين شاكر حاتم",
    "بنين سامي تايه خضير",
    "حسن حيدر حافظ غلام",
    "حسن جلال خضير ابوذينه",
    "حيدر غانم محمد كاظم",
    "سارة حسن سامي مجيد",
    "سميرة رائد محمد سراج",
    "ضرغام حيدر محمد عبد الباقي",
    "طيبة كاظم خلف نايف",
    "علي حسين علي عبيد",
    "علي حيدر حسين علي",
    "فاطمة عمار سعودي عباس",
    "فاطمة هيمن إبراهيم صيهود",
    "فاطمه عماد صباح سلمان",
    "فاطمه حسين مهدي حسن",
    "مريم علي ماجد نوتي",
    "مريم جاسم باقر خلف",
    "مصطفى جواد كاظم عويد",
    "نبأ عماد كامل محمد",
    "نرجس قتيبه عبد الكريم محمد",
    "نور صباح هاشم عبد الرضا",
    "وسن صلاح هادي عبادي"
];

// ===== ADMIN CREDENTIALS =====
// بيانات الدخول للوحة التحكم
export const adminCredentials = {
    username: "zaid009",
    password: "123009"
};

// ===== HELPER FUNCTIONS =====

// Normalize Arabic text for comparison
export function normalizeArabic(text) {
    if (!text) return '';
    return text
        .normalize('NFC')
        .trim()
        .replace(/\s+/g, ' ')           // Multiple spaces to single
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Strip tashkeel/diacritics
        .replace(/[أإآٱ]/g, 'ا')        // Normalize Alef variants
        .replace(/[ة]/g, 'ه')           // Ta Marbuta to Ha
        .replace(/[ىۍ]/g, 'ي')          // Alef Maksura to Ya
        .replace(/[ؤ]/g, 'و')           // Waw with Hamza
        .replace(/[ئ]/g, 'ي')           // Ya with Hamza
        .replace(/ی/g, 'ي')             // Farsi Yeh to Arabic Yeh
        .replace(/ک/g, 'ك')             // Farsi Kaf to Arabic Kaf
        .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // Remove zero-width/direction chars
        .toLowerCase();
}

// Check if student is authorized
export function isStudentAuthorized(studentName) {
    const normalizedInput = normalizeArabic(studentName);
    return authorizedStudents.some(name => 
        normalizeArabic(name) === normalizedInput
    );
}

// Get similar names for suggestions
export function getSimilarNames(studentName) {
    const normalizedInput = normalizeArabic(studentName);
    const inputWords = normalizedInput.split(' ');
    
    return authorizedStudents.filter(name => {
        const normalizedName = normalizeArabic(name);
        const nameWords = normalizedName.split(' ');
        // Check if at least 2 words match
        let matchCount = 0;
        inputWords.forEach(word => {
            if (nameWords.some(nw => nw.includes(word) || word.includes(nw))) {
                matchCount++;
            }
        });
        return matchCount >= 2;
    });
}

// Validate admin credentials
export function validateAdmin(username, password) {
    return username === adminCredentials.username && 
           password === adminCredentials.password;
}
