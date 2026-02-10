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
                    Mini Lab 2-1
                </div>

                <!-- Question counter -->
                <q-space />
                <div class="text-subtitle1 text-weight-medium text-grey-8">
                    Question {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}
                </div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
        </q-header>

        <!-- Main Content -->
        <q-page-container>
            <q-page class="q-pa-md" style="background-color: #f8f9fa;">
                <!-- Instructions - Only on first question -->
                <div v-if="currentQuestionIndex === 0" class="instructions-card q-mb-lg cartoon-card">
                    <div class="instructions-header">
                        <!-- Icon and heading inline -->
                        <div class="flex items-center q-mb-sm">
                            <div class="instruction-icon-container">
                                <q-icon name="help" size="28px" color="white" />
                            </div>
                            <div class="text-h6 text-weight-bold text-white instruction-title">
                                Instructions
                            </div>
                        </div>

                        <!-- Instruction text below -->
                        <div class="instruction-text">
                            Select the correct answer for each question.
                            <span class="text-weight-medium">Only one answer is correct per question.</span>
                            Click on your choice to select it.
                        </div>
                    </div>
                </div>

                <!-- Questions Section - Single Question Display -->
                <div class="section">
                    <div class="section-title q-mb-md">
                        <div class="text-subtitle1 text-weight-bold" style="color: #333;">
                            Multiple Choice Questions
                        </div>
                        <div class="text-caption" style="color: #666;">
                            Select one answer per question
                        </div>
                    </div>

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
                            <!-- Previous Button - Always visible but disabled on first question -->
                            <q-btn label="Previous" @click="goToPreviousQuestion" class="nav-btn cartoon-btn"
                                color="primary" outline :disabled="currentQuestionIndex === 0 || checking" />

                            <!-- Next/Check Answers Button -->
                            <q-btn :label="nextButtonLabel" @click="handleNextOrCheck" class="nav-btn cartoon-btn"
                                :color="nextButtonColor" :disabled="checking" />
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
                        <q-icon :name="resultIcon.name" size="64px" :color="resultIcon.color" />
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
                        <q-btn :label="actionButton.label" :color="actionButton.color" @click="actionButton.action"
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
    quizName: 'Mini Lab 2-2',
    type: 'mini_lab',
    totalItems: 3,
    chapter: 2,
    lesson: 1
}

// Questions data
const questions = ref([
    {
        id: 'q1',
        question: 'When you tilt the wax paper so the water droplet moves across it, does the drop of water break?',
        options: [
            { id: 'a', text: 'Yes, it breaks into many small droplets as it moves' },
            { id: 'b', text: 'No, it stays together as one droplet without breaking' },
            { id: 'c', text: 'Yes, but only when tilted very quickly' },
            { id: 'd', text: 'No, but it flattens out completely' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q2',
        question: 'Using a toothpick, is it easy to break the water droplet into two?',
        options: [
            { id: 'a', text: 'Yes, it separates easily with a gentle touch' },
            { id: 'b', text: 'No, you need to apply force because the water wants to stay together' },
            { id: 'c', text: 'Yes, but the two droplets immediately rejoin' },
            { id: 'd', text: 'No, the toothpick cannot break the water at all' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q3',
        question: 'When you bring the two broken droplets near each other, how do they behave?',
        options: [
            { id: 'a', text: 'They push each other apart and move away' },
            { id: 'b', text: 'They immediately combine back into one droplet' },
            { id: 'c', text: 'They stay as separate droplets without interacting' },
            { id: 'd', text: 'They form a bridge between them but remain separate' }
        ],
        correctAnswer: 'b'
    }
])
// Current question index
const currentQuestionIndex = ref(0)

// Dynamically initialize selected answers based on questions
const initializeSelectedAnswers = () => {
    const answers = {}
    questions.value.forEach(question => {
        answers[question.id] = null
    })
    return answers
}

const selectedAnswers = ref(initializeSelectedAnswers())

const showResults = ref(false)
const showResultsModal = ref(false)
const checking = ref(false)

// Computed properties
const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value]
})

const totalQuestions = computed(() => questions.value.length)

const isLastQuestion = computed(() => {
    return currentQuestionIndex.value === totalQuestions.value - 1
})

const isCurrentQuestionAnswered = computed(() => {
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

// DRY Scoring logic - automatically adjusts based on totalItems
const getScoreTier = (value, total) => {
    if (value === total) return 'perfect'
    if (value >= Math.ceil(total * 0.8)) return 'excellent' // 80% or above
    if (value >= Math.ceil(total * 0.6)) return 'good'      // 60% or above
    return 'tryAgain'
}

const scoreTitle = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const titles = {
        perfect: 'Perfect Score!',
        excellent: 'Excellent!',
        good: 'Good Job!',
        tryAgain: 'Try Again'
    }
    return titles[tier]
})

const scoreTitleClass = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const classes = {
        perfect: 'text-positive',
        excellent: 'text-primary',
        good: 'text-warning',
        tryAgain: 'text-negative'
    }
    return classes[tier]
})

const scorePercentageClass = computed(() => {
    if (scorePercentage.value >= 90) return 'text-positive'
    if (scorePercentage.value >= 70) return 'text-primary'
    if (scorePercentage.value >= 50) return 'text-warning'
    return 'text-negative'
})

const briefFeedback = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const feedback = {
        perfect: 'Excellent! You have mastered all the concepts!',
        excellent: 'Great understanding of the material!',
        good: 'Good understanding, keep practicing!',
        tryAgain: 'Review the concepts and try again to improve your score!'
    }
    return feedback[tier]
})

// Result icon - DRY approach
const resultIcon = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const icons = {
        perfect: { name: 'emoji_events', color: 'amber-7' },
        excellent: { name: 'check_circle', color: 'positive' },
        good: { name: 'check_circle', color: 'positive' },
        tryAgain: { name: 'refresh', color: 'warning' }
    }
    return icons[tier]
})

// Action button - DRY approach
const actionButton = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const buttons = {
        perfect: {
            label: 'Continue',
            color: 'positive',
            action: continueToNext
        },
        excellent: {
            label: 'Continue',
            color: 'positive',
            action: continueToNext
        },
        good: {
            label: 'Try Again',
            color: 'primary',
            action: closeResultsModal
        },
        tryAgain: {
            label: 'Try Again',
            color: 'primary',
            action: closeResultsModal
        }
    }
    return buttons[tier]
})

// Next button label based on state
const nextButtonLabel = computed(() => {
    if (isLastQuestion.value && allAnswered.value) {
        return 'Check Answers'
    }
    return 'Next'
})

// Next button color based on state
const nextButtonColor = computed(() => {
    if (isLastQuestion.value && allAnswered.value) {
        return 'positive'
    }
    return 'primary'
})

// Quiz saving function
const saveQuizResult = (score) => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    // Ensure containers exist
    if (!currentUser.quizzes) currentUser.quizzes = {}
    if (!currentUser.progress) currentUser.progress = {}

    // Save quiz result (numeric fields)
    currentUser.quizzes[config.quizName] = {
        type: config.type,
        score: score,                 // correct answers
        total: config.totalItems,     // total questions
        chapter: config.chapter,
        lesson: config.lesson
    }

    // Optional progress mirror
    currentUser.progress[config.quizName] = {
        type: config.type,
        correct: score,
        total: config.totalItems,
        wrong: config.totalItems - score
    }

    // Persist current user
    setCurrentUser(currentUser)

    // Sync to students list
    const students = LocalStorage.getItem('students') || []
    const updatedStudents = students.map(student =>
        student.id === currentUser.id
            ? { ...student, quizzes: currentUser.quizzes, progress: currentUser.progress }
            : student
    )
    LocalStorage.set('students', updatedStudents)
}

// Navigation function with session storage
const goBack = () => {
    try {
        sessionStorage.setItem("requestedSlide", "slide11")
    } catch {
        // ignore
    }
    history.back()
}

// Methods
const continueToNext = () => {
    showResultsModal.value = false
    goBack()
}

const selectAnswer = (questionId, answerId) => {
    if (!showResults.value) {
        selectedAnswers.value[questionId] = answerId
    }
}

const goToPreviousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
    }
}

const handleNextOrCheck = () => {
    if (!isCurrentQuestionAnswered.value) {
        // Show notification when trying to proceed without answering
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
        // Move to next question
        currentQuestionIndex.value++
    }
}

const submitAnswers = async () => {
    if (!allAnswered.value) return

    checking.value = true

    // Show results on the page
    showResults.value = true

    // Save quiz result
    saveQuizResult(score.value)

    // Simulate checking delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Show the modal
    showResultsModal.value = true
    checking.value = false
}

const closeResultsModal = () => {
    showResultsModal.value = false

    // Reset for retry
    selectedAnswers.value = initializeSelectedAnswers()
    showResults.value = false
    currentQuestionIndex.value = 0
}

// Initialize on mount
onMounted(() => {
    // Ensure selectedAnswers is properly initialized
    selectedAnswers.value = initializeSelectedAnswers()
})
</script>
<style src="src/css/multiple.css" scoped></style>