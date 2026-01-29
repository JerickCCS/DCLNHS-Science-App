<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
        <q-toolbar-title class="navbar-title">Chapter Review</q-toolbar-title>
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
            <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage" no-caps>Previous</q-btn>

            <div class="progress-section">
              <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
              <q-linear-progress :value="progress" size="10px" color="primary" />
            </div>

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
    const lessonId = lesson ? String(lesson.id) : "75"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
  <div>
    <!-- Card 1 -->
    <div class="header">
      <div>
        <div class="title">CHAPTER REVIEW</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Key Concepts Summary</div>
      <div class="info-content">
        <div class="info-text">
  • <b>Earthquake</b>: Refers to the vibration of rocks when the energy stored in them is released.<br>
  • <b>Focus or Hypocenter</b>: The point of origin of an earthquake.<br>
  • <b>Epicenter</b>: The point directly above the focus on the Earth's surface.<br>
  • <b>Faults</b>: Fractures in rocks along which measurable displacement occurs.
        </div>
      </div>
    </div>

      <div class="illustration">
      <img src="assets/img/chapter 10/technology in focus.png" alt="Placeholder">
      <div class="caption">Smartphones can help detect earthquakes using built-in sensors</div>
    </div>
   
  </div>
  `
      ,
      `
<div>
    <!-- Card 2 -->
    <div class="header">
      <div>
        <div class="title">CHAPTER REVIEW</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Fault Classifications</div>
      <div class="info-content">
        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <thead>
      <tr>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Classification Type
        </th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Categories
        </th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Description
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          By Occurrence
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Active and Inactive
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Active faults have moved in the past and are likely to move again. Inactive faults have not moved in a long time.
        </td>
      </tr>

      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          By Movement
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Dip-slip, Strike-slip, and Oblique-slip
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Describes the direction of movement along the fault plane.
        </td>
      </tr>
    </tbody>
  </table>
</div>

      </div>
    </div>
   <div class="fun-fact-card">
      <span class="highlight">REMEMBER:</span> The Philippines is a seismologically active area because of its numerous earthquake generators such as faults.

    </div>
  </div>
  `
      ,
      `
  <div>
    <!-- Card 3 -->
    <div class="header">
      <div>
        <div class="title">CHAPTER REVIEW</div>
      </div>
    </div>

    <div class="info-card">
      <div class="info-title">Measuring Earthquakes</div>
      <div class="info-content">
        <div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
    <thead>
      <tr>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Measurement
        </th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Definition
        </th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">
          Scale Used
        </th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Intensity
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Based on the effect or the extent of damage of an earthquake on people, infrastructure, natural objects, and land surfaces.
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          PHIVOLCS Earthquake Intensity Scale (PEIS)
        </td>
      </tr>

      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Magnitude
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Refers to the energy released at its point of origin or focus.
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          Richter Scale, Moment Magnitude Scale
        </td>
      </tr>
    </tbody>
  </table>
</div>

      </div>
    </div>
   <div class="fun-fact-card">
      <span class="highlight">SCIENCE CONNECTION:</span> Earthquakes provide knowledge about the nature of the Earth's internal structure through the study of seismic waves.

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
