<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 4: Expressing Concentration of Solutions</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "19"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="title">Lesson 4 Expressing Concentration of Solutions</div>
        </div>
        <p>What does concentration of solutions mean?</p>
        <p>A solution may be described in terms of the amount of solute it contains, which is referred to as the concentration of the solution. A solution may be described qualitatively as dilute or concentrated or quantitatively based on percent composition.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Dilute and Concentrated</div>
        </div>
        <p>The terms dilute and concentrated describe the relative amount of the solute in the solution. They do not indicate the exact amount of solute. A dilute solution has a relatively small amount of solute. Adding more solvent will make the solution more dilute. On the other hand, a concentrated solution has a high amount of solute. Adding more solute will make the solution more concentrated.</p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img" alt="Figure 3-6. Varying degrees of concentration of a colored solution: from the most concentrated (left) to the most dilute (right)">
            <div class="caption">Figure 3-6. Varying degrees of concentration of a colored solution: from the most concentrated (left) to the most dilute (right)</div>
        </div>
        <p>For colored solutes, such as dyes, the color of the solution usually indicates the degree of its concentration. Concentrated solutions have an intense or dark color, while dilute solutions are pale or light in color.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Percent by Mass</div>
        </div>
        <p>Two common quantitative expressions of solution concentration are percent by mass and percent by volume.</p>
        <p>Percent by mass is expressed as the mass of solute in the solution divided by the total mass of the solution, then multiplied by 100.</p>
        <div class="illustration">
            <img src="assets/img" alt="Formula Image">
            <div class="caption">Formula Image</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>A 5% by mass of sodium chloride (NaCl) solution contains 5 parts of NaCl for every 95 parts of water (H₂O). Thus, a 100-gram sample of this solution contains 5 grams of NaCl and 95 grams of H₂O.</p>
        <div class="illustration">
            <img src="assets/img" alt="Formula Image">
            <div class="caption">Formula Image</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Percent by Volume</div>
        </div>
        <p>The concentration of a solution can also be expressed in percent by volume. Percent by volume is equal to the volume of solute divided by the volume of solution multiplied by 100.</p>
        <div class="illustration">
            <img src="assets/img" alt="Formula Image">
            <div class="caption">Formula Image</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>The concentration of a solution of two liquids is frequently expressed in percent by volume. This is true for alcoholic beverages. A wine that is 20% alcohol has 20 milliliters of alcohol per 100 milliliters of wine.</p>
        <div class="illustration">
            <img src="assets/img" alt="Formula Image">
            <div class="caption">Formula Image</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img" alt="Figure 3-7. The alcohol content of alcoholic beverages is expressed in percent by volume or in terms of proof as shown on their label.">
            <div class="caption">Figure 3-7. The alcohol content of alcoholic beverages is expressed in percent by volume or in terms of proof as shown on their label.</div>
        </div>
        <p>Aside from percent by volume, the alcohol content in alcoholic beverages can also be expressed in terms of "proof." The proof is twice the percent by volume of alcohol. Thus, a liquor that is 100 proof is 50% alcohol by volume; a 90-proof liquor contains 45% alcohol.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> For an aquarium to achieve a salt concentration similar to seawater, it must contain 3.5 grams of sodium chloride per 100 grams of solution. What is the percent by mass of sodium chloride in the solution?</p>
        <p><strong>2.</strong> An orange juice drink sold in a supermarket is 10% by volume of pure orange extract. (a) What volume (in milliliters) of pure orange extract is present in 100 milliliters of this juice drink? (b) What volume (in milliliters) of water is present in the same amount of drink? Assume that the volumes are additive.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test" unelevated class="start-btn">
          Answer
        </q-btn>
      </div>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">SCIENCE HISTORY</div>
        </div>
        <p>Alcohol proof indicates the amount of alcohol contained in an alcoholic beverage. The term "proof spirit" was originally used in the United Kingdom as early as the 18th century. During that time, payments to British sailors included rations of rum. To determine if the rum was not diluted with water, it was covered with gunpowder. If the gunpowder did not ignite when tested, the rum was noted to contain too much water and considered "under proof." A proof spirit of 100 degrees is calculated to be equivalent to 57.15% alcohol by volume (ABV).</p>
    </div>
    `,
            `
    <div>
        <p>Indicating that the alcohol content on the labels of liquors is regulated by law in the US and in most European countries. The UK uses the ABV standard instead of alcohol proof. In the US, alcohol proof is defined as twice the percentage of ABV.</p>
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
