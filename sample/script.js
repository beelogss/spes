// Remove sampleQuestions and replace with level-specific questions
const shsQuestions = [
    {
        question: "What does SPES stand for?",
        options: [
            "Special Program for Employment of Students",
            "Student Program for Employment Services",
            "Special Program for Educational Support",
            "Student Program for Employment Systems"
        ],
        correctAnswer: 0
    },
    {
        question: "What is the minimum age requirement for SPES?",
        options: [
            "14 years old",
            "15 years old",
            "16 years old",
            "17 years old"
        ],
        correctAnswer: 1
    },
    {
        question: "What percentage of salary is paid by DOLE?",
        options: [
            "20%",
            "40%",
            "50%",
            "60%"
        ],
        correctAnswer: 1
    },
    {
        question: "What is required to qualify for SPES?",
        options: [
            "Birth Certificate only",
            "School ID only",
            "Certificate of Low Income",
            "All of the above"
        ],
        correctAnswer: 2
    },
    {
        question: "How many times can you apply for SPES in a year?",
        options: [
            "Once",
            "Twice",
            "Three times",
            "Four times"
        ],
        correctAnswer: 0
    }
];

const collegeQuestions = [
    {
        question: "Which Republic Act established the SPES program?",
        options: [
            "RA 7323",
            "RA 8759",
            "RA 9547",
            "RA 10917"
        ],
        correctAnswer: 0
    },
    {
        question: "What is the salary sharing between DOLE and employer?",
        options: [
            "30-70",
            "40-60",
            "50-50",
            "60-40"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the maximum period of SPES employment?",
        options: [
            "52 days",
            "78 days",
            "90 days",
            "120 days"
        ],
        correctAnswer: 0
    },
    {
        question: "Which document is NOT required for SPES application?",
        options: [
            "Birth Certificate",
            "Class Schedule",
            "Driver's License",
            "Report Card"
        ],
        correctAnswer: 2
    },
    {
        question: "What is the grade requirement for SPES applicants?",
        options: [
            "70% average",
            "75% average",
            "80% average",
            "85% average"
        ],
        correctAnswer: 1
    }
];

// Add essay questions for both levels
const shsEssayQuestion = {
    question: "Explain how SPES can help SHS students in their education and career goals.",
    type: "essay",
    minWords: 5,
    maxWords: 5,
    correctAnswer: null
};

const collegeEssayQuestion = {
    question: "Discuss the long-term benefits of SPES for college students and the economy.",
    type: "essay",
    minWords: 5,
    maxWords: 5,
    correctAnswer: null
};

// Add essay questions to respective arrays
shsQuestions.push(shsEssayQuestion);
collegeQuestions.push(collegeEssayQuestion);

let currentQuestion = 0;
let currentScore = 0;
let timeLeft = 600; // 10 minutes in seconds
let timer;
let userAnswers = [];
let tabSwitchCount = 0;
let maxTabSwitches = 3;
let examStarted = false;
let warningGiven = false;

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const startExamBtn = document.getElementById('startExamBtn');
const prevQuestion = document.getElementById('prevQuestion');
const nextQuestion = document.getElementById('nextQuestion');
const progressFill = document.getElementById('progressFill');
const timerDisplay = document.getElementById('time');
const retakeExam = document.getElementById('retakeExam');
const examLink = document.getElementById('examLink');
const resultsLink = document.getElementById('resultsLink');
const welcomeSection = document.getElementById('welcomeSection');
const examSection = document.getElementById('examSection');
const resultsSection = document.getElementById('resultsSection');
const questionContainer = document.getElementById('questionContainer');
const submitExam = document.getElementById('submitExam');

// Event Listeners
darkModeToggle.addEventListener('click', toggleDarkMode);
startExamBtn.addEventListener('click', startExam);
prevQuestion.addEventListener('click', showPreviousQuestion);
nextQuestion.addEventListener('click', showNextQuestion);
retakeExam.addEventListener('click', resetExam);
examLink.addEventListener('click', startExam);
resultsLink.addEventListener('click', showResults);
submitExam.addEventListener('click', gradeExam);

document.addEventListener('visibilitychange', () => {
    if (examStarted && document.hidden) {
        tabSwitchCount++;
        showTabSwitchWarning();
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function startExam() {
    examStarted = true;
    tabSwitchCount = 0;
    warningGiven = false;
    welcomeSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    examSection.classList.remove('hidden');
    loadQuestions();
    startTimer();
    
    // Add event listeners for all text inputs and textareas
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('paste', preventPaste);
        input.addEventListener('copy', preventCopy);
        input.addEventListener('cut', preventCut);
    });
    
    // Disable right-click
    document.addEventListener('contextmenu', preventAction);
    // Disable copy
    document.addEventListener('copy', preventAction);
    // Disable paste
    document.addEventListener('paste', preventAction);
    // Disable cut
    document.addEventListener('cut', preventAction);
    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', preventDevTools);
}

function loadQuestions() {
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    showQuestion(currentQuestion);
}

function showQuestion(index) {
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    const question = questions[index];
    
    if (question.type === "essay") {
        questionContainer.innerHTML = `
            <div class="question">
                <h3>Question ${index + 1} of ${questions.length}</h3>
                <p class="question-text">${question.question}</p>
                <div class="essay-container">
                    <textarea 
                        id="essayAnswer" 
                        class="essay-input" 
                        placeholder="Type your answer here... (${question.minWords}-${question.maxWords} words)"
                        oninput="checkWordCount(this)"
                    >${userAnswers[index] || ''}</textarea>
                    <div class="word-count">
                        Words: <span id="wordCount">0</span>/${question.maxWords}
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the new textarea
        const textarea = document.getElementById('essayAnswer');
        textarea.addEventListener('paste', preventPaste);
        textarea.addEventListener('copy', preventCopy);
        textarea.addEventListener('cut', preventCut);
        
        // Update word count on load
        if (textarea.value) {
            checkWordCount(textarea);
        }
    } else {
        questionContainer.innerHTML = `
            <div class="question">
                <h3>Question ${index + 1} of ${questions.length}</h3>
                <p class="question-text">${question.question}</p>
                <div class="options">
                    ${question.options.map((option, i) => `
                        <div class="option ${userAnswers[index] === i ? 'selected' : ''}" 
                             onclick="selectOption(${i})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    updateProgress();
    updateNavigationButtons();
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.classList.remove('hidden');
    
    if (timer) clearInterval(timer);
    
    timeLeft = 600; // Reset to 10 minutes
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time is up!');
            gradeExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Add warning color when less than 1 minute
    if (timeLeft <= 60) {
        timerDisplay.style.color = '#F44336';
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function updateProgress() {
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    showQuestion(currentQuestion);
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

function showNextQuestion() {
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function updateNavigationButtons() {
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    const isLastQuestion = currentQuestion === questions.length - 1;
    const isEssayQuestion = questions[currentQuestion].type === 'essay';
    const essayAnswer = userAnswers[currentQuestion];
    const wordCount = essayAnswer ? essayAnswer.trim().split(/\s+/).length : 0;
    const essayValid = !isEssayQuestion || wordCount >= questions[currentQuestion].minWords;
    
    prevQuestion.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    nextQuestion.style.visibility = isLastQuestion ? 'hidden' : 'visible';
    submitExam.style.display = isLastQuestion ? 'block' : 'none';
    
    // Disable next/submit if essay requirements not met
    if (isEssayQuestion) {
        nextQuestion.disabled = !essayValid;
        submitExam.disabled = !essayValid;
    } else {
        nextQuestion.disabled = false;
        submitExam.disabled = false;
    }
}

function gradeExam() {
    clearInterval(timer);
    
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    
    // Calculate score for multiple choice questions
    currentScore = 0;
    let totalGradedQuestions = 0;
    
    questions.forEach((question, index) => {
        if (!question.type || question.type !== 'essay') {
            totalGradedQuestions++;
            if (userAnswers[index] === question.correctAnswer) {
                currentScore++;
            }
        }
    });
    
    // Calculate percentage based only on multiple choice questions
    const percentage = (currentScore / totalGradedQuestions) * 100;
    
    showResults(percentage, totalGradedQuestions);
}

function showResults(percentage, totalGradedQuestions) {
    examSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    const essayAnswer = userAnswers[questions.length - 1];
    const wordCount = essayAnswer ? essayAnswer.trim().split(/\s+/).length : 0;
    const essayPassed = wordCount >= questions[questions.length - 1].minWords;
    const finalScore = essayPassed ? percentage : 0;

    const scoreContainer = document.getElementById('scoreContainer');
    // Add a fade-in animation class
    scoreContainer.classList.add('fade-in');
    
    // Use a more stable structure with fixed positioning
    scoreContainer.innerHTML = `
        <div class="results-container">
            <div class="score-summary">
                <div class="score-circle ${finalScore >= 75 ? 'pass' : 'fail'} score-permanent">
                    <div class="score-value">${finalScore.toFixed(0)}%</div>
                    <div class="score-label">Final Score</div>
                </div>
                <div class="score-info">
                    <div class="info-item">
                        <i class="fas fa-check-circle"></i>
                        <span>Multiple Choice Score: ${currentScore}/${totalGradedQuestions}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Time Taken: ${formatTime(600 - timeLeft)}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-pen"></i>
                        <span>Essay Words: ${wordCount}/${questions[questions.length - 1].minWords}</span>
                    </div>
                </div>
            </div>

            <div class="essay-review">
                <h3><i class="fas fa-file-alt"></i> Essay Response</h3>
                <div class="essay-content">
                    <p class="essay-question">${questions[questions.length - 1].question}</p>
                    <div class="essay-answer">
                        ${essayAnswer || '<span class="no-answer">No answer provided</span>'}
                    </div>
                    <div class="word-count-badge ${essayPassed ? 'pass' : 'fail'}">
                        <i class="fas ${essayPassed ? 'fa-check' : 'fa-times'}"></i>
                        Word Count: ${wordCount} words
                    </div>
                </div>
            </div>

            <div class="result-actions">
                <button onclick="window.print()" class="secondary-btn">
                    <i class="fas fa-print"></i> Print Results
                </button>
                <button onclick="resetExam()" class="primary-btn">
                    <i class="fas fa-redo"></i> Retake Exam
                </button>
            </div>
        </div>
    `;

    // Create the chart after the container is added to the DOM
    createResultChart(currentScore, totalGradedQuestions);
}

function createResultChart(score, total) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '<canvas id="resultChart"></canvas>';
    
    new Chart(document.getElementById('resultChart'), {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [score, total - score],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function resetExam() {
    examStarted = false;
    tabSwitchCount = 0;
    warningGiven = false;
    currentQuestion = 0;
    currentScore = 0;
    timeLeft = 600;
    userAnswers = [];
    clearInterval(timer);
    
    // Remove event listeners
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.removeEventListener('paste', preventPaste);
        input.removeEventListener('copy', preventCopy);
        input.removeEventListener('cut', preventCut);
    });
    
    document.removeEventListener('contextmenu', preventAction);
    document.removeEventListener('copy', preventAction);
    document.removeEventListener('paste', preventAction);
    document.removeEventListener('cut', preventAction);
    document.removeEventListener('keydown', preventDevTools);
    
    startExam();
}

function showTabSwitchWarning() {
    const remainingAttempts = maxTabSwitches - tabSwitchCount;
    
    if (tabSwitchCount >= maxTabSwitches) {
        if (!warningGiven) {
            warningGiven = true;
            alert(`You have switched tabs/windows too many times. The exam will now end.`);
            gradeExam();
        }
    } else {
        alert(`Warning: You have left the exam tab! Remaining attempts: ${remainingAttempts}`);
    }
}

function preventAction(e) {
    e.preventDefault();
    return false;
}

function preventDevTools(e) {
    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    ) {
        e.preventDefault();
        return false;
    }
}

// Add word count checker
function checkWordCount(textarea) {
    const text = textarea.value;
    const words = text.trim().split(/\s+/);
    const wordCount = text.trim() ? words.length : 0;
    const wordCountDisplay = document.getElementById('wordCount');
    const userType = document.querySelector('.user-type').textContent.toLowerCase();
    const questions = userType.includes('shs') ? shsQuestions : collegeQuestions;
    const question = questions[currentQuestion];
    
    wordCountDisplay.textContent = wordCount;
    
    // Update the word count display with proper validation
    if (wordCount === 0) {
        wordCountDisplay.style.color = '#666';
    } else if (wordCount < question.minWords) {
        wordCountDisplay.style.color = '#F44336';
        wordCountDisplay.textContent = `${wordCount}/${question.minWords} (Need ${question.minWords - wordCount} more words)`;
    } else if (wordCount > question.maxWords) {
        wordCountDisplay.style.color = '#F44336';
        textarea.value = limitToWords(text, question.maxWords);
        wordCountDisplay.textContent = `${question.maxWords}/${question.maxWords} (Maximum reached)`;
    } else {
        wordCountDisplay.style.color = '#4CAF50';
        wordCountDisplay.textContent = `${wordCount}/${question.maxWords} (Good)`;
    }
    
    userAnswers[currentQuestion] = textarea.value;
    updateNavigationButtons();
}

function limitToWords(text, maxWords) {
    const words = text.trim().split(/\s+/);
    return words.slice(0, maxWords).join(' ');
}

// Initialize
document.getElementById('totalQuestions').textContent = shsQuestions.length + collegeQuestions.length;

// Update welcome section text
document.querySelector('#welcomeSection p').textContent = 'Welcome to the Special Program for Employment of Students (SPES) Assessment. This exam will test your knowledge about the SPES program and its benefits.';

// Add these new functions
function preventPaste(e) {
    e.preventDefault();
    alert('Pasting is not allowed during the exam!');
    return false;
}

function preventCopy(e) {
    e.preventDefault();
    alert('Copying is not allowed during the exam!');
    return false;
}

function preventCut(e) {
    e.preventDefault();
    alert('Cutting is not allowed during the exam!');
    return false;
}

// Add these functions at the end of the file
document.addEventListener('DOMContentLoaded', function() {
    // Settings modal functionality
    const settingsLink = document.getElementById('settingsLink');
    const settingsModal = document.getElementById('settingsModal');

    settingsLink.addEventListener('click', function(e) {
        e.preventDefault();
        settingsModal.classList.remove('hidden');
    });

    // Close modal when clicking outside
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeModal();
        }
    });
});

function closeModal() {
    document.getElementById('settingsModal').classList.add('hidden');
}