<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Activity 15: Uneven Heating of Earth's Surface</div>
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
            <div class="lc-wrapper">
                <!-- Radial burst background blobs -->
                <div class="lc-blob lc-blob1"></div>
                <div class="lc-blob lc-blob2"></div>
                <div class="lc-blob lc-blob3"></div>

                <!-- Star GIF -->
                <div class="lc-star-wrap">
                    <img src="assets/icons/five-stars.gif" class="lc-star-img" />
                </div>

                <!-- Text -->
                <div class="lc-title">🎉 Congratulations!</div>
                <div class="lc-subtitle">You've completed this lesson.<br />Keep up the amazing work!</div>

                <!-- Divider dots -->
                <div class="lc-dots">
                    <span></span><span></span><span></span>
                </div>

                <!-- OK button -->
                <button class="lc-ok-btn" @click="stopConfetti(); showLessonComplete = false; $router.back()">
                    Awesome!
                </button>
            </div>
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
        const lessonId = lesson ? String(lesson.id) : "83"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div>
          <div class="title">ACTIVITY 15</div>
        </div>
      </div>
<p>Uneven Heating of Earth's Surface</p>
<p>OBJECTIVES</p>
<p>• Compare the heating of the land surface with that of the water</p>
<p>• Simulate how the greenhouse effect happens</p>
<p>MATERIALS</p>
<table style="border-collapse: collapse;">
  <tr>
    <td>■ Four clear glasses or bowl-shaped clear containers with transparent lid or cling-wrap cover</td>
    <td>■ Dry, dark soil</td>
  </tr>
  <tr>
    <td>■ Water</td>
    <td>■ Two clothespins</td>
  </tr>
  <tr>
    <td>■ Iron stand</td>
    <td>■ C-clamp</td>
  </tr>
  <tr>
    <td>■ Heat lamp</td>
    <td>■ Two thermometers</td>
  </tr>
</table>
    </div>
    `
            ,
            `
    <div>
        <p>PROCEDURE</p>
        <p>Covered heating and covered cooling</p>
        <p style="padding-left: 10px;">1. Fill two-thirds of one container with soil. Fill two-thirds of another container with room temperature water.</p>
<p style="padding-left: 10px;">2. Suspend the thermometer in each container. Secure each thermometer with the clothespin. Make sure that the thermometer bulb is barely below the surface of the soil and water, as shown in the figure.</p>
<div class="illustration">
      <img src="assets/img/chapter 11/figure 1.png" alt="Placeholder">
      <div class="caption">Figure 1: How to suspend the thermometers using clothespins</div>
    </div>
        </div>
    `
            ,
            `
    <div>
        <p>Covered heating and covered cooling</p>
        <p style="padding-left: 10px;">3. Place the iron stand near the edge of the table and secure it with the C-clamp.</p>
<p style="padding-left: 10px;">
4. Place the two containers side by side, next to the base of the iron stand.</p>
<p style="padding-left: 10px;">5. Position the bulb of the heat lamp 20 cm above the containers. Turn on the lamp to make sure that the light from the lamp is evenly distributed between the two containers. Turn off the lamp.</p>
<div class="illustration">
      <img src="assets/img/chapter 11/figure 2.png" alt="Placeholder">
      <div class="caption">Figure 2: Experimental setup for Procedure A</div>
    </div>
        </div>
    `
            ,
            `
    <div>
        <p>Covered heating and covered cooling</p>
        <p style="padding-left: 10px;">3. Place the iron stand near the edge of the table and secure it with the C-clamp.</p>
<p style="padding-left: 10px;">
4. Place the two containers side by side, next to the base of the iron stand.</p>
<p style="padding-left: 10px;">5. Position the bulb of the heat lamp 20 cm above the containers. Turn on the lamp to make sure that the light from the lamp is evenly distributed between the two containers. Turn off the lamp.</p>
<div class="illustration">
      <img src="assets/img/chapter 11/figure 2.png" alt="Placeholder">
      <div class="caption">Figure 2: Experimental setup for Procedure A</div>
    </div>
        </div>
    `
            ,
            `
    <div>
        <p style="padding-left: 10px;">6. When the soil and water have both reached room temperature, record their initial temperatures.</p>
<p style="padding-left: 10px;">7. Turn on the lamp again and record the soil and water temperatures every minute for the next 10 min. Turn off the lamp after 10 minutes and set it aside.</p>
<p style="padding-left: 10px;">8. Cover the soil and water container with transparent lid or cling-wrap. Continue to take temperature readings every minute for the next 10 min.
</p>
<p style="padding-left: 10px;"7>9. Create a temperature-time graph for your sets of data. A  template of the graph is given below.
</p>
<div class="illustration">
      <img src="assets/img/chapter 11/soil graph.png" alt="Placeholder">
    </div>
        </div>
    `
            ,
            `
    <div>
        <div class="illustration">
      <img src="assets/img/chapter 11/water graph.png" alt="Placeholder">
    </div>
    <p>B. Uncovered heating and cooling</p>
        <p style="padding-left: 10px;">1. Repeat steps 1 to 7 of procedure A, but this time, do not cover the soil and water after heating. Continue to take temperature readings every minute for the next 10 min.</p>
<p style="padding-left: 10px;">2. Plot a temperature-time graph for each set of data. A template of the graph is given below.
</p>

<div class="illustration">
      <img src="assets/img/chapter 11/uncovered water graph.png" alt="Placeholder">
    </div>

        </div>
    `
            ,
            `
    <div>
    <p><strong>DATA AND RESULTS</strong></p>
    <p><strong>ANALYSIS AND INTERACTION</strong></p>
        
<p style="padding-left: 10px;">1. Which heated up faster, the soil or the water? Why?</p>
<p style="padding-left: 10px;">2. Which cooled faster? Why?</p>
<p style="padding-left: 10px;">3. Which cooled more rapidly in the covered setup?</p>
<p style="padding-left: 10px;">4. In which setup did cooling occur faster, covered or uncovered? Why?</p>
<p style="padding-left: 10px;">5.Compare the graphs of temperature against time for the covered and uncovered setups of the soil and water. What does the slope or indication of the graphs indicate?</p>
<p style="padding-left: 10px;">6. What does the lid in the covered setup represent when compared to the Earth's surface? Is it a good representation?Explain your answer.</p>


        </div>
    `
            ,
            `
    <div>
    <p><strong>GENERALIZATION</strong></p>
        
<p style="padding-left: 10px;">1. How does heating of land surface compare with that of water surface?</p>
<p style="padding-left: 10px;">2. How does the greenhouse effect happen?</p>

<p><strong>APPLICATION</strong></p>
<p style="padding-left: 10px;">1. Explain how an increase in population contributes to the greenhouse effect.</p>
<p style="padding-left: 10px;">2. Is the greenhouse effect advantageous? Using what you learned from this lesson, explain in not less than five sentences your ideas.</p>


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

            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })

            // Fix z-index after first render
            setTimeout(() => {
                const canvas = document.querySelector('canvas[style*="position: fixed"]')
                if (canvas) canvas.style.zIndex = '99999'
            }, 50)

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
