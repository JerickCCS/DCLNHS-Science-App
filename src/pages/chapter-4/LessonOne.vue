<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <div class="lesson-toolbar">
                <button class="toolbar-btn" @click="goBack">
                    <q-icon name="arrow_back" size="24px" />
                </button>
                <div class="lesson-toolbar-title">Lesson 1: The Microscope: Parts and Function</div>
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
      
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 4/compound light microscope.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The compound light microscope</div>
        </div>
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
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="model-viewer-block">
            <model-viewer src="models/microscope.glb" alt="microscope" camera-controls autoplay auto-rotate interaction-prompt="auto" loading="eager"></model-viewer>
            <a href="/html/microscope.html" class="eye-icon">
                      <img src="assets/icons/eye.png" alt="View 3D Model" />
                    </a>
            <div class="caption">Figure 4.1 The compound microscope(monocular)</div>
          </div>
          
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div style="overflow-x: auto;">
  <table border="1" style="width: 900px; min-width: 100%; border-collapse: collapse; table-layout: fixed; text-align: left; font-family: Arial, sans-serif; border: 2px solid #333;">
      <thead>
          <tr style="background: linear-gradient(to right, #f7971e, #ffd200); color: white;">
              <th style="padding: 12px; width: 200px;">Part</th>
              <th style="padding: 12px; width: 800px;">Description and Function(s)</th>
          </tr>
      </thead>
      <tbody>
          <tr style="background-color: #fff8e1;">
              <td colspan="2" style="padding: 10px; font-weight: bold; text-align: center;">Mechanical</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">
                  Draw tube
              </td>
              <td style="padding: 10px;">A small cylinder attached to the upper part of the body tube that holds the ocular lens.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">
                  Body tube
              </td>
              <td style="padding: 10px;">Connects the ocular lens to the revolving nosepiece.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Coarse adjustment knob</td>
              <td style="padding: 10px;">Moves the body tube or stage upward or downward in larger increments to bring the specimen into initial focus; used only with the scanner or low power objective.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Fine adjustment knob</td>
              <td style="padding: 10px;">Moves the body tube or stage upward or downward in smaller increments to bring the specimen into sharp focus; preferably used with the high power or oil immersion objective.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Arm</td>
              <td style="padding: 10px;">Supports the body tube and is used to carry the microscope.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Revolving nosepiece</td>
              <td style="padding: 10px;">A circular rotating part connected to the body tube that holds the objectives.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Stage</td>
              <td style="padding: 10px;">A platform where the specimen slide is placed; has a hole at the center for light to pass through.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Stage clips</td>
              <td style="padding: 10px;">Secure the specimen slide on the stage.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Inclination joint</td>
              <td style="padding: 10px;">Attaches the arm to the pillar and allows tilting of the microscope.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Pillar</td>
              <td style="padding: 10px;">Provides support above the base and where the arm is attached.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Base</td>
              <td style="padding: 10px;">Provides firm and steady support to the entire microscope.</td>
          </tr>
          <tr style="background-color: #ffe0b2;">
              <td colspan="2" style="padding: 10px; font-weight: bold; text-align: center;">Magnifying</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Ocular lens or eyepiece</td>
              <td style="padding: 10px;">A detachable cylinder on top of the draw tube used to view the specimen; usually magnifies up to 10x and may contain a pointer.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Objective lens</td>
              <td style="padding: 10px;">Magnifies the specimen. Typically includes scanner (if present), low power (LPO), high power (HPO), and oil immersion (OIO) objectives. Used in that order when focusing.</td>
          </tr>
          <tr style="background-color: #ffe0b2;">
              <td colspan="2" style="padding: 10px; font-weight: bold; text-align: center;">Illuminating</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Condenser</td>
              <td style="padding: 10px;">Concentrates light onto the specimen; located above the iris diaphragm and may have adjustment knobs.</td>
          </tr>
          <tr style="background-color: #fff8e1;">
              <td style="padding: 10px;">Iris diaphragm</td>
              <td style="padding: 10px;">Regulates the amount of light passing through the specimen; controlled by a movable lever.</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">Mirror</td>
              <td style="padding: 10px;">Reflects light to the specimen slide and back to the eyes; located below the stage near the base.</td>
          </tr>
      </tbody>
  </table>
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
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 4/proper handling.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Proper handling of a compound light microscope</div>
        </div>
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
        <img src="assets/img/chapter 4/figure 4-2.png" alt="Figure 4.2. Proper way of carrying the microscope">
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
