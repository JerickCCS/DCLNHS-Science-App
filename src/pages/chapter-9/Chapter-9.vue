<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 9</div>
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
                        <img src="assets/img/chapter 9/chapter 9.png" alt="Heat Transfer and Saving Energy"
                            class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 9</span>
                            <h1 class="hero-title">Heat Transfer and Saving Energy</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">Energy cannot be created or destroyed — it can only be changed from one
                            form to another.</p>
                        <p class="quote-author">— Albert Einstein</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>Heat is a form of energy that flows from warmer objects to cooler ones. It is present in
                            virtually every process in our daily lives — from cooking food to warming our homes and
                            powering engines. Understanding how heat behaves helps us make smarter decisions about
                            energy use.</p>
                        <p>In this chapter, you will explore the basic concepts of energy and temperature, the different
                            modes of heat transfer, and practical ways to conserve energy efficiently in everyday
                            life.</p>
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
                                <span class="lessons-banner-eyebrow">Chapter 9 · Heat Transfer and Saving Energy</span>
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
            title: "Heat Transfer and Saving Energy",
            objectives: [
                "What is the difference between heat and temperature?",
                "What are the three modes of heat transfer? Give an example of each.",
                "Why is it important to save and use energy efficiently in daily life?"
            ]
        })

        const lessons = reactive([
            { id: 63, title: "Lesson 1: Basic Concepts of Energy and Temperature", label: "Lesson 1", description: "Learn how energy and temperature are related and how they affect matter in everyday situations.", route: "unit-3-chapter-9-lesson-1", completed: false, current: true, locked: false },
            { id: 64, title: "Lesson 2: Modes of Heat Transfer", label: "Lesson 2", description: "Understand how heat is transferred through conduction, convection, and radiation.", route: "unit-3-chapter-9-lesson-2", completed: false, current: false, locked: true },
            { id: 65, title: "Lesson 3: Saving Energy Efficiency", label: "Lesson 3", description: "Explore ways energy can be conserved and used efficiently in daily life.", route: "unit-3-chapter-9-lesson-3", completed: false, current: false, locked: true },
            { id: 66, title: "Technology in Focus", label: null, description: "Discover technologies used to measure, control, and conserve energy and heat.", route: "chapter-9-technology", completed: false, current: false, locked: true },
            { id: 67, title: "Chapter Review", label: null, description: "Review key ideas about energy, temperature, and heat transfer.", route: "chapter-9-review", completed: false, current: false, locked: true },
            { id: 68, title: "Activity 13: Particles in Motion", label: null, description: "Investigate how particle motion relates to temperature and energy through simple activities.", route: "chapter-9-activity-13", completed: false, current: false, locked: true },
            { id: 69, title: "Chapter Test", label: null, description: "Assess your understanding of energy, temperature, and heat transfer concepts.", route: "chapter-9-test", completed: false, current: false, locked: true },
            { id: 70, title: "STEM Challenge", label: null, description: "Apply your knowledge of energy and heat to solve a real-world problem.", route: "chapter-9-stem-challenge", completed: false, current: false, locked: true }
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