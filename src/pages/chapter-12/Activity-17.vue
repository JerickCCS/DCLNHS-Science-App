<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 17: Earth's Seasons</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
                        @click="toggleBookmark" />
                </div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="primary" class="header-progress" />
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

                        <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>

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
        const lessonId = lesson ? String(lesson.id) : "91"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="banner">
        <img src="assets/img/chapter 12/activity 17.png" alt="activity 17">
        <p style="display: none;">Activity 17</p>
      </div>
          <div class="title">Earth's Seasons</div>
        </div>
      </div>
      <p><strong>OBJECTIVE</strong></p>
      <p style="padding-left:10px;">Make a model of Earth's seasons</p>
      <p><strong>MATERIALS</strong></p>
      <p style="padding-left:10px;">
  <span style="color:#e63946;">■</span> Globe
</p>
<p style="padding-left:10px;">
  <span style="color:#457b9d;">■</span> Light bulb setup
</p>
<p style="padding-left:10px;">
  <span style="color:#2a9d8f;">■</span> Iron clamp
</p>
<p style="padding-left:10px;">
  <span style="color:#f4a261;">■</span> Iron stand
</p>

    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p><strong>PROCEDURE</strong></p>
      <p>A. North Pole pointing toward the light bulb</p>
      <p style="padding-left:10px;">1. Attach the iron clamp to the iron stand.</p>
      <p style="padding-left:10px;">2. Mount the lightbulb using the clamp attached to the iron stand.</p>
      <p style="padding-left:10px;">3. Position the globe in such a way that the North Pole is 23.5° toward the light bulb.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/activity 17-1.png" alt="activity 17-1">
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>4. Observe the illuminated part of the globe.</p>
      <p>5. Rotate the globe counterclockwise. Observe which part of the globe receives direct light.</p>
      <p>6. Compare the surface area of the Northern Hemisphere with that of the Southern Hemisphere that receives light.</p>
      <p>7. Illustrate your setup and observations in the Data and Results. Show the part of the globe that receives sunlight by shading the part that does not receives sunlight.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>B. North Pole pointing away from the light bulb</p>
      <p style="padding-left:10px;">1. Repeat step 3 of procedure A, but this time, position the North Pole such that it points away from the light.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/activity 17-2.png" alt="activity 17-1">
      </div>
      <p style="padding-left:10px;">2. Observe the illuminated part of the globe.</p>
      <p style="padding-left:10px;">3. Rotate the globe counterclockwise. Observe which part of the globe receives direct light.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>4. Compare the surface area of the Northern Hemisphere with that of the Southern Hemisphere that receives light.</p>
      <p>5. Illustrate your setup and observations in the Data and Results. Show the part of the globe that receives sunlight by shading the part that does not receive sunlight.</p>
      <p>C. Equator facing the light bulb</p>
      <p>1. Repeat step 3 of procedure A, but position the equator such that it faces the light.</p>
      <p>2. Observe the illuminated part of the globe.</p>
      <p>3. Rotate the globe counterclockwise. Observe which part of the globe receives direct light.</p>
      <p>4. Compare the surface area of the Northern Hemisphere with that of the Southern Hemisphere that receives light.</p>
      <p>5. Illustrate your setup and observations in the Data and Results.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <p><strong>DATA AND RESULTS</strong></p>
      <p>Illustration for Procedure A Setup</p>
      <p>Illustration for Procedure B Setup</p>
      <p>Illustration for Procedure A Setup</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p><strong>ANALYSIS AND INTERPRETATION</strong></p>
      <p>1. In the setup, what is represented by the globe and the light bulb?</p>
      <p>2. When the North Pole is tilted toward the sun, (a) which part of the Earth receives direct rays from the sun? (b) which hemisphere receives a greater amount of sunlight? (c) how does the length of daytime compare with that of nighttime? What season does the North Pole experience at this time? the South Pole?</p>
      <p>3. When the North Pole is tilted away from the sun, (a) which part of the Earth receives direct rays from the sun? (b) which hemisphere receives a greater amount of sunlight? (c) how does the length of daytime compare with that of nighttime? What season does the North Pole experience at this time? the South Pole?</p>
      <p>4. When the equator is facing toward the sun, (a) which part of the Earth receives direct rays from the sun? (b) which hemisphere receives a greater amount of sunlight? (c) how does the length of daytime compare with that of nighttime?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p><strong>GENERALIZATION</strong></p>
      <p style="padding-left:10px;">What causes the Earth's seasons?</p>
      <p><strong>APPLICATION</strong></p>
      <p style="padding-left:10px;">1. If the Earth were not tilted, would there be seasons? Explain.</p>
      <p style="padding-left:10px;">2. Why do some parts of the world experience winter, while at the same time others are experiencing summer?</p>
      <p style="padding-left:10px;">3. Why is there no winter in the Philippines?</p>
    </div>
    `
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
            boxShadow: "0 8px 0 0 #db0e00"
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
            if (!route.query._reloaded) {
                router.replace({ path: route.path, query: { ...route.query, _reloaded: '1' } }).then(() => {
                    window.location.reload()
                })
                return
            }

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

        onUnmounted(() => { audioManager.restoreBg() })

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