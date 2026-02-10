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
        const lessonId = lesson ? String(lesson.id) : "64"

        // bookmarks
        const bookmarkedPages = ref([])
        const pages = ref([
            `
    <div>
<div class="header">
          <div class="banner">
        <img src="assets/img/chapter 9/heat_transfer_modes.png" alt="Heat transfer modes">
        <p style="display: none;">Modes of Heat Transfer</p>
      </div>
          <div class="title">How is heat transferred through conduction, convection, and radiation?</div>
        </div>
      
      <p>
          Energy can be transferred in three different ways: conduction, convection, and radiation. Imagine the sun warming Earth. During the day, sunlight warms the ground and water. These methods of heat transfer illustrate how the sun warms Earth. Because air is a poor conductor of heat, most conduction occurs at Earth's surface. Convection, on the other hand, is observable in the water cycle.
      </p>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="title">Conduction</div>
        </div>
      
      <p>
          Have you ever touched a hot cooking pot or pan with your bare hands? Have you ever wondered why most cookware have handles made of or covered with wood or rubber?
      </p>
      <p>
          Consider the saucepan with a metal handle in Figure 9-6. When it has just been placed over the flame of the gas burner, you can still hold the handle. But as the pan gets hot, so does the handle. How does heat transfer from the flame to the handle? As the bottom of the pan is heated by the flame, the particles of the pan absorb heat and move faster. Due to the heat they absorb and their faster motion, the hotter particles are forced to collide with their cooler neighboring particles. During collision, energy is transferred from the hotter particles to the cooler particles.
      </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_6.png" alt="Cooking heat transfer">
                <div class="caption">Figure 9-6. Cooking involves the three modes of heat transfer: conduction, convection, and radiation.</div>
        </div>
        <p>
            This explains how heat reaches the handle of the pan. This type of heat transfer that occurs through direct contact is called conduction (Figure 9-7). Conduction happens when you touch a hot object. Does conduction also happen when you touch a cold object?
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_7.png" alt="Conduction process">
                <div class="caption">Figure 9-7. The heat from the torch causes energy to be transferred to the particles of the material that are near the torch. Heat is conducted along the material through the transfer of this acquired energy from particle to particle via collisions between them.</div>
        </div>
        <p>
            Some materials, such as metals, conduct heat better than others. Materials that allow heat to transfer easily are called thermal conductors. Metals and alloys such as iron, aluminum, and copper are thermal conductors. Some materials, such as wood and rubber, prevent heat from transferring easily through their particles. Materials that are considered poor conductors of heat are called thermal insulators. They are used in the handles of cookware and cooking utensils. Based on these concepts, why do you think the bottoms of pots and pans are often made of copper?
        </p>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="title">Convection</div>
        </div>
      
      <p>
          Another way by which heat can be transferred is through the movement of fluids (liquids and gases), which is known as convection. Just like the particles of solids, the particles of fluids move faster when they absorb energy. But compared to particles of solids, particles of fluids move more freely, resulting in the expansion and the decrease in density of the fluid. In contrast, when there is loss of energy in the fluid, its particles move more slowly. The fluid contracts, and its density increases.
      </p>
      <p>
          What happens when a pot of water is heated? The heat travels through the bottom of the pot by conduction. The water at the bottom of the pot is also heated by conduction. The heated water expands, becomes less dense, and then rises as the cooler, denser water at the top sinks. As the hot water rises, it distributes its energy to the surrounding cooler water via conduction, thereby becoming less hot (cooler). Thus, it becomes denser, sinks, and forces warmer water to rise again. This movement creates a convection current (Figure 9-8). Heat is transferred by this current from the warmer to the cooler part of the water.
      </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_8.png" alt="Convection current">
                <div class="caption">Figure 9-8. Convection current in water</div>
        </div>
        <div class="info-card">
  <div class="info-title">MINI LAB 9-2</div>
  <div class="info-content">
    <div class="info-text">
      <p><strong>Materials:</strong> two identical ice cubes, timer, and metal and wooden surfaces</p>
      <p><strong>Procedure:</strong></p>
      <ol>
        <li>Place the ice cubes on the metal and wooden surfaces.</li>
        <li>Use a timer to determine the melting time of each ice cube.</li>
      </ol>
      <p><strong>Guide Questions:</strong></p>
      <ol>
        <li>How will you compare the melting rate of ice from the two setups?</li>
        <li>Given the same room temperature, what is the main factor that affects the melting rate of ice?</li>
      </ol>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
        <p>
            Air also transfers heat through convection. In the kitchen, you can feel the warmth coming from the stove even if you are not in direct contact with it because of the cycle of rising and sinking air across the room. In the same way, the air near the Earth's equator, which is constantly warmed by the sun, goes through a cycle of rising and sinking toward the poles and back to the equator, transferring heat along the way.
        </p>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="title">Radiation</div>
        </div>
      
      <p>
          In the previous sections, you learned that for conduction and convection to take place, matter must be present. In conduction, there must be two bodies that are in direct contact with each other; in convection, fluid must be present. But what if there is no matter present? Can heat be still transferred?
      </p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI LAB 9-3</div>
  <div class="info-content">
    <div class="info-text">
      <p><strong>Materials:</strong> three identical clear jars, construction papers (black, white, and green), and three identical ice cubes</p>
      <p><strong>Procedure:</strong></p>
      <ol>
        <li>Cover the identical clear jars with black, white and green construction papers.</li>
        <li>Put one ice cube in each jar. Then, cover the jar with its lid.</li>
        <li>Position the jars side-by-side to ensure they will get the same amount of sunlight.</li>
        <li>After five minutes, check the ice inside each jar and record your observations.</li>
        <li>After 10 minutes, compare the remaining amount of ice in the jars.</li>
      </ol>
      <p><strong>Guide Questions:</strong></p>
      <ol>
        <li>How will you compare the melting rate of the ice cubes from the three setups?</li>
        <li>Given that each container received the same amount of sunlight, what is the main factor that affects the melting rate of ice?</li>
      </ol>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
        <p>
            Heat transfer through empty space is possible via electromagnetic waves. The transfer of heat via electromagnetic waves is called radiation. The energy being transferred is sometimes called radiant energy. Electromagnetic waves can travel through space or a material medium. Hence, radiation can happen with or without matter. The sun's energy reaches Earth through radiation.
        </p>
        <p>
            In Figure 9-6, radiation happens via visible light and infrared radiation, which are both types of electromagnetic wave. You can see visible light, which is the light from the flame, while infrared radiation is invisible. You can feel the heat when you place your hand near the flame.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_9.png" alt="Sun radiation">
                <div class="caption">Figure 9-9. The energy of the sun reaches Earth through radiation.</div>
        </div>
        <p>
            Different colored objects behave differently when they absorb radiant energy. Dark-colored objects absorb more radiant energy than light-colored ones. (You will learn the reason behind this in your higher physics courses.) Based on this, why do you think it is advisable to wear light-colored clothes during summer (Figure 9-10)?
        </p>
        <p>
            Wearing light-colored clothes in summer is advisable because they reflect more sunlight and absorb less heat compared to dark-colored clothes. Light colors do not absorb as much energy, keeping both the clothes and the wearer cooler. They also help reduce the risk of sunburn by reflecting more sunlight away from the skin.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_10.png" alt="Summer clothing">
                <div class="caption">Figure 9-10. Many people prefer to wear light-colored shirts rather than dark-colored ones in summer. Why?</div>
        </div>
        <div class="info-card">
  <div class="info-title">MINI TEST 9-3</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p>Identify the mode of heat transfer involved in each of the following situations.</p>
        <p><strong>1.</strong> ____ The sun provides warmth to a person standing under its light.</p>
        <p><strong>2.</strong> ____ This method of heat transfer distributes warm air from sunlight throughout the entire house.</p>
        <p><strong>3.</strong> ____ When roasting marshmallows, it is better to use a tree twig than a metal rod, as the rod can get very hot and difficult to hold.</p>
        <p><strong>4.</strong> ____ To prevent ice from melting, use a cooler.</p>
        <p><strong>5.</strong> ____ Earth also emits heat into space.</p>
        <p><strong>6.</strong> ____ This mode of heat transfer brings warmth from the Earth's interior to its surface as it moves through the crust onto the land region, leading to the occurrence of earthquakes and the formation of volcanoes.</p>
        <p><strong>7.</strong> ____ An electric fan makes the air move faster in a room, which can enhance the transfer of warmth from your body into the air.</p>
        <p><strong>8.</strong> ____ The global movement of the ocean helps distribute heat throughout Earth.</p>
        <p><strong>9.</strong> ____ When you step on a tile, heat can transfer more easily from your feet onto the tile.</p>
        <p><strong>10.</strong> ____ Glider pilots utilize 'thermals', upward currents of warm air, to ascend to higher altitudes.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-9-3" unelevated class="start-btn">Answer</q-btn>
      </div>
    </div>
  </div>
</div>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="title">SCIENCE CAREER</div>
        </div>
      
      <p>
          Architects plan, design, and oversee the construction of a house or building. They may incorporate elements to save energy such as passive cooling in planning and designing of a structure.
      </p>
    </div>
    `,
            `
    <div>
<div class="header">
          <div class="title">SCIENCE PIONEER</div>
        </div>
      
      <p>
          Felix Maramba, a Filipino scientist, developed one of the world's most profitable biogas systems. His idea of generating power with methane from manure in a piggery was conceptualized in 1984. He designed the Maya Farms Model, which required a processing plant and feed mill that will operate independently from Meralco. This technology was able to harness energy from waste material.
      </p>
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
            boxShadow: "0 8px 0 0 #db0e00"
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
