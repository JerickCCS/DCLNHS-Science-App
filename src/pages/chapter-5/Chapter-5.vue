<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 5</div>
            </q-toolbar>

            <!-- Tabs inside header so they feel connected -->
            <div class="tab-bar">
                <button class="tab-btn" :class="{ active: activeTab === 'introduction' }"
                    @click="switchTab('introduction')">
                    Introduction
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'lessons' }" @click="switchTab('lessons')">
                    Lessons
                </button>
            </div>
        </q-header>

        <!-- Tab content with transition -->
        <div class="tab-content-wrapper">
            <transition :name="tabTransitionName" mode="out-in">

                <!-- ─── INTRODUCTION ─── -->
                <div v-if="activeTab === 'introduction'" key="introduction" class="introduction-content">

                    <!-- Hero Banner -->
                    <div class="hero-banner">
                        <img src="/assets/img/chapter 5/chapter 5.png" alt="Cellular Reproduction and Fertilization"
                            class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 5</span>
                            <h1 class="hero-title">Cellular Reproduction and Fertilization</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">Every living thing comes from a living thing — life is a continuous thread
                            across generations.</p>
                        <p class="quote-author">— Rudolf Virchow</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>An important characteristic of living things is their ability to perpetuate their own kind
                            through the process of reproduction. The ability of an organism to successfully reproduce
                            allows it to exist generation after generation. The cell cycle and fertilization are
                            interconnected and ensure the continuation of the species in every generation.</p>
                        <p>Whether reproduction is sexual or asexual, the process of the cell cycle is important since
                            it either produces sex cells or gametes through meiosis, or multiplies cells of a parent
                            cell to directly produce its offspring.</p>
                    </div>

                    <!-- Pre-learning check -->
                    <div class="check-card">
                        <div class="check-header">
                            <div class="check-badge">?</div>
                            <div>
                                <p class="check-title">Pre-Learning Check</p>
                                <p class="check-subtitle">Think about these before you begin:</p>
                            </div>
                        </div>
                        <ol class="check-list">
                            <li v-for="objective in unitData.objectives" :key="objective">{{ objective }}</li>
                        </ol>
                    </div>
                </div>

                <!-- ─── LESSONS ─── -->
                <div v-else-if="activeTab === 'lessons'" key="lessons" class="lessons-content">

                    <!-- Lessons Banner -->
                    <div class="lessons-banner">
                        <div class="lessons-banner-bg"></div>
                        <div class="lessons-banner-content">
                            <div class="lessons-banner-text">
                                <span class="lessons-banner-eyebrow">Chapter 5 · Cellular Reproduction and
                                    Fertilization</span>
                                <h2 class="lessons-banner-title">Course Lessons</h2>
                                <p class="lessons-banner-sub">Complete each lesson in order to unlock the next</p>
                            </div>
                            <div class="lessons-banner-stats">
                                <div class="stat-pill">
                                    <span class="stat-num">{{lessons.filter(l => l.completed).length}}</span>
                                    <span class="stat-label">Done</span>
                                </div>
                                <div class="stat-divider"></div>
                                <div class="stat-pill">
                                    <span class="stat-num">{{ lessons.length }}</span>
                                    <span class="stat-label">Total</span>
                                </div>
                            </div>
                        </div>
                        <!-- Decorative circles -->
                        <div class="deco-circle deco-1"></div>
                        <div class="deco-circle deco-2"></div>
                    </div>

                    <div class="lessons-timeline">
                        <div v-for="(lesson, index) in lessons" :key="lesson.id" class="lesson-item" :class="{
                            'is-completed': lesson.completed,
                            'is-current': lesson.current,
                            'is-locked': lesson.locked
                        }" @click="!lesson.locked && selectLesson(lesson)" :aria-disabled="lesson.locked" role="button"
                            :tabindex="lesson.locked ? -1 : 0">
                            <!-- Timeline spine -->
                            <div class="timeline-side">
                                <div class="timeline-node">
                                    <span class="node-number">{{ index + 1 }}</span>
                                </div>
                                <div v-if="index < lessons.length - 1" class="timeline-line"
                                    :class="{ 'line-done': lesson.completed }"></div>
                            </div>

                            <!-- Card -->
                            <div class="lesson-card" :class="{
                                'card-completed': lesson.completed,
                                'card-current': lesson.current,
                                'card-locked': lesson.locked
                            }">
                                <div class="card-left">
                                    <p v-if="lesson.label" class="card-label">{{ lesson.label }}</p>
                                    <h3 class="card-title">{{ lesson.title }}</h3>
                                    <p class="card-desc">{{ lesson.description }}</p>
                                </div>
                                <div class="card-action">
                                    <div v-if="lesson.completed" class="action-btn btn-done">
                                        <img src="assets/icons/check.png" class="action-icon" alt="Done" />
                                    </div>
                                    <div v-else-if="lesson.current" class="action-btn btn-play">
                                        <img src="assets/icons/play.png" class="action-icon" alt="Play" />
                                    </div>
                                    <div v-else class="action-btn btn-lock">
                                        <img src="assets/icons/lock.png" class="action-icon" alt="Locked" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </transition>
        </div>
    </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { getCurrentUser } from "src/utils/session"

export default {
    name: "UnitLessonPage",
    setup() {
        function goBack() {
            window.history.length > 1 ? window.history.back() : window.location.assign('/')
        }

        const router = useRouter()
        const route = useRoute()
        const activeTab = ref(route.query.tab || "introduction")

        const tabOrder = ["introduction", "lessons"]
        const tabTransitionName = ref("tab-slide-left")

        const switchTab = (newTab) => {
            const oldIndex = tabOrder.indexOf(activeTab.value)
            const newIndex = tabOrder.indexOf(newTab)
            tabTransitionName.value = newIndex > oldIndex ? "tab-slide-left" : "tab-slide-right"
            activeTab.value = newTab
        }

        watch(activeTab, (newTab) => {
            router.replace({ query: { ...route.query, tab: newTab } })
        })

        const currentUser = getCurrentUser()
        if (!currentUser || !currentUser.name || !currentUser.section) {
            router.push({ name: "login" })
            return
        }

        const unitData = reactive({
            title: "Cellular Reproduction and Fertilization",
            objectives: [
                "List the organelles/molecules of the cells that are actively involved in the process of cellular reproduction.",
                "Where do mitosis and meiosis happen in the body?",
                "What is the main difference between sexual and asexual reproduction?"
            ]
        })

        const lessons = reactive([
            { id: 36, title: "Lesson 1: Cellular Reproduction", label: "Lesson 1", description: "Learn how cells reproduce through mitosis and meiosis.", route: "unit-2-chapter-5-lesson-1", completed: false, current: true, locked: false },
            { id: 37, title: "Lesson 2: Perpetuation of Organisms", label: "Lesson 2", description: "Understand how reproduction ensures the continuity of organisms.", route: "unit-2-chapter-5-lesson-2", completed: false, current: false, locked: true },
            { id: 38, title: "Technology in Focus", label: null, description: "Explore technological tools used to study cellular reproduction.", route: "chapter-5-technology", completed: false, current: false, locked: true },
            { id: 39, title: "Chapter Review", label: null, description: "Review key concepts about cellular reproduction and fertilization.", route: "chapter-5-review", completed: false, current: false, locked: true },
            { id: 40, title: "Activity 8: Meiosis: Modeling Crossing-Over", label: null, description: "Perform a hands-on activity modeling crossing-over during meiosis.", route: "chapter-5-activity-8", completed: false, current: false, locked: true },
            { id: 41, title: "Activity 9: Sexual Reproduction in Plants", label: null, description: "Explore how sexual reproduction occurs in plants.", route: "chapter-5-activity-9", completed: false, current: false, locked: true },
            { id: 42, title: "Chapter Test", label: null, description: "Assess your understanding of cellular reproduction and fertilization.", route: "chapter-5-test", completed: false, current: false, locked: true }
        ])

        const loadProgress = () => {
            const userProgress = currentUser.progress || {}
            lessons.forEach((lesson, index) => {
                const progress = userProgress[lesson.id] || { completed: false }
                lesson.completed = progress.completed
                lesson.locked = index === 0 ? false : !lessons[index - 1].completed
                lesson.current = !lesson.completed && !lesson.locked
            })
        }

        const selectLesson = (lesson) => {
            if (!lesson.locked) router.push({ path: lesson.route })
        }

        const completeLesson = (lessonId) => {
            currentUser.progress[lessonId] = { completed: true }
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            loadProgress()
        }

        onMounted(loadProgress)

        return { activeTab, tabTransitionName, switchTab, unitData, lessons, selectLesson, completeLesson, goBack }
    }
}
</script>

<style src="src/css/chapterStyles.css" lang="scss"></style>