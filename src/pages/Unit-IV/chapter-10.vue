<template>
    <q-page class="chapter-page">
        <!-- Top Navigation Tabs -->
        <div class="top-navbar">
            <q-tabs v-model="activeTab" align="justify" indicator-color="primary" active-color="primary"
                class="text-grey-7" mobile-arrows outside-arrows>
                <q-tab name="introduction" label="Introduction" class="tab-button" />
                <q-tab name="lessons" label="Lessons" class="tab-button" />
            </q-tabs>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Introduction -->
            <div v-if="activeTab === 'introduction'" class="introduction-content">
                <!-- New Introduction Header -->
                <div class="introduction-header">
                    <div class="intro-text">
                        <div class="chapter-label">CHAPTER 10</div>
                        <h2 class="intro-title">{{ unitData.title }}</h2>
                        <p class="intro-description">{{ unitData.description }}</p>
                    </div>
                    <img src="src/pages/Unit-IV/img/earthquakeandfaults.png" alt="Earthquakes and Faults Icon"
                        class="intro-image-wide">
                </div>

                <!-- Text above PRE-LEARNING CHECK -->
                <div class="pre-learning-intro">
                    <p>On October 15, 2013, a 7.2 magnitude earthquake hit Bohol and destroyed a number of
                        infrastructure.</p>
                    <p>In this chapter, you will learn about earthquakes and faults, their causes, and the effects they
                        can have on our communities.</p>
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
                    <div class="chapter-label">CHAPTER 10</div>
                    <h2 class="lessons-title">Course Lessons</h2>
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
                                    <span v-if="lesson.completed">✓</span>
                                    <span v-else-if="lesson.locked">🔒</span>
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
                                                <img src="/assets/icons/check.png" class="icon-btn" />
                                            </q-btn>
                                            <q-btn v-else-if="lesson.current" round color="primary" size="md" dense>
                                                <img src="/assets/icons/play.png" class="icon-btn" />
                                            </q-btn>
                                            <q-btn v-else-if="lesson.locked" round color="grey-5" size="md" dense>
                                                <img src="/assets/icons/lock.png" class="icon-btn" />
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
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getCurrentUser } from "src/utils/session" // session.js helper

export default {
    name: "UnitLessonPage",
    setup() {
        const router = useRouter()
        const activeTab = ref("introduction")

        // Fetch currentUser from session.js
        const currentUser = getCurrentUser()
        console.log("Current User fetched from LocalStorage:", currentUser)

        // Check if currentUser exists and has name and section properties
        if (!currentUser || !currentUser.name || !currentUser.section) {
            console.error("Current user is not available or doesn't have valid name/section.");
            router.push({ name: "login" })
            return
        }

        const unitData = reactive({
            title: "Earthquakes and Faults",
            description: "Understanding how faults and plate boundaries that generate earthquakes can help people prepare for earthquake-related disasters.",
            objectives: [
                "What is an earthquake?",
                "What causes earthquakes?",
                "What types of damage can earthquakes cause?"
            ],
            totalLessons: 7
        })

        const stats = reactive({
            Lessons: unitData.totalLessons
        })

        const lessons = reactive([
            { id: 1, title: "Lesson 1: Understanding Earthquakes", description: "Learn about what causes earthquakes", route: "unit-1-chapter-1-lesson-1", completed: false, current: true, locked: false },
            { id: 2, title: "Lesson 2: Types of Faults", description: "Understanding different fault systems", route: "unit-1-chapter-1-lesson-2", completed: false, current: false, locked: true },
            { id: 3, title: "Lesson 3: Seismic Waves", description: "Introduction to P-waves, S-waves, and surface waves", route: "unit-1-chapter-1-lesson-3", completed: false, current: false, locked: true },
            { id: 4, title: "Lesson 4: Earthquake Measurement", description: "Learn about Richter scale and seismographs", route: "unit-1-chapter-1-lesson-4", completed: false, current: false, locked: true },
            { id: 5, title: "Technology in Focus", description: "Modern earthquake detection technology", route: "chapter-1-technology", completed: false, current: false, locked: true },
            { id: 6, title: "Chapter Review", description: "Review key concepts about earthquakes and faults", route: "chapter-1-review", completed: false, current: false, locked: true },
            { id: 7, title: "Activity 1: Fault Modeling", description: "Practical activity to understand fault movements", route: "chapter-1-activity", completed: false, current: false, locked: true }
        ])

        // Load progress from localStorage and apply sequential unlocking
        const loadProgress = () => {
            // Fetch currentUser from localStorage to update the progress
            const userProgress = currentUser.progress || {}

            lessons.forEach((lesson, index) => {
                const progress = userProgress[lesson.id] || { completed: false }

                lesson.completed = progress.completed

                if (index === 0) {
                    lesson.locked = false // First lesson is always unlocked
                } else {
                    lesson.locked = !lessons[index - 1].completed // Lock lessons if previous isn't completed
                }

                lesson.current = !lesson.completed && !lesson.locked // Mark the current lesson
            })
        }

        const selectLesson = (lesson) => {
            if (lesson.locked) return
            router.push({ path: lesson.route })
        }

        // Save progress to localStorage after each lesson completion
        const completeLesson = (lessonId) => {
            currentUser.progress[lessonId] = { completed: true }
            // Save updated user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            loadProgress() // Reload progress after completion
        }

        onMounted(() => {
            loadProgress() // Initialize lesson progress on page load
        })

        return { activeTab, unitData, stats, lessons, selectLesson, completeLesson }
    }
}
</script>

<style lang="scss">
.chapter-page {
    font-family: "MyFont", sans-serif;
    min-height: 100vh;
    padding-bottom: 20px;
    overflow: hidden;
}

.top-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
    margin: 0;
    background: #f5f3ff;
    border: 2px solid #c4b5fd;
    border-bottom: 4px solid #8b5cf6;
    box-shadow: 0 3px 8px rgba(139, 92, 246, 0.15);

    .tab-button {
        padding: 12px 16px;
        min-height: 48px;
        font-weight: 600;
        color: #4b5563;
        transition: all 0.3s ease;

        &:hover {
            background: #ddd6fe;
            color: #4c1d95;
        }

        &.q-tab--active {
            background: #8b5cf6;
            color: white !important;
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
    padding-top: 70px;
    /* Reduced from 80px */
    padding-bottom: 20px;
}

// Chapter Label Styles
.chapter-label {
    font-size: 2rem;
    font-weight: 700;
    color: #8b5cf6;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
}

// New Introduction Header Styles with Wide Image
.introduction-content {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 16px;
}

.introduction-header {
    padding-top: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0 1rem;
    /* Reduced from 2rem 0 1.5rem */
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.3);

    .intro-text {
        flex: 1;
        max-width: 60%;

        .intro-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #1976d2;
            line-height: 1.3;
        }

        .intro-description {
            font-family: 'Nunito', sans-serif;
            font-size: 1rem;
            text-align: justify;
            color: #555;
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
        border: 3px solid #1976d2;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
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
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #1976d2;

    p {
        font-size: 1rem;
        line-height: 1.6;
        color: #555;
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

    .objectives-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
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
        color: #555;

        &::before {
            content: '•';
            position: absolute;
            left: 8px;
            color: #1976d2;
            font-weight: bold;
            font-size: 1.2rem;
        }
    }
}

// Lessons Styles
.icon-btn {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.lessons-content {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 16px;
}

.lessons-header {
    margin-bottom: 2px;

    .lessons-title {
        font-size: 20px;
        font-weight: bold;
        color: #1976d2;
        margin: 0
    }

    .lessons-subtitle {
        font-size: 14px;
        color: #666;
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
        background: #3b82f6;
        border-bottom: 4px solid #1f4d97;
        position: relative;

        .lesson-title,
        .lesson-description {
            color: white;
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
        background: #f59e0b;
        border-bottom: 4px solid #996305;

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
        background: #1976d2;
        color: white;
        border-color: #1976d2;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
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