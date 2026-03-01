<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Lesson 2: Seasons in the Philippines</div>
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
        const lessonId = lesson ? String(lesson.id) : "88"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="illustration">
        <img src="assets/img/chapter 12/season in the ph.png" alt="season in the ph">
        <p style="display: none;">Seasons in the Philippines</p>
      </div>
      <div class="header">
          <div class="title">Why are there only two seasons in the Philippines?</div>
        </div>
      </div>
      <p>Countries situated near the equator, such as the Philippines which is located below the Tropic of Cancer, do not have four seasons because they experience almost the same amount of sunlight all year round. The seasons in the Philippines are influenced by temperature, humidity, amount of rainfall, and prevailing winds. From June to October, the southwest monsoon (habagat) causes the wet season, while from November to May, the northeast monsoon (amihan) causes the cold, dry season.</p>
    </div>
    `,
            `
            <div>
                <!-- Card 2 -->
                <div class="header">
          <div class="title">Temperature</div>
        </div>
      </div>
      <p>The average mean annual temperature in the Philippines is 26.6°C (excluding Baguio City). The coldest month in the country is January, while May is the warmest month. The average temperature in Baguio City, the country's summer capital, is comparable to that of temperate countries such as the United States. Baguio's cool temperature is due to its elevation of 1,500 meters above mean sea level.</p>
                </div>
            `,
            `
    <div>
      <!-- Card 2 -->
      <div class="header">
          <div class="title">Humidity</div>
        </div>
      </div>
      <p>Humidity refers to the moisture content in the atmosphere. The bodies of water in and around the Philippines cause the high moisture content in the air. High levels of humidity, coupled with the warm temperatures across the country can make people uncomfortable, especially from March to May.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="header">
          <div class="title">Rainfall</div>
        </div>
      </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 12/lv_0_20260124130826.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The amount of sunlight different regions receive</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 12/lv_0_20260124170012.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The dry and wet seasons</div>
        </div>
        <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-7.png" alt="figure 12-7">
        <div class="caption">Figure 12-7. The Panagbenga Festival is celebrated every season, when the weather is February during the dry cool and dry.</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-8.png" alt="figure 12-8">
        <div class="caption">Figure 12-8. Rice grows in rain-fed condition during wet season, while irrigation system is used during dry season.</div>
      </div>
      <table style="width:100%; border-collapse:collapse; border:1px solid #000; font-family:Arial, sans-serif;">
  <tr>
    <th style="border:1px solid #000; padding:8px; text-align:center; background:#b3d9ff;">Wet</th>
    <th style="border:1px solid #000; padding:8px; text-align:center; background:#ffe6b3;">Dry</th>
  </tr>

  <tr>
    <td colspan="2" style="border:1px solid #000; padding:8px; font-weight:bold; text-align:center; background:#d9ffd9;">
      Advantages
    </td>
  </tr>

  <tr>
    <td style="border:1px solid #000; padding:8px; background:#eaf6ff;">
      • Rain provides irrigation for crops.<br>
      • The quality of fresh water improves.
    </td>
    <td style="border:1px solid #000; padding:8px; background:#fff6e6;">
      • It is perfect for performing outdoor activities.<br>
      • There is a lower chance of flooding.
    </td>
  </tr>

  <tr>
    <td colspan="2" style="border:1px solid:#000; padding:8px; font-weight:bold; text-align:center; background:#ffd9d9;">
      Disadvantages
    </td>
  </tr>

  <tr>
    <td style="border:1px solid #000; padding:8px; background:#ffecec;">
      • The chances of flooding are higher.<br>
      • Humans may contract waterborne diseases.<br>
      • Overflowing bodies of water may flood and damage crops and natural vegetation.
    </td>
    <td style="border:1px solid #000; padding:8px; background:#fff0e6;">
      • Severe drought might kill crops.<br>
      • People may suffer heat-related health problems such as heat stroke and skin diseases.
    </td>
  </tr>
</table>

    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="info-card">
      <div class="info-title">Mini Test 12-2</div>
      <div class="info-content">
        <div class="info-text">
          <p><strong>1.</strong> Explain how temperature, humidity, and rainfall affect the seasons in the Philippines.</p>
          <p><strong>2.</strong> What are the advantages and disadvantages of the dry and wet seasons?</p>
          <p><strong>3.</strong> Show how the seasons in the Philippines change using an illustration.</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-test-12-2" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
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
