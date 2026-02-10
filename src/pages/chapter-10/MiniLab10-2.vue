<template>
    <q-layout view="hHh LpR fFf">
        <!-- Simple Header with Only Back -->
        <q-header class="bg-white text-dark">
            <q-toolbar class="q-px-md">
                <!-- Back button on the left -->
                <q-btn flat dense round icon="arrow_back" @click="goBack" aria-label="Back" class="text-dark back-btn"
                    size="md" />

                <!-- Page title on the right of back button -->
                <div class="text-h6 text-weight-bold text-primary q-ml-md">
                    Mini Test 10-2
                </div>

                <!-- Page counter -->
                <q-space />
                <div class="text-subtitle1 text-weight-medium text-grey-8">
                    Page {{ isInstructionPage ? 'Instructions' : currentQuestionIndex + 1 }}/{{ totalPages }}
                </div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
        </q-header>

        <!-- Main Content -->
        <q-page-container>
            <q-page class="q-pa-md" style="background-color: #f8f9fa;">
                <!-- Instruction Page -->
                <div v-if="isInstructionPage" class="instruction-page">
                    <div class="instruction-card cartoon-card q-mb-lg">
                        <div class="instruction-header">
                            <!-- Icon and heading inline -->
                            <div class="flex items-center q-mb-md">
                                <div class="instruction-icon-container">
                                    <q-icon name="help" size="28px" color="white" />
                                </div>
                                <div class="text-h6 text-weight-bold text-white instruction-title">
                                    Instructions
                                </div>
                            </div>

                            <!-- Instruction text -->
                            <!-- <div class="instruction-text q-mb-md">
                                <p class="q-mb-sm">Select the correct answer for each question.</p>
                                <p class="q-mb-sm"><span class="text-weight-medium">Only one answer is correct per
                                        question.</span></p>
                                <p>Click on your choice to select it.</p>
                            </div> -->

                            <!-- Images Section -->
                            <div class="instruction-images q-mb-lg">
                                <div v-for="(image, index) in instructionImages" :key="index"
                                    class="instruction-image-container q-mb-md">
                                    <img :src="image.src" :alt="image.alt" class="instruction-image cartoon-card" />
                                    <div v-if="image.caption"
                                        class="instruction-image-caption text-caption text-white-7 q-mt-xs">
                                        {{ image.caption }}
                                    </div>
                                </div>
                            </div>

                            <!-- Additional Instructions -->
                            <!-- <div class="additional-instructions q-mt-lg">
                                <div class="text-subtitle2 text-weight-bold text-white q-mb-sm">
                                    Important Notes:
                                </div>
                                <ul class="instruction-list text-white">
                                    <li>You can navigate between questions using Previous/Next buttons</li>
                                    <li>You must answer all questions before checking your answers</li>
                                    <li>You can change your answers anytime before submission</li>
                                    <li>Results will be displayed after submission</li>
                                </ul>
                            </div> -->
                        </div>
                    </div>

                    <!-- Start Button -->
                    <div class="text-center q-mt-xl">
                        <q-btn label="Start Quiz" @click="startQuiz" class="start-btn cartoon-btn" color="positive"
                            unelevated size="md" style="min-width: 200px;">
                            <q-icon name="play_arrow" class="q-ml-sm" />
                        </q-btn>
                    </div>
                </div>

                <!-- Questions Section - Only shown after instruction page -->
                <div v-else class="section">
                    <!-- Single Question Display -->
                    <div v-if="currentQuestion" class="questions-container">
                        <!-- Question Card -->
                        <div :class="['question-card', 'q-mb-md', `question-card-${currentQuestionIndex + 1}`]">
                            <div class="flex items-start">
                                <div>
                                    <div class="text-h6 text-weight-bold text-white q-mb-xs">
                                        Question {{ currentQuestionIndex + 1 }}
                                    </div>
                                    <div class="instruction-text">
                                        {{ currentQuestion.question }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Options Container -->
                        <div class="options-container q-mb-lg">
                            <div v-for="(option, optionIndex) in currentQuestion.options" :key="option.id"
                                class="option-item q-mb-sm cartoon-card" :class="{
                                    'selected': selectedAnswers[currentQuestion.id] === option.id,
                                    'correct': showResults && option.id === currentQuestion.correctAnswer,
                                    'incorrect': showResults && selectedAnswers[currentQuestion.id] === option.id && selectedAnswers[currentQuestion.id] !== currentQuestion.correctAnswer
                                }" @click="selectAnswer(currentQuestion.id, option.id)">
                                <div class="option-letter">{{ String.fromCharCode(65 + optionIndex) }}</div>
                                <div class="option-text">{{ option.text }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Buttons - Always Visible -->
                    <div class="navigation-buttons q-mt-xl">
                        <div class="row justify-between">
                            <!-- Previous Button - Goes to instruction page on first question -->
                            <q-btn label="Previous" @click="goToPrevious" class="nav-btn cartoon-btn" color="primary"
                                outline :disabled="checking" />

                            <!-- Next/Check Answers Button -->
                            <q-btn :label="nextButtonLabel" @click="handleNextOrCheck" class="nav-btn cartoon-btn"
                                :color="nextButtonColor" :disabled="checking || !isCurrentQuestionAnswered" />
                        </div>
                    </div>
                </div>
            </q-page>
        </q-page-container>

        <!-- Full Screen Results Modal -->
        <q-dialog v-model="showResultsModal" maximized seamless>
            <!-- Backdrop Blur Effect -->
            <div class="modal-backdrop" @click="closeResultsModal"></div>

            <!-- Full Screen Modal Content -->
            <div class="fullscreen-modal">
                <div class="modal-content">
                    <div class="result-icon q-mb-md">
                        <q-icon :name="score === 5 ? 'emoji_events' : (score >= 3 ? 'check_circle' : 'refresh')"
                            size="64px" :color="score === 5 ? 'amber-7' : (score >= 3 ? 'positive' : 'warning')" />
                    </div>

                    <div class="result-title q-mb-md">
                        <div class="text-h4 text-weight-bold" :class="scoreTitleClass">
                            {{ scoreTitle }}
                        </div>
                        <div class="text-h6 q-mt-sm" style="color: #666;">
                            {{ score }}/{{ config.totalItems }} Correct
                        </div>
                    </div>

                    <div class="score-percentage q-mb-lg">
                        <div class="text-h3 text-weight-bold" :class="scorePercentageClass">
                            {{ scorePercentage }}%
                        </div>
                    </div>

                    <!-- Brief feedback -->
                    <div class="brief-feedback text-body1 q-mb-xl" style="color: #555;">
                        {{ briefFeedback }}
                    </div>

                    <!-- Action Button -->
                    <div class="modal-actions">
                        <q-btn :label="score === config.totalItems ? 'Continue' : 'Try Again'"
                            :color="score === config.totalItems ? 'positive' : 'primary'"
                            @click="score === config.totalItems ? continueToNext() : closeResultsModal()"
                            class="action-btn cartoon-btn" unelevated size="lg" style="min-width: 200px;" />
                    </div>
                </div>
            </div>
        </q-dialog>
    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { getCurrentUser, setCurrentUser } from 'src/utils/session'

const $q = useQuasar()

// Configuration for this quiz
const config = {
    quizName: 'Mini Lab 10-2',
    type: 'mini_lab',
    totalItems: 5,
    chapter: 10,
    lesson: 1
}

// Instruction images - Add as many as you want
const instructionImages = ref([
    {
        src: 'assets/img/chapter 10/figure0.png',
        alt: 'Example instruction image 1',
        caption: '1. Cut two sets of cardboard like the figure on the right. '
    },
    {
        src: 'assets/img/chapter 10/figure1.jpeg',
        alt: 'Example instruction image 2',
        caption: '2. Get  the  first  set  of  cardboard.  Follow  the  movements  in  figure  1  below.  Slide the pieces of cardboard past each other. Observe what happens to the cardboard in the cut part.'
    },
    {
        src: 'assets/img/chapter 10/figure2.jpeg',
        alt: 'Example instruction image 3',
        caption: '3. Get the second set of cardboard. Follow the movements in figure 2 below. Slide the pieces of cardboard past each other. Observe what happens to the cardboard in the cut part'
    }
])

// Questions data
const questions = ref([
    {
        id: 'q1',
        question: 'In the cardboard model shown, what do the slanted cut surfaces represent?',
        options: [
            { id: 'a', text: 'Earth’s core layers' },
            { id: 'b', text: 'A fault plane where rocks move past each other' },
            { id: 'c', text: 'Sedimentary rock layers' },
            { id: 'd', text: 'Volcanic magma chambers' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q2',
        question: 'Which block of rock is called the hanging wall in the model?',
        options: [
            { id: 'a', text: 'The block located below the fault plane' },
            { id: 'b', text: 'The block that does not move' },
            { id: 'c', text: 'The block located above the fault plane' },
            { id: 'd', text: 'The block with the steeper slope' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 'q3',
        question: 'In the first set, the cardboard pieces slide past each other horizontally. What type of fault does this movement represent?',
        options: [
            { id: 'a', text: 'Normal fault' },
            { id: 'b', text: 'Reverse fault' },
            { id: 'c', text: 'Strike-slip fault' },
            { id: 'd', text: 'Thrust fault' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 'q4',
        question: 'In the second set, the hanging wall moves downward relative to the footwall. What type of fault is being modeled?',
        options: [
            { id: 'a', text: 'Normal fault' },
            { id: 'b', text: 'Reverse fault' },
            { id: 'c', text: 'Strike-slip fault' },
            { id: 'd', text: 'Transform fault' }
        ],
        correctAnswer: 'a'
    },
    {
        id: 'q5',
        question: 'Why is a cardboard model useful for understanding faults and earthquakes?',
        options: [
            { id: 'a', text: 'It exactly duplicates real earthquakes' },
            { id: 'b', text: 'It allows direct observation of Earth’s interior' },
            { id: 'c', text: 'It helps visualize rock movement along faults in a simple way' },
            { id: 'd', text: 'It replaces computer simulations' }
        ],
        correctAnswer: 'c'
    }
])

// State
const isInstructionPage = ref(true)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref({})
const showResults = ref(false)
const showResultsModal = ref(false)
const checking = ref(false)

// Initialize selected answers
const initializeSelectedAnswers = () => {
    const answers = {}
    questions.value.forEach(question => {
        answers[question.id] = null
    })
    return answers
}

// Computed properties
const totalQuestions = computed(() => questions.value.length)
const totalPages = computed(() => totalQuestions.value + 1) // +1 for instruction page

const currentQuestion = computed(() => {
    if (isInstructionPage.value) return null
    return questions.value[currentQuestionIndex.value]
})

const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === totalQuestions.value - 1
})

const isCurrentQuestionAnswered = computed(() => {
    if (!currentQuestion.value) return false
    return selectedAnswers.value[currentQuestion.value.id] !== null
})

const answeredCount = computed(() => {
    return Object.values(selectedAnswers.value).filter(answer => answer !== null).length
})

const allAnswered = computed(() => {
    return answeredCount.value === totalQuestions.value
})

const score = computed(() => {
    let correct = 0
    questions.value.forEach((question) => {
        if (selectedAnswers.value[question.id] === question.correctAnswer) {
            correct++
        }
    })
    return correct
})

const scorePercentage = computed(() => {
    return Math.round((score.value / config.totalItems) * 100)
})

const scoreTitle = computed(() => {
    if (score.value === config.totalItems) return 'Perfect Score!'
    if (score.value >= config.totalItems - 1) return 'Excellent!'
    if (score.value >= config.totalItems - 2) return 'Good Job'
    return 'Try Again'
})

const scoreTitleClass = computed(() => {
    if (score.value === config.totalItems) return 'text-positive'
    if (score.value >= config.totalItems - 1) return 'text-primary'
    if (score.value >= config.totalItems - 2) return 'text-warning'
    return 'text-negative'
})

const scorePercentageClass = computed(() => {
    if (scorePercentage.value >= 90) return 'text-positive'
    if (scorePercentage.value >= 70) return 'text-primary'
    if (scorePercentage.value >= 50) return 'text-warning'
    return 'text-negative'
})

const briefFeedback = computed(() => {
    if (score.value === config.totalItems) return 'You have mastered the atmosphere concepts!'
    if (score.value >= config.totalItems - 1) return 'Great understanding of atmospheric science!'
    if (score.value >= config.totalItems - 2) return 'Good understanding, keep practicing!'
    return 'Review the concepts and try again!'
})

const nextButtonLabel = computed(() => {
    if (isLastQuestion.value && allAnswered.value) {
        return 'Check Answers'
    }
    return 'Next'
})

const nextButtonColor = computed(() => {
    if (isLastQuestion.value && allAnswered.value) {
        return 'positive'
    }
    return 'primary'
})

// Navigation
const goBack = () => {
    try {
        sessionStorage.setItem("requestedSlide", "slide11")
    } catch {
        // ignore
    }
    history.back()
}

const startQuiz = () => {
    isInstructionPage.value = false
    selectedAnswers.value = initializeSelectedAnswers()
}

const goToPrevious = () => {
    if (currentQuestionIndex.value === 0) {
        // Go back to instruction page
        isInstructionPage.value = true
    } else {
        currentQuestionIndex.value--
    }
}

const handleNextOrCheck = () => {
    if (!isCurrentQuestionAnswered.value) {
        $q.notify({
            message: 'Please choose an answer first',
            color: 'warning',
            icon: 'warning',
            position: 'top',
            timeout: 2000,
            textColor: 'white'
        })
        return
    }

    if (isLastQuestion.value && allAnswered.value) {
        submitAnswers()
    } else {
        currentQuestionIndex.value++
    }
}

// Quiz saving function
const saveQuizResult = (score) => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    if (!currentUser.quizzes) currentUser.quizzes = {}
    if (!currentUser.progress) currentUser.progress = {}

    currentUser.quizzes[config.quizName] = {
        type: config.type,
        score: score,
        total: config.totalItems,
        chapter: config.chapter,
        lesson: config.lesson
    }

    currentUser.progress[config.quizName] = {
        type: config.type,
        correct: score,
        total: config.totalItems,
        wrong: config.totalItems - score
    }

    setCurrentUser(currentUser)

    const students = LocalStorage.getItem('students') || []
    const updatedStudents = students.map(student =>
        student.id === currentUser.id
            ? { ...student, quizzes: currentUser.quizzes, progress: currentUser.progress }
            : student
    )
    LocalStorage.set('students', updatedStudents)
}

const submitAnswers = async () => {
    checking.value = true
    showResults.value = true
    saveQuizResult(score.value)

    await new Promise(resolve => setTimeout(resolve, 500))
    showResultsModal.value = true
    checking.value = false
}

const continueToNext = () => {
    showResultsModal.value = false
    goBack()
}

const closeResultsModal = () => {
    showResultsModal.value = false
    selectedAnswers.value = initializeSelectedAnswers()
    showResults.value = false
    currentQuestionIndex.value = 0
    isInstructionPage.value = true
}

const selectAnswer = (questionId, answerId) => {
    if (!showResults.value) {
        selectedAnswers.value[questionId] = answerId
    }
}

// Initialize on mount
onMounted(() => {
    selectedAnswers.value = initializeSelectedAnswers()
    if (questions.value.length !== config.totalItems) {
        console.warn(`Warning: questions array length (${questions.value.length}) doesn't match config.totalItems (${config.totalItems})`)
    }
})
</script>

<style scoped>
/* Cartoonish UI Styles with Bottom Border Design */
.cartoon-card {
    border: none !important;
    box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.15) !important;
    border-radius: 12px !important;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.cartoon-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    border-radius: 0 0 12px 12px;
    transition: all 0.2s ease;
}

.cartoon-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 9px 0 0 rgba(0, 0, 0, 0.15) !important;
}

.cartoon-card:hover::after {
    height: 9px;
}

.cartoon-btn {
    border: none !important;
    box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.15) !important;
    border-radius: 10px !important;
    transition: all 0.2s ease;
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
}

.cartoon-btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 0 0 10px 10px;
    transition: all 0.2s ease;
}

.cartoon-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.15) !important;
}

.cartoon-btn:hover:not(:disabled)::after {
    height: 6px;
}

.cartoon-btn:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.15) !important;
}

.cartoon-btn:active:not(:disabled)::after {
    height: 2px;
}

.cartoon-btn:disabled {
    opacity: 0.6;
    box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.1) !important;
}

.cartoon-btn:disabled::after {
    height: 3px;
}

/* Instruction Page Styles */
.instruction-page {
    max-width: 800px;
    margin: 0 auto;
}

.instruction-card {
    background: linear-gradient(145deg, #FF6B35, #FF8540) !important;
    border-radius: 16px;
    padding: 30px;
    color: white;
}

.instruction-card::after {
    background: #E55A2B !important;
}

.instruction-header {
    margin-bottom: 20px;
}

.instruction-icon-container {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    padding: 10px;
    margin-right: 15px;
    box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

.instruction-icon-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 0 0 10px 10px;
}

.instruction-title {
    font-size: 1.5rem;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.instruction-text {
    font-size: 1.1rem;
    opacity: 0.95;
    line-height: 1.6;
}

/* Instruction Images */
.instruction-images {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.instruction-image-container {
    text-align: center;
}

.instruction-image {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 5px;
    max-height: 300px;
    object-fit: contain;
}

.instruction-image-caption {
    font-style: italic;
    text-align: center;
}

/* Instruction List */
.instruction-list {
    list-style-type: none;
    padding-left: 0;
}

.instruction-list li {
    padding: 8px 0;
    padding-left: 24px;
    position: relative;
}

.instruction-list li:before {
    content: '•';
    color: #FFD700;
    font-size: 1.5rem;
    position: absolute;
    left: 0;
    top: 4px;
}

/* Start Button */
.start-btn {
    min-width: 200px;
    font-size: 1.1rem;
    padding: 12px 30px;
}

/* Navigation Buttons */
.navigation-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    /* optional spacing */
    padding: 14px 20px;

    /* optional layering */
    z-index: 1000;
}


.nav-btn {
    min-width: 140px;
}

/* Modal Backdrop with Blur Effect */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 1;
}

/* Full Screen Modal */
.fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 60px 40px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    animation: modal-appear 0.3s ease-out;
    border: none;
    box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

.modal-content::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 0 0 16px 16px;
}

@keyframes modal-appear {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Result Icon */
.result-icon {
    margin-bottom: 32px;
}

/* Result Title */
.result-title {
    margin-bottom: 32px;
}

/* Score Percentage */
.score-percentage {
    margin-bottom: 40px;
}

/* Brief Feedback */
.brief-feedback {
    margin-bottom: 48px;
    line-height: 1.6;
}

/* Modal Actions */
.modal-actions {
    display: flex;
    justify-content: center;
}

/* Question Cards - Solid Colors with Bottom Borders */
.question-card {
    background: linear-gradient(145deg, #4A90E2, #5A9CE6) !important;
    border-radius: 12px;
    padding: 20px;
    color: white;
    border: none !important;
}

.question-card::after {
    background: #3A80D8 !important;
}

.question-card-2 {
    background: linear-gradient(145deg, #7ED321, #8EE331) !important;
}

.question-card-2::after {
    background: #6EC311 !important;
}

.question-card-3 {
    background: linear-gradient(145deg, #FF4081, #FF5A95) !important;
}

.question-card-3::after {
    background: #FF266D !important;
}

.question-card .instruction-text {
    color: white;
    opacity: 0.95;
}

/* Options Container */
.options-container {
    margin-top: 8px;
}

.option-item {
    background: linear-gradient(145deg, #FFFFFF, #F8F9FA) !important;
    border: none !important;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.1) !important;
}

.option-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0 0 12px 12px;
    transition: all 0.2s ease;
}

.option-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.1) !important;
}

.option-item:hover::after {
    height: 6px;
}

.option-item.selected {
    background: #0051ff6b !important;
}

.option-item.correct {
    background: linear-gradient(145deg, #E8F5E9, #D9E6DA) !important;
}

.option-item.incorrect {
    background: linear-gradient(145deg, #FFEBEE, #EFDCDE) !important;
}

/* Option Letter */
.option-letter {
    width: 36px;
    height: 36px;
    background: linear-gradient(145deg, #333, #444);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 16px;
    color: white;
    font-size: 1rem;
    border: none;
    box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.option-letter::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 0 0 8px 8px;
}

.option-item:hover .option-letter {
    transform: scale(1.05);
}

.option-item.selected .option-letter {
    background: linear-gradient(145deg, #1976D2, #2A86E2) !important;
}

.option-item.correct .option-letter {
    background: linear-gradient(145deg, #4CAF50, #5CBF60) !important;
}

.option-item.incorrect .option-letter {
    background: linear-gradient(145deg, #F44336, #FF5347) !important;
}

.option-text {
    flex: 1;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
}

.option-item.selected .option-text {
    color: #ffffff;
    font-weight: 600;
}

.option-item.correct .option-text {
    color: #2E7D32;
    font-weight: 600;
}

.option-item.incorrect .option-text {
    color: #C62828;
    font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .cartoon-card {
        box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.15) !important;
    }

    .cartoon-card::after {
        height: 4px;
    }

    .cartoon-card:hover {
        box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.15) !important;
    }

    .cartoon-card:hover::after {
        height: 6px;
    }

    .cartoon-btn {
        box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.15) !important;
    }

    .cartoon-btn::after {
        height: 3px;
    }

    .cartoon-btn:hover:not(:disabled) {
        box-shadow: 0 5px 0 0 rgba(0, 0, 0, 0.15) !important;
    }

    .cartoon-btn:hover:not(:disabled)::after {
        height: 5px;
    }

    .instruction-card {
        padding: 20px;
    }

    .instruction-title {
        font-size: 1.25rem;
    }

    .instruction-text {
        font-size: 1rem;
    }

    .instruction-image {
        max-height: 200px;
    }

    .nav-btn {
        min-width: 120px;
        font-size: 0.9rem;
    }

    .start-btn {
        min-width: 180px;
        font-size: 1rem;
    }

    .option-item {
        padding: 14px 16px;
        box-shadow: 0 3px 0 0 rgba(0, 0, 0, 0.1) !important;
    }

    .option-item::after {
        height: 3px;
    }

    .option-item:hover {
        box-shadow: 0 5px 0 0 rgba(0, 0, 0, 0.1) !important;
    }

    .option-item:hover::after {
        height: 5px;
    }

    .option-text {
        font-size: 0.95rem;
    }

    .modal-content {
        padding: 40px 24px;
        width: 95%;
        max-width: 400px;
        box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.15);
    }

    .modal-content::after {
        height: 6px;
    }

    .result-title .text-h4 {
        font-size: 1.75rem;
    }

    .score-percentage .text-h3 {
        font-size: 2.5rem;
    }

    .brief-feedback.text-body1 {
        font-size: 1rem;
    }
}

@media (max-height: 600px) {
    .modal-content {
        padding: 30px 24px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .result-icon {
        margin-bottom: 20px;
    }

    .result-title {
        margin-bottom: 20px;
    }

    .score-percentage {
        margin-bottom: 25px;
    }

    .brief-feedback {
        margin-bottom: 30px;
    }
}

/* Animation for correct/incorrect answers */
@keyframes bounce {

    0%,
    20%,
    60%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-3px);
    }

    80% {
        transform: translateY(-1px);
    }
}

.option-item.correct {
    animation: bounce 0.5s ease;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px);
    }
}

.option-item.incorrect {
    animation: shake 0.5s ease;
}

/* Dialog backdrop blur */
:deep(.q-dialog__backdrop) {
    backdrop-filter: blur(8px);
}

/* Center the dialog content */
:deep(.q-dialog__inner) {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 0 !important;
}
</style>