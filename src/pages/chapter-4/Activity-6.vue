<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Activity 6: Parts of a Compound Microscope</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "32"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">ACTIVITY 6</div>
      </div>
      <div class="header">
        <div class="title">Parts of a Compound Microscope</div>
      </div>
      <p>The word microscope comes from the Greek words mikros, meaning "small," and skopein, meaning "to see.” The function of the microscope is to magnify very small objects so that they can be seen and examined. One of the most commonly used type of microscopes is the compound microscope. A compound microscope has two sets of lenses: the eyepiece or ocular lens at the top end of the body tube and the objective lenses at the lower end of the revolving nosepiece.</p>
      <p>The compound microscope is a fragile and expensive instrument, and it should be handled with care. In this activity, you will be introduced to the parts of a compound microscope and their functions. More importantly, you will learn how to handle the microscope properly.</p>
      <p>OBJECTIVES</p>
      <p>1. State the function of each part of a compound microscope</p>
      <p>2. Handle the microscope properly and carefully</p>
      <p>3. Properly focus a specimen under the microscope</p>
      <p>4. Compute the total magnification of a specimen</p>
      <p>5. Observe proper care of the microscope</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>MATERIALS</p>
      <p>☐ alcohol or xylene</p>
      <p>☐ prepared slide of any specimen</p>
      <p>☐ compound microscope</p>
      <p>☐ lens paper or cotton swab</p>
      <p>PROCEDURE</p>
      <p>1. Identify the parts of a microscope and list down their functions in table 1.</p>
      <p>2. In using the microscope, observe the following:</p>
      <p>a. Carry the microscope with both hands. Grasp the arm with one hand and support the base with the other hand.</p>
      <p>b. Gently place the microscope on the laboratory table, with its arm facing you.</p>
      <p>c. Clean the lenses with lens paper or cotton swab for a clear view of your specimen. You may need to moisten the lens paper with alcohol or xylene to remove grease or oil, which can blur the image of the specimen. (Caution: Xylene is hazardous.)</p>
      <p>d. Examine the eyepiece or ocular lens and take note of the number followed by x. This refers to the magnification of the eyepiece, which tells how many times it can magnify the specimen. For example, 5x means the eyepiece can magnify an object five times its original size.</p>
      <p>e. Look for the objective lenses. There may be three or four of them. Notice that each objective has a number followed by x. Each objective magnifies the object by the factor marked on the particular lens. For example, a scanner objective, which is usually the shortest, has 5x, a low-power objective (LPO) has 10×, a high-power objective (HPO) has 40x, and an oil-immersion objective (OIO) has 100×. Objective lenses should be used in the following order: scanner, low, high, and oil-immersion. If you multiply the magnification of the ocular lens by the magnification of the objective lens, you will get the total magnification of the specimen under the microscope. For example, if you are using the LPO with 10x, multiply this with the magnification number of the ocular lens, which is 5×, and you get a total magnification of 50x. With this information, fill in table 2</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>f. Turn the coarse adjustment knob to raise the body tube away from the stage.</p>
      <p>g. Rotate the revolving nosepiece and select the objective lens with the lowest magnification. Continue rotating until the objective lens sets into place.</p>
      <p>h. Place a specimen slide on the stage and secure it with the stage clips. If your microscope uses a mirror for illumination, position the mirror at an angle that allows it to catch and reflect a sufficient amount of light. If it has a built-in light source, switch it on.</p>
      <p>i. Adjust the iris diaphragm located under the stage of the microscope to control the amount of light that passes through the specimen and the lens, thus making the microscope's field of view bright.</p>
      <p>j. In focusing the specimen, use the objective lens with the lowest magnification first. This may be a scanner or an LPO. Turn the coarse adjustment knob until the specimen comes into focus. To use the HPO, rotate the revolving nosepiece until the HPO sets into place. Focus the specimen using the fine adjustment knob. Do not use the coarse adjustment knob in focusing specimens under HPO or OIO to avoid damaging the specimen and the objective lenses.</p>
      <p>k. The OIO is used for very small organisms, such as bacteria. To use it, locate first the specimen to be observed using the scanner, then the LPO, then the HPO. Place a drop of cedarwood oil on the coverslip at the center of the viewing area. Rotate the nosepiece until the OIO is in contact with the oil. Only use the fine adjustment knob in focusing your specimen. After examining your specimen, lower the stage before removing the slide. Be sure to wipe off the oil from the coverslip and the OIO lens with a lens paper or cotton swab dipped in xylene.</p>
      <p>3. After using the microscope, set the revolving nosepiece to its shortest objective. Return it to its storage box or cabinet. Do not forget to carefully hold it by its arm and support the base with your palm.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>DATA AND RESULTS</p>
      <p>Table 1. Parts of a Compound Microscope and Their Fuctions</p>
      <p>Table 2. Computation of Total Magnification</p>
      <p>ANALYSIS AND INTEREPRETATION</p>
      <p>1. How should you carry a microscope?</p>
      <p>2. What are the two possible sources of light for a microscope?</p>
      <p>3. What is the iris diaphragm for? What happens when it is adjusted?</p>
      <p>4. What are the essential parts of the microscope that help you see or examine a specimen?</p>
      <p>5. How do you compute the total magnification of a specimen viewed under a microscope?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>GENERALIZATION</p>
      <p>1. What are the three classifications of the parts of a microscope?</p>
      <p>2. How should one use and maintain a microscope?</p>
      <p>3. How do you compute for the total magnification of a microscope?</p>
      <p>APPLICATION</p>
      <p>1. Why are microscopes important in science?</p>
      <p>2. If the microscope had not been invented, what would not have been possible to do in our time? What would have happened to humanity?</p>
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
