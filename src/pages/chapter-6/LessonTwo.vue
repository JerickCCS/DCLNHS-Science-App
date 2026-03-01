<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Lesson 2: Energy Flow in an Ecosystem</div>
                <button class="bookmark-btn" @click="toggleBookmark">
                    <span class="material-icons"
                        :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">{{ isBookmarked ?
                            'bookmark' : 'bookmark_border' }}</span>
                </button>
            </div>
            <q-linear-progress :value="progress" size="4px" color="white" class="header-progress" />
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

                        <div class="text-subtitle2 text-white">{{ currentPage + 1 }} / {{ pages.length }}</div>

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
        const lessonId = lesson ? String(lesson.id) : "44"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">Energy Flow in an Ecosystem</div>
      </div>
      <p>What is the relationship between trophic levels and the transfer of energy in an ecosystem?</p>
      <p>In an ecosystem, different populations of organisms have different roles that partially determine their trophic levels. An ecosystem's success depends on the relationships among organisms in the different trophic levels.</p>
      <p>Essentially, there are two basic concepts about ecosystems that need to be understood: (1) how energy is used by organisms; and (2) how organisms acquire minerals and other essential inorganic substances.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>Of the different abiotic factors that affect the organisms that live in an ecosystem, energy is the most important. It is needed by the living components of the ecosystem for survival. Energy from the sun is captured by producers such as plants, algae, and some bacteria, and is used to synthesize food in a process called photosynthesis.</p>
      <p>Organisms are classified according to how they obtain food in the trophic level. Producers are also called autotrophs because they can make their own food. Organisms that depend on producers and other organisms for food and energy on the other hand, are called consumers, or heterotrophs. There are three types of consumers: herbivores, carnivores, and omnivores. Herbivores consume plants, carnivores eat meat, and omnivores consume both plants and animals. An ecosystem also has decomposers, the ones that break down dead organisms and obtain energy from organic wastes, such as feces and leaf litter. Fungi, such as mushrooms, and some bacteria, such as Pseudomonas, are decomposers. Detritivores are organisms that feed on dead or decaying organic matter from plants and animals, as well as fecal matter. They play an important role in the ecosystem by getting rid of the bulk of decomposing organic matter on our planet. Examples of detritivores are earthworms, millipedes, dung beetles, wood lice, and clams.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>A population that shares the same function and energy requirement is assigned to a trophic level (feeding level). An energy pyramid (figure 6-5) is a graphical model that shows how energy flows in an ecosystem. Its shape represents how the amount of energy available to consumers decreases at each trophic level. The primary producers-plants are at the base or first trophic level.</p>
      <p>Insects are the primary consumers of plants and are at the second trophic level. At the third trophic level are frogs, which are then consumed by snakes at the fourth trophic level. Snakes are then eaten by eagles, which are at the fifth trophic level. Note that consumers are relatively few at the top of the pyramid because there is much less energy available for them. The rule of ten applies to the energy pyramid, in which only 10% of energy in a trophic level is passed on to the next trophic level with the 90% used for growth, repair, and reproduction, with some escaping as heat.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>The flow of energy in an ecosystem can be described using models and diagrams. A food chain is a linear arrangement of organisms according to the order in which one organism feeds on another. It identifies what organism is eaten by another organism. Figure 6-6 shows an example of a food chain where each organism is positioned according to its trophic level. For example, grass, a primary producer, is at the start of the food chain or the first trophic level. The first animal, the grasshopper, is the primary consumer and positioned at the second trophic level. The next animal, the mouse, considered the secondary consumer is positioned at the third trophic level, followed by the snake as the tertiary consumer at the fourth trophic level. When the snake dies, it is broken down by decomposers, and its nutrients are consumed by plants like grass.</p>
      <p>IMAGE Figure 6-6. An example of a terrestrial food chain</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>Rarely do organisms eat just one type of food. If you list every species in an ecosystem and connect them to their food sources, you will come up with a model made up of interlocking arrows that resemble a spider web. This interconnecting food chain is called a food web. It shows the precise feeding relationships among a population of organisms. Food webs describe feeding relations in an ecosystem more accurately than food chains. An example of a food web is shown in figure 6-7.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 6-7. An example of a food web. What are the different food chains that constitute this food web?">
        <div class="caption">Figure 6-7. An example of a food web. What are the different food chains that constitute this food web?</div>
      </div>
    </div>
    `,
            `
            <div>
      <div class="info-card">
  <div class="info-title">MINI TEST 6-2</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p>1. Explain what is meant by this statement: Grass is just as important as mice in the diet of a carnivore.</p>
        <p>2. What are the different trophic levels?</p>
        <p>3. Draw one example of a food pyramid then describe the transfer of energy between organisms from one trophic level to another.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-6-2" unelevated class="start-btn">
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
      <!-- Card 6 -->
      <div class="header">
        <div class="title">The Ecological Pyramids</div>
      </div>
      <p>The number of organisms at each trophic level can be visualized through a pyramid, known as the pyramid of numbers. Other ecological pyramids, such as energy and biomass pyramids, are used to quantitatively show how much energy is transferred from one trophic level to the next.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 6-8. A sample pyramid of numbers">
        <div class="caption">Figure 6-8. A sample pyramid of numbers</div>
      </div>
      <p>A pyramid of numbers shows the abundance or number of individual organisms at each trophic level in an ecological community (figure 6-8). It suggests that a thriving community would have more plants than herbivores, and more herbivores than carnivores; otherwise, the community would collapse. However, the pyramid of numbers does not always appear as a regular pyramid. For example, a single tree (primary producer) may feed hundreds of caterpillars (primary consumer), or a deer (primary consumer) may be infested with numerous ticks (secondary consumer). Hence, the pyramid of numbers is not always upright when the number of organisms in a trophic level exceeds the number of organisms in the trophic level below it.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <div class="header">
        <div class="title">Pyramids of Biomass and Energy</div>
      </div>
      <p>The pyramid of numbers does not take into account the biomass of organisms or how energy is utilized. Hence, it is not a reliable indication of the flow of biomass and energy in a community. Biomass is the total mass of all living organisms at any given time. Energy, on the other hand, is the amount of calories in each individual or group of organisms.</p>
      <p>Figure 6-9 presents a sample pyramid of biomass, while figure 6-10 shows a sample pyramid of energy. In both pyramids, the base represents the producers, while the apex represents the highest-level consumer or the top predator. In figure 6-9, notice that the biomass of the producers is greater than that of the herbivores, and the biomass of the herbivores is greater than that of the carnivores. In figure 6-10, the amount of energy decreases from the bottom (producers) to the top (carnivores, which are secondary consumers). The amount of energy transferred from one trophic level to the next is only about 10%. This is referred to as the rule of ten. For example, if a cow consumes 1000 kcal of energy from grass and other plants, only about 10% or 100 kcal is used to build biomass, and the rest is used for processes such as growth, development, respiration, and reproduction. When humans eat beef, they utilize only about 10 kcal or 1% of the energy originally captured by plants. In theory, the rule of ten limits the number of trophic levels in ecosystems because most of the energy is either used or lost in maintaining biological systems.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <div class="illustration">
        <img src="assets/img" alt="Figure 6-9. A sample pyramid of biomass (in g/m²)">
        <div class="caption">Figure 6-9. A sample pyramid of biomass (in g/m²)</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="Figure 6-10. A sample pyramid of energy (in thousands of kcal/cm² per year)">
        <div class="caption">Figure 6-10. A sample pyramid of energy (in thousands of kcal/cm² per year)</div>
      </div>
      <p>In some aquatic ecosystems, the ecological pyramids are inverted-that is, there are more primary consumers (zooplankton) by mass than producers (phytoplankton). This can be attributed to the rapid growth of phytoplanktons, as well as the even higher rate of consumption by zooplanktons.</p>
    </div>
    `,
            `
    <div>
      <div class="info-card">
  <div class="info-title">MINI TEST 6-3</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> What happens to the amount of energy received by an omnivorous consumer that occupies the second trophic level instead of the fourth trophic level it usually occupies? Explain.</p>
        <p><strong>2.</strong> Explain how the types of ecological pyramids differ from one another.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-6-3" unelevated class="start-btn">
          Answer
        </q-btn>
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
            boxShadow: "7px 7px 0px 0px rgba(0, 0, 0, 0.16)"
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
            /* Reload Fix */

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
            stopConfetti()
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
