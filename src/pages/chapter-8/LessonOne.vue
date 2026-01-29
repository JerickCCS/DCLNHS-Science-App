<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
        <q-toolbar-title class="navbar-title">Lesson 1: Basic Concepts of Motion</q-toolbar-title>
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
          <div id="viewer" ref="viewerRef">
            <transition name="fade-slide" mode="out-in" @after-enter="onTransitionComplete">
              <div :key="currentPage" v-html="getPageContent(currentPage)"></div>
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

          <div class="speak-btn" @click="onToggleAudio">
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
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import confetti from "canvas-confetti"
import { getCurrentUser, setCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"
import { LocalStorage } from "quasar"
import '@google/model-viewer'
import { audioManager } from "src/utils/audioManager"
import renderMathInElement from 'katex/contrib/auto-render'
import 'katex/dist/katex.min.css'
import { useTTSLesson } from "src/composables/katexTTS"

export default {
  name: "ScientificModelsLesson",
  setup() {
    // router, state, lesson
    const route = useRoute()
    const router = useRouter()
    const currentPage = ref(0)
    const progress = ref(0)
    const showLessonComplete = ref(false)
    const viewerRef = ref(null)
    const renderedPages = ref([])

    const currentUser = ref(getCurrentUser())
    let confettiInterval = null

    const lesson = flatLessons.find(l => l.route === route.path)
    const lessonId = lesson ? String(lesson.id) : "56"

    // bookmarks
    const bookmarkedPages = ref([])

    // raw lesson pages
    const rawPages = [
      `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">Basic Concepts of Motion</div>
        </div>
      </div>
      <p>Motion is a fundamental concept in physics that helps us understand how objects change their positions relative to other objects or reference points. A reference point is any point in space that we use to compare or measure the position and motion of other things.</p>
      <p>There is motion when you move toward or away from a reference point. Imagine you are walking to school from home. There are different paths that you could take. Each path adds up to the total distance from your house to your school. Your house is your reference or starting point, and your school is the final position.</p>
      <p>The origin (0, 0) is usually the reference point within a Cartesian Coordinate System. This system is divided into four distinct quadrants, denoted as I, II, III, and IV. These quadrants delineate the positioning of both x- and y-values, discerning their signs in relation to each quadrant's boundaries.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 2 -->
      <p>In the previous chapter, we already introduced the four cardinal directions-north (N), south (S), east (E), and west (W)-as fundamental conventions utilized in a Cartesian plane. The positive directions are north and east, while the south and west are the negative ones.</p>
      <div class="illustration">
        <img src="assets/images/cartesian_plane.jpg" alt="Cartesian Coordinate System with four quadrants and cardinal directions">
        <div class="caption">Cartesian Coordinate System showing quadrants and directions</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 3 -->
      <div class="info-card">
        <div class="info-title">SCIENCE HISTORY</div>
        <div class="info-content">
          <div class="info-text">
            <p>Learn about René Descartes and the development of the Cartesian Coordinate System. Click the button to explore the history.</p>
            <div class="start-btn-container">
              <q-btn data-route="/science-history-8-1" unelevated class="start-btn">
                Explore
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">Distance or Displacement</div>
        </div>
      </div>
      <p>Talking about motion, we look at simple ideas like how far and how fast things go, and how they change speed. The fundamental concepts of motion, such as time, distance or displacement, and speed or velocity, will help us determine how things move.</p>
      <p>Moreover, the concept of motion has applications in other scientific domains, such as biology, chemistry, and Earth science. For instance, some processes, such as diffusion, osmosis, and active transport, help in the movement of molecules and ions within cells.</p>
      <p>Understanding motion also aids in predicting the reaction rates and products since atoms and molecules rearrange to form a new substance in chemical reactions. Weather patterns and long-term climates can be determined through the motion of air masses and ocean currents.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 5 -->
      <div class="info-card">
        <div class="info-title">MINI TEST 8-1</div>
        <div class="info-content">
          <div class="info-text">
            <p>Cite applications of motion in biology, chemistry, and Earth science that were not mentioned yet in the discussion. Briefly explain your answers.</p>
            <div class="start-btn-container">
              <q-btn data-route="/mini-test-8-1" unelevated class="start-btn">
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
      <!-- Card 6 -->
      <p>When you are on the move, you travel a certain distance. But when you return to where you started, even though you have covered that same distance, your displacement is zero.</p>
      <p>Distance (d) denotes the length of the path taken by a moving object. On the other hand, displacement (d or Δd) is the shortest span between the initial and final positions. Delta (Δ) means "change." It is the difference between the final and initial values of any physical quantity.</p>
      <p>Distance is a scalar quantity, while displacement is a vector quantity. Distance, a scalar quantity, solely takes magnitude into account. Displacement, a vector quantity, not only encompasses magnitude, but also considers the direction of the movement.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 7 -->
      <p>Measuring how far you have traveled along the whole path in any way you went or turned is distance. Displacement measures the shortest path from where you began to where you ended up. It also includes how far you moved and the direction you moved in.</p>
      <p>The fundamental unit of length in the International System of Units (SI) is the meter (m), which serves as a standard for measuring both distance and displacement. While the meter is applicable to quantifying the extent of travel, displacement goes further by incorporating directionality and, at times, utilizing positive or negative values to signify the motion's orientation.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 8 -->
      <p>Other common units of length include inches (in), feet (ft), centimeters (cm), kilometers (km), and miles (mi).</p>
      <p>For example, consider the scenario where you take steps toward the east, traversing a path spanning 100 meters. Here, the distance covered is precisely 100 meters; correspondingly, the displacement is recorded as 100 meters, east. This displacement value encapsulates not only the extent, but also the directional context of your motion. Try to draw the situation.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 9 -->
      <p>Now, if you retrace your steps and head westward, ultimately returning to your initial starting point, the cumulative distance covered becomes 200 meters. However, in terms of displacement, the value reduces to zero. In essence, a displacement of zero is achieved when the starting and ending positions coincide. Try to draw the situation.</p>
      <p>To better understand how distance differs from displacement, consider an athlete who runs from point A to point C, stops, then reverses his run to point B, and stops again (figure 8-1). The distance he covered is 60 m; however, his displacement is only 20 m. His displacement is positive since his direction is to the right (east)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 10 -->
      <div class="illustration">
        <img src="assets/images/distance_displacement.jpg" alt="Diagram of an athlete running from point A to C, then back to B">
        <div class="caption">Figure 8-1. The distance and displacement of the athlete are not equal (not drawn to scale).</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 11 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">Problem-Solving Techniques</div>
        </div>
      </div>
      <p>To facilitate problem-solving, follow the systematic approach given below to solve a problem correctly.</p>
      <p><strong>Step 1. Given</strong></p>
      <p>Identify the given information with the corresponding units. You may also include a sketch or a diagram to visualize the problem.</p>
      <p><strong>Step 2. Find</strong></p>
      <p>Determine the unknown quantity.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 12 -->
      <p><strong>Step 3. Solution</strong></p>
      <p>Determine and derive the most appropriate formula for the unknown quantity. Then, substitute the given values and perform the necessary calculations to obtain the final answer.</p>
      <p><strong>Step 4. Rationalization</strong></p>
      <p>Provide a rationalization for your answer to confirm your understanding of the problem and its solution.</p>
      <p>By following these systematic steps, you can enhance your problem-solving skills and gain a deeper understanding of the underlying concepts that you need to learn.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 13 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">EXAMPLE 8-1</div>
          <div class="subtitle">Baseball Field Dimensions</div>
        </div>
      </div>
      <div class="illustration">
        <img src="assets/images/baseball_diamond.jpg" alt="Diagram of a baseball diamond with base distances labeled">
        <div class="caption">Baseball field dimensions</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 14 -->
      <p>In a baseball game, the batter hit a homerun, and was able to circle the bases and reach the home plate within a duration of 30.0 seconds. If we track the path he took while running around the baseball field: (a) what is the total distance he covered? (b) what is his total displacement?</p>
      <p><strong>Given:</strong> t = 30.0 s</p>
      <p><strong>Find:</strong> (a) d<sub>T</sub> = ? (b) Δd = ?</p>
      <p><strong>Solution:</strong></p>
      <p>(a) Assuming he took the same distance indicated in the baseball field dimensions, the total distance can be solved by adding all the steps he took along the field's curves and turns.</p>
      <p>d<sub>T</sub> = 4(27.4 m) = 109.6 m</p>
    </div>
    `,
      `
    <div>
      <!-- Card 15 -->
      <p>(b) The displacement is zero since the initial position is the same as the final position.</p>
      <p>Δd = d<sub>f</sub> - d<sub>i</sub> = 0</p>
      <p><strong>Rationalization:</strong></p>
      <p>If an object moves, the total distance cannot be zero. On the other hand, displacement can be zero when its initial position is the same as its final position.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 16 -->
      <div class="info-card">
        <div class="info-title">MINI TEST 8-2</div>
        <div class="info-content">
          <div class="info-text">
            <p>Solve the following problems and show your systematic solutions (Given, Find, Solution, and Rationalization).</p>
            <div class="start-btn-container">
              <q-btn data-route="/mini-test-8-2" unelevated class="start-btn">
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
      <!-- Card 17 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">Speed or Velocity</div>
        </div>
      </div>
      <p>When moving along the road, you can move at the same speed, speed up, or slow down, depending on the situation. When you are late for an appointment, you usually speed up to cover a greater distance at a lesser time of travel.</p>
      <p>When you encounter a yellow or red traffic signal along the way, you need to slow down in order to stop within the stopping distance to avoid any traffic law violation. When you drive around a curved path, it is better to slow down instead of speeding up in order to avoid accidents. These are some situations showing varying speeds or velocities.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 18 -->
      <p>Speed (v), a scalar quantity, is defined as the distance (d) traveled divided by time (t). In symbols, this is expressed as:</p>
      <p>speed (v) = d/t</p>
      <p>Velocity (v), a vector quantity, is the displacement (d or Δd) over time (t). The speed in a particular direction is also called velocity. In symbols, this is expressed as:</p>
      <p>velocity (v) = Δd/Δt</p>
      <p>v = (d<sub>f</sub> - d<sub>i</sub>) / (t<sub>f</sub> - t<sub>i</sub>)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 19 -->
      <p>Given that the SI units for length are meter (m) and second (s), respectively, it follows that we can express speed and velocity using the unit meter per second (m/s). Moreover, velocity can carry additional information, such as a particular direction, or, in certain instances, positive or negative values indicating the motion's orientation.</p>
      <p>Other common units of speed or velocity include feet per second (ft/s), kilometers per hour (km/h) and miles per hour (mi/h).</p>
      <div class="info-card">
        <div class="info-title">MINI LAB 8-1</div>
        <div class="info-content">
          <div class="info-text">
            <p>How fast can you walk? Measure your walking speed using simple materials and follow the procedure.</p>
            <div class="start-btn-container">
              <q-btn data-route="/mini-lab-8-1" unelevated class="start-btn">
                Start Lab
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 20 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">Instantaneous and Average Speed/Velocity</div>
        </div>
      </div>
      <p>Let us say a car travels northward via the expressway, and the speedometer shows that the instantaneous speed or the exact speed at that moment is 109 km/h. But if we consider both the speed and the direction where the car is going, the car is moving at 109 km/h toward north.</p>
      <p>So, if we only look at the speed, it is 109 km/h but considering the direction, the car is moving at 109 km/h north. When the instantaneous speed is coupled with the direction of travel, it transforms into the instantaneous velocity.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 21 -->
      <p>The average speed can be calculated by dividing the total distance (d<sub>T</sub>) traveled by the total elapsed time (t<sub>T</sub>).</p>
      <p>v̄ = d<sub>T</sub> / t<sub>T</sub></p>
      <p>On the other hand, average velocity can be computed using the rate of change of the displacement. Average velocity can also be calculated if the initial and final velocities are given.</p>
      <p>v̄ = Δd / Δt</p>
      <p>v̄ = (v<sub>i</sub> + v<sub>f</sub>) / 2</p>
    </div>
    `,
      `
    <div>
      <!-- Card 22 -->
      <div class="header">
        <span class="lesson-pill">Lesson 1</span>
        <div>
          <div class="title">EXAMPLE 8-2</div>
        </div>
      </div>
      <p>1. What is the average speed of a person who runs 100 meters in 30 seconds?</p>
      <p><strong>Given:</strong> t<sub>T</sub> = 30.0 s, d<sub>T</sub> = 100 m</p>
      <p><strong>Find:</strong> v̄ = ?</p>
      <p><strong>Solution:</strong></p>
      <p>v̄ = d<sub>T</sub> / t<sub>T</sub></p>
      <p>v̄ = 100 m / 30.0 s</p>
      <p>v̄ = 3.33 m/s</p>
    </div>
    `,
      `
    <div>
      <!-- Card 23 -->
      <p><strong>Rationalization:</strong></p>
      <p>The average speed can be computed using the total distance and the total time. Since it is a scalar quantity, it does not need direction.</p>
      <p>2. Using the information in Example 8-1, calculate the baseball player's (a) average speed and (b) average velocity. (c) Is the average speed the same as the average velocity?</p>
      <p><strong>(a) Given:</strong> t<sub>T</sub> = 30.0 s, d<sub>T</sub> = 4(27.4 m) = 109.6 m</p>
      <p><strong>Find:</strong> v̄ = ?</p>
    </div>
    `,
      `
    <div>
      <!-- Card 24 -->
      <p><strong>Solution:</strong></p>
      <p>v̄ = d<sub>T</sub> / t<sub>T</sub></p>
      <p>v̄ = 109.6 m / 30.0 s</p>
      <p>v̄ = 3.65 m/s</p>
      <p><strong>Rationalization:</strong></p>
      <p>The average speed can be computed using the total distance of the baseball field divided by the total time.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 25 -->
      <p><strong>(b) Given:</strong> Δt = 30.0 s, Δd = 0</p>
      <p><strong>Find:</strong> v̄ = ?</p>
      <p><strong>Solution:</strong></p>
      <p>v̄ = Δd / Δt</p>
      <p>v̄ = 0 m / 30.0 s</p>
      <p>v̄ = 0 m/s</p>
      <p><strong>Rationalization:</strong></p>
      <p>The displacement is zero since the player's initial position is the same as his final position. Thus, the average velocity is zero.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 26 -->
      <p><strong>(c)</strong> The average speed is not the same as the average velocity since distance is not the same with displacement.</p>
      <div class="info-card">
        <div class="info-title">MINI TEST 8-3</div>
        <div class="info-content">
          <div class="info-text">
            <p>Solve the following problems and show your systematic solutions (Given, Find, Solution, Rationalization).</p>
            <div class="start-btn-container">
              <q-btn data-route="/mini-test-8-3" unelevated class="start-btn">
                Answer
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
    ]


    // --- KaTeX Rendering ---
    const processPageWithKaTeX = (pageContent) => {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = pageContent
      renderMathInElement(tempDiv, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        errorCallback: (err, msg) => console.warn('KaTeX error:', err, msg)
      })
      return tempDiv.innerHTML
    }

    const processAllPages = () => {
      renderedPages.value = rawPages.map(page => processPageWithKaTeX(page))
    }

    const getPageContent = (pageIndex) => {
      if (renderedPages.value[pageIndex]) return renderedPages.value[pageIndex]
      if (rawPages[pageIndex]) {
        const processed = processPageWithKaTeX(rawPages[pageIndex])
        renderedPages.value[pageIndex] = processed
        return processed
      }
      return ''
    }

    // --- TTS Composable ---
    const { isPlaying, textToRead, toggleAudio, stopSpeaking } = useTTSLesson(rawPages)
    const onToggleAudio = async () => {
      await toggleAudio(currentPage.value)  // <-- uses toggleAudio
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
      const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
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
      bookmarkedPages.value.some(b => b.route === (route.name || route.path) && b.page === currentPage.value)
    )

    // --- Progress & Navigation ---
    const updateProgress = () => {
      progress.value = (currentPage.value + 1) / rawPages.length
    }

    const nextPage = () => {
      if (isPlaying.value) stopSpeaking()
      if (currentPage.value < renderedPages.value.length - 1) {
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

    // --- Lesson Completion ---
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

    // --- KaTeX Re-render after page transition ---
    const onTransitionComplete = () => {
      nextTick(() => {
        const viewerContent = viewerRef.value?.querySelector('div')
        if (viewerContent) {
          renderMathInElement(viewerContent, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false,
            errorCallback: (err, msg) => console.warn('KaTeX error:', err, msg)
          })
        }
      })
    }

    // --- URL Sync ---
    watch(currentPage, (newPage) => {
      router.replace({ path: route.path, query: { page: newPage } })
    })

    // --- Lifecycle ---
    onMounted(() => {
      if (!route.query._reloaded) {
        router.replace({ path: route.path, query: { ...route.query, _reloaded: '1' } })
          .then(() => window.location.reload())
        return
      }

      processAllPages()
      currentUser.value = getCurrentUser()
      bookmarkedPages.value = loadBookmarks()
      updateProgress()

      const pageFromQuery = parseInt(route.query.page, 10)
      if (!isNaN(pageFromQuery) && pageFromQuery < rawPages.length) currentPage.value = pageFromQuery

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

      viewerRef.value?.addEventListener('click', (e) => {
        const target = e.target.closest('[data-route]')
        if (target) router.push(target.dataset.route)
      })
    })

    onUnmounted(() => {
      stopSpeaking()
      speechSynthesis.cancel()
      audioManager.restoreBg()
    })

    return {
      currentPage,
      isPlaying,
      textToRead,
      pages: rawPages,
      showLessonComplete,
      bookmarkedPages,
      progress,
      isBookmarked,
      finishButtonStyle,
      toggleAudio,
      onToggleAudio,
      nextPage,
      prevPage,
      goBack,
      toggleBookmark,
      startConfetti,
      stopConfetti,
      currentUser,
      isLessonComplete,
      markLessonComplete,
      viewerRef,
      onTransitionComplete,
      getPageContent
    }
  }
}
</script>

<style src="src/css/lessonBackground.css"></style>

<!-- Scoped Styles -->
<style src="src/css/lesson.css" scoped></style>
