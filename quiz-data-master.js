// quiz-data-master.js
// هذا الملف يقوم بإنشاء الكائن العالمي (Global Object) الذي سيتم تجميع جميع البيانات فيه.

// تعريف الكائن العالمي window.QUIZ_APP_DATA
window.QUIZ_APP_DATA = {
    subjects: [
        // --- YEAR 1 ---
        { year: 1, name: "Physiology", code: "PHY101", lessons: [{ name: "introduction", code: "intro" }] },
        
        // Histology: المادة التي تم تجزئتها إلى دروس
        { 
            year: 1, 
            name: "Histology", 
            code: "HIS102", 
            lessons: [
                // كود الدرس هو CELL1، وسيتم تحميل أسئلته من الملف المنفصل
                { name: "Cell 1 Structure", code: "CELL1" }, 
                // مثال لدرس جديد 
            ]
        }, 
        
        { year: 1, name: "Biochemistry", code: "BIO103", lessons: [ { name: "amino acids", code: "amino" }
        ] },
        
        // --- YEAR 2 ---
        { year: 2, name: "Physiology", code: "PHY201", lessons: [{ name: "General Topics", code: "GEN" }] },
        { year: 2, name: "Histology", code: "HIS202", lessons: [{ name: "General Topics", code: "GEN" }] },
        { year: 3, name: "ENT", code: "ENT301", lessons: [{ name: "General Topics", code: "GEN" }] },
        { year: 4, name: "MEDICINE", code: "MED401", lessons: [{ name: "CHEST", code: "GEN" }] },


        
        // ... (يمكن إضافة المزيد من السنوات والمواد)
        { year: 5, name: "Clinical Skills", code: "CLIN501", lessons: [{ name: "General Topics", code: "GEN" }] },
    ],
    // هذا الكائن سيتم ملؤه بواسطة ملفات الأسئلة المنفصلة (مثل HIS102-CELL1.js)
    questions: {} 
};

// اختصار للمتغيرات لاستخدامها بسهولة في script.js
const SUBJECTS_DATA = window.QUIZ_APP_DATA.subjects;
const QUESTIONS_BANK = window.QUIZ_APP_DATA.questions;