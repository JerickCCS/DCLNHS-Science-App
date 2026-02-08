<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 3: Factors That Affect Solubility</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "18"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="title">Lesson 3 Factors That Affect Solubility</div>
        </div>
        <p>What are the factors that affect solubility?</p>
        <p>In a homogeneous mixture, the dissolved solute remains uniformly distributed throughout the solution. As such, the physical properties of the mixture, such as color and state, are uniform throughout its phase. These only happen when the solute is soluble in the solvent, which means it can completely dissolve in the solvent at the given temperature. How do we determine which solutes are soluble in a solvent?</p>
        <p>The ability of a solvent to dissolve a solute is governed by the principle "like dissolves like." The term "like" refers to the polar or ionic nature of a substance, which you will learn more about in higher chemistry courses. Polar and ionic solutes dissolve only in polar solvents, and not in nonpolar solvents. Similarly, nonpolar solutes dissolve only in nonpolar solvents.</p>
    </div>
    `,
            `
    <div>
        <p>Let us consider water, a polar substance. Water can dissolve table sugar, also a polar substance, and table salt, an ionic substance. It cannot dissolve oil, which is made up of nonpolar lipids. Oil, however, can dissolve in benzene, which is a nonpolar solvent.</p>
        <div class="illustration">
            <img src="assets/img" alt="Figure 3-3. Water dissolves (A) sugar, but not (B) oil.">
            <div class="caption">Figure 3-3. Water dissolves (A) sugar, but not (B) oil.</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>Some solutes do not completely dissolve in a solvent at a given temperature. A substance is described as partly soluble if only a portion of it can dissolve in the solvent. It is insoluble if none of it dissolves in the solvent.</p>
        <p>The amount of solute that can dissolve in a given amount of solvent, or its solubility in the solvent, is directly affected by two factors—temperature and pressure.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI LAB 3-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Materials:</strong> 4.5 g of table salt, 5 mL water, 5 mL oil, 5 mL ethanol, clear containers, spoon, and measuring cup</p>
        <p><strong>Procedure:</strong></p>
        <p><strong>1.</strong> Label each clear container with the name of the solvent: water, oil, and ethanol.</p>
        <p><strong>2.</strong> Measure 5 mL of each solvent using a measuring cup. Pour each solvent into its respective labeled container.</p>
        <p><strong>3.</strong> Measure 1.5 grams of table salt. Add 1.5 grams of table salt to each container.</p>
        <p><strong>4.</strong> Use the spoon to stir each mixture for about 2 minutes.</p>
        <p><strong>5.</strong> Observe each container and record whether the table salt is soluble or insoluble in each solvent.</p>
        <p><strong>Guide Questions:</strong></p>
        <p><strong>1.</strong> In what solvent(s) is the table salt soluble? In what solvent(s) is it insoluble?</p>
        <p><strong>2.</strong> Since table salt is an ionic substance, what can you infer about the nature of each solvent?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-3-1" unelevated class="start-btn">
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
            <div class="title">Temperature</div>
        </div>
        <p>Temperature has a significant effect on the solubility of two types of solutions—solids dissolved in liquids and gases dissolved in liquids. Do Mini Lab 3-2 to investigate how temperature affects the solubility of a solid solute in a liquid solvent.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI LAB 3-2</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Materials:</strong> table salt, cold water, hot water, room-temperature water, three glasses, and spoon</p>
        <p><strong>Procedure:</strong></p>
        <p><strong>1.</strong> Fill one glass halfway with cold water (around 0–10°C). Add two spoonfuls of salt into the water and stir the mixture.</p>
        <p><strong>2.</strong> In another glass, do step 1, but use hot water (around 60–80°C). Do the same in another glass using room-temperature water (around 20–25°C).</p>
        <p><strong>Guide Questions:</strong></p>
        <p><strong>1.</strong> How much of the added salt was dissolved in water?</p>
        <p><strong>2.</strong> Compare the amounts of dissolved salt in the three glasses.</p>
        <p>You might have observed that more salt dissolved in hot water than in cold water. This is the trend for most solutes—that is, the solubility of a solute increases with temperature. This trend is depicted in the solubility curves of different substances in water (Figure 3-4). Note from the figure that cesium sulfate is one of the few exceptions to this trend. Its solubility decreases with increasing temperature.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-3-2" unelevated class="start-btn">
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
        <div class="illustration">
            <img src="assets/img" alt="Figure 3-4. Solubility curves of some solutes in water">
            <div class="caption">Figure 3-4. Solubility curves of some solutes in water</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>Unlike solids, gases become less soluble in liquids as temperature increases. You may have observed that when water is heated, bubbles form before the water boils. These bubbles are dissolved gases in water that "boil out" first before the water itself boils. The same trend is observed for oxygen. The solubility of oxygen in water is low at high temperatures. Thus, fish are less active in water during daytime than at nighttime. This is why the best times of the day to fish are early morning and late evening.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Pressure</div>
        </div>
        <p>If the solute in a solution is a liquid or a solid, pressure has very little or no effect on its solubility. However, this is not true for a solution of gas in a liquid. The higher the pressure of that gas above the surface of the solution, the higher the amount of gas in a solution. This principle is known as Henry's law.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI LAB 3-3</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Materials:</strong> 2 identical bottles with airtight caps, carbonated water (or soda), measuring cup, ruler, paper, pen, and refrigerator</p>
        <p><strong>Procedure:</strong></p>
        <p><strong>1.</strong> Fill both bottles with the same amount of carbonated water (or soda). Use a measuring cup to ensure both bottles contain the same volume.</p>
        <p><strong>2.</strong> Observe the carbonated water in each bottle. Take note of any bubbles and measure the height of the liquid in each bottle.</p>
        <p><strong>3.</strong> Seal one bottle (labeled as Bottle A) tightly and leave it at room temperature (around 20–25°C).</p>
        <p><strong>4.</strong> Seal the other bottle (labeled as Bottle B) tightly and place it in the refrigerator.</p>
        <p><strong>5.</strong> Allow the bottles to sit for a few hours (or even a whole day). Observe any changes in the height of the liquid, the amount of bubbles, and the pressure inside the bottles.</p>
        <p><strong>6.</strong> After the waiting period, open each bottle and observe any differences in the amount of carbonated water and the sound or force when opening the bottles.</p>
        <p><strong>Guide Questions:</strong></p>
        <p><strong>1.</strong> How do the two bottles differ in terms of liquid height, bubbles, and pressure?</p>
        <p><strong>2.</strong> Which bottle made more noise or exerted more pressure when opened?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-3-3" unelevated class="start-btn">
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
        <div class="illustration">
        <img src="assets/img" alt="Figure 3-5. What causes the fizzing sensation when you open a bottle of carbonated drinks?">
        <div class="caption">Figure 3-5. What causes the fizzing sensation when you open a bottle of carbonated drinks?</div>
      </div>
        <p>An evidence of this principle is the fizzing sensation observed when you open a bottle of carbonated drinks (figure 3-5). Carbon dioxide is dissolved in the drink using high pressure. As you open the bottle, the pressure inside it decreases. Thus, the solubility of carbon dioxide also decreases, and the gas bubbles out of the drink.</p>
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
