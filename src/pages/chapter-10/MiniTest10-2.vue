<template>
    <q-layout view="hHh LpR fFf">
        <!-- Clean Header (simplified) -->
        <q-header class="bg-white text-dark">
            <q-toolbar class="q-px-md">
                <q-btn flat dense round icon="arrow_back" @click="goBack" aria-label="Back" class="text-dark back-btn"
                    size="md" />

                <div class="text-h6 text-weight-bold text-primary q-ml-md">
                    Mini Test 10-2
                </div>

                <!-- Right side intentionally left empty -->
                <q-space />
                <div></div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="primary" class="header-progress" />
        </q-header>

        <q-page-container>
            <q-page class="q-pa-md">
                <!-- Title Card -->
                <div class="title-card q-mb-lg">
                    <div class="title-content">
                        <div class="test-title">MINI TEST 10-2</div>
                        <div class="test-subtitle">Fault Type Identification</div>
                        <div class="quiz-meta">
                            Chapter {{ config.chapter }} • Lesson {{ config.lesson }} • {{ config.quizName }}
                        </div>
                    </div>
                </div>

                <!-- Instructions with Question Icon -->
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
                            Match each Philippine fault with its correct fault type.
                            <span class="text-weight-medium">Tap a fault type below, then tap the matching Philippine
                                fault above.</span>
                            Each fault has only one correct match.
                        </div>
                    </div>
                </div>

                <!-- Active Selection -->
                <div v-if="selectedItem" class="selected-item-banner q-mb-md">
                    <div class="selected-content">
                        <div class="flex items-center">
                            <q-icon name="touch_app" color="primary" size="20px" class="q-mr-sm" />
                            <div>
                                <div class="text-caption text-grey-7">Selected:</div>
                                <div class="text-weight-bold text-primary">{{ selectedItem.name }}</div>
                            </div>
                        </div>
                        <q-btn flat dense icon="close" round size="sm" color="grey" @click="clearSelection" />
                    </div>
                </div>

                <!-- Targets Section -->
                <div class="section q-mb-xl">
                    <div class="section-title q-mb-md">
                        <div class="text-subtitle1 text-weight-bold text-primary">
                            Philippine Faults
                        </div>
                        <div class="text-caption text-grey-6">
                            Tap to assign selected fault type
                        </div>
                    </div>

                    <div class="targets-container">
                        <div v-for="target in targets" :key="target.id" class="target-box" :class="{
                            'selected': selectedTarget === target.id,
                            'correct': showResults && target.isCorrect,
                            'incorrect': showResults && target.isDropped && !target.isCorrect
                        }" @click="assignSelectedItem(target.id)">
                            <div class="target-header">
                                <div class="target-label">
                                    <div class="text-weight-bold">{{ target.name }}</div>
                                    <div class="text-caption text-grey-7">{{ target.description }}</div>
                                </div>
                                <div class="target-status">
                                    <!-- Only show status indicators after checking answers -->
                                    <q-icon v-if="showResults && target.isCorrect" name="check" color="positive"
                                        size="16px" />
                                    <q-icon v-else-if="showResults && target.isDropped && !target.isCorrect"
                                        name="close" color="negative" size="16px" />
                                </div>
                            </div>

                            <div class="target-assignment">
                                <div v-if="target.droppedItem" class="assigned-value">
                                    <div class="assigned-text">{{ target.droppedItem }}</div>
                                    <q-btn flat dense icon="close" round size="sm" color="grey-6"
                                        @click.stop="removeItem(target.id)" class="remove-btn" />
                                </div>
                                <div v-else class="assignment-placeholder">
                                    <div class="placeholder-icon">
                                        <q-icon v-if="selectedTarget === target.id" name="touch_app" color="primary"
                                            size="24px" />
                                        <q-icon v-else name="add" color="grey-5" size="24px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Selectable Items -->
                <div class="section">
                    <div class="section-title q-mb-md">
                        <div class="text-subtitle1 text-weight-bold text-primary">
                            Fault Types
                        </div>
                        <div class="text-caption text-grey-6">
                            Tap to select
                        </div>
                    </div>

                    <div class="selectables-container">
                        <div v-for="item in selectableItems" :key="item.id" class="selectable-box" :class="{
                            'selected': selectedItem?.id === item.id,
                            'assigned': item.isDropped,
                            'correct': showResults && item.isCorrectlyPlaced
                        }" @click="selectItem(item)">
                            <div class="selectable-content">
                                <div class="flex items-start">
                                    <div class="item-icon q-mr-sm">
                                        <q-icon :name="getItemIcon(item)" size="18px" />
                                    </div>
                                    <div class="item-details">
                                        <div class="text-weight-bold">{{ item.name }}</div>
                                        <div class="text-caption text-grey-7">{{ item.description }}</div>
                                    </div>
                                </div>
                                <!-- Only show status indicators after checking answers -->
                                <div v-if="showResults && item.isDropped" class="item-status">
                                    <q-icon :name="item.isCorrectlyPlaced ? 'check' : 'close'"
                                        :color="item.isCorrectlyPlaced ? 'positive' : 'negative'" size="16px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="submit-section q-mt-xl">
                    <q-btn :label="submitButtonLabel" @click="showResults ? actionButton.action() : checkAnswers()"
                        class="full-width submit-btn" size="lg" :color="submitButtonColor" :loading="checking"
                        :disable="!allItemsPlaced" />

                    <div v-if="!allItemsPlaced" class="text-caption text-warning q-mt-xs text-center">
                        Assign all 3 fault types to continue
                    </div>
                </div>
            </q-page>
        </q-page-container>

        <!-- Results Modal (updated to match first example's design) -->
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
    quizName: 'Mini Test 10-3',
    type: 'mini_test',  // Added type to match first example
    totalItems: 3,      // 3 matches to make
    chapter: 10,        // Changed from unit to chapter to match first example
    lesson: 1           // Changed from 1 to 2 to differentiate from first example
}

const targets = ref([
    {
        id: 'guinayangan',
        name: 'Guinayangan Fault',
        description: 'Luzon island',
        correctFault: 'Normal Fault',
        droppedItem: null,
        isDropped: false,
        isCorrect: false
    },
    {
        id: 'bohol',
        name: 'Bohol Fault',
        description: 'Central Visayas',
        correctFault: 'Reverse Fault',
        droppedItem: null,
        isDropped: false,
        isCorrect: false
    },
    {
        id: 'philippine',
        name: 'Philippine Fault',
        description: 'Major fault system',
        correctFault: 'Strike-Slip Fault',
        droppedItem: null,
        isDropped: false,
        isCorrect: false
    }
])

const selectableItems = ref([
    {
        id: 'normal',
        name: 'Normal Fault',
        description: 'Tensional forces',
        isDropped: false,
        isCorrectlyPlaced: false,
        icon: 'arrow_downward'
    },
    {
        id: 'reverse',
        name: 'Reverse Fault',
        description: 'Compressional forces',
        isDropped: false,
        isCorrectlyPlaced: false,
        icon: 'arrow_upward'
    },
    {
        id: 'strike-slip',
        name: 'Strike-Slip Fault',
        description: 'Shear forces',
        isDropped: false,
        isCorrectlyPlaced: false,
        icon: 'swap_horiz'
    },
    {
        id: 'masbate',
        name: 'Masbate Fault',
        description: 'Normal fault in system',
        isDropped: false,
        isCorrectlyPlaced: false,
        icon: 'arrow_downward'
    },
    {
        id: 'leyte',
        name: 'Central Leyte Fault',
        description: 'Normal fault in Visayas',
        isDropped: false,
        isCorrectlyPlaced: false,
        icon: 'arrow_downward'
    }
])

const showResultsModal = ref(false)
const showResults = ref(false)
const checking = ref(false)
const correctMatches = ref(0)
const selectedItem = ref(null)
const selectedTarget = ref(null)

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

// Computed properties
const allItemsPlaced = computed(() => {
    return targets.value.every(target => target.droppedItem !== null)
})

const score = computed(() => {
    return correctMatches.value
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
        perfect: 'Perfect matching! You understand Philippine fault types.',
        excellent: 'Great understanding of Philippine fault types!',
        good: 'Good understanding of fault types, keep practicing!',
        tryAgain: 'Review the Philippine faults and their characteristics. Try again to improve your score!'
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
    if (!allItemsPlaced.value) return 'primary'
    return showResults.value ? actionButton.value.color : 'positive'
})

const submitButtonLabel = computed(() => {
    if (!allItemsPlaced.value) return 'Check Matches'
    return showResults.value ? actionButton.value.label : 'Check Matches'
})

// Navigation function - updated to match first example
const goBack = () => {
    try {
        sessionStorage.setItem("requestedSlide", "slide10")
    } catch {
        // ignore
    }
    history.back()
}

// Methods
const handleContinue = () => {
    showResultsModal.value = false
    goBack()
}

const handleRetry = () => {
    resetForRetry()
}

const selectItem = (item) => {
    if (item.isDropped) return
    selectedItem.value = item
    selectedTarget.value = null
}

const clearSelection = () => {
    selectedItem.value = null
    selectedTarget.value = null
}

const assignSelectedItem = (targetId) => {
    if (!selectedItem.value) {
        selectedTarget.value = targetId
        return
    }

    const target = targets.value.find(t => t.id === targetId)
    const item = selectedItem.value

    // Remove from previous target
    targets.value.forEach(t => {
        if (t.droppedItem === item.name) {
            t.droppedItem = null
            t.isDropped = false
            t.isCorrect = false
        }
    })

    // Remove item status
    selectableItems.value.forEach(i => {
        if (i.name === item.name) {
            i.isDropped = false
            i.isCorrectlyPlaced = false
        }
    })

    // Assign to new target
    target.droppedItem = item.name
    target.isDropped = true
    target.isCorrect = item.name === target.correctFault

    // Update item
    item.isDropped = true
    item.isCorrectlyPlaced = item.name === target.correctFault

    // Clear selection
    clearSelection()
}

const removeItem = (targetId) => {
    const target = targets.value.find(t => t.id === targetId)
    if (!target.droppedItem) return

    const itemName = target.droppedItem
    const item = selectableItems.value.find(i => i.name === itemName)

    if (item) {
        item.isDropped = false
        item.isCorrectlyPlaced = false
    }

    target.droppedItem = null
    target.isDropped = false
    target.isCorrect = false
}

const getItemIcon = (item) => {
    return item.icon || 'terrain'
}

const checkAnswers = () => {
    if (!allItemsPlaced.value) return

    checking.value = true

    // Calculate correct matches
    correctMatches.value = targets.value.filter(target => target.isCorrect).length

    // Save quiz result
    saveQuizResult(correctMatches.value)

    setTimeout(() => {
        checking.value = false
        showResults.value = true
        showResultsModal.value = true
    }, 500)
}

const handleModalAction = () => {
    actionButton.value.action()
    showResultsModal.value = false
}

const resetForRetry = () => {
    // Reset all targets
    targets.value.forEach(target => {
        target.droppedItem = null
        target.isDropped = false
        target.isCorrect = false
    })

    // Reset all selectable items
    selectableItems.value.forEach(item => {
        item.isDropped = false
        item.isCorrectlyPlaced = false
    })

    // Reset UI state
    clearSelection()
    showResults.value = false
    correctMatches.value = 0
    showResultsModal.value = false

    // Re-shuffle items
    selectableItems.value.sort(() => Math.random() - 0.5)
}

// Initialize
onMounted(() => {
    selectableItems.value.sort(() => Math.random() - 0.5)
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

/* Title Card */
.title-card {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    border-radius: 12px;
    padding: 20px;
    color: white;
    text-align: center;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    margin-top: 8px;
}

.test-title {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
}

.test-subtitle {
    font-size: 1rem;
    opacity: 0.9;
    font-weight: 500;
    margin-bottom: 4px;
}

.quiz-meta {
    font-size: 0.8rem;
    opacity: 0.85;
    font-weight: 400;
    background: rgba(255, 255, 255, 0.15);
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    margin-top: 8px;
}

/* Instructions Card - Updated style with question icon */
.instructions-card {
    background: linear-gradient(135deg, #30eb68, #1bc452);
    border-radius: 16px;
    padding: 20px;
    border-bottom: 4px solid #22743a;
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
}

/* Clean minimal layout */
.q-page {
    background: #f8f9fa;
}

/* Selected Item Banner */
.selected-item-banner {
    background: #e3f2fd;
    border-radius: 8px;
    padding: 12px 16px;
    border-left: 4px solid #2196f3;
    animation: slideDown 0.2s ease;
}

.selected-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Section Styling */
.section {
    margin-bottom: 32px;
}

.section-title {
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
}

/* Targets Container */
.targets-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.target-box {
    background: white;
    border-radius: 12px;
    padding: 20px;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
    cursor: pointer;
}

.target-box:hover {
    border-color: #bbdefb;
}

.target-box.selected {
    border-color: #2196f3;
    background: #e3f2fd;
}

/* Only apply correct/incorrect styles when showResults is true */
.target-box.correct {
    border-color: #4caf50;
    background: #f1f8e9;
}

.target-box.incorrect {
    border-color: #f44336;
    background: #ffebee;
}

.target-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.target-label {
    flex: 1;
}

/* Target Assignment Area */
.target-assignment {
    min-height: 56px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    position: relative;
    display: flex;
    align-items: center;
}

/* Assigned Value with Remove Button */
.assigned-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 16px;
}

.assigned-text {
    font-weight: 600;
    color: #1565c0;
    font-size: 1rem;
    flex: 1;
}

.remove-btn {
    margin-left: 8px;
}

/* Assignment Placeholder */
.assignment-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.placeholder-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
}

/* Selectables Container */
.selectables-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.selectable-box {
    background: white;
    border-radius: 8px;
    padding: 16px;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
    cursor: pointer;
}

.selectable-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selectable-box.selected {
    border-color: #2196f3;
    background: #e3f2fd;
}

.selectable-box.assigned {
    opacity: 0.6;
    border-color: #bdbdbd;
}

/* Only apply correct styles when showResults is true */
.selectable-box.correct {
    border-color: #4caf50;
    background: #f1f8e9;
}

.selectable-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.item-icon {
    margin-top: 2px;
}

.item-details {
    flex: 1;
}

/* Submit Button */
.submit-btn {
    height: 52px;
    font-weight: 600;
    border-radius: 12px;
    text-transform: none;
    font-size: 1rem;
    border-bottom: 4px solid;
}

.submit-btn.bg-primary {
    border-bottom-color: #1565c0;
}

.submit-btn.bg-positive {
    border-bottom-color: #2e7d32;
}

.submit-btn.bg-warning {
    border-bottom-color: #ef6c00;
}

.submit-btn:disabled {
    opacity: 0.6;
    background-color: #bdbdbd;
    border-bottom-color: #9e9e9e;
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
    background: linear-gradient(135deg, #4299e1, #3182ce);
    border-bottom-color: #2b6cb0;
}

.action-btn.bg-positive {
    background: linear-gradient(135deg, #48bb78, #38a169);
    border-bottom-color: #2f855a;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animations */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
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

    .title-card {
        padding: 16px;
    }

    .test-title {
        font-size: 1.5rem;
    }

    .quiz-meta {
        font-size: 0.75rem;
        padding: 3px 10px;
    }

    .instructions-card {
        padding: 16px;
        border-radius: 12px;
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

    .selectables-container {
        grid-template-columns: 1fr;
    }

    .target-box {
        padding: 16px;
    }

    .target-assignment {
        min-height: 52px;
    }

    .assigned-value {
        padding: 0 12px;
    }

    .selectable-box {
        padding: 14px;
    }

    .minimal-modal {
        max-width: 280px;
        border-radius: 16px;
    }

    .modal-header {
        padding: 24px 20px 20px;
    }

    .submit-btn {
        height: 48px;
        font-size: 0.95rem;
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

    .minimal-modal {
        max-width: 260px;
    }
}

/* Touch Improvements */
@media (hover: none) and (pointer: coarse) {

    .target-box:active,
    .selectable-box:active {
        transform: scale(0.98);
    }

    /* Larger touch targets */
    .target-box,
    .selectable-box {
        min-height: 44px;
    }

    .remove-btn {
        min-width: 44px;
        min-height: 44px;
    }
}
</style>