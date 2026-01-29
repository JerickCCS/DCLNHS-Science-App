<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Earthquakes along Faults</q-toolbar-title>
                <div class="row items-center q-gutter-sm">
                    <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>
                    <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="primary"
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

                        <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div>

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
        const lessonId = lesson ? String(lesson.id) : "70"

        // bookmarks
        const bookmarkedPages = ref([])
        const pages = [
            `
    <div>
      <!-- Card 1 -->
      <div class="illustration">
      <img src="assets/img/chapter 10/stem challenge.png" alt="Placeholder">
    </div>
      <div class="header">
        <div class="title">STEM CHALLENGE</div>
        <div class="subtitle">Solar Cooker</div>
      </div>
      <p>The energy from the sun has many potential uses. One of these is solar cooking, which uses the energy from sunlight to cook and heat food. Solar cooking is used in some parts of the world where access to electricity is limited or nonexistent.</p>
      <p>People use a solar cooker when they go camping or swimming at the beach because it is portable, fuel-free, and requires minimum supervision. Food cooked in a solar cooker is also considered healthier and tastier since most of the natural nutrients are preserved as it operates at a lower temperature than that of gas or electric stoves.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>Solar cooking may have a lot of advantages, but it also comes with limitations. For one, because a solar cooker operates at a lower temperature, food takes longer to cook. The type and amount of food, as well as the weather, also affects cooking time.</p>
      <p>How can you apply your knowledge of the three modes of heat transfer to address this limitation of solar cooking? Design and construct a solar cooker that incorporates all of the three modes and determine whether doing so can improve cooking time when using a solar cooker.</p>
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
            background: "linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 0%, rgba(252, 176, 69, 1) 79%)",
            color: "#fff",
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
