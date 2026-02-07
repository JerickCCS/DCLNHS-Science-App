<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Scientific Models</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
                        @click="toggleBookmark" />
                </div>
            </q-toolbar>
            <q-linear-progress :value="progress" size="4px" color="primary" class="header-progress" />
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

                        <!-- <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div> -->

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
        const lessonId = lesson ? String(lesson.id) : "1"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
<div class="header">
          <div class="banner">
        <img src="assets/img/chapter 1/scientific model.png" alt="movement">
        <p style="display: none;">Scientic Models</p>
      </div>
          <div class="title">What are scientific models?</div>
        </div>
      </div>
            
            <p>
                Scientific models are representations of concepts, systems, or ideas. They take many forms, such as three- or two-dimensional objects or diagrams, mathematical equations, and computer simulations. Models are made from established scientific knowledge and observed patterns that allow the prediction of patterns in different conditions or scenarios. Models generally help explain and understand processes, phenomena, and ideas that are not commonly observed or easily imagined. In many cases, models allow scientists to test ideas and predict outcomes that cannot be easily done in the real world. Models also allow them to test the validity of other existing models.
            </p>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            Scientific models are commonly categorized into physical, conceptual, mathematical, and computer models. Physical models are tangible objects that help one understand a concept or process. It is a three-dimensional constructed copy of an original object that matches its characteristics, such as shape. In some cases, a physical model represents an abstract idea.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Physical models can be life-size replicas or scale models, which are smaller than the original objects, but otherwise identical. Examples are the globe, which represents the Earth, and the model of the human skeletal system.
        </p>


        <div class="illustration">
            <img src="assets/img/chapter 1/globe.png" alt="Globe model">
        </div>
        <div class="illustration">
            <img src="assets/img/chapter 1/skeleton.png" alt="Skeleton model">
                <div class="caption">Physical models of Earth (globe) and the human skeletal system</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            Conceptual models are representations that make use of familiar objects or expressions to present a concept or an abstract and complicated idea. They are also considered mental models (Victoria State Government 2020). An example is the particle model of matter, which uses round particles to represent the composition of matter to explain their observable properties.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Some conceptual models present a system of ideas that show general relationships. An example is the taxonomic classification of organisms, which shows the hierarchical groupings of organisms. Other models are expressed through writing, speech, or action and are referred to as expressed models (Victoria State Government 2020). Examples are diagrams and flowcharts. Flowcharts are structured diagrams of complex processes or scenarios that show key concepts, variables, and their relationships using arrows and shapes. Some flowcharts show decision options and corresponding outcomes in a process.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 1/solid-liquid-gas.png" alt="States of matter model">
                <div class="caption">(a)</div>
        </div>

        <div class="illustration">
            <img src="assets/img/chapter 1/logic.png" alt="Flowchart model">
                <div class="caption">(b)</div>
                <div class="caption">Conceptual models: (A) particle model of matter and (B) a flowchart</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            Mathematical models quantitatively represent relationships, patterns, and behavior using equations. These models are based on observations, theories, and measurements. They contain numbers, characters, letters, and symbols. An example is the equation for Newton's second law of motion (F=ma) which describes the relationship among mass, acceleration, and the applied force on an object.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Computer models utilize computer softwares to study and simulate complex systems. These models are usually highly mathematical in nature and involve complex processing of numerous data. They are now widely used in all fields of science. In chemistry, the behavior of atoms and molecules are now taught using computer simulations.
        </p>
<div class="model-viewer-block">
      <model-viewer src="/models/atom.glb"
              alt="DNA Structure"
              camera-controls
              auto-rotate
              style="width:100%; height:50vh; background:#eef2ff; border-radius:10px;">
</model-viewer>


    </div>

    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST 1-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> How do physical and conceptual models differ?</p>
        <p><strong>2.</strong> The Bohr model of the atom describes an atom as consisting of nucleus at the center around which electrons revolve along specific orbits A 3D model can be seen in the previous page. What type of model is this?</p>
        <p><strong>3.</strong> Meteorologists use and process various complicated atmospheric information to come up with a daily weather forecast. What type of model will they most likely use? Why?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-1-1" unelevated class="start-btn">Answer</q-btn>
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

        onUnmounted(() => {
            stopSpeaking()
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
