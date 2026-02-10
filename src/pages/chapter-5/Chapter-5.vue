<template>
    <q-page class="chapter-page" :style="{ background: contentColor + ' !important' }">
        <!-- Top Navigation Tabs -->
        <q-header class="bg-white no-shadow" :style="{ background: contentColor + ' !important' }">
            <q-toolbar class="position-relative center-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="btn-left" />
                <div class="toolbar-title">Chapter 5</div>
            </q-toolbar>
        </q-header>
        <div class="top-navbar">
            <q-tabs v-model="activeTab" align="justify" indicator-color="transparent" active-color="primary"
                class="text-grey-7 flat" mobile-arrows outside-arrows>
                <q-tab name="introduction" label="Introduction" class="tab-button"
                    :style="getTabStyle('introduction')" />
                <q-tab name="lessons" label="Lessons" class="tab-button" :style="getTabStyle('lessons')" />
            </q-tabs>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Introduction -->
            <div v-if="activeTab === 'introduction'" class="introduction-content">
                <!-- New Introduction Header -->
                <div class="introduction-header">
                    <div class="intro-text">
                        <div class="chapter-label"></div>
                        <h2 class="intro-title">{{ unitData.title }}</h2>
                        <p class="intro-description">{{ unitData.description }}</p>
                    </div>
                    <img src="/assets/img/chapter 5/chapter 5.png" alt="Cells" class="intro-image-wide">
                </div>

                <!-- Text above PRE-LEARNING CHECK -->
                <div class="pre-learning-intro">
                    <p>Understanding how cells divide and how fertilization occurs helps explain how new cells and
                        organisms develop and grow.</p>
                </div>

                <!-- Learning Objectives -->
                <div class="objectives-section">
                    <div class="objectives-title">PRE-LEARNING CHECK:</div>
                    <ul class="learning-objectives">
                        <li v-for="objective in unitData.objectives" :key="objective">{{ objective }}</li>
                    </ul>
                </div>
            </div>

            <!-- Lessons -->
            <div v-if="activeTab === 'lessons'" class="lessons-content">
                <div class="lessons-header">
                    <h2 class="lessons-title q-pt-lg">Course Lessons</h2>
                    <p class="lessons-subtitle">
                        Follow the lessons in order to master the concepts
                    </p>
                </div>

                <div class="lessons-timeline">
                    <div v-for="(lesson, index) in lessons" :key="lesson.id" class="lesson-item" :class="{
                        completed: lesson.completed,
                        current: lesson.current,
                        locked: lesson.locked
                    }" @click="!lesson.locked && selectLesson(lesson)">

                        <!-- Timeline Circle -->
                        <div class="timeline-side">
                            <div class="timeline-circle">
                                <div class="circle-number">
                                    <img v-if="lesson.completed" src="assets/icons/check.png" alt="Completed"
                                        class="timeline-icon" />
                                    <img v-else-if="lesson.locked" src="assets/icons/lock.png" alt="Locked"
                                        class="timeline-icon" />
                                    <span v-else>{{ index + 1 }}</span>
                                </div>

                            </div>
                            <div v-if="index < lessons.length - 1" class="timeline-line"
                                :class="{ 'completed-line': lesson.completed }"></div>
                        </div>

                        <!-- Lesson Card -->
                        <div class="lesson-content">
                            <q-card flat bordered class="lesson-card" :class="{
                                'completed-card': lesson.completed,
                                'current-card': lesson.current,
                                'locked-card': lesson.locked
                            }">
                                <q-card-section class="lesson-card-section">
                                    <div class="lesson-content-wrapper">
                                        <div class="lesson-text-content">
                                            <h3 class="lesson-title">{{ lesson.title }}</h3>
                                            <p class="lesson-description">{{ lesson.description }}</p>
                                        </div>

                                        <div class="lesson-action">
                                            <q-btn v-if="lesson.completed" round color="green-5" size="md" dense>
                                                <img src="assets/icons/check.png" class="icon-btn" />
                                            </q-btn>
                                            <q-btn v-else-if="lesson.current" round color="primary" size="md" dense>
                                                <img src="assets/icons/play.png" class="icon-btn" />
                                            </q-btn>
                                            <q-btn v-else-if="lesson.locked" round color="grey-5" size="md" dense>
                                                <img src="assets/icons/lock.png" class="icon-btn" />
                                            </q-btn>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import { ref, reactive, onMounted, watch, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { getCurrentUser } from "src/utils/session" // session.js helper

export default {
    name: "UnitLessonPage",
    setup() {

        function goBack() {
            window.history.length > 1 ? window.history.back() : window.location.assign('/');
        }

        const router = useRouter()
        const route = useRoute()
        const activeTab = ref(route.query.tab || "introduction")

        // Color theme definitions
        const colors = {
            introduction: {
                header: '#42a7ff',
                content: '#42a7ff',
                activeTab: '#4534ff'
            },
            lessons: {
                header: '#4534ff',
                content: '#4534ff',
                activeTab: '#42a7ff'
            }
        }

        // Computed properties for dynamic colors
        const contentColor = computed(() => {
            return activeTab.value === 'introduction'
                ? colors.introduction.content
                : colors.lessons.content
        })

        const activeTabColor = computed(() => {
            return activeTab.value === 'introduction'
                ? colors.introduction.activeTab
                : colors.lessons.activeTab
        })

        // Function to get tab styles
        const getTabStyle = (tabName) => {
            if (activeTab.value === tabName) {
                return {
                    background: activeTabColor.value,
                    color: 'white !important'
                }
            }
            return {}
        }

        // Watch for tab changes and update the URL query
        watch(activeTab, (newTab) => {
            router.replace({ query: { ...route.query, tab: newTab } })
        })

        // Fetch currentUser from session.js
        const currentUser = getCurrentUser()
        console.log("Current User fetched from LocalStorage:", currentUser)

        // Check if currentUser exists and has name and section properties
        if (!currentUser || !currentUser.name || !currentUser.section) {
            console.error("Current user is not available or doesn't have valid name/section.")
            router.push({ name: "login" })
            return
        }

        const unitData = reactive({
            "title": "Cellular Reproduction and Fertilization",
            "description": "Understand how cells reproduce through mitosis and meiosis, and how fertilization occurs to form a new organism.",
            "objectives": [
                "Describe the processes of mitosis and meiosis and their roles in growth and reproduction",
                "Differentiate between asexual and sexual reproduction at the cellular level",
                "Explain how fertilization occurs and how it restores the diploid chromosome number"
            ],
            totalLessons: 8,
            estimatedTime: 8,
            difficulty: "Beginner"
        })

        const stats = reactive({
            Lessons: unitData.totalLessons,
            Hours: unitData.estimatedTime,
            Level: unitData.difficulty
        })

        const lessons = reactive([
            { id: 36, unitId: 2, chapterId: 5, title: "Lesson 1: Cellular Reproduction", description: "Learn how cells reproduce through mitosis and meiosis", route: "unit-2-chapter-5-lesson-1", type: "lesson", completed: false, current: true, locked: false },
            { id: 37, unitId: 2, chapterId: 5, title: "Lesson 2: Perpetuation of Organisms", description: "Understand how reproduction ensures the continuity of organisms", route: "unit-2-chapter-5-lesson-2", type: "lesson", completed: false, current: false, locked: true },
            { id: 38, unitId: 2, chapterId: 5, title: "Technology in Focus", description: "Explore technological tools used to study cellular reproduction", route: "chapter-5-technology", type: "special", completed: false, current: false, locked: true },
            { id: 39, unitId: 2, chapterId: 5, title: "Chapter Review", description: "Review key concepts about cellular reproduction and fertilization", route: "chapter-5-review", type: "review", completed: false, current: false, locked: true },
            { id: 40, unitId: 2, chapterId: 5, title: "Activity 8: Meiosis: Modeling Crossing-Over", description: "Perform a hands-on activity modeling crossing-over during meiosis", route: "chapter-5-activity-8", type: "activity", completed: false, current: false, locked: true },
            { id: 41, unitId: 2, chapterId: 5, title: "Activity 9: Sexual Reproduction in Plants", description: "Explore how sexual reproduction occurs in plants", route: "chapter-5-activity-9", type: "activity", completed: false, current: false, locked: true },
            { id: 42, unitId: 2, chapterId: 5, title: "Chapter Test", description: "Assess your understanding of cellular reproduction and fertilization", route: "chapter-5-test", type: "test", completed: false, current: false, locked: true }
        ])

        // Load progress from localStorage and apply sequential unlocking
        const loadProgress = () => {
            const userProgress = currentUser.progress || {}

            lessons.forEach((lesson, index) => {
                const progress = userProgress[lesson.id] || { completed: false }
                lesson.completed = progress.completed

                if (index === 0) {
                    lesson.locked = false
                } else {
                    lesson.locked = !lessons[index - 1].completed
                }

                lesson.current = !lesson.completed && !lesson.locked
            })
        }

        const selectLesson = (lesson) => {
            if (lesson.locked) return
            router.push({ path: lesson.route })
        }

        const completeLesson = (lessonId) => {
            currentUser.progress[lessonId] = { completed: true }
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            loadProgress()
        }

        onMounted(() => {
            loadProgress()
        })

        return {
            activeTab,
            unitData,
            stats,
            lessons,
            selectLesson,
            completeLesson,
            goBack,
            contentColor,
            activeTabColor,
            getTabStyle
        }
    }
}
</script>



<style lang="scss">
.chapter-page {
    font-family: "MyFont", sans-serif;
    min-height: 100vh;
    padding-bottom: 20px;
    overflow: hidden;
    transition: background 0.3s ease;
}

.toolbar-title {
    font-size: 28px;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    color: white !important;
    z-index: 2;
    pointer-events: none;
}

/* Remove header shadow */
.q-header {
    box-shadow: none !important;
    border-bottom: none !important;
    transition: background 0.3s ease !important;
}

/* Center the toolbar content */
.q-toolbar {
    position: relative !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100%;
}

/* Back Button positioning */
.q-header .q-btn {
    position: absolute !important;
    left: 12px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 3 !important;
    background: transparent !important;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease;
}

.q-header .q-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateY(-50%) scale(1.05) !important;
}

/* Reset Quasar default title color if used elsewhere */
.q-header .q-toolbar-title {
    color: white !important;
}

/* Icon color reset */
.q-icon {
    -webkit-text-fill-color: white !important;
    color: white !important;
}

.top-navbar {
    position: fixed;
    top: 50px;
    /* adjust if header height changes */
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    z-index: 10;

    background: white;

    border-bottom: 4px solid #3b28cc;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);

    border-radius: 12px;
    overflow: hidden;

    .tab-button {
        padding: 12px 16px;
        min-height: 48px;
        font-weight: 600;
        color: #4b5563;
        transition: all 0.3s ease;

        &:hover {
            background: #f3f4f6;
            color: #1f2937;
        }

        &.q-tab--active {
            box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15);
        }
    }
}

.q-tab__label {
    font-family: "MyFont", sans-serif !important;
    font-weight: 900;
}

.content-area {
    width: 95%;
    margin: 0 auto;
    padding-top: 25px;
    /* matches fixed tab height */
    padding-bottom: 20px;
}

// Introduction Styles - Mobile First
.chapter-label {
    font-size: 2rem;
    font-weight: 700;
    color: #fbbf24;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
}

// New Introduction Header Styles with Wide Image
.introduction-content {
    padding: 16px;
    background: transparent;
}

.introduction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0 1rem;
    /* Reduced from 2rem 0 1.5rem */
    padding-bottom: 1rem;
    border-bottom: 2px solid rgb(255, 255, 255);

    .intro-text {
        flex: 1;
        max-width: 60%;

        .intro-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #ffffff;
            line-height: 1.3;
        }

        .intro-description {
            font-family: 'MyFont', sans-serif;
            font-size: 1rem;
            text-align: justify;
            color: #f7f7f7;
            line-height: 1.6;
            font-weight: 600;
        }
    }

    .intro-image-wide {
        width: 45%;
        min-width: 250px;
        height: 220px;
        /* Increased height */
        object-fit: cover;
        /* Ensures image fills the space properly */
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 3px solid #ffffff;
        filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.2));
        transition: all 0.3s ease;

        &:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
    }
}

// Text above PRE-LEARNING CHECK
.pre-learning-intro {
    margin: 1.5rem 0;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;

    p {
        font-size: 1rem;
        line-height: 1.6;
        color: #374151;
        margin-bottom: 12px;
        text-align: justify;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

// Learning Objectives
.objectives-section {
    margin-top: 1.5rem;
    /* Reduced from 2rem */
    background-color: white;
    padding: 12px;
    border-radius: 8px;

    .objectives-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
    }
}

.learning-objectives {
    list-style: none;
    padding-left: 0;

    li {
        position: relative;
        padding-left: 24px;
        margin-bottom: 12px;
        font-size: 1rem;
        line-height: 1.5;
        color: #374151;

        &::before {
            content: '•';
            position: absolute;
            left: 8px;
            color: #3b28cc;
            font-weight: bold;
            font-size: 1.2rem;
        }
    }
}

// Lessons Styles
.icon-btn {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.lessons-content {
    padding: 16px;
    background: transparent;
}

.lessons-header {
    margin-bottom: 2px;

    .lessons-title {
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        margin: 0
    }

    .lessons-subtitle {
        font-size: 14px;
        color: #ffffff;
        margin-bottom: 1em;
    }
}

.lessons-timeline {
    position: relative;
}

.lesson-item {
    position: relative;
    display: flex;
    margin-bottom: 32px;
    cursor: pointer;
    min-height: 72px;

    &.locked {
        cursor: not-allowed;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.timeline-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
}


.timeline-side {
    position: relative;
    flex-shrink: 0;
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 72px;
}

.timeline-circle {
    position: relative;
    z-index: 2;
    margin-bottom: 0px;

    .circle-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        background: #e0e0e0;
        color: #666;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
}

.timeline-line {
    position: absolute;
    top: 36px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: #e0e0e0;
    z-index: 1;

    &.completed-line {
        background: #4caf50;
    }
}

.lesson-content {
    flex: 1;
    margin-left: 12px;
}

.lesson-card {
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    min-height: 48px;
    overflow: hidden;

    &:active {
        transform: translateY(2px);
        box-shadow: 0 2px 0 currentColor !important;
    }

    &.completed-card {
        border: none;
        background: #10b981;
        border-bottom: 4px solid #086143;

        .lesson-title,
        .lesson-description {
            color: white;
        }
    }

    &.current-card {
        border: none;
        background: #2699f7;
        border-bottom: 4px solid #1f4d97;
        position: relative;

        .lesson-title,
        .lesson-description {
            color: rgb(255, 255, 255);
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 2s infinite;
        }
    }

    &.locked-card {
        border: none;
        background: #e9a82f;
        border-bottom: 4px solid #bb8528;

        .lesson-title,
        .lesson-description {
            color: white;
        }
    }
}

@keyframes shimmer {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}

.lesson-card-section {
    padding: 12px 16px;
}

.lesson-content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.lesson-text-content {
    flex: 1;
    min-width: 0;

    .lesson-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
        line-height: 1.3;
    }

    .lesson-description {
        font-size: 14px;
        color: #666;
        margin: 0 0 12px 0;
        line-height: 1.4;
    }
}

.lesson-action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

// Lesson Status Colors
.lesson-item {
    &.completed .circle-number {
        background: #4caf50;
        color: white;
        border-color: #4caf50;
    }

    &.current .circle-number {
        background: #ffffff;
        color: rgb(45, 42, 255);
        border-color: #c0baff;
        box-shadow: 0 0 0 3px rgba(59, 40, 204, 0.2);
    }

    &.locked .circle-number {
        background: #bdbdbd;
        color: white;
    }
}

// Tablet and Desktop Optimizations
@media (min-width: 600px) {
    .top-navbar {
        width: 100%;
        margin: 0;

        .tab-button {
            font-size: 16px;
            padding: 16px 24px;
        }
    }

    .content-area {
        width: 90%;
        padding-top: 65px;
        /* Reduced from 80px */
    }

    .introduction-content,
    .lessons-content {
        padding: 24px;
    }

    .introduction-header {
        margin: 1.5rem 0 1.5rem;
        /* Reduced from 3rem 0 2rem */

        .intro-text {
            .intro-title {
                font-size: 1.8rem;
            }

            .intro-description {
                font-size: 1.1rem;
            }
        }

        .intro-image-wide {
            width: 40%;
            min-width: 300px;
            height: 250px;
            /* Even larger on tablets */
        }
    }

    .pre-learning-intro p {
        font-size: 1.1rem;
    }

    .objectives-section {
        .objectives-title {
            font-size: 1.4rem;
        }
    }

    .learning-objectives li {
        font-size: 1.1rem;
    }

    .lessons-timeline {
        max-width: 700px;
        margin: 0 auto;
    }

    .timeline-side {
        width: 60px;
    }

    .timeline-circle .circle-number {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }

    .timeline-line {
        top: 40px;
    }

    .lesson-content {
        margin-left: 20px;
    }

    .lesson-card:hover:not(.locked-card) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .lesson-text-content .lesson-title {
        font-size: 18px;
    }

    .lesson-text-content .lesson-description {
        font-size: 15px;
    }

    .icon-btn {
        width: 18px;
        height: 18px;
    }
}

@media (min-width: 1024px) {

    .introduction-content,
    .lessons-content {
        padding: 40px;
    }

    .introduction-header {
        .intro-text {
            .intro-title {
                font-size: 2rem;
            }

            .intro-description {
                font-size: 1.2rem;

            }
        }

        .intro-image-wide {
            width: 35%;
            min-width: 350px;
            height: 280px;
            /* Largest on desktop */
        }
    }
}

@media (max-width: 600px) {
    .introduction-header {
        flex-direction: column;
        text-align: center;

        .intro-text {
            max-width: 100%;
            margin-bottom: 1rem;
        }

        .intro-image-wide {
            width: 100%;
            min-width: 300px;
            height: 250px;
            /* Still larger than original on mobile */
        }
    }
}
</style>