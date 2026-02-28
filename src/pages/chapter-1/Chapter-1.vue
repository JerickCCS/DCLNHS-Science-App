<template>
    <q-page class="chapter-page">
        <!-- Header -->
        <q-header class="chapter-header no-shadow">
            <q-toolbar class="chapter-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="back-btn" />
                <div class="toolbar-title">Chapter 1</div>
            </q-toolbar>

            <!-- Tabs inside header so they feel connected -->
            <div class="tab-bar">
                <button class="tab-btn" :class="{ active: activeTab === 'introduction' }"
                    @click="activeTab = 'introduction'">
                    Introduction
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'lessons' }" @click="activeTab = 'lessons'">
                    Lessons
                </button>
            </div>
        </q-header>

        <!-- ─── INTRODUCTION ─── -->
        <div v-if="activeTab === 'introduction'" class="introduction-content">

            <!-- Hero Banner -->
            <div class="hero-banner">
                <img src="assets/img/chapter 1/Chemistry.png" alt="Nature of Science" class="hero-image" />
                <div class="hero-overlay">
                    <span class="hero-eyebrow">Chapter 1</span>
                    <h1 class="hero-title">Nature of Science</h1>
                </div>
            </div>

            <!-- Quote card -->
            <div class="quote-card">
                <span class="quote-mark">"</span>
                <p class="quote-text">All truths are easy to understand once they are discovered; the point is to
                    discover them.</p>
                <p class="quote-author">— Galileo Galilei</p>
            </div>

            <!-- Body text -->
            <div class="body-card">
                <p>When scientists become curious about the things around them, they start to observe and think, then
                    experiment, measure, analyze, and make conclusions based on their findings.</p>
                <p>In this chapter, you will be guided on how to do science the way scientists do. The lessons will
                    equip you with knowledge about the common models and tools used in science and how to properly
                    utilize them in performing investigations.</p>
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
        <div v-if="activeTab === 'lessons'" class="lessons-content">

            <!-- Lessons Banner -->
            <div class="lessons-banner">
                <div class="lessons-banner-bg"></div>
                <div class="lessons-banner-content">
                    <div class="lessons-banner-text">
                        <span class="lessons-banner-eyebrow">Chapter 1 · Nature of Science</span>
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

        watch(activeTab, (newTab) => {
            router.replace({ query: { ...route.query, tab: newTab } })
        })

        const currentUser = getCurrentUser()
        if (!currentUser || !currentUser.name || !currentUser.section) {
            router.push({ name: "login" })
            return
        }

        const unitData = reactive({
            title: "Nature of Science",
            objectives: [
                "What are the common laboratory tools and their uses?",
                "What are the basic process skills employed in studying science?",
                "What are the components of a scientific investigation?"
            ]
        })

        const lessons = reactive([
            { id: 1, title: "Scientific Models", label: "Lesson 1", description: "Learn about scientific models and how they represent real-world phenomena.", route: "unit-1-chapter-1-lesson-1", completed: false, current: true, locked: false },
            { id: 2, title: "Measurements and Data Organization", label: "Lesson 2", description: "Understanding measurements and organizing data effectively.", route: "unit-1-chapter-1-lesson-2", completed: false, current: false, locked: true },
            { id: 3, title: "Common Laboratory Tools", label: "Lesson 3", description: "Introduction to basic laboratory tools and equipment.", route: "unit-1-chapter-1-lesson-3", completed: false, current: false, locked: true },
            { id: 4, title: "Doing Scientific Investigations", label: "Lesson 4", description: "Step-by-step guide to performing scientific investigations.", route: "unit-1-chapter-1-lesson-4", completed: false, current: false, locked: true },
            { id: 5, title: "Technology in Focus", label: null, description: "Explore technology applications in scientific studies.", route: "chapter-1-technology", completed: false, current: false, locked: true },
            { id: 6, title: "Chapter Review", label: null, description: "Review and consolidate the key concepts from this chapter.", route: "chapter-1-review", completed: false, current: false, locked: true },
            { id: 7, title: "Activity 1: Measurement", label: null, description: "Practical hands-on activity to measure real quantities.", route: "chapter-1-activity", completed: false, current: false, locked: true },
            { id: 8, title: "Chapter Test", label: null, description: "Assess your understanding of all chapter concepts.", route: "chapter-1-test", completed: false, current: false, locked: true }
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

        return { activeTab, unitData, lessons, selectLesson, completeLesson, goBack }
    }
}
</script>

<style lang="scss">
// ── Variables ──────────────────────────────────────────────
:root {
    --primary: #42a7ff;
    --primary-dark: #1a7fd4;
    --primary-light: #e0f2ff;
    --green: #10b981;
    --green-dark: #065f46;
    --amber: #f59e0b;
    --amber-dark: #b45309;
    --grey-light: #f3f4f6;
    --grey-mid: #d1d5db;
    --grey-dark: #6b7280;
    --text: #111827;
    --text-soft: #4b5563;
    --white: #ffffff;
    --radius: 14px;
    --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.12);
}

// ── Base ───────────────────────────────────────────────────
.chapter-page {
    font-family: "MyFont", sans-serif;
    min-height: 100vh;
    background: #f0f7ff;
    padding-bottom: 40px;
}

// ── Header ─────────────────────────────────────────────────
.chapter-header {
    background: var(--primary) !important;
    box-shadow: none !important;
}

.chapter-toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 12px 16px;
}

.toolbar-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 0.3px;
}

.back-btn {
    position: absolute !important;
    left: 12px !important;
    color: var(--white) !important;

    .q-icon {
        color: var(--white) !important;
    }
}

// ── Tab Bar ────────────────────────────────────────────────
.tab-bar {
    display: flex;
    background: var(--primary-dark);
    padding: 6px 8px;
    gap: 4px;
}

.tab-btn {
    flex: 1;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    font-family: "MyFont", sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.3px;

    &:hover {
        color: var(--white);
        background: rgba(255, 255, 255, 0.1);
    }

    &.active {
        background: var(--white);
        color: var(--primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
}

// ── Introduction ───────────────────────────────────────────
.introduction-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

// Hero
.hero-banner {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    height: 200px;
    box-shadow: var(--shadow-md);
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10, 60, 120, 0.85) 0%, rgba(10, 60, 120, 0.3) 60%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
}

.hero-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 4px;
}

.hero-title {
    font-size: 24px;
    font-weight: 800;
    color: var(--white);
    margin: 0;
    line-height: 1.2;
}

// Quote
.quote-card {
    background: var(--primary);
    border-radius: var(--radius);
    padding: 20px 20px 20px 24px;
    position: relative;
    box-shadow: var(--shadow);
}

.quote-mark {
    font-size: 72px;
    line-height: 0;
    position: absolute;
    top: 28px;
    left: 14px;
    color: rgba(255, 255, 255, 0.2);
    font-family: Georgia, serif;
    pointer-events: none;
}

.quote-text {
    font-size: 15px;
    font-style: italic;
    color: var(--white);
    line-height: 1.7;
    margin: 0 0 10px 0;
    padding-left: 20px;
}

.quote-author {
    font-size: 13px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    padding-left: 20px;
    letter-spacing: 0.5px;
}

// Body text
.body-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);

    p {
        font-size: 14px;
        line-height: 1.75;
        color: var(--text-soft);
        margin: 0 0 12px 0;
        text-align: justify;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Pre-learning check
.check-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary);
}

.check-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.check-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary);
    font-size: 18px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.check-title {
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 2px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.check-subtitle {
    font-size: 12px;
    color: var(--grey-dark);
    margin: 0;
}

.check-list {
    padding-left: 20px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-soft);
    }
}

// ── Lessons ────────────────────────────────────────────────
.lessons-content {
    padding: 16px;
}

// Lessons banner
.lessons-banner {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 20px;
    background: var(--primary);
    box-shadow: 0 6px 24px rgba(66, 167, 255, 0.35);
}

.lessons-banner-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #42a7ff 0%, #1a7fd4 100%);
}

.lessons-banner-content {
    position: relative;
    z-index: 2;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.lessons-banner-text {
    flex: 1;
}

.lessons-banner-eyebrow {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 6px;
}

.lessons-banner-title {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 4px 0;
    line-height: 1.2;
}

.lessons-banner-sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.4;
}

.lessons-banner-stats {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 10px 14px;
    backdrop-filter: blur(4px);
}

.stat-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-num {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
}

.stat-label {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.65);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.stat-divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.3);
}

// Decorative circles
.deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
}

.deco-1 {
    width: 100px;
    height: 100px;
    top: -30px;
    right: -20px;
}

.deco-2 {
    width: 60px;
    height: 60px;
    bottom: -20px;
    right: 60px;
}

// Timeline
.lessons-timeline {
    display: flex;
    flex-direction: column;
}

.lesson-item {
    display: flex;
    gap: 12px;
    margin-bottom: 0;
    cursor: pointer;

    &.is-locked {
        cursor: not-allowed;
    }

    &:last-child .timeline-line {
        display: none;
    }
}

.timeline-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 40px;
}

.timeline-node {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--grey-mid);
    border: 3px solid var(--white);
    box-shadow: 0 0 0 2px var(--grey-mid);
    z-index: 2;
    position: relative;

    .is-completed & {
        background: var(--green);
        box-shadow: 0 0 0 2px var(--green);
    }

    .is-current & {
        background: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 40, 204, 0.25);
    }

    .is-locked & {
        background: #f59e0b;
        box-shadow: 0 0 0 2px #f59e0b;
    }
}

.node-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.node-number {
    font-size: 15px;
    font-weight: 800;
    color: var(--white);
}

.timeline-line {
    width: 2px;
    flex: 1;
    min-height: 20px;
    background: var(--grey-mid);
    margin: 4px 0;

    &.line-done {
        background: var(--green);
    }
}

// Lesson card
.lesson-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: var(--radius);
    padding: 14px 16px;
    margin-bottom: 12px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    // Default / locked state — warm amber
    &.card-locked {
        background: #f59e0b;
        border-bottom: 4px solid #b45309;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

        .card-label {
            color: rgba(255, 255, 255, 0.75);
        }

        .card-title {
            color: #ffffff;
        }

        .card-desc {
            color: rgba(255, 255, 255, 0.75);
        }
    }

    // Current / active — purple primary
    &.card-current {
        background: var(--primary);
        border-bottom: 4px solid var(--primary-dark);
        box-shadow: 0 4px 16px rgba(59, 40, 204, 0.35);
        position: relative;
        overflow: hidden;

        // Subtle shimmer
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 60%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
            animation: shimmer 2.5s infinite;
        }

        .card-label {
            color: rgba(255, 255, 255, 0.7);
        }

        .card-title {
            color: #ffffff;
        }

        .card-desc {
            color: rgba(255, 255, 255, 0.75);
        }
    }

    // Completed — green
    &.card-completed {
        background: #10b981;
        border-bottom: 4px solid #065f46;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

        .card-label {
            color: rgba(255, 255, 255, 0.75);
        }

        .card-title {
            color: #ffffff;
        }

        .card-desc {
            color: rgba(255, 255, 255, 0.75);
        }
    }
}

@keyframes shimmer {
    0% {
        left: -100%;
    }

    100% {
        left: 160%;
    }
}

.lesson-item:not(.is-locked):active .lesson-card {
    transform: translateY(2px);
    filter: brightness(0.95);
}

@media (hover: hover) {
    .lesson-item:not(.is-locked):hover .lesson-card {
        transform: translateY(-2px);
        filter: brightness(1.05);
    }
}

.card-left {
    flex: 1;
    min-width: 0;
}

.card-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 3px 0;
}

.card-title {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.card-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
    line-height: 1.5;
}

// Action button
.action-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.4);
}

.btn-done {}

.btn-play {}

.btn-lock {}

.action-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
}

// ── Responsive ─────────────────────────────────────────────
@media (min-width: 600px) {

    .introduction-content,
    .lessons-content {
        padding: 24px;
        max-width: 680px;
        margin: 0 auto;
    }

    .hero-banner {
        height: 260px;
    }

    .hero-title {
        font-size: 30px;
    }

    .tab-btn {
        font-size: 15px;
    }

    .lessons-header .lessons-title {
        font-size: 24px;
    }
}

@media (min-width: 1024px) {

    .introduction-content,
    .lessons-content {
        padding: 40px;
        max-width: 760px;
    }

    .hero-banner {
        height: 300px;
    }
}
</style>