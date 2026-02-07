<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 7: Focusing Specimens under the Compound
                    Microscope</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "33"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">ACTIVITY 7</div>
      </div>
      <div class="header">
        <div class="title">Focusing Specimens under the Compound Microscope</div>
      </div>
      <p>Sample specimens to be examined under the microscope are generally prepared in two ways: prepared slides or wet mounts. Prepared or permanent slides can last for a long time. They are purchased from biological supply stores, or may be teacher-made. Wet mounts, on the other hand, are temporary, usually lasting for one laboratory period. In this experiment, you will learn how to prepare slides for observation, and observe and examine specimens under the microscope.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>OBJECTIVES</p>
      <p>Prepare slides for examination under the microscope</p>
      <p>Locate the specimen of interest and focus it under LPO and HPO</p>
      <p>Calculate the magnification of an image observed under the microscope</p>
      <p>MATERIALS</p>
      <p>◾ water</p>
      <p>◾ letter e (cut from a magazine or newspaper)</p>
      <p>◾ hair strand with follicle (use one that has naturally fallen or taken by comb)</p>
      <p>◾ compound microscope</p>
      <p>◾ medicine dropper</p>
      <p>◾ lens paper or cotton swab</p>
      <p>◾ scissors or cutter</p>
      <p>◾ coverslip</p>
      <p>◾ ruler</p>
      <p>◾ glass slide</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>PROCEDURE</p>
      <p>1. Place the cutout letter e at the center of the glass slide. Using a medicine dropper, place a small amount of water on it. Carefully put a coverslip over the specimen, starting from the edge to prevent the formation of bubbles.</p>
      <p>2. Place the slide at the center of the stage and secure it with the stage clips.</p>
      <p>3. Set the scanner in place and use the coarse adjustment knob to lower the objective as close as possible to the slide.</p>
      <p>4. Keeping both of your eyes open, focus the letter e on the slide carefully using the coarse adjustment knob. If you do not see anything with both eyes open, cover one eye with your palm. Sharpen the focus with one eye.</p>
      <p>5. Using the iris diaphragm, regulate the amount of light that illuminates the specimen. You cannot see clearly the details of the specimen under examination with too much light.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>6. Once the specimen is in focus, move the slide slightly to the left and then to the right. Note the position and orientation (upright or inverted) of the specimen. Draw your observations under Data and Results.</p>
      <p>7. Set the HPO in place and focus the specimen using the fine adjustment knob. Draw your observations under Data and Results. Compare the appearance of the letter e under LPO and HPO.</p>
      <p>8. Replace the cutout letter e specimen with a 1-cm piece of hair strand with follicle.</p>
      <p>9. Focus the hair follicle under LPO, then HPO. Take note of its size. Draw your observations in Data and Results. Compare the appearance of the follicle under LPO and HPO.</p>
      <p>10. Once you are done, clean the ocular and the objective lenses. Make sure that the stage is dry before returning the microscope into the storage box or cabinet.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="header">
        <div class="title">DATA AND RESULTS</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="Figure">
        <div class="caption">Figure</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="header">
        <div class="title">ANALYSIS AND INTERPRETATION</div>
      </div>
      <p>1. Letter e</p>
      <p>a. What happened to the position of the cutout letter e when you moved the slide to the left? to the right?</p>
      <p>b. In what objective lens did you see the whole mount of the letter e?</p>
      <p>2. Hair follicle</p>
      <p>a. Did you see the whole specimen?</p>
      <p>b. Differentiate the image of the hair follicle when focused under LPO and HPO.</p>
      <p>Why should you put the specimen at the center of the field of view before changing the objective lens?</p>
      <p>Why must you use the fine adjustment knob in focusing the specimen under HPO?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="header">
        <div class="title">GENERALIZATION</div>
      </div>
      <p>What are the factors to consider prior to and while observing a specimen under a microscope?</p>
      <p>APPLICATION</p>
      <p>If the ocular lens can magnify an object 10x, and the objective lens 100x, what is the total magnification of the specimen under the microscope?</p>
      <p>What are the possible reasons a specimen may not be focused clearly under the microscope?</p>
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
