<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Earth's Motions</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="primary"
                        @click="toggleBookmark" />
                </div>
            </q-toolbar>
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

                        <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div>

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
        const lessonId = lesson ? String(lesson.id) : "87"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="illustration">
        <img src="assets/img/chapter 12/earth motion.png" alt="earth motion">
        <p style="display: none;">Earth's Motion</p>
      </div>
      <div class="header">
        <div>
          <div class="title">How does the amount of energy received from the sun cause the seasons?</div>
        </div>
      </div>
      <p>Earth moves in two ways: rotation and revolution. Every 24 hours, our planet completes one full rotation on its axis. The Earth's axis is an imaginary line running from the magnetic north pole to the South Pole. This axis is tilted 23.5° from a line perpendicular to the Earth's ecliptic plane, the imaginary plane containing the Earth's orbit around the sun (figure 12-1). The rotation is from west to east or in a counterclockwise direction.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-1.png" alt="figure 12-1">
        <div class="caption">Figure 12-1. Earth rotates on its axis, which</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>As Earth rotates on its axis, it also revolves around the sun in an elliptical orbit with a speed of 108 000 km/h. It makes a complete revolution around the sun every 365.24 days. As it revolves around the sun, its axis of rotation always points toward the same direction in space-that is, toward Polaris also known as the North Star.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-2.jpg" alt="figure 12-2.jpg">
        <div class="caption">Figure 12-2. Earth's rotation on its axis is reflected in the star trails around the North Star.</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>Do you remember the distance of Earth from the sun? The point at which Earth is closest to the sun in its orbit is called perihelion (figure 12-3). During perihelion, the Northern Hemisphere is tilted away from the sun, so it gets less solar radiation. This is why countries in this part of the world experience winter or cold weather. On the other hand, aphelion is the point at which Earth is farthest from the sun. The Northern Hemisphere is tilted toward the sun during aphelion, so it gets more solar radiation. Thus, the Northern Hemisphere experiences summer, or a hot, and dry weather. From this, we can see that the distance of our planet from the sun does not influence the occurrence of seasons. Rather, it is the amount of from the sun that Earth receives which causes the changes in seasons.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-3.png" alt="figure 12-3">
        <div class="caption">Figure 12-3. Earth reaches its aphelion, it's farthest point from the sun, during summer in the Northern Hemisphere. At Earth's perihelion, its closest point to the sun, it is winter in the Northern Hemisphere.</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div>
          <div class="title">Effect of Earth's Tilt</div>
        </div>
      </div>
      <p>The sun is Earth's main source of energy. The energy received on the Earth's surface is called insolation. However, due to Earth's tilt, this energy is not evenly distributed on Earth. The amount of insolation received at any place on the Earth's surface depends on the length of daytime and nighttime and the angle of the sun above the horizon, which is called the solar altitude.</p>
      <p>The cross-sectional model of Earth (figure 12-4) shows how the different parts of Earth receive sunlight. Places located at 23.5° north of the equator or along the Tropic of Cancer receive direct rays from the sun the most. It is summer in these parts of Earth. The opposite happens in the Southern Hemisphere, where only a small portion receives sunlight, and daytime is shorter than nighttime. The Southern Hemisphere experiences winter because it receives less solar energy.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>When the North Pole is tilted away from the sun, only a smaller part of the Northern Hemisphere receives sunlight, hence, it receives less solar energy. The length of daytime becomes shorter than that of nighttime. Generally, the temperature in the Northern Hemisphere is lower than at other times. Places that are 23.5° above the equator or along the Tropic of Cancer experience winter. The opposite happens in the Southern Hemisphere where daytime is longer, the temperature is higher, and the hemisphere experiences summer.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-4.png" alt="figure 12-4">
        <div class="caption">Figure 12-4. (a) The Northern Hemisphere is tilted toward the sun while (b) the Northern Hemisphere is tilted away from the sun. The tilt is the cause of seasons on Earth.</div>
      </div>
      <p>Earth's 23.5-degree tilt is the primary reason why seasons change. What do you think may happen if the Earth's tilt is changed? Perform the activity in Mini-Lab 12-1 and understand better how the degree of the Earth's tilt affects the seasons.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="info-card">
      <div class="info-title">Mini Lab 12-1</div>
      <div class="info-content">
        <div class="info-text">
          <p><strong>1.</strong> Find a partner and gather the following materials: table lamp without casing or cover, a globe, or any spherical object.</p>
          <p><strong>2.</strong> Place the lamp and the globe on a table: ensure that the center of the lamp and the globe are aligned. What is represented by the globe? the lamp?</p>
          <p><strong>3.</strong> Hold the globe such that the North Pole is pointed straight up (and not tilted at all).</p>
          <p><strong>4.</strong> Move the globe around the lamp counterclockwise until it is opposite its original position, without changing where the North Pole is pointed.</p>
          <p><strong>5.</strong> Observe the area in the Northern Hemisphere on which light falls. Compare this with the area in the Southern Hemisphere, which receives light.</p>
          <p><strong>6.</strong> Repeat steps 3-5, this time tilt the globe 45°.</p>
          <p><strong>7.</strong> How does the degree of tilting affect the amount of solar energy received by the Northern and Southern Hemispheres?</p>
        </div>
      </div>
    </div>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 12/lv_0_20260123154652.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The Earth's tilt</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-5.png" alt="figure 12-5">
        <div class="caption">Figure 12-5. The sun's path varies with the season. Shown here is its path in the Northern Hemisphere</div>
      </div>
      <p>The winter solstice is the day on which the hemisphere receives the least amount of direct sunlight. This makes winter solstice the shortest day of the year. In the Northern Hemisphere, this occurs on December 21. At the start of the winter solstice, the sun shines for 24 hours in the Antarctic Circle. In the Southern Hemisphere, opposite solstices happen. Summer solstice in the Southern Hemisphere falls on December 21, while the winter solstice on June 21.</p>
      <p>The Arctic Circle and Antarctic Circle are parts of the Earth that are in the highest latitude, or farthest away from the equator.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <p>As the seasons change, the path of the sun across the sky each day also changes. During summer in the Northern Hemisphere, the North Pole is slanted toward the sun. The sun's path appears higher in the sky. During winter, the North Pole is tilted away from the sun. The sun's path appears lower in the sky. When the Earth is tilted toward the sun, the path of the sun across the sky is also longer than when the Earth is tilted away from the sun. This means daytime is longer during summer than in winter, which also means more energy is received during summer than in winter.</p>
      <div class="illustration">
        <img src="assets/img/chapter 12/figure 12-6.png" alt="figure 12-6">
        <div class="caption">Figure 12-6. The shift in seasons as the Earth moves around its orbit.</div>
      </div>
      
    </div>
    `,
            `
    <div>
      <!-- Card 10 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 12/lv_0_20260123231806.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The seasons</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 11 -->
      <div class="info-card">
      <div class="info-title">Mini Test 12-1</div>
      <div class="info-content">
        <div class="info-text">
          <p><strong>1.</strong> What are the two motions of Earth? Explain the difference between the two.</p>
          <p><strong>2.</strong> Why is it warmer at the equator than in the polar regions?</p>
          <p><strong>3.</strong> What happens during an equinox?</p>
          <p><strong>4.</strong> Why do areas between the tropics and polar circles experience four seasons, while those in the equator experience only two seasons?</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-test-12-1" unelevated class="start-btn">Answer</q-btn>
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
