// script.js (الكود الكامل والمصحح)

// المتغيرات SUBJECTS_DATA و QUESTIONS_BANK يتم تحميلها الآن من ملفات البيانات

let currentStep = 1;
const totalSteps = 5; 
let selectedYear = null;
let selectedSubjectCode = null;
let selectedLessonCode = null; 
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let quizSubmitted = false;

const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const questionsDisplay = document.getElementById('questions-display');
const resultContainer = document.getElementById('result');
const subjectList = document.getElementById('subject-list');
const lessonList = document.getElementById('lesson-list'); 

// 🔊 تعريف عناصر الصوت (يجب أن تتطابق مع IDs في index.html)
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');


// --- NEW FUNCTION for Step 1 ---
function selectUniversity() {
    navigateStep(1);
}

// --- Navigation Functions (Stages 1, 2, 3, 4) ---

function navigateStep(direction) {
    if (quizSubmitted) return; 

    if (direction > 0 && !validateCurrentStep()) {
        return; 
    }
    
    document.getElementById(`step-${currentStep}`).classList.add('hidden');

    currentStep += direction;

    if (currentStep < 1) currentStep = 1;
    else if (currentStep > totalSteps) currentStep = totalSteps;
    
    if (currentStep < 5 && currentStep + direction > 5) {
        currentQuestionIndex = 0;
        userAnswers = {};
        quizSubmitted = false;
    }

    document.getElementById(`step-${currentStep}`).classList.remove('hidden');

    if (currentStep === 3) {
        populateSubjects();
        selectedLessonCode = null; 
    } else if (currentStep === 4) { 
        populateLessons();
    } else if (currentStep === 5) {
        loadAndBuildQuiz();
    }

    updateControls();
}

function validateCurrentStep() {
    if (currentStep === 1) return true;
    if (currentStep === 2 && !selectedYear) {
        alert("Please select an Academic Year before proceeding.");
        return false;
    }
    if (currentStep === 3 && !selectedSubjectCode) {
        alert("Please select a Subject before proceeding.");
        return false;
    }
    if (currentStep === 4 && !selectedLessonCode) { 
        alert("Please select a Lesson/Chapter before proceeding.");
        return false;
    }
    return true;
}


// --- Step 2 & 3 Selection Functions ---

function selectYear(year) {
    selectedYear = year;
    document.querySelectorAll('.year-box').forEach(box => {
        box.classList.remove('selected-item');
    });
    document.querySelector(`[data-year="${year}"]`).classList.add('selected-item');
    
    selectedSubjectCode = null;
    selectedLessonCode = null;
    navigateStep(1);
}

function selectSubject(code) {
    selectedSubjectCode = code;
    document.querySelectorAll('.subject-box').forEach(box => {
        box.classList.remove('selected-item');
    });
    document.querySelector(`[data-code="${code}"]`).classList.add('selected-item');
    
    selectedLessonCode = null;
    navigateStep(1);
}

function populateSubjects() {
    subjectList.innerHTML = '';
    
    const subjectsForYear = SUBJECTS_DATA.filter(sub => sub.year === selectedYear);
    
    if (subjectsForYear.length === 0) {
        subjectList.innerHTML = `<p style="text-align:center;">No subjects found for Year ${selectedYear}.</p>`;
        return;
    }

    subjectsForYear.forEach(subject => {
        const button = document.createElement('button');
        button.className = 'subject-box';
        button.textContent = subject.name;
        button.setAttribute('data-code', subject.code);
        button.onclick = () => selectSubject(subject.code);
        subjectList.appendChild(button);
    });
}

// --- Step 4 Lesson Selection Function ---

function selectLesson(code) {
    selectedLessonCode = code;
    document.querySelectorAll('.lesson-box').forEach(box => {
        box.classList.remove('selected-item');
    });
    document.querySelector(`[data-lesson-code="${code}"]`).classList.add('selected-item');
    
    navigateStep(1); 
}

function populateLessons() {
    lessonList.innerHTML = '';
    
    const selectedSubject = SUBJECTS_DATA.find(sub => sub.code === selectedSubjectCode);
    
    if (!selectedSubject || !selectedSubject.lessons || selectedSubject.lessons.length === 0) {
        lessonList.innerHTML = `<p style="text-align:center;">No lessons found for the selected subject.</p>`;
        return;
    }

    selectedSubject.lessons.forEach(lesson => {
        const button = document.createElement('button');
        button.className = 'subject-box lesson-box';
        button.textContent = lesson.name;
        button.setAttribute('data-lesson-code', lesson.code);
        
        const quizKey = selectedSubjectCode + "-" + lesson.code;
        const questionsAvailable = QUESTIONS_BANK[quizKey] && QUESTIONS_BANK[quizKey].length > 0;
        
        if (questionsAvailable) {
             button.onclick = () => selectLesson(lesson.code);
        } else {
             button.disabled = true;
             button.title = "No questions available for this lesson yet.";
             button.style.opacity = 0.6;
        }
       
        lessonList.appendChild(button);
    });
}


// --- Step 5: Quiz (Instant Feedback Logic) ---

function loadAndBuildQuiz() {
    const quizKey = selectedSubjectCode + "-" + selectedLessonCode;
    currentQuestions = QUESTIONS_BANK[quizKey] || [];
    
    currentQuestionIndex = 0;
    userAnswers = {};
    quizSubmitted = false;
    resultContainer.innerHTML = '';
    
    if (currentQuestions.length === 0) {
        questionsDisplay.innerHTML = `<p style="text-align:center;">No questions found for the selected lesson (${quizKey}).</p>`;
        updateControls();
        return;
    }
    
    showQuestion();
}

function handleAnswerSelection(event) {
    const radioInput = event.target;
    const userAnswer = radioInput.value;
    const qNum = currentQuestionIndex;
    const q = currentQuestions[qNum];
    
    userAnswers[qNum] = userAnswer; 
    
    // تعطيل جميع الخيارات بعد الإجابة
    questionsDisplay.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
    });

    // استدعاء دالة عرض الإجابة (التي تشغل الصوت)
    revealAnswer(userAnswer, q, qNum);
    
    updateControls();
}

function revealAnswer(userAnswer, q, qNum) {
    const isCorrect = userAnswer === q.correctAnswer;
    const answerContainer = questionsDisplay.querySelector('.answers');
    
    // 🔊 منطق تشغيل الصوت المُضاف
    if (isCorrect) {
        correctSound.currentTime = 0; // إرجاع الصوت للبداية لضمان التشغيل الفوري
        correctSound.play();
    } else {
        incorrectSound.currentTime = 0;
        incorrectSound.play();
    }

    const feedbackDiv = document.getElementById(`feedback-${qNum}`);
    feedbackDiv.innerHTML = isCorrect ? '✅ **Correct Answer!**' : '❌ **Incorrect Answer.**';
    feedbackDiv.style.color = isCorrect ? 'green' : 'red';
    feedbackDiv.style.display = 'block';
    
    const correctLabel = answerContainer.querySelector(`input[value=${q.correctAnswer}]`).parentNode;
    if(correctLabel) {
        correctLabel.style.backgroundColor = '#d1ffc9'; 
        correctLabel.style.fontWeight = 'bold';
    }
    
    if (!isCorrect) {
        const incorrectLabel = answerContainer.querySelector(`input[value=${userAnswer}]`).parentNode;
        if(incorrectLabel) {
            incorrectLabel.style.backgroundColor = '#ffc9c9'; 
        }
    }
    
    document.getElementById(`exp-${qNum}`).style.display = 'block';
}

function setupAnswerListeners() {
    questionsDisplay.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', handleAnswerSelection);
    });
}


function showQuestion() {
    questionsDisplay.innerHTML = '';
    
    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalSummary();
        return;
    }
    
    const q = currentQuestions[currentQuestionIndex];
    const qNum = currentQuestionIndex;
    const hasAnswered = userAnswers[qNum] !== undefined;
    
    const answersHTML = [];
    for (const letter in q.answers) {
        const isChecked = userAnswers[qNum] === letter ? 'checked' : '';
        const isDisabled = hasAnswered ? 'disabled' : '';
        
        let labelStyle = '';
        if (hasAnswered) {
            if (userAnswers[qNum] === q.correctAnswer) {
                 labelStyle = 'background-color: #d1ffc9; font-weight: bold;';
            } else if (userAnswers[qNum] === letter) {
                 labelStyle = (q.correctAnswer === letter) ? 'background-color: #d1ffc9; font-weight: bold;' : 'background-color: #ffc9c9;'; 
            } else if (q.correctAnswer === letter) {
                 labelStyle = 'background-color: #d1ffc9; font-weight: bold;'; 
            }
        }

        answersHTML.push(
            `<label style="${labelStyle}">
                <input type="radio" name="question${qNum}" value="${letter}" ${isChecked} ${isDisabled}>
                ${q.answers[letter]}
            </label>`
        );
    }

    questionsDisplay.innerHTML = `
        <div class="question">Q${qNum + 1} of ${currentQuestions.length}: ${q.question}</div>
        <div class="answers">${answersHTML.join('')}</div>
        <div id="feedback-${qNum}" class="feedback-message" style="display: ${hasAnswered ? 'block' : 'none'}; color: ${hasAnswered ? (userAnswers[qNum] === q.correctAnswer ? 'green' : 'red') : ''};">
            ${hasAnswered ? (userAnswers[qNum] === q.correctAnswer ? '✅ **Correct Answer!**' : '❌ **Incorrect Answer.**') : ''}
        </div>
        <div class="explanation" id="exp-${qNum}" style="display: ${hasAnswered ? 'block' : 'none'};">
            <strong>Explanation:</strong> ${q.explanation}
        </div>
    `;
    
    if (!hasAnswered) {
        setupAnswerListeners();
    }
    
    updateControls();
}

function navigateQuestion(direction) {
    if (currentQuestionIndex + direction < 0) {
        navigateStep(-1);
    } else {
        currentQuestionIndex += direction;
        showQuestion();
    }
}

function continueQuizOrSubmit() {
    const qNum = currentQuestionIndex;
    
    if (userAnswers[qNum] === undefined) {
        alert("Please select an answer to continue.");
        return;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalSummary();
    } else {
        showQuestion();
    }
}

function showFinalSummary() {
    questionsDisplay.innerHTML = '';
    quizSubmitted = true;
    
    let numCorrect = 0;
    const totalQuestions = currentQuestions.length;

    const finalReviewOutput = [];

    currentQuestions.forEach((q, qNum) => {
        const userAnswer = userAnswers[qNum];
        const isCorrect = userAnswer === q.correctAnswer;
        
        if (isCorrect) {
            numCorrect++;
        }

        const answerClass = isCorrect ? 'correct-answer' : (userAnswer ? 'incorrect-answer' : 'unanswered-answer');
        
        finalReviewOutput.push(
            `<div class="question" style="color:#333; margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                Q${qNum + 1}: ${q.question} 
            </div>
            <div class="answers">
                <p><strong>Your Answer:</strong> ${userAnswer ? q.answers[userAnswer] : 'No Answer'}</p>
                <p class="${answerClass}"><strong>Correct Answer:</strong> ${q.answers[q.correctAnswer]}</p>
            </div>
            <div class="explanation" style="display: block; background-color: #f0f0ff;">
                <strong>Explanation:</strong> ${q.explanation}
            </div>`
        );
    });

    questionsDisplay.innerHTML = finalReviewOutput.join('');

    resultContainer.innerHTML = `You scored ${numCorrect} out of ${totalQuestions}.`;
    
    updateControls();
}


// --- Controls Update ---

function updateControls() {
    const isQuizStage = currentStep === 5 && !quizSubmitted; 
    const isInitialStage = currentStep < 5;

    if (isInitialStage) {
        prevBtn.classList.toggle('hidden', currentStep <= 1);
        nextBtn.classList.add('hidden'); 
        
        prevBtn.onclick = () => navigateStep(-1);
        return;
    }

    if (quizSubmitted) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        return;
    }

    if (isQuizStage) {
        const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
        const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

        prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
        prevBtn.onclick = () => navigateQuestion(-1);
        
        nextBtn.classList.remove('hidden');
        nextBtn.disabled = !hasAnswered; 
        
        if (isLastQuestion) {
            nextBtn.textContent = 'Finish Quiz & See Results';
        } else {
            nextBtn.textContent = 'Continue (Next Question)';
        }
    }
}


// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index > 0) {
            step.classList.add('hidden');
        }
    });

    currentStep = 1;
    updateControls();
});