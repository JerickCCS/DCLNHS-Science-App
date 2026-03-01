<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Activity 1: Measurement of Some Physical Quantities</div>
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
        const lessonId = lesson ? String(lesson.id) : "7"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div>
          <div class="title">ACTIVITY 1</div>
          <div class="subtitle">Measurement of Some Physical Quantities</div>
        </div>
      </div>
      <p>Measuring is a basic skill. As a science student, it is important to learn how to take measurements correctly and scientifically.</p>
      <p>The basic measurements encountered in the laboratory are length, mass, and volume, which are obtained using appropriate tools or equipment and following procedure.</p>
      <p><strong>OBJECTIVES</strong></p>
      <p>Use proper laboratory techniques in measuring mass, length, and volume.</p>
      <p><strong>MATERIALS</strong></p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="vertical-align: top;">
            <ul style="list-style-type: square; margin: 0; padding-left: 20px;">
              <li>tap water</li>
              <li>10 mL graduated cylinder</li>
              <li>two 250 mL beakers</li>
            </ul>
          </td>
          <td style="vertical-align: top;">
            <ul style="list-style-type: square; margin: 0; padding-left: 20px;">
              <li>graduated pipette</li>
              <li>platform balance or triple beam balance</li>
              <li>rubber bulb or aspirator</li>
            </ul>
          </td>
          <td style="vertical-align: top;">
            <ul style="list-style-type: square; margin: 0; padding-left: 20px;">
              <li>three one-peso coins</li>
              <li>metric ruler</li>
              <li>thick book</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
            <p><strong>PROCEDURE</strong></p>
      <p>1. Measurement of mass</p>
      <p>2. Using the platform balance or triple beam balance, measure the mass of each of the three one-peso coins. Record the mass to the nearest hundredth of a gram.</p>
      <p>3. Compute the average mass of the coins.</p>
      <p>4. Record the average mass in the data table in Data and Results.</p>
      <p>5. Measurement of length</p>
      <p>6. Using the centimeter scale of the ruler, measure the thickness of 50 pages of the thick book. Record the thickness to the nearest tenth of a centimeter.</p>
      <p>7. Do the same for a 100- and 150-page book.</p>
      <p>8. Calculate the average thickness of one page of the book from the data you have obtained.</p>
      <p>9. Record the average thickness in the table in Data and Results.</p>
      <p>10. Measurement of volume</p>
      <p>11. Measure 5.0 mL tap water using the graduated pipette.<br>(Note: Your teacher will demonstrate first how to use a pipette.)</p>
      <p>12. Carefully transfer the water into the graduated cylinder. Place the graduated cylinder on a flat surface. Read and record the volume to the nearest tenth of a milliliter.</p>
      <p>13. Determine the difference between the graduated pipette reading and the graduated cylinder reading.</p>
      <p>14. Repeat the procedure using 7.0 mL and 10.0 mL tap water.</p>
      <p>15. Calculate the differences in the volume readings.</p>
      <p>16. Record the volume differences in the table in Data and Results.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p><strong>DATA AND RESULTS</strong></p>
      <p>A. Measurement of mass</p>
      <table style="border-collapse: collapse; width: 100%;" border="1">
        <tr>
          <th>Coin</th>
          <th>Mass (g)</th>
        </tr>
        <tr><td>1</td><td></td></tr>
        <tr><td>2</td><td></td></tr>
        <tr><td>3</td><td></td></tr>
        <tr><td>Average</td><td></td></tr>
      </table>
      <br>
      <p>B. Measurement of length</p>
      <table style="border-collapse: collapse; width: 100%;" border="1">
        <tr>
          <th>Number of pages</th>
          <th>Thickness (cm)</th>
          <th>Thickness of one page (cm)</th>
        </tr>
        <tr><td>50</td><td></td><td></td></tr>
        <tr><td>100</td><td></td><td></td></tr>
        <tr><td>150</td><td></td><td></td></tr>
        <tr><td>Average</td><td></td><td></td></tr>
      </table>
      <br>
      <p>C. Measurement of volume</p>
      <table style="border-collapse: collapse; width: 100%;" border="1">
        <tr>
          <th>Volume of water (mL)</th>
          <th>Using the graduated pipette</th>
          <th>Using the graduated cylinder</th>
          <th>Difference in volume</th>
        </tr>
        <tr><td>5.0</td><td></td><td></td><td></td></tr>
        <tr><td>7.0</td><td></td><td></td><td></td></tr>
        <tr><td>10.0</td><td></td><td></td><td></td></tr>
      </table>
      <br>
      <p><strong>ANALYSIS AND INTERPRETATION</strong></p>
      <p>1. Is there a difference in the masses of the one-peso coins? If yes, what may be the possible cause(s) of the difference?</p>
      <p>2. Is calculating the average thickness of one page of a book in the experiment more accurate than measuring just one page? Why or why not?</p>
      <p>3. In measuring small volumes of liquids, which is more accurate to use—a graduated pipette or a graduated cylinder? Why?</p>
      <p>How can you obtain sound and accurate data and results in laboratory experiments?</p>
      <p><strong>APPLICATION</strong></p>
      <p>4. Describe a method for determining the following:  
        <br> a. thickness of a thin piece of cloth  
        <br> b. mass of a small needle</p>
      <p>5. Why is it necessary to make several trials of measurement?</p>
      <p>6. Why is measurement important in science?</p>
    </div>
    ` ])

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
