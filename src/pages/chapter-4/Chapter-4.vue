<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 4</div>
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
                        <img src="assets/img/chapter 4/chapter-4.png" alt="The Microscope and the Microscopic Cell"
                            class="hero-image" />
                        <div class="hero-overlay">
                            <span class="hero-eyebrow">Chapter 4</span>
                            <h1 class="hero-title">The Microscope and the Microscopic Cell</h1>
                        </div>
                    </div>

                    <!-- Quote card -->
                    <div class="quote-card">
                        <span class="quote-mark">"</span>
                        <p class="quote-text">The cell is the basic unit of life — to understand the cell is to
                            understand the organism itself.</p>
                        <p class="quote-author">— Antonie van Leeuwenhoek</p>
                    </div>

                    <!-- Body text -->
                    <div class="body-card">
                        <p>Antonie van Leeuwenhoek was the first person to observe bacteria and protozoa using a single
                            high quality lens microscope. In his lifetime, he ground more than 100 lenses which were
                            often very small and placed them in brass plates. He was able to observe many microscopic
                            things which laid the foundations for the study of microorganisms.</p>
                        <p>Living organisms are composed of cells — the structural and functional unit of life.
                            Observing cells using the naked eye is very difficult because of their minute size. Cells
                            are observed using a powerful optical instrument made up of lenses: the microscope.</p>
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
                                <span class="lessons-banner-eyebrow">Chapter 4 · The Microscope and the Microscopic
                                    Cell</span>
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
            title: "The Microscope and the Microscopic Cell",
            objectives: [
                "Make a quick sketch of a microscope from what you know, then label its parts.",
                "Compute: How many times bigger is a 15-cm ostrich egg from a 0.3-μm Mycoplasma gallacticum cell? (Note: 1 cm = 10,000 μm)",
                "What are the differences between an animal cell and a plant cell?"
            ]
        })

        const lessons = reactive([
            { id: 28, title: "Lesson 1: The Microscope: Parts and Function", label: "Lesson 1", description: "Identify the parts of a microscope and their functions.", route: "unit-2-chapter-4-lesson-1", completed: false, current: true, locked: false },
            { id: 29, title: "Lesson 2: The Cell: The Basic Unit of Life", label: "Lesson 2", description: "Understand the cell as the basic unit of life.", route: "unit-2-chapter-4-lesson-2", completed: false, current: false, locked: true },
            { id: 30, title: "Technology in Focus", label: null, description: "Explore technology used in microscopy and cell studies.", route: "unit-2-chapter-4-technology", completed: false, current: false, locked: true },
            { id: 31, title: "Chapter Review", label: null, description: "Review key concepts about microscopes and cells.", route: "unit-2-chapter-4-review", completed: false, current: false, locked: true },
            { id: 32, title: "Activity 6: Parts of a Compound Microscope", label: null, description: "Hands-on activity identifying microscope parts.", route: "unit-2-chapter-4-activity-6", completed: false, current: false, locked: true },
            { id: 33, title: "Activity 7: Focusing Specimens under the Compound Microscope", label: null, description: "Practice focusing specimens using a compound microscope.", route: "unit-2-chapter-4-activity-7", completed: false, current: false, locked: true },
            { id: 34, title: "Chapter Test", label: null, description: "Assess understanding of microscopes and cells.", route: "unit-2-chapter-4-test", completed: false, current: false, locked: true },
            { id: 35, title: "STEM Challenge", label: null, description: "Apply learning through a STEM-based challenge.", route: "unit-2-chapter-4-stem-challenge", completed: false, current: false, locked: true }
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