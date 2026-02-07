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
                    Mini Test 1-1
                </div>

                <!-- Question counter -->
                <q-space />
                <div class="text-subtitle1 text-weight-medium text-grey-8">
                    Question {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}
                </div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="primary" class="header-progress" />
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
                        <q-icon :name="score === 5 ? 'emoji_events' : (score >= 3 ? 'check_circle' : 'refresh')"
                            size="64px" :color="score === 5 ? 'amber-7' : (score >= 3 ? 'positive' : 'warning')" />
                    </div>

                    <div class="result-title q-mb-md">
                        <div class="text-h4 text-weight-bold" :class="scoreTitleClass">
                            {{ scoreTitle }}
                        </div>
                        <div class="text-h6 q-mt-sm" style="color: #666;">
                            {{ score }}/5 Correct
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
                        <q-btn :label="score === 5 ? 'Continue' : 'Try Again'"
                            :color="score === 5 ? 'positive' : 'primary'"
                            @click="score === 5 ? continueToNext() : closeResultsModal()" class="action-btn cartoon-btn"
                            unelevated size="lg" style="min-width: 200px;" />
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

// Configuration for this quiz - CHANGE THESE VALUES FOR DIFFERENT PAGE
const config = {
    quizName: 'Mini Test 1-1',
    type: 'mini_test',
    totalItems: 3,  // This will now be used everywhere instead of hardcoded 5
    chapter: 1,
    lesson: 1
}

// Questions data - make sure this matches totalItems
const questions = ref([
    {
        id: 'q1',
        question: 'How do physical and conceptual models differ?',
        options: [
            { id: 'a', text: 'Physical models are mathematical, while conceptual models are computer simulations' },
            { id: 'b', text: 'Physical models are tangible 3D objects or scale replicas, while conceptual models use familiar representations to explain abstract ideas' },
            { id: 'c', text: 'Physical models are only used in biology, while conceptual models are used in physics' },
            { id: 'd', text: 'There is no difference - both terms refer to the same type of model' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q2',
        question: 'The Bohr model of the atom describes an atom as consisting of a nucleus at the center around which electrons revolve along specific orbits. A 3D model can be seen in the previous page. What type of model is this?',
        options: [
            { id: 'a', text: 'Computer model' },
            { id: 'b', text: 'Mathematical model' },
            { id: 'c', text: 'Conceptual model' },
            { id: 'd', text: 'Physical model' }
        ],
        correctAnswer: 'd'
    },
    {
        id: 'q3',
        question: 'Meteorologists use and process various complicated atmospheric information to come up with a daily weather forecast. What type of model will they most likely use? Why?',
        options: [
            { id: 'a', text: 'Physical model - because they need tangible objects to understand weather patterns' },
            { id: 'b', text: 'Conceptual model - because weather is an abstract idea that needs simple representation' },
            { id: 'c', text: 'Mathematical model - because they need equations to represent atmospheric relationships' },
            { id: 'd', text: 'Computer model - because they need to process complex data and simulate atmospheric systems' }
        ],
        correctAnswer: 'd'
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

    // Optional: Validate that questions array matches totalItems
    if (questions.value.length !== config.totalItems) {
        console.warn(`Warning: questions array length (${questions.value.length}) doesn't match config.totalItems (${config.totalItems})`)
    }
})
</script>

<style src="src/css/multiple.css" scoped></style>