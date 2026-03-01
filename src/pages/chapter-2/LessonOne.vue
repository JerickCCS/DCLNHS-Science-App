<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Lesson 1: The Particles of Matter</div>
                <button class="bookmark-btn" @click="toggleBookmark">
                    <span class="material-icons"
                        :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">{{ isBookmarked ?
                            'bookmark' : 'bookmark_border' }}</span>
                </button>
            </div>
            <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
        </q-header>

        <q-page-container class="night-sky">
            <q-page>
                <div class="stars"></div>
                <div class="lesson-container">
                    <div id="viewer">
                        <transition name="fade-slide" mode="out-in">
                            <div :key="currentPage" v-html="pages[currentPage]"></div>
                        </transition>
                    </div>

                    <div class="buttons">
                        <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage"
                            no-caps>Previous</q-btn>

                        <div class="text-subtitle2 text-white">{{ currentPage + 1 }} / {{ pages.length }}</div>

                        <q-btn class="nav-button" @click="nextPage"
                            :label="currentPage === pages.length - 1 ? 'Finish' : 'Next'"
                            :style="currentPage === pages.length - 1 ? finishButtonStyle : null" no-caps />
                    </div>

                    <div class="speak-btn" @click="toggleAudio">
                        <img :src="isPlaying ? '/icons/stop.png' : '/icons/speak.png'" alt="Speak Button"
                            class="cursor-pointer" style="width: 20px; height: 20px;" />
                    </div>
                </div>
            </q-page>
        </q-page-container>

        <audio id="lesson-complete-audio" src="assets/audio/completed.mp3" preload="auto"></audio>

        <q-dialog v-model="showLessonComplete" @show="startConfetti" @hide="stopConfetti" persistent>
            <q-card class="lesson-complete-card q-pa-md text-center relative-position">
                <q-card-section>
                    <div class="stars-row flex justify-center items-center q-gutter-md">
                        <img src="assets/icons/five-stars.gif" class="star-icon big-star" />
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="text-h6 text-bold">🎉 Congratulations!</div>
                    <div class="text-subtitle2 q-mt-sm">You have completed this lesson.</div>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn label="OK" color="primary" unelevated rounded class="lesson-ok-btn" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-layout>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTTS } from "src/composables/useTTS"
import confetti from "canvas-confetti"
import { getCurrentUser, setCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"
import { LocalStorage } from "quasar"
import '@google/model-viewer';
import { audioManager } from "src/utils/audioManager"
import { onBeforeRouteLeave } from "vue-router"

export default {
    name: "ScientificModelsLesson",
    setup() {
        const route = useRoute()
        const router = useRouter()
        const currentPage = ref(0)
        const progress = ref(0)
        const showLessonComplete = ref(false)

        // --- TTS composable ---
        const { isPlaying, toggleAudio, stopSpeaking } = useTTS()

        const currentUser = ref(getCurrentUser())
        let confettiInterval = null
        const lesson = flatLessons.find(l => l.route === route.path)
        const lessonId = lesson ? String(lesson.id) : "9"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="title">The Particle of Matter</div>
        </div>
        <p style="font-weight: bold; padding-top: 10px; margin-bottom: 5px;">What does the "particle nature of matter" mean?</strong></p>
        <p>Democritus's idea of a fundamental particle established the foundation for the concept of the particle nature of matter-the idea that matter is made up of discrete and indivisible particles. Hence, matter is considered discontinuous. This idea implies that a piece of matter cannot be divided perpetually. This is contrary to Aristotle's idea that matter is continuous and can be divided indefinitely into smaller pieces. The particle model of matter is a fundamental scientific model, which helps us understand the nature of matter, and it includes the following essential principles:</p>
    </div>
    `,
            `
    <div>
        <p><strong>1.</strong> Matter is made up of discrete particles.</p>
        <p><strong>2.</strong>There is empty space between the particles.</p>
        <p><strong>3.</strong> The particles are in constant motion.</p>
        <p><strong>4.</strong> Forces act between the particles.</p>
        <p>This model is essential when studying the behavior of particles at the molecular and atomic levels.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/matter.png" alt="illustration">
        </div>
    </div>
    `,
            `
    <div>
        <div class="title">Discrete Particles of Matter</div>
        <p>You can touch and see the bulk of matter, but you cannot distinguish the atoms that compose them. Recall that an atom is the basicbuildingunit of matter. Thus, the idea of discrete particles of matter is abstract. These particles-which can be discrete atoms or chemically combined atoms-are usually represented using scientific models such as conceptual diagrams, particle drawings, and even computer simulations. These representations will be discussed further in the succeeding lessons.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/discrete particles.png" alt="illustration">
        </div>
    </div>
    `,
            `
    <div>
        <div class="title">Empty Space between Particles</div>
        <p>Aristotle's idea of the continuity of matter implies that all space is filled with matter and that there is no such thing as empty space. This idea is contradicted by the principle of the particle nature of matter, which states that empty space exists between particles of matter. Let us verify this idea by doing Mini Lab 2-1.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/empty space.png" alt="illustration">
        </div>
    </div>
    `,
            `
    <div>
        <div class="info-card">
            <div class="info-title">MINI LAB 2-1</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p><i>Materials:</i> brown sugar, water, drinking glass, and teaspoon</p>
                        <p><i>Procedure:</i></p>
                        <p><strong>1.</strong> Fill the glass halfway with water.</p>
                        <p><strong>2.</strong> Add one-half teaspoon of sugar to the water and stir until it's completely dissolved.</p>
                        <p><i>Guide Questions</i></p>
                        <p><strong>1.</strong> What happened to the sugar and water particles in the solution? What do you think their particle arrangement looks like in the solution?</p>
                        <p><strong>2.</strong> How will you explain your observations in terms of the idea that particles of matter have spaces between them?</p>
                    </div>
                    <div class="start-btn-container">
                        <q-btn data-route="/mini-lab-2-1" unelevated class="start-btn">
                            Answer
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="title">Particles in Constant Motion</div>
        <p>Smoke can diffuse very easily in the air. The smell of chicken adobo cooking on the stove quickly spreads across the kitchen. An inflated balloon usually becomes smaller after a day or two. These situations be explained by the tendency of the particles of mattereven those of solids—to move and spread in all directions. What other situations verify that particles of matter are in constant motion?</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-1.png" alt="figure 2-1">
            <div class="caption">The smoke from foods spreads in the air while cooking</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="title">Forces Between Particles</div>
        <p>Have you observed beads of water on the windshield of a car? How will you explain this phenomenon?</p>
        <p>The formation of beads of water on a surface supports the idea that attractive forces act between the particles of matter. These forces keep the particles of water in the beads together. In many other forms of matter, these forces impact and influence the different properties of substances or materials.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-2.png" alt="figure 2-2">
            <div class="caption">The formation of beads of water on a windshield is the result of the tendency of water molecules to attract one another.</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="info-card">
            <div class="info-title">MINI LAB 2-2</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p><i>Materials:</i> water, piece of wax paper, toothpick, and dropper</p>
                        <p><i>Procedure:</i></p>
                        <p><strong>1.</strong> Place a drop of water on the wax paper.</p>
                        <p><strong>2.</strong> Tilt the wax paper in any direction so that the drop of water moves across but does not fall off the paper. Does the drop of water break as you move the wax paper?</p>
                        <p><strong>3.</strong> Using the toothpick, break the droplet into two. Is it easy to break the water droplet?</p>
                        <p><strong>4.</strong> Use the toothpick again to bring the two droplets near each other. How do the two droplets behave?</p>
                    </div>
                    <div class="start-btn-container">
                        <q-btn data-route="/mini-lab-2-2" unelevated class="start-btn">
                            Answer
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="info-card">
            <div class="info-title">MINI TEST 2-1</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p><strong>1.</strong> Based on what you have learned about scientific models in Chapter 1, make illustrative representations of the basic principles of the particle nature of matter. Compare your drawings with a classmate's. Agree on which output best represents the principles.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

        ])

        // --- Lesson completion ---
        const isLessonComplete = computed(() =>
            currentUser.value?.progress?.[lessonId]?.completed || false
        )

        const markLessonComplete = () => {
            if (!currentUser.value) return
            if (!currentUser.value.progress) currentUser.value.progress = {}

            currentUser.value.progress[lessonId] = {
                ...currentUser.value.progress[lessonId],
                completed: true
            }

            setCurrentUser(currentUser.value)

            let students = LocalStorage.getItem("students") || []
            students = students.map(student =>
                student.id === currentUser.value.id
                    ? { ...student, progress: currentUser.value.progress }
                    : student
            )
            LocalStorage.set("students", students)
            currentUser.value = getCurrentUser()
        }

        const finishButtonStyle = {
            background: "#fe3223",
            color: "#fff",
            boxShadow: "7px 7px 0px 0px rgba(0, 0, 0, 0.16)"
        }

        // --- Bookmarks ---
        const saveBookmarks = (bookmarksArr) => {
            const user = getCurrentUser()
            if (!user) return
            const key = user.studentId ?? user.id ?? user.name
            let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
            allBookmarks[key] = bookmarksArr
            localStorage.setItem("bookmarks", JSON.stringify(allBookmarks))
        }

        const loadBookmarks = () => {
            const user = getCurrentUser()
            if (!user) return []
            const key = user.studentId ?? user.id ?? user.name
            let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
            return allBookmarks[key] || []
        }

        const toggleBookmark = () => {
            const bookmark = { route: route.name || route.path, page: currentPage.value, lessonId }
            let existing = loadBookmarks()
            const index = existing.findIndex(b => b.route === bookmark.route && b.page === bookmark.page)
            if (index !== -1) existing.splice(index, 1)
            else existing.push(bookmark)
            saveBookmarks(existing)
            bookmarkedPages.value = loadBookmarks()
        }

        const isBookmarked = computed(() =>
            bookmarkedPages.value.some(
                b => b.route === (route.name || route.path) && b.page === currentPage.value
            )
        )

        // --- Progress & Navigation ---
        const updateProgress = () => { progress.value = (currentPage.value + 1) / pages.value.length }

        onBeforeRouteLeave(() => {
            stopSpeaking()
        })

        const nextPage = () => {
            if (isPlaying.value) stopSpeaking()
            if (currentPage.value < pages.value.length - 1) {
                currentPage.value++
                updateProgress()
            } else {
                markLessonComplete()
                showLessonComplete.value = true
            }
        }

        const prevPage = () => {
            if (isPlaying.value) stopSpeaking()
            if (currentPage.value > 0) {
                currentPage.value--
                updateProgress()
            }
        }

        const goBack = () => {
            if (window.history.length > 1) router.back()
            else router.push("/chapters")
        }

        watch(currentPage, (newPage) => {
            router.replace({ path: route.path, query: { page: newPage } })
        })

        // --- Confetti ---
        const startConfetti = () => {
            stopConfetti()
            const audio = document.getElementById("lesson-complete-audio")
            if (audio) { audio.currentTime = 0; audio.play().catch(() => { }) }
            confettiInterval = setInterval(() => {
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
            }, 500)
        }

        const stopConfetti = () => {
            if (confettiInterval) { clearInterval(confettiInterval); confettiInterval = null }
        }

        // --- Lifecycle ---
        onMounted(() => {
            /* Reload Fix */

            currentUser.value = getCurrentUser()
            bookmarkedPages.value = loadBookmarks()
            updateProgress()

            const pageFromQuery = parseInt(route.query.page, 10)
            if (!isNaN(pageFromQuery) && pageFromQuery < pages.value.length) currentPage.value = pageFromQuery

            // Stars animation
            const starContainer = document.querySelector('.stars')
            if (starContainer) {
                for (let i = 0; i < 100; i++) {
                    const star = document.createElement('div')
                    star.classList.add('star')
                    star.style.top = Math.random() * 100 + '%'
                    star.style.left = Math.random() * 100 + '%'
                    star.style.width = (Math.random() * 2 + 1) + 'px'
                    star.style.height = star.style.width
                    star.style.animationDuration = (2 + Math.random() * 3) + 's'
                    star.style.animationDelay = (Math.random() * 3) + 's'
                    starContainer.appendChild(star)
                }
            }

            // Click to navigate mini-tests
            const viewer = document.querySelector('#viewer')
            if (viewer) {
                viewer.addEventListener('click', (e) => {
                    const target = e.target.closest('[data-route]')
                    if (target) router.push(target.dataset.route)
                })
            }
        })

        onUnmounted(() => {
            stopSpeaking()
            stopConfetti()
            audioManager.restoreBg()
        })

        return {
            currentPage,
            isPlaying,
            pages,
            showLessonComplete,
            bookmarkedPages,
            progress,
            isBookmarked,
            finishButtonStyle,
            toggleAudio: () => toggleAudio(pages.value[currentPage.value]),
            nextPage,
            prevPage,
            goBack,
            toggleBookmark,
            startConfetti,
            stopConfetti,
            currentUser,
            isLessonComplete,
            markLessonComplete
        }
    }
}
</script>


<style src="src/css/lessonBackground.css"></style>
<style src="src/css/lesson.css" scoped></style>
