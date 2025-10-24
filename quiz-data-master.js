// quiz-data-master.js
// هذا الملف يحتوي على هيكل المواد والدروس الرئيسية

// تعريف الكائن العالمي الذي سيجمع بيانات المواد والأسئلة من جميع الملفات الأخرى
window.QUIZ_APP_DATA = {
    subjects: [
        // --- YEAR 1 ---
        { year: 1, name: "Physiology", code: "PHY101", lessons: [{ name: "General Topics", code: "GEN" }] },
        
        // Histology: المادة التي تم تجزئتها
        { 
            year: 1, 
            name: "Histology", 
            code: "HIS102", 
            lessons: [
                // سيتم تحميل أسئلة هذا الدرس من ملف HIS102-CELL1.js
                { name: "Cell 1 Structure", code: "CELL1" }, 
                // مثال لدرس آخر يمكنك إضافة ملفه لاحقاً
                { name: "Epithelium Tissues", code: "EPI" },
            ]
        }, 
        
        { year: 1, name: "Biochemistry", code: "BIO103", lessons: [{ name: "General Topics", code: "GEN" }] },
        
        // --- YEAR 2 ---
        { year: 2, name: "Physiology", code: "PHY201", lessons: [{ name: "General Topics", code: "GEN" }] },
        { year: 2, name: "Histology", code: "HIS202", lessons: [{ name: "General Topics", code: "GEN" }] },
        
        // ... تكملة السنوات الأخرى
        { year: 4, name: "Pediatrics", code: "PED401", lessons: [{ name: "General Topics", code: "GEN" }] },
    ],
    // هذا الكائن سيتم ملؤه من ملفات الدروس المنفصلة (مثل HIS102-CELL1.js)
    questions: {} 
};

// اختصار للمتغيرات لاستخدامها بسهولة في script.js
const SUBJECTS_DATA = window.QUIZ_APP_DATA.subjects;
const QUESTIONS_BANK = window.QUIZ_APP_DATA.questions;