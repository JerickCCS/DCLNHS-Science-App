<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Activity 2: The Particle Nature of Matter</div>
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
        const lessonId = lesson ? String(lesson.id) : "13"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <span class="lesson-pill">ACTIVITY 2</span>
        <div>
          <div class="title">The Particle Nature of Matter</div>
        </div>
      </div>
      <p>During the time of the Ancient Greeks (about 400 BCE), it was believed that matter was
continuous, and therefore could be infinitely divided. However, this idea was opposed by
evidence suggesting that matter is made up of building blocks called atoms. Today, the particle
nature of matter is an established theory.</p>
      <div class="question">
        <div class="question-header">
          <i class="fa-solid fa-key"></i>
          <span>Materials</span>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="vertical-align: top; padding: 12px; width: 50%; border: none;">
        <ul style="list-style-type: square; margin: 0; padding-left: 1.25rem;">
          <li>absorbent cotton</li>
          <li>perfume</li>
          <li>water</li>
          <li>writing ink</li>
          <li>boiled agar</li>
          <li>food coloring or dye</li>
          <li>ammonium hydroxide</li>
          <li>solution (about 1.0 molar of NH⁴OH)</li>
          <li>phenolphthalein</li>
        </ul>
      </td>
      <td style="vertical-align: top; padding: 12px; width: 50%; border: none;">
        <ul style="list-style-type: square; margin: 0; padding-left: 1.25rem;">
          <li>two 250 mL beakers</li>
          <li>two medicine droppers</li>
          <li>spatula</li>
          <li>iron ring</li>
          <li>iron stand</li>
          <li>petri dish</li>
          <li>small transparent plastic</li>
          <li>bag</li>
          <li>piece of string</li>
        </ul>
      </td>
    </tr>
  </table>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <div class="question">
        <div class="question-header">
          <i class="fa-solid fa-key"></i>
          <span>Procedure</span>
        </div>
      </div>
      <p>A. Perfume in the air</p>
<p>1. Moisten a piece of absorbent cotton with the perfume.</p>
<p>2. Observe what happens after 30 minutes. Record your observations in Data and
Results.</p>
<p>B. Ink in water</p>
<p>1. Fill a beaker halfway with water.</p>
<p>2. Put three drops of writing ink in the beaker with wa</p>
<p>3. Observe what happens to the ink. Record your observations in Data and Results.</p>
<p>C. Food coloring or dye in boiled agar</p>
<p>1. Put the boiled agar in a petri dish and allow it to solidify.</p>
<p>2. Using a spatula, sprinkle food coloring or dye on the surface of the agar.</p>
<p>3. Observe what happens after 30 minutes. Record your observations in Data and
Results.</p>
<p>D. Ammonium hydroxide in a bag</p>
<p>1. Pour 50 mL of ammonium hydroxide solution into a small transparent plastic bag.</p>
<p>2. Tightly tie the mouth of the bag with a piece of string in such a way that the solution does not seep through.</p>
<p>3. Place the bag in a beaker with enough water so that it is at the same level as the solution in the bag.</p>
<p>4. Add five drops of phenolphthalein to the water. Allow the setup to stand until nearly the end of the laboratory period.</p>
<p>5. Observe what happens. Record your observations in Data and Results.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="illustration">
        <img src="assets/img/chapter 2/activity 2.png" alt="activity 2">
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="question">
        <div class="question-header">
          <i class="fa-solid fa-key"></i>
          <span>Safety Precaution</span>
        </div>
      </div>
      <p>Dispose of waste as directed by your teacher.</p>

      <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; text-align:left;">
  <tr>
    <th style="border:1px solid black; padding:10px; background-color:#f2f2f2;">Setup</th>
    <th style="border:1px solid black; padding:10px; background-color:#f2f2f2;">Observation</th>
  </tr>
  <tr>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;">A</td>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;"></td>
  </tr>
  <tr>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;">B</td>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;"></td>
  </tr>
  <tr>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;">C</td>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;"></td>
  </tr>
  <tr>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;">D</td>
    <td style="border:1px solid black; padding:10px; height:80px; vertical-align:top;"></td>
  </tr>
</table>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="question">
        <div class="question-header">
          <i class="fa-solid fa-key"></i>
          <span>Analysis and Interpretation</span>
        </div>
      </div>
      <p>1. Based on your observations in setup A, how will you describe the molecules of gases?</p>
<p>2. In setup B, how did the ink spread in water? What does this show?</p>
<p>3. Compare the timeit takes for the food coloring or dye to spread in the agar with the timne
it takes for the perfume scent to reach you. How do you explain this difference?</p>
<p>4. In setup D, what is the purpose of adding phenolphthalein to water? Describe how the color change happened.</p>
      <div class="question">
        <div class="question-header">
          <i class="fa-solid fa-key"></i>
          <span>GENERALIZATION</span>
        </div>
      </div>
      <p>What determines the speed of the movement of particles, and how does it vary across
different physical states?</p>
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
