<template>
    <div class="page-container">
        <!-- Header -->
        <header class="header">
            <button class="back-button" @click="goBack">
                ←
            </button>
            <h1 class="title">Chapter 3 Test</h1>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Progress Container -->
            <div class="progress-container">
                <div class="progress-item">
                    <span class="progress-label">Question</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar question-bar" :style="{ width: `${questionProgress * 100}%` }"></div>
                    </div>
                    <span class="progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
                </div>
                <div class="progress-item">
                    <span class="progress-label">Time</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar time-bar" :style="{ width: `${timerProgress}%` }"></div>
                    </div>
                    <span class="progress-text">{{ formattedTime }}</span>
                </div>
            </div>

            <!-- Question Container with optional image -->
            <div class="question-container">
                <!-- Image Section (only shown if image exists) -->
                <div v-if="questions[currentQuestionIndex].image" class="question-image-container">
                    <img :src="questions[currentQuestionIndex].image"
                        :alt="'Image for question ' + (currentQuestionIndex + 1)" class="question-image" />
                </div>

                <!-- Question Text Section -->
                <div class="question-text" :class="{ 'has-image': questions[currentQuestionIndex].image }">
                    {{ questions[currentQuestionIndex].question }}
                </div>
            </div>

            <!-- Choices - Now separated -->
            <div class="choices-container">
                <div v-for="(option, index) in questions[currentQuestionIndex].options" :key="index" class="choice-card"
                    :class="{ 'selected': userAnswers[currentQuestionIndex] === option }" @click="selectAnswer(option)">
                    <div class="choice-content">
                        <span class="choice-letter">{{ String.fromCharCode(65 + index) }}</span>
                        <span class="choice-text">{{ option }}</span>
                    </div>
                </div>
            </div>
        </main>

        <!-- Navigation Buttons - Transparent background -->
        <div class="navigation-buttons">
            <button class="nav-button prev-button" @click="prevQuestion" :disabled="currentQuestionIndex === 0"
                :class="{ 'disabled': currentQuestionIndex === 0 }">
                Previous
            </button>
            <button class="nav-button next-button" @click="nextQuestion"
                :disabled="userAnswers[currentQuestionIndex] === null"
                :class="{ 'disabled': userAnswers[currentQuestionIndex] === null }">
                {{ currentQuestionIndex === questions.length - 1 ? 'Check Answers' : 'Next' }}
            </button>
        </div>

        <!-- Simplified Modal -->
        <div v-if="quizCompleted" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-icon" :class="scoreColor">
                    <span v-if="scorePercentage >= 80">✓</span>
                    <span v-else-if="scorePercentage >= 50">○</span>
                    <span v-else>✗</span>
                </div>
                <h2 class="modal-title">Test Complete</h2>
                <div class="modal-score">{{ correctCount }}/{{ questions.length }}</div>
                <div class="modal-percentage">{{ scorePercentage }}%</div>
                <p class="modal-message">{{ finalResultMessage }}</p>
                <div class="modal-actions">
                    <button class="modal-button try-again" @click="resetQuiz">Try Again</button>
                    <button class="modal-button exit" @click="exitQuiz">Exit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { LocalStorage } from "quasar";
import { getCurrentUser, setCurrentUser } from "src/utils/session.js";

export default {
    data() {
        const quizQuestions = [
            {
                question: "What type of solution is formed when alcohol evaporates and mixes in the air?",
                options: [
                    "Gas in gas solution",
                    "Liquid in gas solution",
                    "Gas in liquid solution",
                    "Solid in gas solution"
                ],
                correctAnswer: "Liquid in gas solution",
                image: null
            },
            {
                question: "When salt is added to water to make a saline solution, does it become a solute or a solvent? What happens to the concentration of solute when more solvent is added to the mixture?",
                options: [
                    "Solute, decrease",
                    "Solute, increase",
                    "Solvent, decrease",
                    "Solvent, increase"
                ],
                correctAnswer: "Solute, decrease",
                image: null
            },
            {
                question: "What will happen if a small crystal of solute is added to a supersaturated solution?",
                options: [
                    "The crystal will grow bigger.",
                    "The crystal will remain unchanged.",
                    "The crystal will be partially dissolved.",
                    "The crystal will be completely dissolved."
                ],
                correctAnswer: "The crystal will grow bigger.",
                image: null
            },
            {
                question: "Which statement is incorrect about liquid solutions?",
                options: [
                    "The amount of solvent is greater than the amount of solute.",
                    "Adding 5 grams of solute to a solution will make it more dilute.",
                    "A 10-milliliter solute in a 1-liter solution makes a 1% by volume solution.",
                    "A concentrated 100-milliliter solution has more solute than a dilute 100-milliliter solution."
                ],
                correctAnswer: "Adding 5 grams of solute to a solution will make it more dilute.",
                image: null
            },
            {
                question: "Which is a quantitative expression of solution concentration?",
                options: [
                    "Concentrated",
                    "Dilute",
                    "30 milliliters",
                    "50% by volume"
                ],
                correctAnswer: "50% by volume",
                image: null
            },
            {
                question: "Which factor does not affect how solids dissolve in liquids?",
                options: [
                    "Nature of solute",
                    "Nature of solvent",
                    "Pressure",
                    "Temperature"
                ],
                correctAnswer: "Pressure",
                image: null
            },
            {
                question: "Which statement is correct?",
                options: [
                    "An unsaturated solution is a very unstable solution.",
                    "A supersaturated solution is a concentrated solution.",
                    "A supersaturated solution is more dilute than an unsaturated solution.",
                    "A saturated solution is more concentrated than a supersaturated solution."
                ],
                correctAnswer: "A supersaturated solution is a concentrated solution.",
                image: null
            },
            {
                question: "When adding a large amount of solute to a solvent, which of the following is most likely to happen?",
                options: [
                    "The temperature of the solvent will decrease.",
                    "The solubility of the solute will increase with more solute added.",
                    "The solution may become saturated, and undissolved solute may remain.",
                    "The solvent will hold the same amount of solute regardless of the quantity added."
                ],
                correctAnswer: "The solution may become saturated, and undissolved solute may remain.",
                image: null
            },
            {
                question: "What is a familiar solution involving salt used to preserve food?",
                options: [
                    "Ascorbic acid solution",
                    "Sodium hydroxide solution",
                    "Saline solution",
                    "Acetylsalicylic acid solution"
                ],
                correctAnswer: "Saline solution",
                image: null
            },
            {
                question: "Which of the following is a solution involving a base used in disinfectants?",
                options: [
                    "Ammonia solution",
                    "Ascorbic acid solution",
                    "Sodium hydroxide solution",
                    "Acetylsalicylic acid solution"
                ],
                correctAnswer: "Ammonia solution",
                image: null
            }
        ];

        const durationMinutes = 5;
        const initialTime = durationMinutes * 60 * 1000;

        return {
            questions: quizQuestions,
            currentQuestionIndex: 0,
            userAnswers: new Array(quizQuestions.length).fill(null),
            timerDuration: initialTime,
            remainingTime: initialTime,
            quizCompleted: false,
            timerInterval: null,
        };
    },

    computed: {
        formattedTime() {
            const totalSeconds = Math.max(0, Math.floor(this.remainingTime / 1000));
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        },
        timerProgress() {
            return (this.remainingTime / this.timerDuration) * 100;
        },
        questionProgress() {
            return (this.currentQuestionIndex + 1) / this.questions.length;
        },
        correctCount() {
            return this.userAnswers.filter(
                (answer, index) => answer === this.questions[index].correctAnswer
            ).length;
        },
        wrongCount() {
            return this.userAnswers.filter(
                (answer, index) =>
                    answer !== null && answer !== this.questions[index].correctAnswer
            ).length;
        },
        scorePercentage() {
            return Math.round((this.correctCount / this.questions.length) * 100);
        },
        scoreColor() {
            if (this.scorePercentage >= 80) return "excellent";
            if (this.scorePercentage >= 50) return "good";
            return "poor";
        },
        finalResultMessage() {
            if (this.scorePercentage >= 80) return "Excellent work! Keep it up.";
            if (this.scorePercentage >= 50) return "Good effort! You passed.";
            return "Keep studying, you can do better!";
        },
    },

    watch: {
        quizCompleted(newVal) {
            if (newVal) this.stopTimer();
        },
    },

    mounted() {
        this.startTimer();
    },

    beforeUnmount() {
        this.stopTimer();
    },

    methods: {
        startTimer() {
            this.stopTimer();
            this.timerInterval = setInterval(() => {
                if (this.remainingTime > 1000) {
                    this.remainingTime -= 1000;
                } else {
                    this.remainingTime = 0;
                    this.onTimerFinish();
                }
            }, 1000);
        },

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },

        selectAnswer(option) {
            this.userAnswers[this.currentQuestionIndex] = option;
        },

        goBack() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            } else {
                window.history.back();
            }
        },

        prevQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
            }
        },

        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
            } else {
                this.finishQuiz();
            }
        },

        finishQuiz() {
            this.quizCompleted = true;

            const currentUser = getCurrentUser();
            if (!currentUser) return;

            // Initialize progress and chapterTest if they don't exist
            if (!currentUser.progress) currentUser.progress = {};
            if (!currentUser.chapterTest) currentUser.chapterTest = {};

            const chapterNumber = 4; // Chapter Number
            const chapterId = "chapter_" + chapterNumber; // Create chapterID
            const isCompleted = this.scorePercentage >= 80; // true/false

            console.log('Saving quiz results:', {
                chapter: chapterNumber,
                chapterId: chapterId,
                score: this.correctCount,
                total: this.questions.length,
                percentage: this.scorePercentage,
                completed: isCompleted
            });

            // Store test results in chapterTest with the requested structure
            currentUser.chapterTest[chapterNumber] = {
                total: this.questions.length,
                score: this.correctCount,
                chapterID: chapterId,
                // Additional data preserved for backward compatibility
                correct: this.correctCount,
                wrong: this.wrongCount,
                percentage: this.scorePercentage,
                completed: isCompleted,
                timestamp: new Date().toISOString()
            };

            // FIXED: Update only the completed value while preserving other data
            // Assuming lesson ID 92 corresponds to this quiz
            const lessonId = 34; // Lesson ID for this quiz

            // Preserve existing data and only update completed
            currentUser.progress[lessonId] = {
                ...currentUser.progress[lessonId], // Keep existing properties
                completed: isCompleted  // Update only the completed value
            };

            // Save updates to session
            setCurrentUser(currentUser);

            // Update global students list in LocalStorage
            let students = LocalStorage.getItem("students") || [];
            students = students.map(student =>
                student.id === currentUser.id
                    ? {
                        ...student,
                        progress: currentUser.progress,
                        chapterTest: currentUser.chapterTest
                    }
                    : student
            );

            LocalStorage.set("students", students);
            LocalStorage.set("currentUser", currentUser);

            // Debug log
            console.log('Saved to localStorage:', {
                lessonProgress: currentUser.progress[lessonId],
                chapterTest: currentUser.chapterTest[chapterNumber]
            });
        },

        onTimerFinish() {
            this.finishQuiz();
        },

        resetQuiz() {
            this.currentQuestionIndex = 0;
            this.userAnswers = new Array(this.questions.length).fill(null);
            this.remainingTime = this.timerDuration;
            this.quizCompleted = false;
            this.startTimer();
        },

        exitQuiz() {
            window.history.back();
        }
    },
};
</script>
<style scoped>
.page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
}

/* Header Styles */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: linear-gradient(to right, #4A90E2, #357ABD);
    border-bottom: 3px solid #2C5F9D;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 0 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Simple red arrow back button */
.back-button {
    position: absolute;
    left: 20px;
    background: #FF4444;
    border: none;
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-bottom: 3px solid #CC0000;
}

.back-button:hover:not(:disabled) {
    background: #FF6666;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
}

.back-button:active:not(:disabled) {
    transform: translateY(1px);
    border-bottom-width: 1px;
}

.back-button:disabled {
    background: #CCCCCC;
    border-bottom: 3px solid #AAAAAA;
    color: #888888;
    cursor: not-allowed;
}

/* Add to your existing CSS */

.question-image-container {
    margin-bottom: 20px;
    text-align: center;
}

.question-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-text.has-image {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

/* Adjust question container for image layout */
.question-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Main Content */
.main-content {
    padding: 90px 20px 100px;
    max-width: 800px;
    margin: 0 auto;
}

/* Progress Container */
.progress-container {
    background: linear-gradient(135deg, #FFD166 0%, #FFB347 100%);
    border-bottom: 3px solid #E89C30;
    border-radius: 15px;
    padding: 20px 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(255, 179, 71, 0.2);
}

.progress-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.progress-item:last-child {
    margin-bottom: 0;
}

.progress-label {
    width: 80px;
    font-size: 15px;
    color: #7A5C1C;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.progress-bar-container {
    flex: 1;
    height: 12px;
    background: linear-gradient(135deg, #FFE8B5 0%, #FFD8A8 100%);
    border-radius: 6px;
    overflow: hidden;
    margin: 0 15px;
    border: 2px solid #E89C30;
}

.progress-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.question-bar {
    background: linear-gradient(90deg, #06D6A0 0%, #04B48A 100%);
    border-bottom: 2px solid #038C6A;
}

.time-bar {
    background: linear-gradient(90deg, #EF476F 0%, #D43A5E 100%);
    border-bottom: 2px solid #B32E4D;
}

.progress-text {
    width: 80px;
    font-size: 15px;
    color: #7A5C1C;
    text-align: right;
    font-weight: 700;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

/* Question Container */
.question-container {
    background: linear-gradient(135deg, #118AB2 0%, #0A6E8F 100%);
    border-bottom: 3px solid #095A77;
    border-radius: 15px;
    padding: 28px 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(17, 138, 178, 0.2);
}

.question-text {
    font-size: 20px;
    line-height: 1.6;
    color: white;
    font-weight: 600;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

/* Choices Container - Separated Cards */
.choices-container {
    display: grid;
    gap: 15px;
    margin-bottom: 20px;
}

.choice-card {
    background: linear-gradient(135deg, #073B4C 0%, #052C39 100%);
    border-bottom: 3px solid #031E26;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(7, 59, 76, 0.2);
}

.choice-card:hover {
    background: linear-gradient(135deg, #0D5C76 0%, #0A485E 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(7, 59, 76, 0.3);
}

.choice-card.selected {
    background: linear-gradient(135deg, #1B98E0 0%, #1478B2 100%);
    border-bottom: 3px solid #0F5C8A;
    box-shadow: 0 6px 12px rgba(27, 152, 224, 0.3);
}

.choice-content {
    display: flex;
    align-items: center;
    padding: 20px 24px;
}

.choice-letter {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FFD166 0%, #FFB347 100%);
    border: 2px solid #E89C30;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    font-weight: 800;
    color: #7A5C1C;
    font-size: 18px;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    box-shadow: 0 3px 6px rgba(255, 179, 71, 0.3);
    flex-shrink: 0;
}

.choice-card.selected .choice-letter {
    background: linear-gradient(135deg, #06D6A0 0%, #04B48A 100%);
    border: 2px solid #038C6A;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.choice-text {
    flex: 1;
    font-size: 17px;
    line-height: 1.5;
    color: #E0F7FA;
    font-weight: 500;
}

.choice-card.selected .choice-text {
    color: white;
    font-weight: 600;
}

/* Navigation Buttons - Transparent Background */
.navigation-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: transparent;
    /* Transparent background */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    z-index: 100;
}

.nav-button {
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    min-width: 140px;
}

.prev-button {
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
    color: white;
    border-bottom: 3px solid #6D28D9;
}

.prev-button:not(.disabled):hover {
    background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
}

.prev-button:not(.disabled):active {
    transform: translateY(1px);
    border-bottom-width: 1px;
}

.next-button {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    border-bottom: 3px solid #047857;
}

.next-button:not(.disabled):hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
}

.next-button:not(.disabled):active {
    transform: translateY(1px);
    border-bottom-width: 1px;
}

.nav-button.disabled {
    background: linear-gradient(135deg, rgba(102, 102, 102, 0.7) 0%, rgba(85, 85, 85, 0.7) 100%);
    color: rgba(170, 170, 170, 0.8);
    border-bottom: 3px solid rgba(68, 68, 68, 0.7);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    backdrop-filter: blur(5px);
}

/* Simplified Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 32px;
    font-weight: bold;
}

.modal-icon.excellent {
    background: #E8F5E9;
    color: #2E7D32;
    border: 3px solid #4CAF50;
}

.modal-icon.good {
    background: #FFF3E0;
    color: #EF6C00;
    border: 3px solid #FF9800;
}

.modal-icon.poor {
    background: #FFEBEE;
    color: #C62828;
    border: 3px solid #F44336;
}

.modal-title {
    margin: 0 0 15px 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.modal-score {
    font-size: 36px;
    font-weight: 700;
    color: #2196F3;
    margin-bottom: 5px;
}

.modal-percentage {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
    font-weight: 500;
}

.modal-message {
    margin: 0 0 25px 0;
    font-size: 16px;
    color: #555;
    line-height: 1.4;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.modal-button {
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
}

.try-again {
    background: #4CAF50;
    color: white;
    border-bottom: 2px solid #388E3C;
}

.try-again:hover {
    background: #388E3C;
}

.exit {
    background: #F5F5F5;
    color: #333;
    border-bottom: 2px solid #DDD;
}

.exit:hover {
    background: #E0E0E0;
}

.modal-button:active {
    transform: translateY(2px);
    border-bottom-width: 1px;
}

/* Responsive Design */
@media (max-width: 600px) {
    .main-content {
        padding: 80px 16px 90px;
    }

    .question-text {
        font-size: 18px;
    }

    .choice-text {
        font-size: 16px;
    }

    .choice-content {
        padding: 16px 20px;
    }

    .nav-button {
        padding: 12px 24px;
        font-size: 14px;
        min-width: 120px;
    }

    .navigation-buttons {
        padding: 0 20px;
        height: 70px;
    }

    .modal-content {
        padding: 25px 20px;
        max-width: 90%;
    }

    .modal-icon {
        width: 60px;
        height: 60px;
        font-size: 28px;
        margin-bottom: 15px;
    }

    .modal-title {
        font-size: 22px;
        margin-bottom: 12px;
    }

    .modal-score {
        font-size: 32px;
    }

    .modal-percentage {
        font-size: 16px;
        margin-bottom: 15px;
    }

    .modal-message {
        font-size: 15px;
        margin-bottom: 20px;
    }

    .modal-button {
        padding: 10px 20px;
        font-size: 14px;
        min-width: 110px;
    }

    .modal-actions {
        gap: 10px;
    }

    .back-button {
        width: 45px;
        height: 45px;
        font-size: 22px;
        left: 15px;
    }

    .progress-label,
    .progress-text {
        width: 70px;
        font-size: 14px;
    }

    .progress-bar-container {
        margin: 0 10px;
    }
}
</style>