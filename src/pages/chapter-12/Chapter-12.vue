<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 12</div>
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
                        <img src="assets/img/chapter 12/chapter 12.png" alt="Seasons" class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 12</span>
                            <h1 class="hero-title">Seasons</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">The seasons do not push one another; neither do clouds race the wind
                            across the sky. All things happen in their own good time.</p>
                        <p class="quote-author">— Dan Millman</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>Why do we experience extreme hot weather from March to May? Why do we have frequent rainfall
                            and
                            thunderstorms, especially from June to August? The Philippines experiences two seasons—wet
                            and
                            dry seasons, while other countries have four seasons each year. Why do they have summer,
                            spring,
                            autumn, and winter, and we do not?</p>
                        <p>This chapter will help you understand the seasons better. You will learn what causes the
                            seasons, and why they vary in different parts of the world.</p>
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
                                <span class="lessons-banner-eyebrow">Chapter 12 · Seasons</span>
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
            title: "Seasons",
            objectives: [
                "Define season.",
                "Why do seasons occur?",
                "How does the location of the Philippines affect its seasons?"
            ]
        })

        const lessons = reactive([
            { id: 87, title: "Lesson 1: Earth's Motions", label: "Lesson 1", description: "Understand Earth's rotation and revolution and their effects.", route: "unit-4-chapter-12-lesson-1", completed: false, current: true, locked: false },
            { id: 88, title: "Lesson 2: Seasons in the Philippines", label: "Lesson 2", description: "Learn how Earth's tilt and motion create seasons in the Philippines.", route: "unit-4-chapter-12-lesson-2", completed: false, current: false, locked: true },
            { id: 89, title: "Technology in Focus", label: null, description: "Discover technologies used to study Earth's motions and seasons.", route: "chapter-12-technology", completed: false, current: false, locked: true },
            { id: 90, title: "Chapter Review", label: null, description: "Review key concepts about Earth's motions and seasons.", route: "chapter-12-review", completed: false, current: false, locked: true },
            { id: 91, title: "Activity 17: Earth's Seasons", label: null, description: "Explore why Earth experiences different seasons.", route: "chapter-12-activity-17", completed: false, current: false, locked: true },
            { id: 92, title: "Chapter Test", label: null, description: "Evaluate your understanding of Earth's motions and seasons.", route: "chapter-12-test", completed: false, current: false, locked: true }
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