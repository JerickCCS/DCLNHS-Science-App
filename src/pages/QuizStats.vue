<template>
    <q-layout view="hHh LpR fFf">
        <q-header class="bg-white text-dark">
            <q-toolbar class="relative-position">
                <!-- Back button (left) -->
                <q-btn flat dense round icon="arrow_back" @click="goBack" class="absolute-left q-ml-sm" />

                <!-- Centered title -->
                <div class="absolute-center text-h6 text-weight-bold">
                    Statistics
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page class="q-pa-md stats-page">
                <!-- FILTER TABS -->
                <div class="filter-bar q-mb-md">
                    <q-btn-toggle v-model="activeTab" spread unelevated toggle-color="primary" :options="[
                        { label: 'All', value: 'all' },
                        { label: 'Chapter Tests', value: 'chapter_tests' },
                        { label: 'Mini Tests', value: 'mini_test' },
                        { label: 'Mini Labs', value: 'mini_lab' }
                    ]" />
                </div>

                <!-- ALL TAB CONTENT -->
                <div v-if="activeTab === 'all'" class="all-content">
                    <!-- CENTERED HORIZONTAL SUMMARY CARD - ONLY IN ALL TAB -->
                    <div class="summary-card-container q-mb-lg">
                        <div class="summary-card">
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Total Quizzes</div>
                                <div class="summary-stat-value">{{ totalAllQuizzes }}</div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Average Score</div>
                                <div class="summary-stat-value-with-badge">
                                    <span class="summary-stat-value">{{ overallAverage }}%</span>
                                    <span class="summary-stat-badge" :class="getStatusClass(overallAverage)">
                                        {{ getStatusText(overallAverage) }}
                                    </span>
                                </div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Correct / Wrong</div>
                                <div class="summary-stat-value">{{ totalAllCorrect }} / {{ totalAllWrong }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- UNIT PERFORMANCE CARDS -->
                    <div class="section-title q-mb-md">Overall Unit Performance</div>
                    <div class="row q-col-gutter-sm q-mb-lg">
                        <div class="col-6" v-for="unit in unitStatuses" :key="unit.number">
                            <div class="unit-performance-card" :class="getUnitPerformanceClass(unit.status)">
                                <div class="unit-performance-content">
                                    <div class="unit-performance-title">Unit {{ unit.number }}</div>
                                    <div class="unit-performance-status" :class="getUnitStatusClass(unit.status)">
                                        {{ unit.status }}
                                    </div>
                                    <div class="unit-performance-meta">
                                        {{ unit.totalActivities }} Activities Completed
                                    </div>
                                    <div class="unit-performance-score">
                                        Avg: <span class="unit-performance-score-value">{{ unit.averageScore }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ALL QUIZZES MIXED -->
                    <div class="section-title q-mb-md">All Quizzes & Tests</div>

                    <!-- Chapter Tests in All Tab -->
                    <div v-if="attemptedChapters.length > 0" class="q-mb-lg">
                        <div class="section-subtitle q-mb-sm">Chapter Tests</div>
                        <div class="quiz-card chapter_tests" v-for="chapter in attemptedChapters"
                            :key="`chapter-${chapter.number}`">
                            <div class="quiz-left">
                                <div class="quiz-title">Chapter {{ chapter.number }} Test</div>
                                <div class="quiz-meta">
                                    Unit {{ Math.ceil(chapter.number / 3) }} • {{ formatDate(chapter.timestamp) }}
                                </div>
                            </div>
                            <div class="quiz-right">
                                <div class="quiz-pass-status" :class="getStatusClass(chapter.percentage)">
                                    {{ getStatusText(chapter.percentage) }}
                                </div>
                                <div class="quiz-meta-right">
                                    {{ chapter.score }}/{{ chapter.total }} • {{ chapter.percentage }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mini Tests in All Tab -->
                    <div v-if="miniTests.length > 0" class="q-mb-lg">
                        <div class="section-subtitle q-mb-sm">Mini Tests</div>
                        <div class="quiz-card mini_test" v-for="quiz in miniTests" :key="`minitest-${quiz.name}`">
                            <div class="quiz-left">
                                <div class="quiz-title">{{ quiz.name }}</div>
                                <div class="quiz-meta">
                                    Chapter {{ quiz.chapter }} • Lesson {{ quiz.lesson }}
                                </div>
                            </div>
                            <div class="quiz-right">
                                <div class="quiz-pass-status" :class="getStatusClass(quiz.percentage)">
                                    {{ getStatusText(quiz.percentage) }}
                                </div>
                                <div class="quiz-meta-right">
                                    {{ quiz.score }}/{{ quiz.total }} • {{ quiz.percentage }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mini Labs in All Tab -->
                    <div v-if="miniLabs.length > 0">
                        <div class="section-subtitle q-mb-sm">Mini Labs</div>
                        <div class="quiz-card mini_lab" v-for="quiz in miniLabs" :key="`minilab-${quiz.name}`">
                            <div class="quiz-left">
                                <div class="quiz-title">{{ quiz.name }}</div>
                                <div class="quiz-meta">
                                    Chapter {{ quiz.chapter }} • Lesson {{ quiz.lesson }}
                                </div>
                            </div>
                            <div class="quiz-right">
                                <div class="quiz-pass-status" :class="getStatusClass(quiz.percentage)">
                                    {{ getStatusText(quiz.percentage) }}
                                </div>
                                <div class="quiz-meta-right">
                                    {{ quiz.score }}/{{ quiz.total }} • {{ quiz.percentage }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!hasContent" class="empty-state">
                        No quizzes completed yet
                    </div>
                </div>

                <!-- CHAPTER TESTS TAB -->
                <div v-else-if="activeTab === 'chapter_tests'" class="chapter-tests-content">
                    <!-- CENTERED HORIZONTAL SUMMARY CARD FOR CHAPTER TESTS -->
                    <div class="summary-card-container q-mb-lg">
                        <div class="summary-card">
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Tests Taken</div>
                                <div class="summary-stat-value">{{ chapterTestStats.count }}/12</div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Average Score</div>
                                <div class="summary-stat-value-with-badge">
                                    <span class="summary-stat-value">{{ chapterTestStats.average }}%</span>
                                    <span class="summary-stat-badge" :class="getStatusClass(chapterTestStats.average)">
                                        {{ getStatusText(chapterTestStats.average) }}
                                    </span>
                                </div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Correct / Wrong</div>
                                <div class="summary-stat-value">{{ chapterTestStats.correct }} / {{
                                    chapterTestStats.wrong }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- CHAPTER DETAILED VIEW -->
                    <div class="section-title q-mb-md">Chapter Test Results</div>

                    <!-- Unit 1 -->
                    <div class="unit-section q-mb-lg" v-if="hasChaptersInUnit(1)">
                        <div class="unit-header q-mb-sm">
                            <div class="unit-title">Unit 1</div>
                            <div class="unit-progress">{{ getUnitAttemptProgress(1) }}% attempted</div>
                        </div>
                        <div class="chapter-card-group">
                            <div class="quiz-card chapter_tests" v-for="chapter in getChaptersByUnit(1)"
                                :key="chapter.number" :class="{ 'attempted': chapter.attempted }">
                                <div class="quiz-left">
                                    <div class="quiz-title">Chapter {{ chapter.number }}</div>
                                    <div class="quiz-meta">Unit 1</div>
                                </div>
                                <div class="quiz-right">
                                    <div v-if="chapter.attempted" class="quiz-score-group">
                                        <div class="quiz-pass-status" :class="getStatusClass(chapter.percentage)">
                                            {{ getStatusText(chapter.percentage) }}
                                        </div>
                                        <div class="quiz-meta-right">
                                            {{ chapter.score }}/{{ chapter.total }} • {{ chapter.percentage }}%
                                        </div>
                                    </div>
                                    <div v-else class="quiz-start">Not Started</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Unit 2 -->
                    <div class="unit-section q-mb-lg" v-if="hasChaptersInUnit(2)">
                        <div class="unit-header q-mb-sm">
                            <div class="unit-title">Unit 2</div>
                            <div class="unit-progress">{{ getUnitAttemptProgress(2) }}% attempted</div>
                        </div>
                        <div class="chapter-card-group">
                            <div class="quiz-card chapter_tests" v-for="chapter in getChaptersByUnit(2)"
                                :key="chapter.number" :class="{ 'attempted': chapter.attempted }">
                                <div class="quiz-left">
                                    <div class="quiz-title">Chapter {{ chapter.number }}</div>
                                    <div class="quiz-meta">Unit 2</div>
                                </div>
                                <div class="quiz-right">
                                    <div v-if="chapter.attempted" class="quiz-score-group">
                                        <div class="quiz-pass-status" :class="getStatusClass(chapter.percentage)">
                                            {{ getStatusText(chapter.percentage) }}
                                        </div>
                                        <div class="quiz-meta-right">
                                            {{ chapter.score }}/{{ chapter.total }} • {{ chapter.percentage }}%
                                        </div>
                                    </div>
                                    <div v-else class="quiz-start">Not Started</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Unit 3 -->
                    <div class="unit-section q-mb-lg" v-if="hasChaptersInUnit(3)">
                        <div class="unit-header q-mb-sm">
                            <div class="unit-title">Unit 3</div>
                            <div class="unit-progress">{{ getUnitAttemptProgress(3) }}% attempted</div>
                        </div>
                        <div class="chapter-card-group">
                            <div class="quiz-card chapter_tests" v-for="chapter in getChaptersByUnit(3)"
                                :key="chapter.number" :class="{ 'attempted': chapter.attempted }">
                                <div class="quiz-left">
                                    <div class="quiz-title">Chapter {{ chapter.number }}</div>
                                    <div class="quiz-meta">Unit 3</div>
                                </div>
                                <div class="quiz-right">
                                    <div v-if="chapter.attempted" class="quiz-score-group">
                                        <div class="quiz-pass-status" :class="getStatusClass(chapter.percentage)">
                                            {{ getStatusText(chapter.percentage) }}
                                        </div>
                                        <div class="quiz-meta-right">
                                            {{ chapter.score }}/{{ chapter.total }} • {{ chapter.percentage }}%
                                        </div>
                                    </div>
                                    <div v-else class="quiz-start">Not Started</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Unit 4 -->
                    <div class="unit-section" v-if="hasChaptersInUnit(4)">
                        <div class="unit-header q-mb-sm">
                            <div class="unit-title">Unit 4</div>
                            <div class="unit-progress">{{ getUnitAttemptProgress(4) }}% attempted</div>
                        </div>
                        <div class="chapter-card-group">
                            <div class="quiz-card chapter_tests" v-for="chapter in getChaptersByUnit(4)"
                                :key="chapter.number" :class="{ 'attempted': chapter.attempted }">
                                <div class="quiz-left">
                                    <div class="quiz-title">Chapter {{ chapter.number }}</div>
                                    <div class="quiz-meta">Unit 4</div>
                                </div>
                                <div class="quiz-right">
                                    <div v-if="chapter.attempted" class="quiz-score-group">
                                        <div class="quiz-pass-status" :class="getStatusClass(chapter.percentage)">
                                            {{ getStatusText(chapter.percentage) }}
                                        </div>
                                        <div class="quiz-meta-right">
                                            {{ chapter.score }}/{{ chapter.total }} • {{ chapter.percentage }}%
                                        </div>
                                    </div>
                                    <div v-else class="quiz-start">Not Started</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MINI TESTS TAB -->
                <div v-else-if="activeTab === 'mini_test'" class="mini-content">
                    <!-- CENTERED HORIZONTAL SUMMARY CARD FOR MINI TESTS -->
                    <div class="summary-card-container q-mb-lg">
                        <div class="summary-card">
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Mini Tests</div>
                                <div class="summary-stat-value">{{ miniTestStats.count }}</div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Average Score</div>
                                <div class="summary-stat-value-with-badge">
                                    <span class="summary-stat-value">{{ miniTestStats.average }}%</span>
                                    <span class="summary-stat-badge" :class="getStatusClass(miniTestStats.average)">
                                        {{ getStatusText(miniTestStats.average) }}
                                    </span>
                                </div>
                            </div>

                            <div class="summary-stat-divider"></div>

                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Correct / Wrong</div>
                                <div class="summary-stat-value">{{ miniTestStats.correct }} / {{ miniTestStats.wrong }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-title q-mb-md">Mini Test Results</div>

                    <div v-for="u in [1, 2, 3, 4]" :key="`mt-unit-${u}`">
                        <div v-if="getMiniTestsByUnit(u).length > 0" class="q-mb-lg">
                            <div class="unit-section">
                                <div class="unit-header q-mb-sm">
                                    <div class="unit-title">Unit {{ u }}</div>
                                    <div class="unit-progress">{{ getMiniTestUnitStats(u).count }} tests completed</div>
                                </div>
                                <div class="quiz-card-group">
                                    <div class="quiz-card mini_test" v-for="quiz in getMiniTestsByUnit(u)"
                                        :key="quiz.name">
                                        <div class="quiz-left">
                                            <div class="quiz-title">{{ quiz.name }}</div>
                                            <div class="quiz-meta">Chapter {{ quiz.chapter }} • Lesson {{ quiz.lesson }}
                                            </div>
                                        </div>
                                        <div class="quiz-right">
                                            <div class="quiz-pass-status" :class="getStatusClass(quiz.percentage)">
                                                {{ getStatusText(quiz.percentage) }}
                                            </div>
                                            <div class="quiz-meta-right">
                                                {{ quiz.score }}/{{ quiz.total }} • {{ quiz.percentage }}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="miniTests.length === 0" class="empty-state">No mini tests completed yet</div>
                </div>

                <!-- MINI LABS TAB -->
                <div v-else-if="activeTab === 'mini_lab'" class="mini-content">
                    <div class="summary-card-container q-mb-lg">
                        <div class="summary-card">
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Mini Labs</div>
                                <div class="summary-stat-value">{{ miniLabStats.count }}</div>
                            </div>
                            <div class="summary-stat-divider"></div>
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Average Score</div>
                                <div class="summary-stat-value-with-badge">
                                    <span class="summary-stat-value">{{ miniLabStats.average }}%</span>
                                    <span class="summary-stat-badge" :class="getStatusClass(miniLabStats.average)">
                                        {{ getStatusText(miniLabStats.average) }}
                                    </span>
                                </div>
                            </div>
                            <div class="summary-stat-divider"></div>
                            <div class="summary-stat-item">
                                <div class="summary-stat-label">Correct / Wrong</div>
                                <div class="summary-stat-value">{{ miniLabStats.correct }} / {{ miniLabStats.wrong }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-title q-mb-md">Mini Lab Results</div>

                    <div v-for="u in [1, 2, 3, 4]" :key="`ml-unit-${u}`">
                        <div v-if="getMiniLabsByUnit(u).length > 0" class="q-mb-lg">
                            <div class="unit-section">
                                <div class="unit-header q-mb-sm">
                                    <div class="unit-title">Unit {{ u }}</div>
                                    <div class="unit-progress">{{ getMiniLabUnitStats(u).count }} labs completed</div>
                                </div>
                                <div class="quiz-card-group">
                                    <div class="quiz-card mini_lab" v-for="quiz in getMiniLabsByUnit(u)"
                                        :key="quiz.name">
                                        <div class="quiz-left">
                                            <div class="quiz-title">{{ quiz.name }}</div>
                                            <div class="quiz-meta">Chapter {{ quiz.chapter }} • Lesson {{ quiz.lesson }}
                                            </div>
                                        </div>
                                        <div class="quiz-right">
                                            <div class="quiz-pass-status" :class="getStatusClass(quiz.percentage)">
                                                {{ getStatusText(quiz.percentage) }}
                                            </div>
                                            <div class="quiz-meta-right">
                                                {{ quiz.score }}/{{ quiz.total }} • {{ quiz.percentage }}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="miniLabs.length === 0" class="empty-state">No mini labs completed yet</div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from 'src/utils/session'
import { LocalStorage } from "quasar"

const activeTab = ref('all')
const quizzes = ref([])
const chapterResults = ref([])
const user = ref(null)

const goBack = () => history.back()

onMounted(() => {
    loadUserData()
})

const loadUserData = () => {
    user.value = getCurrentUser()
    if (!user.value) {
        user.value = LocalStorage.getItem("currentUser")
    }

    if (user.value) {
        if (user.value.quizzes) {
            quizzes.value = Object.entries(user.value.quizzes).map(([name, q]) => ({
                name,
                type: q.type,
                score: q.score,
                total: q.total,
                chapter: q.chapter,
                lesson: q.lesson,
                percentage: Math.round((q.score / q.total) * 100),
                timestamp: q.timestamp || Date.now()
            }))
        }
        initializeChapterResults()
    }
}

const initializeChapterResults = () => {
    chapterResults.value = Array.from({ length: 12 }, (_, i) => {
        const chapterNumber = i + 1
        const testData = user.value?.chapterTest?.[chapterNumber]

        if (testData) {
            const hasBeenTaken = testData.score !== undefined && testData.total !== undefined
            return {
                number: chapterNumber,
                score: testData.score || 0,
                total: testData.total || 0,
                percentage: testData.percentage || Math.round(((testData.score || 0) / (testData.total || 1)) * 100),
                attempted: hasBeenTaken,
                passed: testData.completed || false,
                timestamp: testData.timestamp || Date.now(),
                unit: Math.ceil(chapterNumber / 3)
            }
        } else {
            return {
                number: chapterNumber,
                score: 0,
                total: 0,
                percentage: 0,
                attempted: false,
                passed: false,
                timestamp: null,
                unit: Math.ceil(chapterNumber / 3)
            }
        }
    })
}

const miniTests = computed(() => quizzes.value.filter(q => q.type === 'mini_test'))
const miniLabs = computed(() => quizzes.value.filter(q => q.type === 'mini_lab'))
const attemptedChapters = computed(() => chapterResults.value.filter(ch => ch.attempted))

const chapterTestStats = computed(() => ({
    count: attemptedChapters.value.length,
    correct: attemptedChapters.value.reduce((s, c) => s + c.score, 0),
    wrong: attemptedChapters.value.reduce((s, c) => s + (c.total - c.score), 0),
    average: attemptedChapters.value.length === 0 ? 0 :
        Math.round(attemptedChapters.value.reduce((s, c) => s + c.percentage, 0) / attemptedChapters.value.length)
}))

const miniTestStats = computed(() => calculateQuizStats(miniTests.value))
const miniLabStats = computed(() => calculateQuizStats(miniLabs.value))

const overallAverage = computed(() => {
    const allItems = [
        ...quizzes.value.map(q => q.percentage),
        ...attemptedChapters.value.map(c => c.percentage)
    ]
    if (allItems.length === 0) return 0
    return Math.round(allItems.reduce((a, b) => a + b, 0) / allItems.length)
})

const totalAllQuizzes = computed(() => quizzes.value.length + attemptedChapters.value.length)
const totalAllCorrect = computed(() => {
    const qC = quizzes.value.reduce((s, q) => s + q.score, 0)
    return qC + chapterTestStats.value.correct
})
const totalAllWrong = computed(() => {
    const qW = quizzes.value.reduce((s, q) => s + (q.total - q.score), 0)
    return qW + chapterTestStats.value.wrong
})

const hasContent = computed(() => {
    if (activeTab.value === 'all') return quizzes.value.length > 0 || attemptedChapters.value.length > 0
    if (activeTab.value === 'chapter_tests') return chapterResults.value.some(c => c.attempted)
    if (activeTab.value === 'mini_test') return miniTests.value.length > 0
    if (activeTab.value === 'mini_lab') return miniLabs.value.length > 0
    return false
})

/**
 * UPDATED UNIT STATUS LOGIC
 * Calculates performance based on Chapter Tests + Mini Tests + Mini Labs per unit
 */
const unitStatuses = computed(() => {
    const units = []
    for (let u = 1; u <= 4; u++) {
        const unitChapterTests = getChaptersByUnit(u).filter(ch => ch.attempted)
        const unitMiniTests = getMiniTestsByUnit(u)
        const unitMiniLabs = getMiniLabsByUnit(u)

        const allActivities = [...unitChapterTests, ...unitMiniTests, ...unitMiniLabs]
        const count = allActivities.length

        if (count === 0) {
            units.push({ number: u, status: 'Not Attempted', averageScore: 0, totalActivities: 0 })
        } else {
            const avg = Math.round(allActivities.reduce((s, item) => s + item.percentage, 0) / count)
            let status = 'Fail'
            if (avg >= 80) status = 'Excellent'
            else if (avg >= 60) status = 'Pass'

            units.push({
                number: u,
                status,
                averageScore: avg,
                totalActivities: count
            })
        }
    }
    return units
})

const getChaptersByUnit = (u) => chapterResults.value.filter(c => c.unit === u)
const hasChaptersInUnit = (u) => getChaptersByUnit(u).some(c => c.attempted || true) // Show sections if exists

const getUnitAttemptProgress = (u) => {
    const chs = getChaptersByUnit(u)
    return Math.round((chs.filter(c => c.attempted).length / chs.length) * 100)
}

const getMiniTestsByUnit = (u) => {
    const min = (u - 1) * 3 + 1; const max = u * 3
    return miniTests.value.filter(q => q.chapter >= min && q.chapter <= max)
}
const getMiniTestUnitStats = (u) => calculateQuizStats(getMiniTestsByUnit(u))

const getMiniLabsByUnit = (u) => {
    const min = (u - 1) * 3 + 1; const max = u * 3
    return miniLabs.value.filter(q => q.chapter >= min && q.chapter <= max)
}
const getMiniLabUnitStats = (u) => calculateQuizStats(getMiniLabsByUnit(u))

const calculateQuizStats = (list) => {
    if (list.length === 0) return { count: 0, average: 0, correct: 0, wrong: 0 }
    const cor = list.reduce((a, b) => a + b.score, 0)
    const tot = list.reduce((a, b) => a + b.total, 0)
    return { count: list.length, correct: cor, wrong: tot - cor, average: Math.round((cor / tot) * 100) || 0 }
}

const getStatusClass = (p) => p >= 80 ? 'status-excellent' : (p >= 60 ? 'status-pass' : 'status-failed')
const getStatusText = (p) => p >= 80 ? 'Excellent' : (p >= 60 ? 'Pass' : 'Failed')
const formatDate = (t) => t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'

const getUnitPerformanceClass = (s) => {
    if (s === 'Excellent') return 'unit-excellent'
    if (s === 'Pass') return 'unit-pass'
    if (s === 'Fail') return 'unit-fail'
    return 'unit-not-started'
}

const getUnitStatusClass = (s) => {
    if (s === 'Excellent') return 'status-excellent'
    if (s === 'Pass') return 'status-pass'
    if (s === 'Fail') return 'status-failed'
    return 'status-not-started'
}
</script>

<style scoped>
.stats-page {
    background: #f4f6f8;
}

/* CENTERED HORIZONTAL SUMMARY CARD */
.summary-card-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.summary-card {
    background: white;
    border-radius: 16px;

    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 140px;
    width: 100%;
    max-width: 800px;
    transition: all 0.3s ease;
    margin: 0 auto;
}

.summary-card:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
}

.summary-stat-item {
    flex: 1;
    text-align: center;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.summary-stat-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.summary-stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    line-height: 1;
    letter-spacing: -0.5px;
}

.summary-stat-value-with-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
}

.summary-stat-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: -2px;
    /* Visual alignment with percentage */
}

.summary-stat-divider {
    width: 1px;
    height: 70px;
    background: linear-gradient(to bottom,
            transparent 0%,
            #e0e0e0 15%,
            #e0e0e0 85%,
            transparent 100%);
    flex-shrink: 0;
}

/* Status color classes */
.status-excellent {
    background: #4caf50;
    color: white;
}

.status-pass {
    background: #ff9800;
    color: white;
}

.status-failed {
    background: #f44336;
    color: white;
}

.status-not-started {
    background: #9e9e9e;
    color: white;
}

/* UNIT PERFORMANCE CARDS */
.unit-performance-card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    border-bottom: 5px solid;
    min-height: 120px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.unit-performance-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.unit-performance-card.unit-excellent {
    border-bottom-color: #4caf50;
    background: linear-gradient(135deg, #f1f8e9, #e8f5e9);
}

.unit-performance-card.unit-pass {
    border-bottom-color: #ff9800;
    background: linear-gradient(135deg, #fff3e0, #fff8e1);
}

.unit-performance-card.unit-fail {
    border-bottom-color: #f44336;
    background: linear-gradient(135deg, #ffebee, #fce4ec);
}

.unit-performance-card.unit-not-started {
    border-bottom-color: #9e9e9e;
    background: linear-gradient(135deg, #f5f5f5, #eeeeee);
}

.unit-performance-content {
    position: relative;
}

.unit-performance-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
}

.unit-performance-status {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 5px;
    margin-bottom: 8px;
    text-align: center;
}

.unit-performance-meta {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.unit-performance-score {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.unit-performance-score-value {
    font-weight: 700;
    color: #2196f3;
}

/* FILTER */
.filter-bar {
    background: white;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* SECTION TITLES */
.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    padding-bottom: 8px;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 16px;
    letter-spacing: -0.2px;
}

.section-subtitle {
    font-size: 16px;
    font-weight: 600;
    color: #555;
    margin-bottom: 12px;
    padding-left: 4px;
}

/* QUIZ CARDS - UPDATED LAYOUT WITH COLORED STATUS */
.quiz-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    margin-bottom: 10px;
    border-radius: 12px;
    color: white;
    border-bottom: 5px solid;
    cursor: default;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    min-height: 80px;
}

.quiz-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.quiz-card.mini_lab {
    background: linear-gradient(135deg, #ff7043, #ff5252);
    border-bottom-color: #f4511e;
}

.quiz-card.mini_test {
    background: linear-gradient(135deg, #7e57c2, #673ab7);
    border-bottom-color: #5e35b1;
}

.quiz-card.chapter_tests {
    background: linear-gradient(135deg, #42a5f5, #2196f3);
    border-bottom-color: #1e88e5;
}

.quiz-card.chapter_tests:not(.attempted) {
    background: linear-gradient(135deg, #78909c, #546e7a);
    border-bottom-color: #455a64;
    opacity: 0.9;
}

.quiz-left {
    flex: 1;
    min-width: 0;
    padding-right: 12px;
}

.quiz-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 6px;
    letter-spacing: -0.1px;
    line-height: 1.2;
}

.quiz-meta {
    font-size: 12px;
    opacity: 0.9;
    font-weight: 500;
    line-height: 1.3;
}

.quiz-right {
    text-align: right;
    min-width: 90px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
}

.quiz-pass-status {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 6px;
    line-height: 1.2;
    text-transform: capitalize;
    letter-spacing: 0.5px;
    padding: 4px 8px;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
}

.quiz-pass-status.status-excellent {
    background: #4caf50;
    color: white;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.quiz-pass-status.status-pass {
    background: #ff9800;
    color: white;
    box-shadow: 0 2px 4px rgba(255, 152, 0, 0.3);
}

.quiz-pass-status.status-failed {
    background: #f44336;
    color: white;
    box-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
}

.quiz-meta-right {
    font-size: 12px;
    opacity: 0.9;
    font-weight: 500;
    line-height: 1.3;
    background: rgba(255, 255, 255, 0.15);
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
}

.quiz-score-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.quiz-start {
    font-size: 13px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 12px;
    border-radius: 8px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
}

/* UNIT SECTIONS */
.unit-section {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.unit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
}

.unit-title {
    font-size: 17px;
    font-weight: 700;
    color: #333;
    letter-spacing: -0.2px;
}

.unit-progress {
    font-size: 13px;
    color: #666;
    font-weight: 500;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 10px;
}

.chapter-card-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
}

.quiz-card-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
}

/* EMPTY STATE */
.empty-state {
    text-align: center;
    color: #888;
    margin-top: 40px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .summary-card {

        min-height: 120px;
        max-width: 95%;
    }

    .summary-stat-value {
        font-size: 30px;
    }

    .summary-stat-label {
        font-size: 11px;
        margin-bottom: 10px;
    }

    .summary-stat-badge {
        font-size: 10px;
        padding: 4px 12px;
    }

    .summary-stat-divider {
        height: 60px;
    }

    .summary-stat-item {
        padding: 0 16px;
    }

    .quiz-pass-status {
        font-size: 14px;
        padding: 3px 6px;
    }

    .quiz-title {
        font-size: 15px;
    }

    .quiz-meta,
    .quiz-meta-right {
        font-size: 11px;
    }

    .unit-title {
        font-size: 15px;
    }

    .unit-progress {
        font-size: 12px;
    }

    .unit-performance-title {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .summary-card {

        min-height: 110px;
        max-width: 100%;
    }

    .summary-stat-item {
        padding: 0 12px;
    }

    .summary-stat-value {
        font-size: 26px;
    }

    .summary-stat-label {
        font-size: 10px;
        margin-bottom: 8px;
        letter-spacing: 0.6px;
    }

    .summary-stat-badge {
        font-size: 9px;
        padding: 3px 10px;
    }

    .summary-stat-divider {
        height: 50px;
    }

    .summary-stat-value-with-badge {
        gap: 8px;
    }

    .quiz-card {
        padding: 14px;
        min-height: 70px;
    }

    .quiz-title {
        font-size: 14px;
        margin-bottom: 4px;
    }

    .quiz-pass-status {
        font-size: 13px;
        margin-bottom: 4px;
        padding: 3px 6px;
    }

    .quiz-meta,
    .quiz-meta-right {
        font-size: 10px;
    }

    .quiz-right {
        min-width: 80px;
    }

    .unit-section {
        padding: 12px;
    }

    .unit-performance-card {
        padding: 12px;
        min-height: 100px;
    }
}

@media (max-width: 360px) {
    .summary-card {

        min-height: 100px;
    }

    .summary-stat-value {
        font-size: 24px;
    }

    .summary-stat-label {
        font-size: 9px;
    }

    .summary-stat-badge {
        font-size: 8px;
        padding: 2px 8px;
    }

    .summary-stat-divider {
        height: 40px;
    }

    .summary-stat-item {
        padding: 0 8px;
    }
}
</style>