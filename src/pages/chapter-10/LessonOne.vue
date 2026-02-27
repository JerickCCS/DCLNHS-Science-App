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
            <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage" no-caps>Previous</q-btn>

            <div class="text-subtitle2 text-white">{{ currentPage + 1 }} / {{ pages.length }}</div>

            <q-btn class="nav-button" @click="nextPage" :label="currentPage === pages.length - 1 ? 'Finish' : 'Next'"
              :style="currentPage === pages.length - 1 ? finishButtonStyle : null" no-caps />
          </div>

          <div class="speak-btn" @click="toggleAudio">
            <img :src="isPlaying ? '/icons/stop.png' : '/icons/speak.png'" alt="Speak Button" class="cursor-pointer"
              style="width: 20px; height: 20px;" />
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
    const lessonId = lesson ? String(lesson.id) : "71"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
     <div>
      <!-- Card 1 -->
      <div class="header">
        <div>
          <div class="title">Earthquakes along Faults</div>
        </div>
      </div>

      <p>Our country is located in an earthquake-prone region. Did you know that earthquakes are recorded in the Philippines every day? Fortunately, most of them are too weak to be felt or noticed. What exactly are earthquakes? Why do these happen? How do these occur?</p>

      <div class="info-card">
        <div class="info-title">Mini Lab 10-1</div>
        <div class="info-content">
          <div class="info-text">
            <p>1. Lay the ruler along the table such that 3/4 of its length is over the edge.</p>
            <p>2. Hold the ruler with one of your hand. With your other hand, bend the free end of the ruler and then release it.</p>
            <p>3. Describe the movement of the ruler.</p>
          </div>
        </div>
      </div>

      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/as the ruler.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What happens when the ruler is bent?</div>
        </div>
    </div>
  `,

      `
  <div>
    <!-- Card 3 -->
    <div class="model-viewer-block">
            <model-viewer src="models/tectonic_plates.glb" alt="earthquake" camera-controls autoplay auto-rotate interaction-prompt="auto" loading="eager"></model-viewer>
            <a href="/html/tectonic-plates.html" class="eye-icon">
                      <img src="assets/icons/eye.png" alt="View 3D Model" />
                    </a>
            <div class="caption">Example movement of tectonic plates</div>
          </div>
  </div>
  `,

      `
  <div>
    <!-- Card 4 -->
    <div class="header">
      <div>
        <div class="title">Focus and Epicenter</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/figure 10-1.png" alt="Placeholder">
      <div class="caption">Figure 10-1. The epicenter of an earthquake is located directly above its focus, or the point of origin of an earthquake.</div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/lv_0_20260124190522.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What is focus and types of earthquakes?</div>
        </div>
  </div>
  `,

      `
  <div>
    <!-- Card 5 -->
    <div class="info-card">
      <div class="info-title">Mini Test 10-1</div>
      <div class="info-content">
        <div class="info-text">
          <p style="text-align: center;"><strong>What is the difference between the epicenter and the focus of an earthquake? How do faults generate earthquakes?</strong></p>
          <p style="text-align: center; color: purple;">Present your answers by doing one of the following:</p>
          <p>1. Create an animation.</p>
          <p>2. Act out the concept.</p>
          <p>3. Write a news article.</p>
        </div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/fblite_video.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The Earth's tectonic plates and their movement.</div>
        </div>
  </div>
  `,

      `
  <div>
    <!-- Card 6 -->
    <div class="header">
      <div>
        <div class="title">Active and Inactive Faults</div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/IMG_20260124_191358_804fblite_video.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">Active and inactive faults.</div>
        </div>
  </div>
  `,

      `
  <div>
    <!-- Card 7 -->
    <div class="header">
      <div>
        <div class="title">Dip-Slip, Strike-Slip, and Oblique-Slip Faults</div>
      </div>
    </div>

    <p>In a dip-slip fault, the ground moves either up or down along the slope of the fault. The dip is the angle the fault makes with respect to the surface. The block above the fault is the hanging wall, while the block below is the footwall. Depending on how these blocks move in relation to the hanging wall and footwall, dip-slip faults are categorized as normal or reverse. In a normal dip-slip fault (figure 10-2A), the hanging wall moves down in relation to the footwall. In a reverse dip-slip fault, the opposite happens; the hanging wall moves up in relation to the footwall (figure 10-2B).</p>
  </div>
  `,

      `
  <div>
    <!-- Card 8 -->
    <p>In a strike-slip fault, the blocks move side to side, sliding past one another (figure 10-2C). The strike is where the fault cuts across a horizontal surface. In a sinistral strike-slip fault, a fault block moves to the left with respect to the opposite block. In a dextral strike-slip fault, the movement is to the right.</p>
    <div class="fun-fact-card">
      <span class="highlight">Science Tips:</span> Hanging wall and footwall are mining terms that have been adopted in geology. In mining, a hanging wall is the mass of rock overlying mineral deposits, while a footwall is the rock below the mass. These terms are used by geologists to refer to the block of rock above the fault plane (hanging wall) and the block below (footwall).
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 9 -->
    <div class="header">
      <div>
        <div class="title">Oblique-Slip Faults</div>
      </div>
    </div>

    <p>An oblique-slip fault exhibits both dip-slip and strike-slip displacements: either an upward or downward sliding of the fault block, and a horizontal movement to the left or to the right of one fault block with respect to the opposite block (figure 10-2D)</p>

    <div class="illustration">
      <img src="assets/img/chapter 10/figure10-2.png" alt="Placeholder">
      <div class="caption">Figure 10-2. Different faults based on orientation of displacement: (a) normal dip-slip fault, (b) reverse dip-slip fault, (c) strike-slip fault, and (d) oblique-slip fault.</div>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 10 -->
    <div class="header">
      <div>
        <div class="title">Apply Your Knowledge</div>
      </div>
    </div>

    <p>Now that you've learned about different types of faults and how they generate earthquakes, it's time to apply this knowledge. The next activity will challenge you to demonstrate your understanding through a practical exercise.</p>

    <div class="info-card">
      <div class="info-title">MINI LAB 10-2</div>
      <div class="info-content">
        <div class="info-text">
          <p>Apply what you have learned by performing the activity on faults. Click the button to go to the next page.</p>
          <div class="start-btn-container">
            <q-btn data-route="/mini-lab-10-2" unelevated class="start-btn">
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
    <!-- Card 11 -->
    <div class="header">
      <div>
        <div class="title">How Movement along Faults Generate Earthquakes</div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/1769331258299.mp4" controls alt="figure 11-3" type="video/mp4">
          </video>
          <div class="caption">Three Basic Fault Types</div>
        </div>
    <p>At or near tectonic plate boundaries, there is a large concentration of faults. The reason for this is that the movement of tectonic plates provides stress. Rocks on the Earth's surface break in response to this stress.</p>
  </div>
  `,
      `
  <div>
    <!-- Card 12 -->
    <div class="header">
      <div>
        <div class="title">Normal Faults</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Normal_Fault (1).gif" alt="Placeholder">
      <div class="caption">Normal Fault Animation</div>

    <p>Normal faults are caused by rocks being stretched. They are formed as a block of rock falls after being fractured. Sudden movement along these faults causes earthquakes as the movement releases stored up energy. The earthquake focus is the place where the rocks break.</p>
  </div>
  `,

      `
  <div>
    <!-- Card 13 -->
    <div class="header">
      <div>
        <div class="title">Reverse Fault Earthquakes</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Reverse_Fault (1).gif" alt="Placeholder">
      <div class="caption">Reverse Fault Animation</div>
    </div>

    <p>In a reverse fault, the hanging wall has moved upward relative to the footwall due to compressional force. Earthquakes happen due to this sudden movement.</p>
  </div>
  `,

      `
  <div>
    <!-- Card 14 -->
    <div class="header">
      <div>
        <div class="title">Strike-Slip Fault Earthquakes</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/Strike-Slip_Fault.gif" alt="Placeholder">
      <div class="caption">Strike-Slip Fault Animation</div>
    </div>

    <p>In strike-slip faults, two plates move horizontally sideways in opposite directions. As the plates move against one another, strain is built up. As energy is released, earthquakes occur. Strike-slip faults can produce major earthquakes with a magnitude as great as 8.</p>
  </div>
  `,

      `
  <div>
    <!-- Card 15 -->
    <div class="header">
      <div>
        <div class="title">Mini Test 10-2</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">MINI TEST 10-2</div>
      <div class="info-content">
        <div class="info-text">
          <p>1. Draw the graphic organizer on your paper as shown below.</p>
          <p>2. For each set of rectangles, fill the top with the tectonic plate and the bottom with the associated type of fault.</p>

          <div class="illustration">
            <img src="assets/img/chapter 10/mini test 10-2.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-test-10-2" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 16 -->
    <div class="header">
      <div>
        <div class="title">Types of Faults in the Philippines</div>
      </div>
    </div>

    <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter10-lesson1.mp4" controls alt="philippine fault" type="video/mp4">
          </video>
          <div class="caption">The Types of Faults in the Philippines Animation</div>
        </div>
        <p>The Philippines is considered one of the most tectonically and seismically active areas in the world. PHIVOLCS records at least five earthquakes a day in the Philippines, all of which are due to active faults.</p>
  </div>
  `,

      `
  <div>
    <!-- Card 18 -->
    
    <p>The Philippine Fault Zone (PFZ) is an important tectonic and seismic feature that cuts across the Philippine archipelago from northwestern Luzon to southeastern Mindanao. The PFZ is generally strike-slip in nature and is made up of several segments. Large magnitude earthquakes in recent years originated from this fault zone.</p>

    <div class="fun-fact-card">
      <span class="highlight">Did You Know?:</span> During an earthquake, stay away from windows, heavy furniture, and objects that could fall.
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 19 -->
    <div class="header">
      <div>
        <div class="title">Philippine Fault Lines</div>
      </div>
    </div>

    <div class="illustration">
      <img src="assets/img/chapter 10/philippines-map.jpeg" alt="Placeholder">
      <div class="caption">Figure 10-3: Distribution of active faults in the Philippines</div>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 20 -->
    <div class="header">
      <div>
        <div class="title">Mini Lab 10-3</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Mini Lab 10-3</div>
      <div class="info-content">
        <div class="info-text">
          <p>Fill in the second column with examples of the type of faults found in the Philippines.</p>

          <div class="illustration">
            <img src="assets/img/chapter 10/mini lab 10-3.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-lab-10-3" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 21 -->
    <div class="info-card">
      <div class="info-title">MINI TEST 10-3</div>
      <div class="info-content">
        <div class="info-text">
         
          <div class="illustration">
            <img src="assets/img/chapter 10/mini test 10-3.png" alt="Placeholder">
          </div>

          <div class="start-btn-container">
            <q-btn data-route="/mini-test-10-3" unelevated class="start-btn">Answer</q-btn>
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
