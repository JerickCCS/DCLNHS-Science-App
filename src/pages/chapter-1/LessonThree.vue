<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 3: Common Laboratory Tools, Equipment, and Wares</div>
        <button class="bookmark-btn" @click="toggleBookmark">
          <span class="material-icons" :style="{ color: isBookmarked ? '#FFD600' : 'white', fontSize: '24px' }">{{
            isBookmarked ?
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
    const lessonId = lesson ? String(lesson.id) : "3"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
    <div>
        <div class="illustration">
          <img src="assets/img/chapter 1/laboratory-tools.png" alt="Laboratory Tools">
        </div>
      <div class="header">
          <div class="title">What are the common laboratory materials used
in scientific investigations?</div>
      </div>
      <p>Observations and experimentations in science require skills
in measuring, collecting data, and reporting results. As a science
student, you need to learn how to take measurements correctly
and scientifically. The way you take measurements affects your
derivation or computation of other quantities that are useful in
your investigation.</p>
      <p>The measurements commonly taken in the laboratory are
length, mass, volume, and temperature.</p>
    </div>
  `,
      `
    <div>
        <div class="header">
          <div class="title">Tools for Measuring Length</div>
      </div>
      
      <p>Length can be measured using simple tools such as the ruler, meter rule, and caliper.
A ruler is used to measure lengths of objects within 1-30 cm. Measurements in a ruler are
typically displayed in centimeters, millimeters, and inches. A ruler starts its measurement
from a position that is not at the edge of the zero mark.</p>
      <p>A meter rule is a long, straight stick that has a well-ground edge where you can begin
measuring (i.e., zero at the end of the meter rule). This feature ensures accuracy from the
starting point. The meter rule is commonly used in woodworking applications since it has
a length of one meter and displays measurements in centimeters, millimeters, and inches.
Figure 1-9 shows the difference between a ruler and a meter rule.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure 1-9.png" alt="figure-1-9">
        <div class="caption">Figure 1-9. Difference between a ruler (A and C) and a meter rule (B and D)</div>
      </div>
    </div>
  `,
      `
    <div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 1/caliper.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">What is a caliper?</div>
        </div>
      <p>To use a caliper, carefully grip the object using the straight edges of the external or internal jaws and secure it with the locking screw. Figure 1-10 shows a typical caliper.</p>
      <div class="model-viewer-block">
        <model-viewer src="models/caliper.glb" alt="Figure 1-10. Parts of a typical caliper" camera-controls auto-rotate interaction-prompt="auto" loading="eager"></model-viewer>
        <a href="/html/caliper.html" class="eye-icon">
          <img src="assets/icons/eye.png" alt="View 3D Model" />
        </a>
        <div class="caption">Figure 1-10. Parts of a typical caliper</div>
      </div>
    </div>
  `,
      `
    <div>
        <div class="header">
          <div class="title">Equipment for Measuring Mass</div>
      </div>
      
      <p>The mass of an object can be determined using a balance with preset degrees of precision.
Some of these balances are shown in figure 1-11.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/double beam balance.png" alt="double beam balance">
        <div class="caption">double beam balance</div>
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 1/triple beam balance.png" alt="triple beam balance">
        <div class="caption">triple beam balance</div>
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 1/top-loading balance.png" alt="top-loading balance">
        <div class="caption">top-loading balance</div>
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 1/analytical balance.png" alt="analytical balance">
        <div class="caption">analytical balance</div>
      </div>
      <p>Figure 1-11. The common types of balance</p>
      <p>A double beam balance is a mechanical weighing balance known for its precision and
durability. It is made up of two pans and two beams (bars) that support sliding weights or
riders. The first rider measures from 0 to 10 grams in l-g increments, while the second rider
measures from 0 to 200 grams in 10-g increments.</p>
    </div>
  `,
      `
    <div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 1/double beam balance.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The double beam balance</div>
        </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 1/triple beam balance.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The triple beam balance</div>
        </div>
      <p>Before using the balance, the riders on the three beams must be moved to the leftmost
positions so that the scale pointer exactly aligns with the zero line. The object is then placed
on the pan, and the riders are adjusted until the scale pointer returns to zero. The hundreds
rider is adjusted first, followed by the tens and ones. The position of the riders corresponds to
the object's mass, which is obtained by summing the numbers from the three beams.</p>
    </div>
  `,
      `
    <div>
      <p>The top-loading balance and the analytical balance are both electronic balances
designed for high-precision measurements.</p>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 1/top-loading balances.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The top-loading balance</div>
        </div>
      <div class="video-container">
          <video controls width="100%">
            <source src="assets/videos/chapter 1/analytical balance.mp4" controls alt="video" type="video/mp4">
          </video>
          <div class="caption">The analytical balance</div>
        </div>
      <p>The basic steps for weighing with analytical and top-loading balances are generally
similar. The only difference is that, in an analytical balance, the balance door is closed to
reduce the effect of wind and dust in the obtained measurement.</p>
    </div>
  `,
      `
    <div>
      <p>The following are the steps in using the two balances.</p>
      <p>1. Make sure the balance pan is empty, then press the "tare" or "zero" button.</p>
      <p>2. Place the object to be weighed at the center of the pan. If you are to weigh a wet sample or chemicals, do not place them directly on the pan. Instead, use a weighing dish to keep
the sample or chemical contained. Position the weighing dish in the center of the pan,
press "tare" to reset to zero, and add the sample. If you are using an analytical balance,
close the balance door.</p>
      <p>3. Record the displayed weight once the balance stabilizes.</p>
    </div>
  `,
      `
    <div>
        <div class="header">
          <div class="title">Wares for Measuring Volume</div>
      </div>

      <p>In the laboratory, the volume of liquids can be measured using glasswares, such as those
shown in figure 1-12. Beakers are commonly used as reaction containers and for keeping
liquid or solid samples. Though these containers come in varying sizes and include volume
marks, it is important to note that these markings only provide approximate, not accurate,
measures of liquid volume.</p>
      <p>Graduated cylinders are used to approximate liquid volume measurements to the nearest
0.1 mL. They may also be used to transfer liquids with a considerable degree of accuracy.
Pipettes are used to transfer and measure liquids where a fixed and small volume is required,
providing a high degree of accuracy in measuring the liquid quantity. Burettes are particularly
used in titration experiments in quantitative chemistry for measuring and delivering a precise
volume of liquid to the nearest 0.01 ml or 0.l mL, depending on the capacity of the burette.
Burettes differ from pipettes because burettes can provide varied sample volumes.</p>
    </div>
  `,
      `
    <div>
<div class="illustration">
  <img src="assets/img/chapter 1/graduated cylinder.png" alt="Graduated Cylinder">
  <div class="caption">Graduated Cylinder</div>
</div>

<div class="illustration">
  <img src="assets/img/chapter 1/beaker.png" alt="Beaker">
  <div class="caption">Beaker</div>
</div>

<div class="illustration">
  <img src="assets/img/chapter 1/pipette.png" alt="Pipette">
  <div class="caption">Pipette</div>
</div>

<div class="illustration">
  <img src="assets/img/chapter 1/burette.png" alt="Burette">
  <div class="caption">Burette</div>
</div>

<p>Figure 1-12. Common laboratory glasswares used to measure the volume of liquids.</p>

    </div>
  `,
      `
    <div>
      <p>In measuring the liquid volume using graduated cylinders, pipettes, and burettes, the
liquid level should be correctly read. Liquids tend to form a curvature called meniscus at the
liquid surface. For most liquids, an upward curvature is formed. To read their volume, make
sure the eye is at the same level as the bottom of the meniscus (figure 1-13). A white background
might occasionally help to clearly observe the meniscus.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure 1-13.png" alt="figure 1-13">
        <div class="caption">Figure 1-13. Reading the liquid level that forms an upward meniscus</div>
      </div>
    </div>
  `,
      `
    <div>
        <div class="header">
          <div class="title">Other Laboratory Tools and Equipment</div>
      </div>

      <p>Other laboratory tools and equipment, such as aspirators and Bunsen burners, are also
frequently used in laboratory experiments. An aspirator is essential in transferring fluids.
It creates a vacuum by drawing air or liquid through a tube, which is usually a pipette.
Figure 1-14 shows how to properly use a pipette with the help of an aspirator.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure 1-14.png" alt="figure 1-14">
        <div class="caption">Figure 1-14. How to use a pipette</div>
      </div>
      <p>1. Draw the liquid into the pipette using a rubber bulb or an aspirator.</p>
      <p>2. Drain the liquid down to the desired reading, touching the adhering drop to the side of
the container. Plug the upper hole of the pipette with your index finger to prevent the
liquid from draining further.</p>
      <p>3. Place the pipette tip against the side of the receiving container. Take your finger off the
top of the container to let the liquid flow. After emptying the pipette, allow for a 20 s
drainage period. Touch the tip of the pipette to the side of the container.</p>
      <p>The liquid remaining in the lower portion of the pipette should not be blown out.
The pipette has been calibrated for this amount to remain.</p>
    </div>
  `,
      `
    <div>
      <p>Another laboratory equipment is the Bunsen burner,
which is used for heating and is fueled by liquified
petroleum gas (LPG). The Bunsen burner produces a
flame that can be adjusted based on the requirements of
an experiment. Named after its creator, Robert Bunsen,
this equipment can produce a bluish-green flame to an
orange-yellow flame.</p>
      <div class="model-viewer-block">
        <model-viewer src="models/bunsen_burner.glb" alt="Bunsen burner" camera-controls auto-rotate interaction-prompt="auto" loading="eager"></model-viewer>
        <a href="/html/bunsen burner.html" class="eye-icon">
          <img src="assets/icons/eye.png" alt="View 3D Model" />
        </a>
        <div class="caption">Figure 1-15. A Bunsen burner</div>
      </div>
    </div>
  `,
      `
    <div>
      <div class="info-card">
  <div class="info-title">MINI LAB 1-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Materials:</strong> plant and an appropriate measuring tool</p>
        <p><strong>Procedure:</strong></p>
        <p><strong>1.</strong> Observe and record the height of a plant for seven days. Use an appropriate measuring tool and express the measurements in appropriate units.</p>
        <p><strong>2.</strong> Organize your data in a data table and present them in a graph. What can you deduce from your graph?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-1-1" unelevated class="start-btn">
          Answer
        </q-btn>
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
