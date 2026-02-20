<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Earthquakes along Faults</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
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
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Capacitor } from "@capacitor/core"
import { TextToSpeech } from "@capacitor-community/text-to-speech"
import confetti from "canvas-confetti"
import { getCurrentUser, setCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"
import { LocalStorage } from "quasar"
import '@google/model-viewer';
import { watch } from "vue"
import { audioManager } from "src/utils/audioManager"

export default {
    name: "ScientificModelsLesson",
    setup() {
        // router and state
        const route = useRoute()
        const router = useRouter()
        const currentPage = ref(0)
        const progress = ref(0)
        const showLessonComplete = ref(false)

        // audio
        const isPlaying = ref(false)
        const textToRead = ref("")

        // user and lesson
        const currentUser = ref(getCurrentUser())
        let confettiInterval = null
        const lesson = flatLessons.find(l => l.route === route.path)
        const lessonId = lesson ? String(lesson.id) : "63"

        // bookmarks
        const bookmarkedPages = ref([])
        const pages = ref([
            `
    <div>
<div class="header">
          <div class="banner">
        <img src="assets/img/chapter 9/particle_motion.png" alt="Particle motion">
        <p style="display: none;">Energy and Temperature</p>
      </div>
          <div class="title">How does the motion of the particles of a body determine its energy and temperature?</div>
        </div>
      
      <p>
          The particles that make up matter are always in motion (Figure 9-1). Heating a substance results in faster particle movement, which affects its internal energy and temperature. The total energy of the particles in a body is called <strong>internal energy</strong>. Internal energy includes the energy associated with motion and interactions between particles. Adding heat to a substance increases its internal energy since energy is transferred to its particles.
      </p>
    </div>
    `,
            `
    <div>
        <p>
            Temperature is a measure of the <strong>average energy of motion</strong> of particles. The faster the movement of the particles, the greater the average energy of motion and the higher the temperature. Comparing the same amount of substances being heated, the faster the movement of the particles, the greater the temperature (Figure 9-2).
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_1.png" alt="Particles in motion">
        </div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_2.png" alt="Two containers with different temperatures">
                <div class="caption">Figure 9-1. Particles of matter (shown here as spheres) are in constant random motion</div>
                <div class="caption">Figure 9-2. The substances in both containers have the same mass. However, the temperature of container A is higher than that of container B. Thus, the particles in substance A move faster compared to the particles in substance B.</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            To differentiate internal energy from temperature, consider a cup of boiling tea and a kettle of boiling tea (Figure 9-3). The two samples of tea have the same temperature (100°C) but have different internal energies. The larger the amount of matter, the larger the energy needed to reach a certain temperature. Therefore, the kettle of boiling tea has a higher internal energy than a cup of boiling tea.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_3.png" alt="Cup vs kettle of boiling tea">
                <div class="caption">Figure 9-3. Which has more internal energy: a cup of boiling tea or a kettle of boiling tea?</div>
        </div>
        <p>
            In Figure 9-2, although both substances have the same mass, substance A has a higher internal energy than substance B because the particles of substance A have a higher temperature. Since internal energy is total energy, higher temperature means higher internal energy, if the mass is the same.
        </p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST 9-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> If two objects have the same mass and temperature, how would you compare their internal energies?</p>
        <p><strong>2.</strong> What happens to the temperature and internal energy of a substance as you heat it?</p>
        <p><strong>3.</strong> Which has a greater internal energy: a cup of water at 30°C or a kettle of water at the same temperature?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-9-1" unelevated class="start-btn">Answer</q-btn>
      </div>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="banner">
        <img src="assets/img/chapter 9/heat_transfer.png" alt="Heat transfer">
        <p style="display: none;">Basic Concepts of Heat</p>
      </div>
          <div class="title">How is heat related to temperature?</div>
        </div>
      
      <p>
          Heat is the transfer of internal energy from a warmer object to a cooler one due to the difference in their temperatures. You feel it when you touch something hot or cold, and that is because of the transfer of internal energy between your body and the object. Similarly, when you take ice cream out of the freezer, it slowly turns into a liquid because the internal energy from the warmer surroundings causes it to melt. The air around it is warmer, so the internal energy transfers into the colder ice cream. You can witness this energy transfer in action in Mini Lab 9-1.
      </p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI LAB 9-1</div>
  <div class="info-content">
    <div class="info-text">
      <p><strong>Materials:</strong> ice cubes, freezer, and timer</p>
      <p><strong>Procedure:</strong></p>
      <ol>
        <li>Hold an ice cube in your palm for 30 seconds. Observe what happens to the ice cube.</li>
        <li>Stack two ice cubes on top of each other inside the freezer for 30 seconds. Observe what happens to the top ice cube.</li>
      </ol>
      <p><strong>Guide Questions:</strong></p>
      <ol>
        <li>How will you compare the temperature of the ice cube and that of your palm? How about the two ice cubes in step 2?</li>
        <li>Compare what happens to the ice cube in step 1 and the top ice cube in step 2. What do you think accounts for the similarities or differences in your observations?</li>
      </ol>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
        <p>
            In Mini Lab 9-1, your palm and the ice cube initially have different temperatures. Your palm has a higher temperature than the ice. When the two come in contact with each other, some of the energy from your palm is transferred to the ice and partially melts it. The energy in transit from one body to another is called <strong>heat</strong>. Heat transfer between bodies occurs solely because of the temperature difference between them.
        </p>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_4.png" alt="Heat transfer from hand to ice">
                <div class="caption">Figure 9-4. Heat is transferred from the palm to the ice due to temperature difference</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            It is important to note that matter does not contain heat, only internal energy. When there is a temperature difference between two bodies, this internal energy is transferred in the form of heat. When a body absorbs or releases heat, the internal energy of the body changes. However, the change in internal energy does not necessarily cause a change in temperature. For example, when ice melts, it absorbs heat without any change in its temperature.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            In Figure 9-5, as heat flows from block A (hot body) to block B (cold body), the temperature of block A decreases, while the temperature of block B increases. When the two bodies reach the same temperature, heat transfer stops. This means the bodies have reached their <strong>thermal equilibrium</strong>, a condition in which there is no flow of internal energy.
        </p>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_5.png" alt="Heat transfer mechanism">
                <div class="caption">Figure 9-5. The mechanism of heat transfer: (A) heat flows from a body of higher temperature to a body of lower temperature until they reach (B) thermal equilibrium.</div>
        </div>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST 9-2</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> What is the difference between internal energy and heat?</p>
        <p><strong>2.</strong> Under what conditions will heat transfer take place?</p>
        <p><strong>3.</strong> Consider objects A and B on the right. The objects are made of the same material and achieved thermal equilibrium after coming into contact with each other. (a) Are their temperatures the same? (b) What about their internal energies?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-9-2" unelevated class="start-btn">Answer</q-btn>
      </div>
    </div>
  </div>
</div>
    </div>
    `
        ])
        // lesson saving
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

        // finish button style
        const finishButtonStyle = {
            background: "#fe3223",
            color: "#fff",
            boxShadow: "7px 7px 0px 0px rgba(0, 0, 0, 0.16)"
        }

        // text to speech
        const speakText = async (text) => {
            if (!text) return
            if (Capacitor.getPlatform() !== "web") {
                await TextToSpeech.speak({ text, lang: "en-US", rate: 1.0, pitch: 1.0 })
            } else {
                const synth = window.speechSynthesis
                synth.cancel()
                const utter = new SpeechSynthesisUtterance(text)
                utter.lang = "en-US"
                utter.rate = 1.0
                utter.pitch = 1.0
                utter.onend = () => { isPlaying.value = false }
                synth.speak(utter)
            }
        }

        const stopSpeaking = async () => {
            if (Capacitor.getPlatform() !== "web") await TextToSpeech.stop()
            else window.speechSynthesis.cancel()
            isPlaying.value = false
        }

        //Modified to duck background
        const toggleAudio = async () => {
            if (isPlaying.value) {
                await stopSpeaking()
                audioManager.restoreBg()  // restore when stopped early
                return
            }

            isPlaying.value = true
            const tempDiv = document.createElement("div")
            tempDiv.innerHTML = pages[currentPage.value]
            textToRead.value = tempDiv.innerText.trim()

            // duck background
            audioManager.duckBg()

            // play narration
            // play narration
            await speakText(textToRead.value)
            // restore happens automatically in speakText() when utter.onend fires


            if (Capacitor.getPlatform() !== "web") isPlaying.value = false
        }

        // bookmark functions
        const saveBookmarks = (bookmarksArr) => {
            const user = getCurrentUser()
            if (!user) return
            const key = user.studentId ?? user.id ?? user.name
            let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{ }")
            if (!allBookmarks[key]) allBookmarks[key] = []
            allBookmarks[key] = bookmarksArr
            localStorage.setItem("bookmarks", JSON.stringify(allBookmarks))
        }

        const loadBookmarks = () => {
            const user = getCurrentUser()
            if (!user) return []
            const key = user.studentId ?? user.id ?? user.name
            let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{ }")
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

        // progress and navigation
        const updateProgress = () => {
            progress.value = (currentPage.value + 1) / pages.value.length
        }

        const nextPage = async () => {
            await stopSpeaking()
            if (currentPage.value < pages.value.length - 1) {
                currentPage.value++
                updateProgress()
            } else {
                markLessonComplete()
                showLessonComplete.value = true
            }
        }

        const prevPage = async () => {
            if (currentPage.value > 0) {
                await stopSpeaking()
                currentPage.value--
                updateProgress()
            }
        }

        const goBack = () => {
            if (window.history.length > 1) router.back()
            else router.push("/chapters")
        }

        // update URL when page changes
        watch(currentPage, (newPage) => {
            router.replace({
                path: route.path,
                query: { page: newPage }
            })
        })

        // confetti
        const startConfetti = () => {
            stopConfetti();

            // play sound
            const audio = document.getElementById("lesson-complete-audio");
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => { });
            }

            // confetti animation
            confettiInterval = setInterval(() => {
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 500);
        };

        const stopConfetti = () => {
            if (confettiInterval) { clearInterval(confettiInterval); confettiInterval = null }
        }

        // lifecycle
        onMounted(() => {
            // one-time full reload to fix layout rendering issue
            if (!route.query._reloaded) {
                router.replace({
                    path: route.path,
                    query: { ...route.query, _reloaded: '1' }
                }).then(() => {
                    window.location.reload()
                })
                return // stop further execution until reload
            }

            // normal logic runs after reload
            currentUser.value = getCurrentUser()
            bookmarkedPages.value = loadBookmarks()
            updateProgress()

            const pageFromQuery = parseInt(route.query.page, 10)
            if (!isNaN(pageFromQuery) && pageFromQuery < pages.value.length) {
                currentPage.value = pageFromQuery
            }
        })


        onUnmounted(() => { stopSpeaking() })

        onUnmounted(() => {
            speechSynthesis.cancel()
            audioManager.restoreBg()
        })

        onMounted(() => {
            // Wait for DOM mount to safely append stars
            const starContainer = document.querySelector('.stars')
            if (!starContainer) return

            const starCount = 100
            for (let i = 0; i < starCount; i++) {
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
        })

        //For linking buttons
        onMounted(() => {
            document.querySelector('#viewer').addEventListener('click', (e) => {
                const target = e.target.closest('[data-route]')
                if (target) router.push(target.dataset.route)
            })
        })


        // return
        return {
            currentPage,
            isPlaying,
            pages,
            showLessonComplete,
            bookmarkedPages,
            progress,
            isBookmarked,
            finishButtonStyle,
            toggleAudio,
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

<!-- Scoped Styles -->
<style src="src/css/lesson.css" scoped></style>
