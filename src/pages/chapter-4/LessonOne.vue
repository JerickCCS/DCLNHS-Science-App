<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: The Microscope: Parts and Function</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "28"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">How is the microscope important in the study of cells and its organelles?</div>
      </div>
      <p>Living organisms come in two forms based on their size; they are either macroscopic or microscopic. Macroscopic life can be seen by the naked eye, while microscopic life-forms refer to small living organisms. Observing organisms or parts of an organism that are very small is difficult without the aid of microscopes.</p>
      <p>In the mid-1660s, Dutch scientist Antonie van Leeuwenhoek invented the first practical microscope. He used this to examine protozoans, bacteria, and other microscopic organisms. As technology advanced, various types of microscopes became available. They were developed to fit the current needs of scientists to build more knowledge in science.</p>
      <p>The compound light microscope is the most common microscope used in science laboratories. It has two lenses: the objective lens and the ocular lens. A compound light microscope that has only one ocular lens is called a monocular microscope, while the one that has two ocular lenses is called a binocular microscope.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>The compound microscope has several objective lenses in varying magnification power-the scanner with 4x, the low power objective (LPO) with 10x, the high power objective (HPO) with 40x, and the oil immersion objective (OIO) with 100x. If you multiply the magnification of the ocular lens by the magnification of the objective lens, you will get the total magnification of the specimen under the microscope. For example, if you are using the LPO with 10x, multiply this with the magnification number of the ocular lens, which is 5x, and you get a total magnification of 50x.</p>
      <p>Compound microscopes can be used to examine both living and nonliving specimens. However, they cannot provide enough magnifying power to examine extremely small parts of a specimen such as the mitochondria and the ribosomes.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div class="title">Importance of a Microscope</div>
      </div>
      <p>Science has greatly advanced in the last century. Among the many reasons for this advancement is the development and use of sophisticated laboratory instruments such as the microscope. Below are some of the reasons why this tool is important in the study of life.</p>
      <p>1. The microscope is one of the instruments that enables the study of microscopic organisms.</p>
      <p>2. Using a microscope, the tiny parts of cells can be observed and identified in detail. With the help of the microscope, scientists are able to know more how organisms perform life processes.</p>
      <p>3. Microscopes are used in the medical field to diagnose illnesses.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">The Parts and Functions of a Compound Light Microscope</div>
      </div>
      <p>Similar to the organization of living organisms, the microscope has parts that are necessary for it to function well. The absence of or damage to one of the components may affect the way the microscope functions. It is therefore necessary to know the different parts that make up the microscope and how each of these functions. The parts of a compound light microscope found in figure 4-1 can be classified into mechanical, magnifying, and illuminating parts.</p>
      <p>The mechanical parts hold the different parts together and are used to adjust the magnifying and illuminating parts to focus on a specimen. The magnifying parts are involved in enlarging the image of a specimen. The illuminating parts are used to collect light and create a clear image. Table 4-1 summarizes the different parts and functions of a compound light microscope.</p>
      <div class="illustration">
        <img src="assets" alt="Figure 4.1. The compound microscope(monocular)">
        <div class="caption">Figure 4.1. The compound microscope(monocular)</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="illustration">
        <img src="assets" alt="Table 4.1. Parts, Descriptions, and Functions of a Compound Light Microscope">
        <div class="caption">Table 4.1. Parts, Descriptions, and Functions of a Compound Light Microscope</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="header">
        <div class="title">Proper Use, Handling, and Storage of a Compound Microscope</div>
      </div>
      <p>The compound light microscope being an optical instrument is generally made up of lenses. This is the main component that magnifies the image of very small specimens. The lenses are contained in metal tubes for protection against breakage and dust. The whole microscope is supported by metal structures like the base, arm, and pillar. The proper use, handling, and storage are important to ensure the quality of microscopic observations.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="header">
        <div class="title">Proper Focusing of Specimen for Microscopic Study</div>
      </div>
      <p>These are the steps on how to properly focus a specimen under the microscope:</p>
      <p>1. Place the microscope on the leveled working table in a position where it will not be easily knocked off from the table's edge.</p>
      <p>2. Choose the size of the iris diaphragm and the objective lens that will be used, and align it with the body tube and stage aperture (hole in the middle of the stage).</p>
      <p>3. Capture the light source by adjusting the angle of the mirror. The field of view when looking through the ocular lens should be white.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p>4. Place the slide on the stage with the specimen on the aperture. Secure the slide using the stage clip to keep it from falling off the stage.</p>
      <p>5. While looking in the ocular lens, slowly move the objective lens up until the image is clearly visible.</p>
      <p>6. Shift to LPO or HPO if a higher magnification is needed to view the image more closely.</p>
      <p>When shifting from scanner to LPO, or from LPO to HPO, make sure that the distance between the lens and the slide is enough to avoid damaging the lens and/or breaking the slide.</p>
      <p>7. Adjust the resolution of the HPO objective lens using the fine adjustment knob.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <div class="header">
        <div class="title">Proper Placement and Handling of the Microscope</div>
      </div>
      <p>The place where the microscope is placed for laboratory use is very important, and should be chosen carefully. A good experience in using the microscope relies on the condition of the working space. Below are some things to remember when choosing where the microscope should be placed for use:</p>
      <p>1. Make sure that the table where the microscope is placed receives a good amount and quality of light.</p>
      <p>2. The table must be sturdy, level, clean, and dry. There should also be enough space for the microscope and other materials for the activity.</p>
      <p>3. The table must not be located where there is direct sunlight, high temperature and humidity, water supply, vibrations, and dust.</p>
      <p>In transporting and safekeeping the microscope, all plugs, cables, and camera must be detached from the microscope and moved separately. Then, carefully pick up the microscope by firmly holding the arm with one hand and placing the other hand below the base (figure 4-2) to prevent the microscope from dropping just in case the other hand accidentally loses its grip.</p>
      <div class="illustration">
        <img src="assets" alt="Figure 4.2. Proper way of carrying the microscope">
        <div class="caption">Figure 4.2. Proper way of carrying the microscope</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 10 -->
      <div class="header">
        <div class="title">Proper Storage of the Microscope</div>
      </div>
      <p>The microscope must be cleaned after use and stored properly to protect it from damages. The following are to be considered when storing the microscope:</p>
      <p>1. Clean the microscope before storage. The external parts, except the lens, can be cleaned off dust with lint-free damp cloth. The lens is cleaned using a lens solution and lens paper. The lens should not be touched with the fingers or cleaned with tissue paper or cloth because it can scratch and damage the lens.</p>
      <p>2. The revolving nosepiece must be placed on its lowest level near the stage to prevent the gears from wearing out.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 11 -->
      <p>3. The mirror, if there is any, must be in a vertical position.</p>
      <p>4. The plastic dust cover of the microscope must be placed over before storing it in the cabinet.</p>
      <p>5. The storage must not be exposed to direct sunlight and high humidity.</p>
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
