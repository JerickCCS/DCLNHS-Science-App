<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar class="toolbar-row"> <q-btn flat dense round icon="arrow_back" aria-label="Go back"
                    @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Levels of Biological Organization</q-toolbar-title>
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
        const lessonId = lesson ? String(lesson.id) : "43"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="title">Levels of Biological Organization</div>
        </div>
        <p>How are the components of the living world built up from the simplest to the most complex?</p>
        <p>The biosphere is an organized collection of components of organisms and organisms themselves. Organisms interact with one another and with their environment. This interaction takes place from the most basic unit of life (cell) to the most complex level of the biological hierarchy (biosphere). All levels of life have interrelated systems and parts such as the environmental factors and the organisms that are necessary for the existence or functioning of one another. The study of the different levels of organization provides a simple way of connecting the simplest part of the living world to the most complex. Figure 6-1 shows an example of a biological organization from cell to organism.</p>
        <p>Figure 6-1. The biological levels of organization from cell to organism</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Cell</div>
        </div>
        <p>Cells are microscopic units that collectively carry out the processes that make an organism a living entity. Your body is composed of trillions of cells of around 200 different types. Your brain is made up of brain cells, your skeleton of bone cells, and your heart of cardiac muscle cells.</p>
        <p>There are different types of cells within a multicellular organism. In animals, major groups are epithelial, connective, muscle, and nervous cells. They can also be named specific to the part they make up, such as skin cells, bone cells, muscle cells, neurons, neuroglia, and others. In plants, the name of cells may vary slightly based on structure and function. Their names follow the tissues they build such as parenchymal cells for parenchymal tissue.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Tissue</div>
        </div>
        <p>At the early stages of life, most cells look the same. However, as life progresses, new cells become specialized to carry out specific functions in the body. These specialized cells start to group together to perform certain functions, such as protection, locomotion, and support. A group of cells that have the same function is called a tissue.</p>
        <p>In animals, tissues may belong to the four major groups namely: epithelial, muscular, connective, and nervous tissue as seen in figure 6-2. Each of these tissues has a unique characteristic in structure and function. Epithelial tissues cover the outermost part of the body--the skin. Muscular tissues have the ability to contract and relax, which enables body movement. Alongside the bones, muscular tissues give shape to the body. Connective tissues connect, bind, and pack body parts together. Nervous tissues are responsible for the reception of stimuli and conduction of impulses in the body.</p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img" alt="Figure 6-2. Animal tissues have different types.">
            <div class="caption">Figure 6-2. Animal tissues have different types.</div>
        </div>
        <p>Plants are also composed of various tissues. Similar to animals, these tissues have their own unique structure and function. Meristematic or embryonic tissues are made up of young, actively dividing cells. These cells are typically small, six-sided, and boxlike in structure. However, as they mature, they transform into many different shapes and sizes according to their functions. They are usually found at the tips of roots and stems or shoots. Nonmeristematic or permanent tissues are composed of mature (nondividing) and differentiated cells. There are two types of nonmeristematic tissues: simple and complex.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Organ</div>
        </div>
        <p>Various tissues that belong to the same organism and perform a particular function build an organ. The unique form and function of tissues and other distinguishing features contribute to the structure and function of the organ that they build. Heart, lungs, brain, kidneys, and many more are animal organs. The function of each one is entirely different from the others. Table 6-1 lists some of the animal organs and their respective functions.</p>
        <div class="illustration">
            <img src="assets/img" alt="Table 6-1. Some Animal Organs and Their Functions">
            <div class="caption">Table 6-1. Some Animal Organs and Their Functions</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>Just like animals, plants are also composed of several organs, which include the roots, stems, leaves, and flowers (figure 6-3). Table 6-2 shows some plant organs and their functions.</p>
        <div class="illustration">
            <img src="assets/img" alt="Figure 6-3. Some organs of a flowering plant and of the human body">
            <div class="caption">Figure 6-3. Some organs of a flowering plant and of the human body</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img" alt="Table 6-2. Some Plant Organs and Their Functions">
            <div class="caption">Table 6-2. Some Plant Organs and Their Functions</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Organ System</div>
        </div>
        <p>Multicellular organisms have organs that work together to perform a particular task. These organs form an organ system. In humans and other animals, there is the circulatory system made up of the heart, blood, and vessels; the respiratory system which is composed of the lungs and the respiratory tubes; and the nervous system which is primarily made up of the brain and the spinal cord. Table 6-3 shows the representative organ systems of animals, including their major organs and tissues, and their functions.</p>
        <div class="illustration">
            <img src="assets/img" alt="Table 6-3. Components amd Functions of Animal Organ Systems">
            <div class="caption">Table 6-3. Components amd Functions of Animal Organ Systems</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Organism</div>
        </div>
        <p>An organism is a life-form composed of related parts that maintain different essential processes. Fungi, plants, animals, and humans are examples of organisms. Figure 6-4 shows an example of a biological organization from an organism to the biosphere.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Population</div>
        </div>
        <p>A population is a group of organisms that belong to the same species living in a given geographical area. Organisms within a population can breed with one another. Specific kinds of plants, animals, fungi, protists, and bacteria found in a specific place are separately referred to as a population.</p>
        <div class="illustration">
            <img src="assets/img" alt="Figure 6-4. The biological levels of organization from organism to biosphere">
            <div class="caption">Figure 6-4. The biological levels of organization from organism to biosphere</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Community</div>
        </div>
        <p>When populations of different organisms live in the same place at the same time and interact with one another and with their environment in a certain geographical area, it is called a community. A place made up of different types of trees and other plants and animals can be a forest community. Fishes, algae, and corals are found in a coral community in marine waters.</p>
    </div>
    `,
            `
    <div>
        <p>SCIENCE CAREER</p>
        <p>Wildlife Biologist</p>
        <p>Wildlife biologists study animals in the wild and in captivity, including how they interact with their environment. A wildlife biologist is one who is willing to go out in the field and patiently study animals in their natural habitats. Their studies are focused on a variety of animals that inhabit the ocean or the forests.</p>
        <p>How can one become a wildlife biologist? First, you must earn a four-year college degree in one of the following disciplines: biology, zoology, or ecology. To advance your position, you can enroll in a master's degree in the fields mentioned, or earn a professional certification from the Biodiversity Conservation Society of the Philippines (BCSP), Haribon Foundation, and Marine Wildlife Watch of the Philippines, among others.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Ecosystem</div>
        </div>
        <p>The ecosystem is considered the smallest functional unit of ecology. It consists of all the living organisms called the biotic component and the nonliving factors called the abiotic component in the environment. The abiotic components include water, air, soil, and light, among others.</p>
        <p>Most of the time, the environmental condition determines whether an organism would thrive or not in a certain habitat. Organisms need to be in harmony with their environment in order to maintain their normal body processes.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">The effects of the nonliving factors on organisms are discussed as follows:</div>
        </div>
        <p>Sunlight - The sun is the main source of energy for most ecosystems. Sunlight is indispensable to plants and other organisms that perform photosynthesis. They need sunlight to manufacture food, which they use to fuel processes that keep them alive. For instance, in an aquatic environment, most photosynthetic organisms, such as phytoplankton, thrive near the water surface because sunlight penetration decreases with depth. Sunlight is also important to animals and other microorganisms. It activates the production of vitamin D in human skin. Also, the ultraviolet rays from sunlight may inhibit the growth of bacteria.</p>
    </div>
    `,
            `
    <div>
        <p>Soil - Soil serves as home to many animals and microorganisms, and is the growth medium for plants. How well plants grow on soil depends on how fertile the soil is and its composition. The nutrient content of the soil varies from place to place. Soil fertility depends on the amount of decayed plants and animals and other substances present in the soil. Some plants grow favorably in acidic soil, while others prefer alkaline soil. Plant growth and distribution are dependent on the type of soil, which is why plant species vary around the world.</p>
        <p>Temperature - Temperature influences the distribution of life-forms on Earth since it affects their biological processes. For example, cells may burst if the water they contain freezes. Some organisms in desert ecosystems are nocturnal, and only come out at night when the temperature is lower, to feed or look for a mate. However, during daytime, when it is extremely hot, they hide from the scorching heat of the sun and sleep until the sun sets.</p>
    </div>
    `,
            `
    <div>
        <p>Humidity - Humidity, the amount of water vapor in air, varies from place to place. When the humidity is too high, plants cannot make water evaporate through transpiration. Consequently, their ability to obtain nutrients from the soil is reduced, which may lead to nutrient deficiency. Similarly, high humidity may increase animal heat stress because of decreased evaporation.</p>
        <p>Weather - Organisms need to adapt to changing weather elements such as storm, wind, and air current. Plants that live in regions that are frequently hit by typhoons and strong winds need to develop strong root systems that will enable them to survive. Similarly, organisms that live in areas that experience frequent floods or strong storms need to adapt to such conditions.</p>
    </div>
    `,
            `
    <div>
        <p>Water - Water is an important biological medium because of its temperature-regulating property and its role as the universal solvent, among others. The quality of water can profoundly affect the organisms that are dependent on it. The salinity, pH, and oxygen content of water can greatly affect the distribution of organisms. For instance, the availability and quality of water force organisms to develop different types of adaptation along the intertidal zone (seashore or foreshore) where the condition is either wet or dry. They must also develop ways to cling to rocks or substrates in order not to be washed away by waves. The availability of water also affects the distribution of plants. Plants thrive in areas where there is an adequate supply of water. In deserts, plants such as cacti, agave, and aloe have developed several adaptations, such as deep roots, leaves that reduce the loss of water, and stems that are able to store water.</p>
    </div>
    `,
            `
    <div>
        <p>Access to water also directly affects living organisms. When marine plants and algae are washed ashore, they become extremely dehydrated. This may also impair photosynthesis and cellular respiration. Prolonged dehydration could lead to wilting, and eventually the death of algae and other photosynthetic organisms. In animal cells, dehydration can result in shrinkage and loss of their physiological functions, which could lead to death.</p>
    </div>
    `,
            `
    <div>
        <p>SCIENCE HISTORY</p>
        <p>The Guimaras Oil Spill</p>
        <p>The Guimaras oil spill in 2006 is dubbed as the worst massive oil spill in Philippine history. The oil tanker M/T Solar 1, chartered by Petron, carrying more than two million liters of bunker fuel, sank on August 11, 2006, at the Guimaras Strait off the Coast of Guimaras and Negros Occidental provinces. The oil spill adversely affected marine sanctuaries and mangrove reserves in three out of five municipalities in the Guimaras Island, and even reached the shores of Iloilo and Negros. According to officials, around 1000 hectares of mangrove forests were affected, including part of the Taklong island city sanctuary, a feeding and breeding ground for fish and other species.</p>
        <p>It was only after 13 years that Guimaras can once again boast of its beautiful white, sandy beaches, and fisherfolks have returned to harvest the abundance of their marine resources.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST 6-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Can you consider a decaying log as an ecosystem? Explain.</p>
        <p><strong>2.</strong> Enumerate the levels of biological organization from cell to biosphere and describe the characteristics of each level.</p>
        <p><strong>3.</strong> What is the importance of learning about the biological levels of organization?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-6-1" unelevated class="start-btn">
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
        <div class="info-card">
  <div class="info-title">MINI LAB 6-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p>Choose an ecosystem in your school or community (school garden, park, or barangay). Use this as a model to create a labeled diagram that shows the biological levels of organization from cell to ecosystem. What do you think would happen if one of either the biotic or abiotic factors is removed from an ecosystem?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-6-1" unelevated class="start-btn">
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
            <div class="title">Biome</div>
        </div>
        <p>A biome is characterized by its distinct flora and fauna, which are adapted to their particular environment. Abiotic factors like the amount of light, temperature, rainfall, and soil type determine the type of niche for specific species of animals that will inhabit the biome. Examples of biomes include desert, rain forest, savanna, tundra, and taiga.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Biosphere</div>
        </div>
        <p>The biosphere is considered the highest level of ecological hierarchy, since it includes the zones of land, air, and water where organisms live. Sometimes, it is referred to as the totality of all the ecosystems found on Earth.</p>
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
