<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 3: Earthquake Preparedness</div>
        <button class="bookmark-btn" @click="toggleBookmark">
          <span class="material-icons" :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">
            {{ isBookmarked ? 'bookmark' : 'bookmark_border' }}
          </span>
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
    const lessonId = lesson ? String(lesson.id) : "73"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
  <div>
    <!-- Card 1 -->
    <div class="header">
      <div>
        <div class="title">Earthquake Preparedness</div>
      </div>
    </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 10/lv_0_20260116220654.mp4" controls alt="video" type="video/mp4">
          </video>
    </div>

           <div class="header">
      <div>
        <div class="title">What to Do Before an Earthquake</div>
      </div>
    </div>
<p>&bull; Familiarize yourself with the earthquake hazards in your community.</p>
<p>&bull; Know where the exit routes, communication facilities, and evacuation centers are located in your community.</p>
<p>&bull; Know where the fire extinguishers and first aid kits are kept in your school and at home. Learn how to use them.</p>
<p>&bull; Ask your parents to strap or bolt heavy furniture to the wall.</p>
<p>&bull; Help your parents check the stability of hanging objects, such as ceiling fans.</p>

  </div>
        </div>
  </div>
 
   
  `,

      `
  <div>
    <!-- Card 3 -->
<div class="header">
      <div>
        <div class="title">What to Do Before an Earthquake</div>
      </div>
    </div>
<p>&bull; Remind your family members to store and secure fragile items, harmful chemicals, and flammable materials in the lowermost shelves.</p>
<p>&bull; Help your family put together an emergency supply kit with a first aid kit, easy-to-open canned goods, water, clothing, a blanket, battery-operated radio, flashlights, and extra batteries (figure 10-5).</p>

<div class="illustration">
      <img src="assets/img/chapter 10/figure 10-5.png" alt="Placeholder" style="height: 180px;">
      <div class="caption">Figure 10-5. Sample contents of an emergency supply kit</div>
    </div>

<p>&bull; Participate in earthquake drills.</p>
<p>&bull; Store important documents in a sealed plastic envelope or have a digital copy stored somewhere else.</p>
<p>&bull; Have a list of emergency contact numbers in your mobile phone, or written down in case your device is lost, destroyed, or malfunctioning.</p>
   
  </div>
  `,

      `
  <div>
    <!-- Card 4 -->
    <div class="header">
      <div>
        <div class="title">What to Do During an Earthquake
</div>
      </div>
    </div>

    <p>&bull; Stay calm. Do not panic.</p>
<p>&bull; When you are inside the building, quickly exit the building, if possible.</p>
<p>&bull; If it is not possible to get out right away, do the "duck, cover, and hold" technique; go under the sturdy desk or table, hold on to it, and protect your head with your arms.</p>

<div class="illustration">
      <img src="assets/img/chapter 10/duck.png" alt="Placeholder">
      <div class="caption">Figure 10-6. The duck, cover, and hold technique is one way to keep safe during an earthquake.</div>
    </div>

  </div>
  `,

      `
  <div>
    <!-- Card 5 -->
    <p>&bull; Stay away from glass windows, stand-alone shelves, cabinets, and other heavy objects not bolted down.</p>
<p>&bull; Beware of falling objects. Be alert and keep your eyes open.</p>
<p>&bull; If you are outside, move to an open area, but</p>

<p style="margin-left: 30px;">&bull; stay away from trees, power lines, posts, and concrete structures that may collapse;</p>
<p style="margin-left: 30px;">&bull; move away from steep slopes, which may be affected by landslides; and</p>
<p style="margin-left: 30px;">&bull; if you are near a body of water, move to a higher ground to avoid tsunamis and seiches.</p>

</div>


  </div>
  `,

      `
  <div>
    <!-- Card 6 -->
    <div class="header">
      <div>
        <div class="title">What to Do After an Earthquake
</div>
      </div>
    </div>

    <p>&bull; Be prepared for aftershocks. Once the shaking stops, take the fastest and safest way to get out of the building.</p>

<p>&bull; Do not</p>
<p style="margin-left: 30px;">&bull; use the elevator;</p>
<p style="margin-left: 30px;">&bull; enter damaged buildings;</p>
<p style="margin-left: 30px;">&bull; use telephones or cellphones, unless necessary; and</p>
<p style="margin-left: 30px;">&bull; panic.</p>

<p>&bull; Check</p>
<p style="margin-left: 30px;">&bull; yourself and others for injuries;</p>
<p style="margin-left: 30px;">&bull; gas, water, and electrical lines for damages;</p>
<p style="margin-left: 30px;">&bull; for chemical and toxic spills and flammable materials; and</p>
<p style="margin-left: 30px;">&bull; to see if small fires are under control before they spread.</p>

<p>&bull; If you need to evacuate your residence, bring your emergency supply kit.</p>
<p>&bull; Stay updated with the news on your battery-operated radio.</p>


  </div>
  `,

      `
  <div>
    <!-- Card 7 -->
<div class="info-card" style="margin-top: 10vh;">
      <div class="info-title">MINI LAB 10-5</div>
      <div class="info-content">
        <div class="info-text">
          <p>1. Form a group of five members. Discuss creative ways of presenting preparedness during and after an earthquake. You should be able to demonstrate what should be done before, during, and after an earthquake in school, at home, or near coastal area settings.</p>
          <p style="font-size: 18px;">2. Write an essay in Filipino about your role in disaster preparedness during earthquakes.</p>
        </div>
      </div>
    </div>
  </div>
  `,

      `
  <div>
    <!-- Card 8 -->
    <div class="header">
      <div>
        <div class="title">Tsunami Alert Levels
</div>
      </div>
<p>The Philippines is prone to earthquakes, and many of its communities are located near bodies of water. These communities must be aware of tsunami warnings after strong offshore earthquakes.</p>

<div style="color: #8000ff; font-weight: bold; font-size: 20px;">Table 10-3: Recommended Course of Action for Tsunami</div>

<table style="width:100%; border-collapse:collapse; font-size:14px;">
    <thead>
        <tr>
            <th style="border:1px solid #8000ff; padding:8px; background:#8000ff; color:#fff; text-align:left;">Level</th>
            <th style="border:1px solid #8000ff; padding:8px; background:#8000ff; color:#fff; text-align:left;">Threat</th>
            <th style="border:1px solid #8000ff; padding:8px; background:#8000ff; color:#fff; text-align:left;">Recommended Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border:1px solid #8000ff; padding:8px;">0</td>
            <td style="border:1px solid #8000ff; padding:8px;">
                There is a large earthquake generated. A tsunami may be generated but will not reach the Philippines, or may not be generated at all.
            </td>
            <td style="border:1px solid #8000ff; padding:8px;">
                • No evacuation needed.<br>
                • The bulletin is issued for information purposes only.
            </td>
        </tr>
        <tr>
            <td style="border:1px solid #8000ff; padding:8px;">1</td>
            <td style="border:1px solid #8000ff; padding:8px;">
                There is a potential threat.
            </td>
            <td style="border:1px solid #8000ff; padding:8px;">
                • No evacuation order is in effect but coastal communities are advised to be on alert for possible evacuation.
            </td>
        </tr>
    </tbody>
</table>

  </div>
  `,

      `
  <div>
    <!-- Card 9 -->
    <div class="header">
      <div>
        <div class="title">Tsunami Alert Levels
</div>
      </div>
<div style="overflow-x:auto;">
  <table style="width:100%; border-collapse:collapse; min-width:760px; font-size:16px;">
    <thead>
      <tr>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">Level</th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">Threat</th>
        <th style="padding:8px; background:#8000ff; color:#fff; text-align:left; border:1px solid #8000ff;">Recommended Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">2</td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          A tsunami is expected to arrive in the Philippines with wave heights of less than one meter above the expected ocean tides.
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          • The public is advised to be on alert for unusual waves. People are advised to stay away from the beach or seashore.<br>
          • People who live near the shore are advised to move farther inland.<br>
          • Boats in harbors, estuaries, or shallow coastal waters should be secured or moved away from the waterfront.<br>
          • Offshore boats are advised to stay in deep seawaters until notified.
        </td>
      </tr>
      <tr>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">3</td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          A destructive tsunami is expected to arrive in the Philippines with wave heights of greater than one meter above the expected ocean tides.
        </td>
        <td style="padding:8px; border:1px solid #8000ff; vertical-align:top; word-break:break-word;">
          • Coastal communities are strongly advised to evacuate immediately to higher ground.<br>
          • Boats in harbors, estuaries, or shallow coastal waters should be secured and moved away from the waterfront.<br>
          • Offshore boats are advised to stay in deep seawaters until notified.
        </td>
      </tr>
    </tbody>
  </table>
</div>
<p style="text-align: center;"><i>Source: phivolcs.dost.gov.ph</i></p>
  </div>
  `,

      `
  <div>
    <!-- Card 10 -->
<div class="info-card">
      <div class="info-title">MINI TEST 10-5</div>
      <div class="info-content">
        <div class="info-text">
          <p>How will you keep yourself and your family safe from the effects and hazards of earthquakes?</p>
          
          <div class="start-btn-container">
            <q-btn data-route="/mini-test-10-5" unelevated class="start-btn">Answer</q-btn>
          </div>
        </div>
      </div>
    </div>
<div class="fun-fact-card">
      <span class="highlight">SCIENCE PIONEER:</span> Dr. Raymundo Punongbayan was the former director of the Philippine Institute of Volcanology (PHIVOLCS) from 1983 to 2002. He was well known for his contribution in handling two well-known calamities in the Philippines—the 1990 Luzon Earthquake and the 1991 Pinatubo eruption. His work saved thousands of lives in 1991.

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

      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })

      // Fix z-index after first render
      setTimeout(() => {
        const canvas = document.querySelector('canvas[style*="position: fixed"]')
        if (canvas) canvas.style.zIndex = '99999'
      }, 50)

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