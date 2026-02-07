<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: The Earth's Atmosphere</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "79"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">

        <div>
          <div class="title">The Earth's Atmosphere</div>
        </div>
      </div>
      <p>The envelope of air surrounding the Earth is the
atmosphere. Air is a mixture of gases. It consists of 78%
nitrogen, 21% oxygen, 0.93% argon, 0.04% carbon dioxide,
and traces of other gases (figure 11-1). Air also contains
variable amounts of water vapor.</p>
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-1.png" alt="figure 11-1">
        <div class="caption">Figure 11-1. Air is composed of gases in varying percentages</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769260511430.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What's the purpose of water vapor?</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/lv_0_20260124213156.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The atmosphere</div>
        </div>

      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/lv_0_20260124213444.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The troposphere</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-2.png" alt="figure 11-2">
        <div class="caption">Figure 11-2. The layers of the atmosphere</div>
      </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/lv_0_20260124213742.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The stratosphere</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/lv_0_20260125003748.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The mesosphere</div>
        </div>
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-2.png" alt="figure 11-2">
        <div class="caption">Figure 11-2. The layers of the atmosphere</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769266253928.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Beyond the mesopause</div>
        </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/Norway's Northern Lights - Aurora Borealis Chris Bay Photography.mp4" controls alt="figure 11-3" type="video/mp4">
          </video>
          <div class="caption">Figure 11.3 The aurora borealis, or northern lights, is the effect of the flow of cosmic and solar radiation in the thermosphere.</div>
        </div>
    </div>
    `,
            `
            <div>

      <div class="info-card">
      <div class="info-title">Mini Test 11-1</div>
      <div class="info-content">
        <div class="info-text">
          <p><strong>1.</strong> What are the layers of the Earth's atmosphere?</p>
          <p><strong>2.</strong> What makes the atmosphere important to life on Earth?</p>
          <p><strong>3.</strong> How does temperature vary in each layer of the atmosphere?p>
          <p><strong>4.</strong> How does the solar radiation absorbed by the particles of gases in the thermosphere cause air temperature to increase with altitude?</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-test-11-1" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
                
                </div>
            `,
            `
    <div>
      <!-- Card 7 -->
      <div class="header">
        <div>
          <div class="title">Greenhouse Effect: Its Role in Warming the Atmosphere</div>
        </div>
      </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769268532269.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What is the greenhouse effect?</div>
        </div>
      <div class="illustration">
        <img src="assets/img/chapter 11/figure 11-4.gif" alt="figure 11-4">
        <div class="caption">Figure 11-4. The greenhouse effect</div>
      </div>
      <p>Direct solar radiation is not the main cause of the heating of the atmosphere; it is due to
the greenhouse effect. The greenhouse effect occurs when the energy from the sun is received
and reradiated by the Earth's surface. Greenhouse gases such as carbon dioxide and water
vapor in the air absorb this radiated energy from the ground.</p>
      <p>The greenhouse effect is the absorption of radiation from the Earth's surface by
greenhouse gases such as carbon dioxide in the atmosphere, causing the Earth's atmosphere
to become warm.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p>Greenhouse gases may be formed naturally or produced by human activities. The natural sources of carbon dioxide (COsub2) are the decomposition of organic matter (e.g., leaves and dead animals), respiration of humans and animals, warming of oceans, and volcanic eruptions. Underground magma also releases carbon dioxide through vents, porous rocks, and soils. Carbon dioxide is also released from oceans when deep ocean waters rise to the surface as part of the normal ocean-circulation patterns. Human activities such as the burning of fossil fuels, clearing forests, and producing cement also generate carbon dioxide. They become part of our atmosphere.</p>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 11/1769268775055.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The greenhouse effect</div>
        </div>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <div class="info-card">
  <div class="info-title">Mini Test 11-2</div>
  <div class="info-content">
    <div class="info-text">
      <p><strong>1.</strong> Form a group of five students.</p>
      <p><strong>2.</strong> Use the following words or phrases to make a concept map:</p>
      <p>a. Greenhouse gases</p>
      <p>b. Greenhouse effect</p>
      <p>c. Environment</p>
      <p>d. Radiation</p>
      <p>e. Earth's surface</p>
      <p>f. Heat</p>
      <p>g. Absorption</p>
      <p>h. Carbon dioxide</p>
      <p>i. Water vapor</p>
      <p>j. Methane</p>
    </div>
  </div>
</div>


    </div>
    `,
            `
    <div>
      <!-- Card 10 -->
<div class="illustration">
        <img src="assets/img/chapter 11/science pioneer.png" alt="figure 11-4">
        <p style="display: none;">Science Pioneer:
Maria Yzabell Angel Palma invented the Air Disc cooling system, an alternative air-conditioner.
Her invention consumes 10 percent less energy. This cooling system uses innovative centrifugal
Gcompressor that is unlike a rotary or piston-type compression with high-energy consumption.
The device consists of a rotating set of concentric air tanks through which air is passed and compressed,
and thus, is cooled. Palma studied mechanical engineering at the De La Salle University in Manila. She discovered her
AirDisc technology by chance when she was in grade 10 while working on an eco-friendly oven for a
research subject.</p>
      </div>

      <div class="illustration">
        <img src="assets/img/chapter 11/science career.png" alt="figure 11-4">
        <p style="display: none;">Science Career:
Broadcast meteorologists give weather forecasts to the general public through television, radio,
and the internet. They develop maps and charts that help explain their forecasts. Graphic softwares
are used for this purpose. To be a broadcast meteorologist, you need to finish a bachelor's degree
program in meteorology or atmospheric science. Many careers in meteorology are available to college
graduates. However, a graduate degree, like master's degree and doctorate degree, will open doors to
many professional opportunities.</p>
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