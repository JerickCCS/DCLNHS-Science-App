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
        const lessonId = lesson ? String(lesson.id) : "65"

        // bookmarks
        const bookmarkedPages = ref([])
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="banner">
                <img src="assets/img/chapter 9/attic_roof.png" alt="Attic and roof space">
                <p style="display: none;">Saving Energy Efficiently</p>
            </div>
            <div class="title">How can we save energy efficiently in our homes?</div>
        </div>
        <p>
            An attic is a space located just beneath the roof of a house, often with limited headroom. Is having an attic a good idea in tropical countries? Its primary purpose is to create a buffer zone between the living spaces of the house and the external environment. While an attic can provide additional storage, ventilation, and insulation, it can become excessively hot in some tropical countries, especially without proper insulation, ventilation, and shading.
        </p>
        <p>
            Some houses are built with well-ventilated roof spaces instead of attics. These spaces contribute to passive cooling by providing a buffer zone between internal and external spaces, particularly in the most difficult area to shade: the roof.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_10.png" alt="A house with an attic and structure of roof space ventilation">
            <div class="caption">Figure 9-10. (a) A house with an attic and (b) structure of roof space ventilation</div>
        </div>
        <p>
            Passive cooling is crucial for maintaining or reducing the temperature inside a house without relying on active mechanical systems like air conditioning. This approach focuses on managing heat gain and naturally promoting cooling as a design strategy to minimize high energy consumption.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Properly orienting and designing the layout of the house can minimize direct exposure to intense sunlight. Windows and vents can allow for more natural ventilation, taking advantage of prevailing winds to encourage natural airflow and dissipate heat. Materials such as stone, concrete, and adobe can absorb and store heat during the day, releasing it slowly at night at lower temperatures.
        </p>
        <p>
            Shading devices, such as overhangs, and strategically placed vegetation can block direct sunlight and reduce solar heat gain. Using insulation and light-colored, highly reflective roofing materials can prevent excess heat from entering the house. High thermal performance windows with low-emissivity coatings and multiple panes can also reduce the amount of heat that enters the house.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Incorporating natural cooling elements like ponds, fountains, and vegetation can create cooler microclimates than the surrounding area. When a house is designed to be energy-efficient, it consumes less energy, significantly contributing to less greenhouse gas emissions and decreasing the effect of global warming.
        </p>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_11.png" alt="Passive cooling techniques">
            <div class="caption">Figure 9-11. Passive cooling techniques: (a) natural cooling system and (b) highly reflective roofing</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            Saving energy means lower energy bills, improved air quality, conservation of energy resources, and reduced pollution. In other words, saving energy means making an effort to create a better environment, ecosystem, and biodiversity.
        </p>
        <p>
            When all individuals take part in saving energy, it can lead to a more sustainable, resilient, and environmentally responsible global energy landscape that contributes to a brighter future for both current and future generations.
        </p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
            <div class="info-title">MINI TEST 9–4</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p>Choose three out of seven passive cooling techniques and discuss the underlying heat transfer principles involved in each one. Write an essay to explain how these techniques can help reduce energy consumption.</p>
                    </div>
                    <div class="start-btn-container">
                        <q-btn data-route="/mini-test-9-4" unelevated class="start-btn">Answer</q-btn>
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
                <img src="assets/img/chapter 9/heat_to_electricity.png" alt="Technologies transforming heat into electrical energy">
                <p style="display: none;">Technologies in Transforming Heat into Electrical Energy</p>
            </div>
            <div class="title">Technologies in Transforming Heat into Electrical Energy</div>
        </div>
        <p>
            An increased emphasis on energy efficiency encourages research and development of new technologies and solutions, driving innovation in the energy sector. The following are some innovative devices that can be used to transform heat into electrical energy.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            <strong>1. Thermomagnetic Generators</strong><br>
            Thermomagnetic generators convert waste heat into electricity. Researchers from Karlsruhe Institute of Technology (KIT) and Tohoku University in Japan have improved these generators to harness waste heat from various processes, which is typically released into the environment unused. Utilizing higher temperatures makes the process of harnessing heat for heating or power generation easier and more cost-effective.
        </p>
        <p>
            The collaboration between KIT and Tohoku University significantly improved the efficiency of thermomagnetic generators, making them comparable to conventional thermoelectric generators even with small temperature differences. These generators rely on special alloys that undergo significant changes in magnetic properties with temperature fluctuations, resulting in electricity generation.
        </p>
    </div>
    `,
            `
    <div>
        <p>
            Optimizing the alloy's film thickness resulted in a 3.4-fold increase in electrical power generation. This advancement opens the door to the development of custom-made thermomagnetic generators that efficiently utilize waste heat, particularly at near-room temperatures.
        </p>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_12.png" alt="Thermomagnetic generators based on magnetic thin films">
            <div class="caption">Figure 9-12. Thermomagnetic generators based on magnetic thin films</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>
            <strong>2. Thermal Photovoltaic Cells</strong><br>
            Antora Energy has created special cells much better than regular solar cells, producing 100 times more power in similarly sized devices. These cells efficiently convert high-temperature heat into electricity, primarily for thermal energy grid storage (TEGS) applications.
        </p>
        <p>
            At the heart of this innovation is a unique technology called <strong>thermophotovoltaics (TPV)</strong>, which utilizes heat to generate power. Antora Energy has significantly enhanced its efficiency, now boasting a performance of over 40%, meaning they can produce substantial amounts of power in a highly efficient manner.
        </p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 9/figure_9_13.png" alt="A wafer awaiting inspection by a confocal microscope that is part of Antora's 2MW TPV factory">
            <div class="caption">Figure 9-13. A wafer awaiting inspection by a confocal microscope that is part of Antora's 2MW TPV factory</div>
        </div>

        <div class="info-card">
            <div class="info-title">SKILL-BOOSTER</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p>Conduct research using secondary resources (journals, reports, reviews, articles) to know other innovative devices that effectively convert heat into electrical energy.</p>
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
            /* Reload Fix */

            // normal logic runs after reload
            currentUser.value = getCurrentUser()
            bookmarkedPages.value = loadBookmarks()
            updateProgress()

            const pageFromQuery = parseInt(route.query.page, 10)
            if (!isNaN(pageFromQuery) && pageFromQuery < pages.value.length) {
                currentPage.value = pageFromQuery
            }
        })

        onUnmounted(() => {
            stopSpeaking()
            speechSynthesis.cancel()
            stopConfetti()
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
