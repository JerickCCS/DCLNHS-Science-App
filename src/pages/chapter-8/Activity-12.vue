<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar> <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack"
                    class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 12: Factors Affecting Motion in Toy
                    Cars</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "60"

        // bookmarks
        const bookmarkedPages = ref([])

        // raw lesson pages
        const rawPages = [
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">ACTIVITY 12</div>
        <div class="subtitle">Factors Affecting Motion in Toy Cars</div>
      </div>
      <p><strong>Controlled Experiment</strong></p>
      <p>When doing an experiment, one should follow the steps in the scientific method. It is also essential that the experiment should be controlled in order to observe directly the effect of the independent variable on the dependent variable, while other variables that may affect the experiment should be kept constant or controlled. Here are some important steps in doing a controlled experiment.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>1. <strong>Identify the Research Problem or Question.</strong> Clearly define the aspect you want to investigate. Questions should be quantitatively measured.</p>
      <p>2. <strong>Make a Background Research.</strong> Utilize resources such as the library and the internet to find the best approach to answer your research question. Approach your research like a scientist.</p>
      <p>3. <strong>Formulate a Hypothesis.</strong> The hypothesis should be a testable statement about the relationship of dependent and independent variables.</p>
      <p><strong>Recall:</strong></p>
      <p>• <strong>dependent variable</strong> – the variable that is affected when the independent variable changes</p>
      <p>• <strong>independent variable</strong> – the variable that is manipulated by the experimenter</p>
      <p>• <strong>controlled variable</strong> – the variable that should be kept constant throughout the experiment</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>4. <strong>Test the Hypothesis through Experimentation.</strong> Ensure that the experiment is a fair test. Vary only one factor at a time while keeping other potentially influential variables constant. Conduct at least three trials to ensure measurement validity and reliability. Design the controlled experiment, including materials, procedures, and methods.</p>
      <p>5. <strong>Analyze Data.</strong> After collecting data, organize and present it accurately using tables, graphs, charts, or appropriate statistical tools based on the data type. This aids in data analysis.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>6. <strong>Draw Conclusion.</strong> Based on the gathered data, the results of the experiment may accept or reject the hypothesis.</p>
      <p>7. <strong>Communicate Results.</strong> Share your research findings to contribute to collective knowledge through formal reports, presentations, conferences, and other suitable channels.</p>
      <p>A sample of a controlled experiment is the following laboratory activity.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p><strong>OBJECTIVES</strong></p>
      <p>1. Investigate the factors affecting the motion of toy cars.</p>
      <p>2. Describe the motion of toy cars.</p>
      <div class="illustration">
        <img src="assets/images/table_2_toy_car.jpg" alt="Table 2: Varying Paths of Toy Car">
        <div class="caption">Table 2. Varying Paths of Toy Car</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="illustration">
        <img src="assets/images/table_3_ramp_angles.jpg" alt="Table 3: Varying Angles of the Ramp">
        <div class="caption">Table 3. Varying Angles of the Ramp</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p><strong>ANALYSIS AND INTERPRETATION</strong></p>
      <p>1. In setup 1, which has the greater speed: the small or the big toy car?</p>
      <p>2. Compare the motion of the toy car in the horizontal path and in the zigzag path (setup 2). In which path did the toy car cover a greater distance within the same period?</p>
      <p>3. What happens to the motion of the toy car when the angle of the ramp is changed? Does the motion remain unchanged?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p><strong>GENERALIZATION</strong></p>
      <p>How would a position-time graph appear for different motions of the toy car?</p>
      <p><strong>APPLICATION</strong></p>
      <p>1. To avoid any road accidents, what precautionary measures should be taken when traveling in a zigzag path? Should a car speed up or slow down? Explain your answer.</p>
      <p>2. A driver should step on the gas more often while descending on a sloping road. Explain the physics concept behind this situation and its impact on road safety.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <p>3. What is the rationale behind the implementation of a regulation that requires very big trucks to stay within their designated lanes for slow-moving vehicles?</p>
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
