<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 11: Measuring Forces</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
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

                        <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>

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
        const lessonId = lesson ? String(lesson.id) : "54"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">ACTIVITY 11</div>
      </div>
      <div class="header">
        <div class="title">Measuring Forces</div>
      </div>
      <p><strong>OBJECTIVES</strong></p>
      <p>1. Measure the force acting on an object.</p>
      <p>2. Sketch free-body diagrams.</p>
      <p><strong>MATERIALS</strong></p>
      <p>- inclined plane</p>
      <p>- protractor</p>
      <p>- spring scale</p>
      <p>- water</p>
      <p>- 250 mL beaker</p>
      <p>- meterstick</p>
      <p>- 5 different standard masses or objects of known mass</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p><strong>PROCEDURES</strong></p>
      <p><strong>Setup 1. Measuring the force needed to lift an object</strong></p>
      <p>1. Verify if the pointer of the spring scale aligns with the zero mark.</p>
      <p>2. Attach one standard mass to the spring balance to measure the force needed to lift it to a height. Measure the height using the meterstick.</p>
      <p>3. Repeat steps 1 and 2 using the remaining standard masses. Lift them to the same height.</p>
      <p>4. Record the data and complete table 1.</p>
      <p>5. Sketch the free-body diagram and label the types of force present.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p><strong>Setup 2. Measuring the force needed to pull an object on an inclined plane</strong></p>
      <p>1. Verify if the pointer of the spring scale aligns with the zero mark.</p>
      <p>2. Set up the inclined plane. Make sure it is stable. Measure the angle of inclination with respect to the horizontal.</p>
      <p>3. Attach one standard mass to the spring balance to measure the force needed to pull it on the inclined plane.</p>
      <p>4. Repeat steps 1 to 3 using the remaining standard masses. Make sure that the angle of inclination is constant.</p>
      <p>5. Record the data and complete table 2.</p>
      <p>6. Sketch the free-body diagram and label the types of force present.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p><strong>Setup 3. Measuring the force of a hanging object on fluids</strong></p>
      <p>1. Verify if the pointer of the spring scale aligns with the zero mark.</p>
      <p>2. Attach one standard mass to the spring balance and hang it. Measure the force of the hanging object.</p>
      <p>3. Now, partially submerge the hanging object in a beaker of water.</p>
      <p>4. Repeat steps 1 to 3 using the remaining standard masses.</p>
      <p>5. Record the data and complete table 3.</p>
      <p>6. Sketch the free-body diagram and label the types of force present.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p><strong>DATA COLLECTION AND ANALYSIS</strong></p>
      <p><strong>Table 1. Force in lifting objects</strong></p>
      <div class="illustration">
        <img src="assets/img" alt="Table 1. Force in lifting objects">
        <div class="caption">Table 1. Force in lifting objects</div>
      </div>
      <p>Sketch the Free-Body Diagram:</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <p><strong>Table 2. Force in pulling objects along an inclined plane</strong></p>
      <div class="illustration">
        <img src="assets/img" alt="Table 2. Force in pulling objects along an inclined plane">
        <div class="caption">Table 2. Force in pulling objects along an inclined plane</div>
      </div>
      <p>Sketch the Free-Body Diagram:</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p><strong>Table 3. Force of hanging objects submerged in water</strong></p>
      <div class="illustration">
        <img src="assets/img" alt="Table 3. Force of hanging objects submerged in water">
        <div class="caption">Table 3. Force of hanging objects submerged in water</div>
      </div>
      <p>Sketch the Free-Body Diagram:</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p><strong>ANALYSIS AND INTERPRETATION</strong></p>
      <p>1. Which requires more force: lifting an object or pulling it along an inclined plane? Justify your answer.</p>
      <p>2. In setup 1, how is the mass of the object related to the force required to lift it?</p>
      <p>3. Compare the measured force before and after submerging the object in water. Did you obtain the same measurement? Explain the result.</p>
      <p><strong>GENERALIZATION</strong></p>
      <p>1. What is the importance of a free-body diagram?</p>
      <p>2. What indicates a zero net force?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <p><strong>APPLICATION</strong></p>
      <p>1. Why are inclined planes used as loading ramps for cargo?</p>
      <p>2. How is force measurement used in materials science and metallurgy industry?</p>
      <p>3. Why is it important for structural engineers to measure the forces acting on the different components of a structure, such as a bridge and a building?</p>
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
