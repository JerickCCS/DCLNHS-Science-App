<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Technology in Focus</div>
                <button class="bookmark-btn" @click="toggleBookmark">
                    <span class="material-icons"
                        :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">
                        {{ isBookmarked ? 'bookmark' : 'bookmark_border' }}
                    </span>
                </button>
            </div>
            <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
        </q-header>

        <q-page-container class="night-sky">
            <q-page>
                <div class="stars"></div>
                <div class="lesson-container">
                    <div id="viewer" ref="viewerRef">
                        <transition name="fade-slide" mode="out-in" @after-enter="onTransitionComplete">
                            <div :key="currentPage" v-html="getPageContent(currentPage)"></div>
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

                    <div class="speak-btn" @click="onToggleAudio">
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
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import confetti from "canvas-confetti"
import { getCurrentUser, setCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"
import { LocalStorage } from "quasar"
import '@google/model-viewer'
import { audioManager } from "src/utils/audioManager"
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'
import { useTTSLesson } from "src/composables/katexTTS"

export default {
    name: "ScientificModelsLesson",
    setup() {
        // router, state, lesson
        const route = useRoute()
        const router = useRouter()
        const currentPage = ref(0)
        const progress = ref(0)
        const showLessonComplete = ref(false)
        const viewerRef = ref(null)
        const renderedPages = ref([])

        const currentUser = ref(getCurrentUser())
        let confettiInterval = null

        const lesson = flatLessons.find(l => l.route === route.path)
        const lessonId = lesson ? String(lesson.id) : "58"

        // bookmarks
        const bookmarkedPages = ref([])

        // raw lesson pages
        const rawPages = [
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">Preserving Lives through Road Safety</div>
      </div>
      <p>Traffic rules serve as essential guidelines to regulate the movement of vehicles and pedestrians to prevent road accidents. Adherence to these rules is important in establishing a secure and well-organized traffic environment. Ensuring the use of safety features installed in vehicles, such as seat belts, airbags, and rear-view cameras, significantly contributes in minimizing the impact of forces and abrupt changes in motion on passengers.</p>
      <p>This, in turn, protects individuals from potential injuries or fatal accidents. According to data from the WHO Global Health Estimates (2020), there is an average of 12 deaths per 100,000 Filipino population due to road accidents from 2015-2019, which include drivers, passengers, motorcyclists, cyclists, and pedestrians.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>Top-tier car models are now being equipped with Advanced Driver-Assistance Systems (ADAS) that are considered essential to increase driver safety not just in motion, but also when parking. Some cars are also equipped with Autonomous Emergency Braking (AEB) systems, which use sensors such as radar, lidar, or cameras to detect potential collisions with vehicles, pedestrians, or obstacles.</p>
      <p>If a collision is imminent and the driver does not react in time, the system automatically applies the brakes to prevent or mitigate the impact. In addition, some cars have Adaptive Cruise Control (ACC) systems, which automatically adjust a car's speed to maintain a safe following distance from the car ahead. They use sensors to detect the distance and speed of cars in front and can speed up or slow down as needed to avoid collision.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>The combination of advanced safety features in vehicles and responsible road behavior not only helps avoid legal consequences such as fines and legal actions in the case of fatalities, but also upholds the fundamental right of all individuals to live in a safer and hazard-free environment.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">ICT CHALLENGE</div>
      </div>
      <p>Many advancements in car designs are now in place for additional safety, but they do not guarantee total protection against accidents. Research on some road accidents in which safety features of the car failed to work, for example, miscalculation of autonomous emergency braking.</p>
      <p>Write a reaction paper about the accidents. Highlight ways to avoid such kinds of accidents.</p>
    </div>
    `
        ]


        // --- KaTeX Rendering ---
        const processPageWithKaTeX = (pageContent) => {
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = pageContent
            renderMathInElement(tempDiv, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false,
                errorCallback: (err, msg) => console.warn('KaTeX error:', err, msg)
            })
            return tempDiv.innerHTML
        }

        const processAllPages = () => {
            renderedPages.value = rawPages.map(page => processPageWithKaTeX(page))
        }

        const getPageContent = (pageIndex) => {
            if (renderedPages.value[pageIndex]) return renderedPages.value[pageIndex]
            if (rawPages[pageIndex]) {
                const processed = processPageWithKaTeX(rawPages[pageIndex])
                renderedPages.value[pageIndex] = processed
                return processed
            }
            return ''
        }

        // --- TTS Composable ---
        const { isPlaying, textToRead, toggleAudio, stopSpeaking } = useTTSLesson(rawPages)
        const onToggleAudio = async () => {
            await toggleAudio(currentPage.value)  // <-- uses toggleAudio
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
            const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
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
            bookmarkedPages.value.some(b => b.route === (route.name || route.path) && b.page === currentPage.value)
        )

        // --- Progress & Navigation ---
        const updateProgress = () => {
            progress.value = (currentPage.value + 1) / rawPages.length
        }

        const nextPage = () => {
            if (isPlaying.value) stopSpeaking()
            if (currentPage.value < renderedPages.value.length - 1) {
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

        // --- Lesson Completion ---
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

        // --- KaTeX Re-render after page transition ---
        const onTransitionComplete = () => {
            nextTick(() => {
                const viewerContent = viewerRef.value?.querySelector('div')
                if (viewerContent) {
                    renderMathInElement(viewerContent, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true }
                        ],
                        throwOnError: false,
                        errorCallback: (err, msg) => console.warn('KaTeX error:', err, msg)
                    })
                }
            })
        }

        // --- URL Sync ---
        watch(currentPage, (newPage) => {
            router.replace({ path: route.path, query: { page: newPage } })
        })

        // --- Lifecycle ---
        onMounted(() => {
            if (!route.query._reloaded) {
                router.replace({ path: route.path, query: { ...route.query, _reloaded: '1' } })
                    .then(() => window.location.reload())
                return
            }

            processAllPages()
            currentUser.value = getCurrentUser()
            bookmarkedPages.value = loadBookmarks()
            updateProgress()

            const pageFromQuery = parseInt(route.query.page, 10)
            if (!isNaN(pageFromQuery) && pageFromQuery < rawPages.length) currentPage.value = pageFromQuery

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

            viewerRef.value?.addEventListener('click', (e) => {
                const target = e.target.closest('[data-route]')
                if (target) router.push(target.dataset.route)
            })
        })

        onUnmounted(() => {
            stopSpeaking()
            speechSynthesis.cancel()
            stopConfetti()
            audioManager.restoreBg()
        })

        return {
            currentPage,
            isPlaying,
            textToRead,
            pages: rawPages,
            showLessonComplete,
            bookmarkedPages,
            progress,
            isBookmarked,
            finishButtonStyle,
            toggleAudio,
            onToggleAudio,
            nextPage,
            prevPage,
            goBack,
            toggleBookmark,
            startConfetti,
            stopConfetti,
            currentUser,
            isLessonComplete,
            markLessonComplete,
            viewerRef,
            onTransitionComplete,
            getPageContent
        }
    }
}
</script>

<style src="src/css/lessonBackground.css"></style>

<!-- Scoped Styles -->
<style src="src/css/lesson.css" scoped></style>
