<template>
    <q-layout view="hHh LpR fFf">
        <!-- Clean Header (simplified) -->
        <q-header class="bg-white text-dark">
            <q-toolbar class="q-px-md">
                <q-btn flat dense round icon="arrow_back" @click="goBack" aria-label="Back" class="text-dark back-btn"
                    size="md" />

                <div class="text-h6 text-weight-bold text-primary q-ml-md">
                    Mini Test 10-5
                </div>

                <!-- Right side intentionally left empty -->
                <q-space />
                <div></div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page class="q-pa-md">
                <!-- Instructions -->
                <div class="instructions-card q-mb-lg">
                    <div class="instructions-header">
                        <div class="flex items-center q-mb-sm">
                            <div class="instruction-icon-container">
                                <img src="assets/icons/question.png" alt="Instruction Icon" class="instruction-icon" />
                            </div>
                            <div class="text-h6 text-weight-bold text-white instruction-title">
                                Instructions
                            </div>
                        </div>
                        <div class="instruction-text">
                            <span class="text-weight-medium">Drag and drop</span> the keywords below to complete the
                            earthquake safety paragraph.
                        </div>
                    </div>
                </div>

                <!-- Keywords Container (Fixed Position) -->
                <div class="keywords-container fixed-section">
                    <div class="text-subtitle2 text-weight-bold q-mb-sm">
                        Drag these keywords:
                    </div>
                    <div class="keywords-grid">
                        <div v-for="(keyword, index) in keywords" :key="index" class="keyword-item"
                            :class="{ 'used': keyword.used }" draggable="true" @dragstart="dragStart($event, keyword)"
                            @dragend="dragEnd">
                            {{ keyword.text }}
                        </div>
                    </div>
                </div>

                <!-- Paragraph Container -->
                <div class="paragraph-container q-mt-lg">
                    <div class="text-subtitle2 text-weight-bold q-mb-md">
                        Complete the safety paragraph:
                    </div>

                    <div class="safety-paragraph">
                        <p>To keep safe from earthquakes, preparation is key. First, create an emergency
                            <span class="blank" @dragover.prevent @dragenter.prevent
                                @drop="dropWord($event, 'emergencyKit')">
                                {{ blanks.emergencyKit || '________' }}
                            </span> with supplies. At home,
                            <span class="blank" @dragover.prevent @dragenter.prevent
                                @drop="dropWord($event, 'furniture')">
                                {{ blanks.furniture || '________' }}
                            </span> heavy furniture to walls. During shaking,
                            <span class="blank" @dragover.prevent @dragenter.prevent @drop="dropWord($event, 'duck')">
                                {{ blanks.duck || '________' }}
                            </span> under a sturdy table. Afterward, check for
                            <span class="blank" @dragover.prevent @dragenter.prevent
                                @drop="dropWord($event, 'gasLeaks')">
                                {{ blanks.gasLeaks || '________' }}
                            </span> and help others.
                        </p>

                        <p>Always stay
                            <span class="blank" @dragover.prevent @dragenter.prevent @drop="dropWord($event, 'calm')">
                                {{ blanks.calm || '________' }}
                            </span> and avoid
                            <span class="blank" @dragover.prevent @dragenter.prevent
                                @drop="dropWord($event, 'elevators')">
                                {{ blanks.elevators || '________' }}
                            </span>. Practice
                            <span class="blank" @dragover.prevent @dragenter.prevent @drop="dropWord($event, 'drills')">
                                {{ blanks.drills || '________' }}
                            </span> regularly and keep
                            <span class="blank" @dragover.prevent @dragenter.prevent
                                @drop="dropWord($event, 'contactInfo')">
                                {{ blanks.contactInfo || '________' }}
                            </span> updated.
                        </p>
                    </div>
                </div>

                <!-- Reset and Submit Buttons -->
                <div class="action-buttons q-mt-sm">
                    <q-btn label="Reset All" @click="resetQuiz" class="reset-btn" outline color="primary" icon="refresh"
                        size="md" />

                    <q-btn :label="submitButtonLabel" @click="handleSubmitAction" class="full-width submit-btn"
                        :color="submitButtonColor" :disabled="!allFilled" :loading="checking" icon="check_circle"
                        size="lg" />
                </div>
            </q-page>
        </q-page-container>

        <!-- Results Modal (updated to match unified design) -->
        <q-dialog v-model="showResultsModal" seamless>
            <q-card class="white-modal minimal-modal">
                <q-card-section class="modal-header text-center q-pa-md">
                    <!-- Updated result icon using computed property -->
                    <div class="result-icon q-mb-sm">
                        <q-icon :name="resultIcon.name" size="48px" :color="resultIcon.color" />
                    </div>

                    <!-- Updated title using unified scoring -->
                    <div class="result-title q-mb-sm">
                        <div class="text-h6 text-weight-bold" :class="scoreTitleClass">
                            {{ scoreTitle }}
                        </div>
                        <div class="text-body2 text-grey-7">
                            {{ score }}/{{ config.totalItems }} Correct
                        </div>
                        <div class="text-caption text-grey-6">
                            Score: {{ score }}/{{ config.totalItems }}
                        </div>
                    </div>

                    <!-- Updated percentage display -->
                    <div class="score-percentage q-mb-md">
                        <div class="text-h5 text-weight-bold" :class="scorePercentageClass">
                            {{ scorePercentage }}%
                        </div>
                    </div>

                    <!-- Updated feedback using computed property -->
                    <div class="brief-feedback text-caption text-grey-8 q-mb-sm">
                        {{ briefFeedback }}
                    </div>
                </q-card-section>

                <q-card-actions class="modal-actions q-px-md q-pb-md">
                    <!-- Updated action button using computed property -->
                    <q-btn :label="actionButton.label" :color="actionButton.color" @click="handleModalAction"
                        class="full-width action-btn" unelevated size="md" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-layout>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { LocalStorage } from 'quasar'
import { getCurrentUser, setCurrentUser } from 'src/utils/session'

// Configuration for this quiz - consistent with the first example
const config = {
    quizName: 'Mini Test 10-5',
    type: 'mini_test',  // Added type to match first example
    totalItems: 8,      // 8 fill-in-the-blank items
    chapter: 10,        // Changed from unit to chapter to match first example
    lesson: 3           // Updated to match the quiz number
}

// Drag and drop data
const draggedKeyword = ref(null)
const blanks = ref({
    emergencyKit: '',
    furniture: '',
    duck: '',
    gasLeaks: '',
    calm: '',
    elevators: '',
    drills: '',
    contactInfo: ''
})

// Keywords with correct answers mapping (will be randomized on mount)
const initialKeywords = [
    { text: 'kit', correctFor: 'emergencyKit', used: false },
    { text: 'strap', correctFor: 'furniture', used: false },
    { text: 'duck', correctFor: 'duck', used: false },
    { text: 'gas leaks', correctFor: 'gasLeaks', used: false },
    { text: 'calm', correctFor: 'calm', used: false },
    { text: 'elevators', correctFor: 'elevators', used: false },
    { text: 'drills', correctFor: 'drills', used: false },
    { text: 'contact information', correctFor: 'contactInfo', used: false }
]

const keywords = ref([])

// Quiz state
const showResultsModal = ref(false)
const correctCount = ref(0)
const showResults = ref(false)
const checking = ref(false) // Added for consistency

// DRY Scoring logic - exactly the same as first example
const getScoreTier = (value, total) => {
    if (value === total) return 'perfect'
    if (value >= Math.ceil(total * 0.8)) return 'excellent' // 80% or above
    if (value >= Math.ceil(total * 0.6)) return 'good'      // 60% or above
    return 'tryAgain'
}

// Quiz saving function - updated to match first example exactly
const saveQuizResult = (score) => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    // Ensure containers exist (matching first example)
    if (!currentUser.quizzes) currentUser.quizzes = {}
    if (!currentUser.progress) currentUser.progress = {}

    // Save quiz result (numeric fields) - matching first example format
    currentUser.quizzes[config.quizName] = {
        type: config.type,
        score: score,                 // correct answers
        total: config.totalItems,     // total questions
        chapter: config.chapter,
        lesson: config.lesson
    }

    // Optional progress mirror - matching first example
    currentUser.progress[config.quizName] = {
        type: config.type,
        correct: score,
        total: config.totalItems,
        wrong: config.totalItems - score
    }

    // Persist current user
    setCurrentUser(currentUser)

    // Sync to students list - matching first example
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
        sessionStorage.setItem("requestedSlide", "slide10")
    } catch {
        // ignore
    }
    history.back()
}

// Computed properties
const allFilled = computed(() => {
    return Object.values(blanks.value).every(blank => blank.trim() !== '')
})

const score = computed(() => {
    return correctCount.value
})

const scorePercentage = computed(() => {
    return Math.round((score.value / config.totalItems) * 100)
})

// Using the same getScoreTier function
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
        perfect: 'Perfect! You know earthquake safety procedures.',
        excellent: 'Excellent understanding of earthquake safety!',
        good: 'Good understanding of safety concepts, keep practicing!',
        tryAgain: 'Review earthquake safety procedures. Try again to improve your score!'
    }
    return feedback[tier]
})

// Result icon - DRY approach matching first example
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

// Action button - DRY approach matching first example
const actionButton = computed(() => {
    const tier = getScoreTier(score.value, config.totalItems)
    const buttons = {
        perfect: {
            label: 'Continue',
            color: 'positive',
            action: handleContinue
        },
        excellent: {
            label: 'Continue',
            color: 'positive',
            action: handleContinue
        },
        good: {
            label: 'Try Again',
            color: 'primary',
            action: handleRetry
        },
        tryAgain: {
            label: 'Try Again',
            color: 'primary',
            action: handleRetry
        }
    }
    return buttons[tier]
})

const submitButtonColor = computed(() => {
    if (!allFilled.value) return 'primary'
    return showResults.value ? actionButton.value.color : 'positive'
})

const submitButtonLabel = computed(() => {
    if (!allFilled.value) return 'Check Answers'
    return showResults.value ? actionButton.value.label : 'Check Answers'
})

// Methods
const handleContinue = () => {
    showResultsModal.value = false
    goBack()
}

const handleRetry = () => {
    resetQuiz()
}

// Drag and drop methods
const dragStart = (event, keyword) => {
    draggedKeyword.value = keyword
    event.dataTransfer.setData('text/plain', keyword.text)
    event.dataTransfer.effectAllowed = 'move'
}

const dragEnd = () => {
    draggedKeyword.value = null
}

const dropWord = (event, blankId) => {
    event.preventDefault()

    if (draggedKeyword.value) {
        // Clear previous usage of this keyword
        Object.keys(blanks.value).forEach(key => {
            if (blanks.value[key] === draggedKeyword.value.text) {
                // Mark the keyword as not used
                const prevKeyword = keywords.value.find(k => k.text === draggedKeyword.value.text)
                if (prevKeyword) prevKeyword.used = false
                blanks.value[key] = ''
            }
        })

        // Set new blank
        blanks.value[blankId] = draggedKeyword.value.text
        draggedKeyword.value.used = true
    }
}

// Quiz methods
const checkAnswers = () => {
    if (!allFilled.value) return

    checking.value = true

    correctCount.value = 0

    Object.keys(blanks.value).forEach(blankId => {
        const keyword = keywords.value.find(k => k.correctFor === blankId)
        if (keyword && blanks.value[blankId] === keyword.text) {
            correctCount.value++
        }
    })

    // Save quiz result
    saveQuizResult(correctCount.value)

    setTimeout(() => {
        checking.value = false
        showResults.value = true
        showResultsModal.value = true
    }, 500)
}

const resetQuiz = () => {
    // Reset all blanks
    Object.keys(blanks.value).forEach(key => {
        blanks.value[key] = ''
    })

    // Reset keyword usage
    keywords.value.forEach(keyword => {
        keyword.used = false
    })

    // Reset results
    correctCount.value = 0
    showResults.value = false
    showResultsModal.value = false

    // Re-randomize keywords order
    keywords.value = [...keywords.value].sort(() => Math.random() - 0.5)
}

const handleSubmitAction = () => {
    if (!allFilled.value) return

    if (showResults.value) {
        // If results are shown, handle continue/retry
        actionButton.value.action()
    } else {
        // First time checking answers
        checkAnswers()
    }
}

const handleModalAction = () => {
    actionButton.value.action()
    showResultsModal.value = false
}

// Randomize keywords order on component mount
onMounted(() => {
    keywords.value = [...initialKeywords].sort(() => Math.random() - 0.5)
})
</script>
<style scoped>
/* Clean Header */
.q-header {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 56px;
}

.q-toolbar {
    min-height: 56px;
    padding: 0 16px;
}

.back-btn {
    width: 40px;
    height: 40px;
}

.back-btn .q-icon {
    font-size: 24px;
}

.back-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

/* Instructions Card */
.instructions-card {
    background: linear-gradient(135deg, #30eb68, #1bc452);
    border-radius: 16px;
    padding: 20px;
    border-bottom: 4px solid #22743a;
    margin-top: 8px;
    box-shadow: 0 4px 12px rgba(48, 235, 104, 0.2);
}

.instructions-header {
    display: block;
}

.flex.items-center {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.instruction-icon-container {
    flex-shrink: 0;
    margin-right: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.instruction-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
}

.instruction-title {
    line-height: 1;
    font-size: 1.25rem;
}

.instruction-text {
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.95);
    padding-left: 0;
}

/* Fixed Keywords Container */
.fixed-section {
    position: sticky;
    top: 80px;
    z-index: 10;
    background: white;
    border-radius: 12px;
    padding: 16px;
    border: 2px solid #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
}

.keywords-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.keyword-item {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: grab;
    user-select: none;
    transition: all 0.2s ease;
    border-bottom: 3px solid #0d47a1;
    white-space: nowrap;
    min-width: fit-content;
}

.keyword-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.keyword-item:active {
    cursor: grabbing;
    transform: translateY(0);
}

.keyword-item.used {
    background: linear-gradient(135deg, #9e9e9e, #757575);
    border-bottom-color: #424242;
    cursor: not-allowed;
    opacity: 0.6;
}

/* Paragraph Container */
.paragraph-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    border: 2px solid #e0e0e0;
}

.safety-paragraph {
    font-size: 1rem;
    line-height: 2.4 !important;
    color: #333;
}

.safety-paragraph p {
    margin-bottom: 1.5em;
    line-height: inherit;
}

.blank {
    display: inline-block;
    min-width: 80px;
    padding: 3px 6px;
    margin: 0 6px;
    background: #f5f5f5;
    border: 2px dashed #bbb;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 28px;
    vertical-align: middle;
    line-height: 1.4;
}

.blank:hover {
    background: #e3f2fd;
    border-color: #2196f3;
}

.blank:empty::after {
    content: '________';
    color: #999;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 0 10px 0;
    margin-bottom: 0;
}

.reset-btn {
    align-self: center;
    height: 48px;
    border-radius: 10px;
    font-weight: 600;
    text-transform: none;
    max-width: 200px;
    border-bottom: 3px solid #1565c0;
}

.submit-btn {
    height: 52px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    font-size: 1rem;
    border-bottom: 4px solid;
    margin-bottom: 0;
}

.submit-btn.bg-primary {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    border-bottom-color: #0d47a1;
}

.submit-btn.bg-positive {
    background: linear-gradient(135deg, #4CAF50, #388E3C);
    border-bottom-color: #1B5E20;
}

.submit-btn.bg-warning {
    background: linear-gradient(135deg, #FF9800, #F57C00);
    border-bottom-color: #E65100;
}

.submit-btn:disabled {
    opacity: 0.6;
    background: #cbd5e0 !important;
    border-bottom-color: #a0aec0 !important;
    cursor: not-allowed;
}

/* White Results Modal */
.white-modal {
    background: white !important;
}

.minimal-modal {
    border-radius: 20px;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    border: 1px solid #e0e0e0;
}

.modal-header {
    padding: 32px 24px 24px;
    background: white !important;
    border-bottom: 1px solid #e0e0e0;
}

.result-icon {
    margin-bottom: 16px;
}

.result-title {
    margin-bottom: 20px;
}

.score-percentage {
    margin-bottom: 20px;
}

.brief-feedback {
    line-height: 1.6;
    font-size: 0.9rem;
    color: #4a5568;
}

.modal-actions {
    padding: 0 24px 24px;
    background: white;
}

.action-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: none;
    border-bottom: 3px solid;
    transition: all 0.2s ease;
    font-size: 1rem;
}

.action-btn.bg-primary {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    border-bottom-color: #0d47a1;
}

.action-btn.bg-positive {
    background: linear-gradient(135deg, #4CAF50, #388E3C);
    border-bottom-color: #1B5E20;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mobile Optimizations */
@media (max-width: 600px) {
    .q-page {
        padding: 16px;
    }

    .q-header {
        height: 52px;
    }

    .q-toolbar {
        min-height: 52px;
        padding: 0 12px;
    }

    .back-btn {
        width: 36px;
        height: 36px;
    }

    .instructions-card {
        padding: 16px;
        border-radius: 12px;
    }

    .instruction-icon {
        width: 20px;
        height: 20px;
    }

    .instruction-icon-container {
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }

    .instruction-title {
        font-size: 1.1rem;
    }

    .instruction-text {
        font-size: 0.9rem;
    }

    .fixed-section {
        padding: 12px;
        top: 70px;
    }

    .keywords-grid {
        gap: 8px;
    }

    .keyword-item {
        padding: 6px 10px;
        font-size: 0.85rem;
    }

    .paragraph-container {
        padding: 16px;
    }

    .safety-paragraph {
        font-size: 0.95rem;
        line-height: 2.2 !important;
    }

    .safety-paragraph p {
        margin-bottom: 1.2em;
    }

    .blank {
        min-width: 70px;
        padding: 2px 5px;
        font-size: 0.9rem;
        min-height: 26px;
        margin: 0 5px;
    }

    .reset-btn {
        max-width: 180px;
        height: 44px;
    }

    .submit-btn {
        height: 48px;
        font-size: 0.95rem;
    }

    .action-buttons {
        padding: 16px 0 8px 0;
        gap: 14px;
    }

    .minimal-modal {
        max-width: 280px;
        border-radius: 16px;
    }

    .modal-header {
        padding: 24px 20px 20px;
    }
}

/* Extra small mobile devices */
@media (max-width: 400px) {
    .q-toolbar {
        padding: 0 8px;
    }

    .back-btn {
        width: 32px;
        height: 32px;
    }

    .back-btn .q-icon {
        font-size: 20px;
    }

    .instruction-icon-container {
        width: 32px;
        height: 32px;
        margin-right: 8px;
    }

    .instruction-icon {
        width: 18px;
        height: 18px;
    }

    .instruction-title {
        font-size: 1rem;
    }

    .instruction-text {
        font-size: 0.85rem;
    }

    .keywords-grid {
        justify-content: center;
    }

    .keyword-item {
        padding: 5px 8px;
        font-size: 0.8rem;
    }

    .blank {
        min-width: 60px;
        font-size: 0.85rem;
        min-height: 24px;
        margin: 0 4px;
    }

    .action-buttons {
        padding: 12px 0 6px 0;
        gap: 12px;
    }

    .safety-paragraph {
        line-height: 2.0 !important;
    }

    .safety-paragraph p {
        margin-bottom: 1em;
    }

    .minimal-modal {
        max-width: 260px;
    }
}

/* Tablet and larger */
@media (min-width: 768px) {
    .action-buttons {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .reset-btn {
        max-width: 200px;
    }

    .submit-btn {
        max-width: 300px;
    }
}

/* Ensure proper scrolling */
.q-page {
    padding-bottom: 30px;
}
</style>