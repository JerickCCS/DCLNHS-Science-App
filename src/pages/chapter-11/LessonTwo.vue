<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar class="toolbar-row"> <q-btn flat dense round icon="arrow_back" aria-label="Go back"
                    @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 2: Movement in the Atmosphere</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "80"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
          <div class="banner">
        <img src="assets/img/chapter 11/movement.png" alt="movement">
        <p style="display: none;">Activity 17</p>
      </div>
          <div class="title">How do weather systems affect people?</div>
        </div>
      </div>
      <p>Recall that heat may be transferred by conduction,
convection, and radiation. These mechanisms move energy from
one place to another, warm the ground and the air, and cause
cool, dense air to sink and push warm air out.</p>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769267260855.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The conduction current</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <div class="header">
        <div>
          <div class="title">Land Breeze and Sea Breeze</div>
        </div>
      </div>
      <p>Air moves from areas of higher pressure to areas of lower pressure. This movement of air
generates wind, or the horizontal movement of air across the Earth's surface.</p>
<div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769267654454.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Land Breeze and Sea Breeze</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>Local winds affect weather in the sense that they moderate the climate of regions
depending upon their location. They can affect the climate by increasing or decreasing the
temperature and humidity.</p>
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-5.png" alt="Figure 11-5">
        <div class="caption">Figure 11-5. The movement of air during (a) daytime differs from its movement during (b) nighttime</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div>
          <div class="title">Monsoons</div>
        </div>
      </div>
      <p>Aside from local winds, another effect of the heating and cooling patterns of the
atmosphere is the formation of monsoons. Monsoons are winds that change direction as the
seasons change. Wind blows in one direction for about six months, then blows the other way
for the next six months. Monsoons are caused by the difference in the annual temnperature
trends over land and sea.</p>
      <p>The annual cycle of monsoons begins in the winter months, when air from the cold, dry
interior of Asia, north of the Himalayas, flows toward a warm, low-pressure area over India.
During the winter months in the Northern Hemisphere, the continents are much cooler than
the sea. The air pressure over the continents is higher than the air pressure over the sea. Dry
air flows from the high-pressure area over the continent to the low-pressure ar
area over the
sea. During summer, this pattern is reversed as the continents in the Northern Hemisphere
become much warmer than the sea. Moist wind flows from the high-pressure area over the
sea to the low-pressure area over the continents. South Asia and Southeast Asia (where the
Philippines is) experience the most extreme monsoons.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>The northeast monsoon and the southwest monsoon are the two principal air streams
that have the greatest impact on the climate of the Philippines.</p>
      <p>The northeast monsoon, locally known as Amihan (figure 11-6A), starts out as a mass
OT cold, dry air originating from a high-pressure weather system that forms over Siberia and
China. The dry air mass gradually moves down toward Southeast Asia, gathering moisture from
the Pacific Ocean before it reaches the Philippines. The northeast monsoon is characterized
by widespread cloudiness with moderate rainfall and cool weather, especially in the eastern
section of the country. It affects the Philippines from late October to early March.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769267936512.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Moonsoons</div>
        </div>
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-6.png" alt="Figure 11-6">
        <div class="caption">Figure 11-6. (a) Amihan in January and (b) Habagat in July</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="info-card">
      <div class="info-title">Mini Test 11-3</div>
      <div class="info-content">
        <div class="info-text">
          <p><strong>1.</strong> What causes land breeze and sea breeze to form?</p>
          <p><strong>2.</strong> If A is a high-pressure area and B is a low-pressure area, where does the air move?</p>
          <p><strong>3.</strong> What causes monsoons to form?</p>
          <p><strong>4.</strong> Which statement best shows the similarities and differences between the Northeast Monsoon and the Southwest Monsoon?</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-test-11-3" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 12/lv_0_20260121135745.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The intertropical convergence zone</div>
        </div>
        <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-7.png" alt="Figure 11-7">
        <div class="caption">Figure 11-7. The location of the ITCZ in July and in January</div>
      </div>
       <p>The poleward movement of the ITCZ is more noticeable over land than over water, and
Over the Northern Hemisphere than over the Southern Hemisphere. During July and August,
the ITCZ is situated between 5° and 15° north of the equator over the Atlantic Ocean and the
Pacific Ocean; over the landmasses of Africa and Asia, it is further north. It may move up to
30° north of the equator.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <p>The air in the ITCZ moves in a vertical motion so that there is little surface wind in the
ITCZ. This is why sailors refer to the ITCZ as the doldrums or the calms."</p>
    </div>
    <div class="info-card"> <div class="info-title">Mini Test 11-4</div> <div class="info-content"> <div class="info-text"> <p><strong>1.</strong> How does the ITCZ affect the weather in the Philippines?</p> <p><strong>2.</strong> How does the ITCZ move in the Northern Hemisphere? in the Southern Hemisphere?</p>
        <div class="start-btn-container">
            <q-btn data-route="/mini-test-11-4" unelevated class="start-btn">Answer</q-btn>
          </div> </div> </div> </div>
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