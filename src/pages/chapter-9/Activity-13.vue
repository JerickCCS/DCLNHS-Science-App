<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Lesson 1: Earthquakes along Faults</div>
                <button class="bookmark-btn" @click="toggleBookmark">
                    <span class="material-icons"
                        :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">
                        {{ isBookmarked ? 'bookmark' : 'bookmark_border' }}
                    </span>
                </button>
            </div>
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
            <div class="lc-wrapper">
                <!-- Radial burst background blobs -->
                <div class="lc-blob lc-blob1"></div>
                <div class="lc-blob lc-blob2"></div>
                <div class="lc-blob lc-blob3"></div>

                <!-- Star GIF -->
                <div class="lc-star-wrap">
                    <img src="assets/icons/five-stars.gif" class="lc-star-img" />
                </div>

                <!-- Text -->
                <div class="lc-title">🎉 Congratulations!</div>
                <div class="lc-subtitle">You've completed this lesson.<br />Keep up the amazing work!</div>

                <!-- Divider dots -->
                <div class="lc-dots">
                    <span></span><span></span><span></span>
                </div>

                <!-- OK button -->
                <button class="lc-ok-btn" @click="stopConfetti(); showLessonComplete = false; $router.back()">
                    Awesome!
                </button>
            </div>
        </q-dialog>
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
        const lessonId = lesson ? String(lesson.id) : "68"

        // bookmarks
        const bookmarkedPages = ref([])
        const pages = [
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">ACTIVITY 13</div>
        <div class="subtitle">Particles in Motion</div>
      </div>
      <p>Some particles are too small to be seen by the naked eye. There are, however, observable pieces of evidence that prove their existence and demonstrate that they are in motion.</p>
      <p>The movement of the particles in a system is affected by temperature.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p><strong>OBJECTIVE</strong></p>
      <p>Investigate the effect of temperature on the movement of particles</p>
      <p><strong>MATERIALS</strong></p>
      <p>• two 250 mL beakers</p>
      <p>• 200 mL cold water</p>
      <p>• 200 mL hot water</p>
      <p>• ink</p>
      <p>• stopwatch</p>
      <p>• camera</p>
      <p>• dropper</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p><strong>PROCEDURE</strong></p>
      <p>1. Pour 200 mL cold water into a beaker and 200 mL hot water into another beaker.</p>
      <p>2. Put five drops of ink into the cold water. Observe what happens to the ink in 30 s. Take a photo and paste it in Data and Results.</p>
      <p>3. Put five drops of ink into the hot water. Observe what happens to the ink in 30 s. Take a photo and paste it in Data and Results.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p><strong>DATA AND RESULTS</strong></p>
      <div class="illustration">
        <img src="assets/images/setup_a_ink.jpg" alt="Setup A: Cold water with ink">
        <div class="caption">Setup A</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="illustration">
        <img src="assets/images/setup_b_ink.jpg" alt="Setup B: Hot water with ink">
        <div class="caption">Setup B</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <p><strong>ANALYSIS AND INTERPRETATION</strong></p>
      <p>1. What happened to the ink when it is poured in a beaker of cold water? in hot water? Why does this happen?</p>
      <p>2. What affected the motion of the ink in each beaker?</p>
      <p>3. What is the relationship between the motion of the particles and their temperature?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p><strong>GENERALIZATION</strong></p>
      <p>How does the motion of the particles of a body determine the body’s energy and temperature?</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p><strong>APPLICATION</strong></p>
      <p>1. When you open a bottle of perfume, why does its scent easily spread throughout the room? Explain your answer based on the concept of temperature.</p>
      <p>2. Cite other observable evidence that particles are in motion.</p>
      <p>3. How can the average kinetic energy of molecules be increased?</p>
    </div>
    `,
        ];
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
            progress.value = (currentPage.value + 1) / pages.length
        }

        const nextPage = async () => {
            await stopSpeaking()
            if (currentPage.value < pages.length - 1) {
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

            // fire once immediately and fix z-index
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                const canvas = document.querySelector('canvas[style*="position: fixed"]');
                if (canvas) canvas.style.zIndex = '99999';
            }, 50);

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
            if (!isNaN(pageFromQuery) && pageFromQuery < pages.length) {
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
