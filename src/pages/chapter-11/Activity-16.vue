<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar> <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack"
                    class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 16: Amount of Water Vapor in the Air</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
                        @click="toggleBookmark" />
                </div>
            </q-toolbar>
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
        const lessonId = lesson ? String(lesson.id) : "84"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div>
          <div class="title">ACTIVITY 16</div>
        </div>
      </div>
<p>Amount of Water Vapor in the Air</p>
<p>Humidity pertains to the amount of water vapor in the air. It can be absolute or relative. Absolute humidity pertains to the actual amount of water vapor in a given volume of air; it is independent of temperature. Relative humidity, on the other hand, pertains to the percentage of the water vapor in a given volume of air with respect to the maximum amount that the air can hold. Relative humidity depends on temperature. Absolute humidity is expressed in %.</p>
<p>OBJECTIVE</p>
<p>Measure the amount of water vapor in the air</p>

<p>MATERIALS</p>
<table style="border-collapse: collapse;">
  <tr>
    <td>■ Water at room temperature</td>
    <td>■ Two laboratory thermometers</td>
  </tr>
  <tr>
    <td>■ Standard relative humidity chart</td>
    <td>■ Two strings (20 cm long each illustration board)</td>
  </tr>
  <tr>
    <td>■ Cotton wick</td>
    <td>■ Stopwatch or timer</td>
  </tr>
  <tr>
    <td>■ Adhesive tape</td>
  </tr>
</table>
    </div>
    `
            ,
            `
    <div>
        <p>PROCEDURE</p>
        
        <p style="padding-left: 10px;">1. Attach the strings to the upper part of the illustration board to form the handles.</p>
<p style="padding-left: 10px;">2. Tape two thermometers side by side on the illustration board with their bulbs hanging off the bottom of the illustration board</p>
<p style="padding-left: 10px;">3. Moisten the cotton wick with water at room temperature. Squeeze out the excess liquid.</p>
<p style="padding-left: 10px;">4. Place the damp cotton wick around the bulb of one of the thermometers. Do not get the other thermometer wet. The device you assembled in steps 1 - 4 is an example of psychrometer, a device used to measure humidity.</p>
<div class="illustration">
      <img src="assets/img/chapter 11/figure 3.png" alt="Placeholder">
      <div class="caption">Figure 3. Improvised pyschrometer</div>
    </div>
        </div>
    `
            ,
            `
    <div>
        <p style="padding-left: 10px;">5. Swing around the psychrometer by its string handle</p>

        <p style="padding-left: 10px;">6. Get the thermometer readings in degrees Celsius after 10 minutes. The dry thermometer measures air thermometer, while the wet thermometer determines the evaporation temperature. Record these in Data and Results</p>
<p style="padding-left: 10px;">7. Do steps 5 and 6 three times</p>

<p><strong>DATA AND RESULTS</strong></p>
<p>A. Thermometer for reading after 10 minutes</p>
<table style="border-collapse: collapse; border: 1px solid black;">
  <tr>
    <th style="border: 1px solid black; padding: 8px;">Air temperature (°C)</th>
    <th style="border: 1px solid black; padding: 8px;">Evaporation temperature (°C)</th>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
</table>


        </div>
    `
            ,
            `
    <div>
        <p>B. Relative humidity</p>
<table style="border-collapse: collapse; border: 1px solid black; width: 100%; margin-bottom: 10px;">
  <tr>
    <th style="border: 1px solid black; padding: 8px;">Trial</th>
    <th style="border: 1px solid black; padding: 8px;">Relative humidity (°C)</th>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">1</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">2</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
  <tr>
    <td style="border: 1px solid black; padding: 8px;">3</td>
    <td style="border: 1px solid black; padding: 8px;">&nbsp;</td>
  </tr>
</table>
<p><strong>GENERALIZATION</strong></p>
<p style="padding-left: 10px;">How do you measure the amount of water vapor in the air?</p>
<p><strong>APPLICATION</strong></p>
<p style="padding-left: 10px;">1. On a warm summer day, evaporation of moisture from your skin can help you feel comfortable. However, before a storm, your skin becomes moist and you feel uncomfortable. Why?</p>
<p style="padding-left: 10px;">2. If you measure the relative humidity for the day in two different locations, would they be the same? Explain</p>

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