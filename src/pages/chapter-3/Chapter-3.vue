<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 3</div>
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
                        <img src="assets/img/chapter 3/chapter-3.png" alt="Solutions" class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 3</span>
                            <h1 class="hero-title">Understanding Solutions</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">In every walk with nature, one receives far more than he seeks.</p>
                        <p class="quote-author">— John Muir</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>Solutions are part of our daily lives. The air we breathe is a solution of oxygen, nitrogen,
                            carbon dioxide, water vapor, and other gases. Nutrients are circulated in our body as
                            solutions.
                            Minerals in the soil are absorbed by plants in the form of solutions. Many solutions are
                            also
                            involved in the chemical reactions that occur in the environment.</p>
                        <p>In this chapter, you will learn more about solutions, particularly their types, general
                            properties, and everyday examples such as salts, acids, and bases.</p>
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
                                <span class="lessons-banner-eyebrow">Chapter 3 · Understanding Solutions</span>
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
            title: "Understanding Solubility and Concentration: Practical Applications Explored in Solutions",
            objectives: [
                "What are the components of a solution?",
                "How are solutions classified based on the proportion of their components?"
            ]
        })

        const lessons = reactive([
            { id: 16, title: "Lesson 1: The Nature of Solutions", label: "Lesson 1", description: "Learn about the nature of solutions.", route: "unit-1-chapter-3-lesson-1", completed: false, current: true, locked: false },
            { id: 17, title: "Lesson 2: Solubility and Saturation", label: "Lesson 2", description: "Understand solubility and saturation in solutions.", route: "unit-1-chapter-3-lesson-2", completed: false, current: false, locked: true },
            { id: 18, title: "Lesson 3: Factors That Affect Solubility", label: "Lesson 3", description: "Explore factors that influence solubility.", route: "unit-1-chapter-3-lesson-3", completed: false, current: false, locked: true },
            { id: 19, title: "Lesson 4: Expressing Concentration of Solutions", label: "Lesson 4", description: "Learn how to express solution concentration.", route: "unit-1-chapter-3-lesson-4", completed: false, current: false, locked: true },
            { id: 20, title: "Lesson 5: Practical Examples of Solutions: Acids, Bases, and Salt Solutions", label: "Lesson 5", description: "See practical examples of solutions in acids, bases, and salts.", route: "unit-1-chapter-3-lesson-5", completed: false, current: false, locked: true },
            { id: 21, title: "Technology in Focus", label: null, description: "Explore technology related to solutions.", route: "chapter-3-technology", completed: false, current: false, locked: true },
            { id: 22, title: "Chapter Review", label: null, description: "Review key concepts of the chapter.", route: "chapter-3-review", completed: false, current: false, locked: true },
            { id: 23, title: "Activity 3: Some Factors Affecting Solubility", label: null, description: "Hands-on activity exploring factors affecting solubility.", route: "chapter-3-activity-3", completed: false, current: false, locked: true },
            { id: 24, title: "Activity 4: Percent by Mass of Salt in Aqueous Solutions", label: null, description: "Calculate percent by mass of salt in solutions.", route: "chapter-3-activity-4", completed: false, current: false, locked: true },
            { id: 25, title: "Activity 5: Chemistry of Acids and Bases", label: null, description: "Explore the chemistry of acids and bases.", route: "chapter-3-activity-5", completed: false, current: false, locked: true },
            { id: 26, title: "Chapter Test", label: null, description: "Evaluate your understanding of the chapter.", route: "chapter-3-test", completed: false, current: false, locked: true },
            { id: 27, title: "STEM Challenge", label: null, description: "Apply your knowledge through a STEM challenge.", route: "chapter-3-stem", completed: false, current: false, locked: true }
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