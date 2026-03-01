<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 10</div>
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
                        <img src="assets/img/chapter 10/chapter 10.png" alt="Earthquakes and Faults"
                            class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 10</span>
                            <h1 class="hero-title">Earthquakes and Faults</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">The ground beneath us is never truly still — understanding it can save
                            lives.</p>
                        <p class="quote-author">— Philippine Institute of Volcanology and Seismology</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>On October 15, 2013, a 7.2-magnitude earthquake hit Bohol and destroyed a number of
                            infrastructure, including historic churches and landmarks in the province. Based on official
                            reports from the NDRRMC, the effects of the earthquake resulted in about 200 human
                            casualties, with eight persons missing and 976 injured.</p>
                        <p>In this chapter, you will learn about why earthquakes occur, how much damage they can cause,
                            and how to protect yourself and others during earthquakes.</p>
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
                                <span class="lessons-banner-eyebrow">Chapter 10 · Earthquakes and Faults</span>
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
            title: "Earthquakes and Faults",
            objectives: [
                "Describe how earthquakes occur and identify their causes.",
                "Differentiate between active and inactive faults.",
                "Explain how faults are related to earthquake generation."
            ]
        })

        const lessons = reactive([
            { id: 71, title: "Lesson 1: Earthquakes along Faults", label: "Lesson 1", description: "Learn about how earthquakes occur along faults.", route: "unit-4-chapter-10-lesson-1", completed: false, current: true, locked: false },
            { id: 72, title: "Lesson 2: Measuring Earthquakes", label: "Lesson 2", description: "Understand how scientists measure earthquake strength.", route: "unit-4-chapter-10-lesson-2", completed: false, current: false, locked: true },
            { id: 73, title: "Lesson 3: Earthquake Preparedness", label: "Lesson 3", description: "Learn how to prepare for and stay safe during earthquakes.", route: "unit-4-chapter-10-lesson-3", completed: false, current: false, locked: true },
            { id: 74, title: "Technology in Focus", label: null, description: "Explore technology applications in studying earthquakes.", route: "chapter-10-technology", completed: false, current: false, locked: true },
            { id: 75, title: "Chapter Review", label: null, description: "Review key concepts about earthquakes and faults.", route: "chapter-10-review", completed: false, current: false, locked: true },
            { id: 76, title: "Activity 14: Simulation of an Earthquake", label: null, description: "Perform a hands-on simulation of an earthquake.", route: "chapter-10-activity", completed: false, current: false, locked: true },
            { id: 77, title: "Chapter Test", label: null, description: "Assess your understanding of earthquakes.", route: "chapter-10-test", completed: false, current: false, locked: true },
            { id: 78, title: "STEM Challenge", label: null, description: "Apply your knowledge in a real-world STEM challenge.", route: "chapter-10-stem", completed: false, current: false, locked: true }
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