<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
        <q-toolbar-title class="navbar-title">Lesson 2: Uniform Motion</q-toolbar-title>
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2">{{ currentPage + 1 }} / {{ pages.length }}</div>
          <q-btn flat dense round :icon="isBookmarked ? 'bookmark' : 'bookmark_border'" color="yellow"
            @click="toggleBookmark" />
        </div>
      </q-toolbar>
      <q-linear-progress :value="progress" size="4px" color="primary" class="header-progress" />
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

            <!-- <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div> -->

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
    const lessonId = lesson ? String(lesson.id) : "57"

    // bookmarks
    const bookmarkedPages = ref([])

    // raw lesson pages
    const rawPages = [
      `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <span class="lesson-pill">Lesson 2</span>
        <div>
          <div class="title">Uniform Motion</div>
        </div>
      </div>
      <p>An object has uniform motion if it moves at a constant velocity. The only formula you need in solving a problem with uniform motion is</p>
      <p>\\( v = \\frac{d}{t} \\)</p>
      <p>If there are only three physical quantities, you can use the triangle technique to solve for the different unknowns. By just covering the unknown quantity, you can get the formula using the triangle technique.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 2 -->
      <div class="illustration">
        <img src="assets/images/triangle_technique.jpg" alt="Triangle technique diagram showing v = d/t with covering method">
        <div class="caption">Triangle technique for solving uniform motion problems</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 3 -->
      <p>Solving for the distance, \\( d = vt \\).</p>
      <p>Solving for the time, \\( t = \\frac{d}{v} \\).</p>
      <p>However, the triangle technique is not applicable when dealing with more than three quantities; instead, the derivation of the formula should be done. To derive the distance formula, you should multiply both sides of the equation by time. Whatever is done on one side of the equation should be done on the other side. This method can provide a deeper understanding and flexibility in solving problems even with more than three quantities.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 4 -->
      <p>\\( v = \\frac{d}{t} \\)</p>
      <p>\\( t(v) = \\left( \\frac{d}{t} \\right) t \\)</p>
      <p>\\( d = vt \\)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 5: SCIENCE CAREER -->
      <div class="info-card">
        <div class="info-title">SCIENCE CAREER</div>
        <div class="info-content">
          <div class="info-text">
            <p>The work of an automotive engineer involves designing and improving the performance of vehicles. One of the duties and responsibilities of automotive engineers is assessing the performance and safety of vehicles through conducting rigorous testing and simulations. This profession also utilizes technical software and equipment to assess the vehicle dynamics, fuel efficiency, and emissions. To improve and optimize a vehicle's design and performance, automotive engineers evaluate emerging technologies, such as Advanced Driver Assistance System (ADAS), autonomous driving systems, and electric vehicles integrated into its design.</p>
          </div>
        </div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 6: Visual Representation of Motion -->
      <div class="header">
        <span class="lesson-pill">Visual Representation</span>
        <div>
          <div class="title">Visual Representation of Motion</div>
        </div>
      </div>
      <p>Motion experiments often employ tape charts to help us discern the nature of movement. These charts can reveal outcomes that align with specific scenarios.</p>
      <p><strong>Case I: Constant Velocity</strong></p>
      <div class="illustration">
        <img src="assets/images/constant_velocity.jpg" alt="Tape chart showing constant velocity motion">
        <div class="caption">Constant velocity - equal displacements in equal time intervals</div>
      </div>
      <p>In this case, the car maintains a constant rightward velocity. During equal time intervals, the race car covers the same displacement, which indicates that it moves at constant velocity.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 7: Case II -->
      <p><strong>Case II: Uniformly Increasing Velocity</strong></p>
      <div class="illustration">
        <img src="assets/images/increasing_velocity.jpg" alt="Tape chart showing uniformly increasing velocity">
        <div class="caption">Uniformly increasing velocity - progressively larger displacements</div>
      </div>
      <p>Here, the car moves to the right while its velocity steadily increases. Over equal time intervals, the race car covers progressively larger displacements. This pattern indicates that the car's velocity is rising uniformly rightward.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 8: Case III -->
      <p><strong>Case III: Uniformly Decreasing Velocity</strong></p>
      <div class="illustration">
        <img src="assets/images/decreasing_velocity.jpg" alt="Tape chart showing uniformly decreasing velocity">
        <div class="caption">Uniformly decreasing velocity - progressively smaller displacements</div>
      </div>
      <p>For an equal time interval, decreasing displacement was covered by the car. This indicates that the car is slowing down. The final velocity is lower than the initial velocity.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 9: Graphical Analysis of Motion -->
      <div class="header">
        <span class="lesson-pill">Graphical Analysis</span>
        <div>
          <div class="title">Graphical Analysis of Motion</div>
        </div>
      </div>
      <p>If a bicycle has a velocity of 4 m/s, it means that it travels 4 m every second. From its initial position (0 m) at 0 s, it reaches the 8 m position after 2 s and the 12 m position after 3 s. The bicycle covers equal distances within the same lengths of time. Thus, its velocity is uniform, or constant. A constant-velocity motion is described as uniform motion.</p>
      <div class="illustration">
        <img src="assets/images/table_8_1.jpg" alt="Table 8-1 showing positions of bicycle at different times">
        <div class="caption">Table 8-1. Positions of a Bicycle at Different Times</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 10 -->
      <p>Motion can be represented through graphs. If the positions of the bicycle from its point of origin (table 8-1) are plotted against time, how does the graph look?</p>
      <div class="illustration">
        <img src="assets/images/figure_8_2.jpg" alt="Position-time graph based on data in table 8-1">
        <div class="caption">Figure 8-2. Position-time graph based on data in table 8-1</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 11 -->
      <p>Understanding motion graphs becomes much clearer when you think about "slope." Slope (\\( m \\)) means how much you go up or down (rise) compared to how much you go left or right (run). The quantities in the \\( y \\)- and \\( x \\)-axes represent the rise and run, respectively. You can easily determine the velocity using the concept of the slope.</p>
      <p>A line's slope can be positive (sloping upward), negative (sloping downward), zero (horizontal), or undefined (vertical). The steeper the line, the greater the slope. When the line is curved, the slope is not always the same because the steepness of the curve changes. In symbols,</p>
      <p>\\( m = \\frac{\\text{rise}}{\\text{run}} \\)</p>
      <p>\\( m = \\frac{\\Delta y}{\\Delta x} \\)</p>
      <p>\\( m = \\frac{y_2 - y_1}{x_2 - x_1} \\)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 12 -->
      <p>The nature of motion can be discerned by considering the concept of slope. Going back to the previous situation of the bicycle, the slope of the position-time graph represents the velocity.</p>
      <p>\\( \\text{slope} = \\frac{\\text{change in position}}{\\text{change in time}} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_2 - x_1}{t_2 - t_1} \\)</p>
      <p>From figure 8-2, the slope of the line (from \\( t_1 = 1 \\) s to \\( t_2 = 2 \\) s) is</p>
      <p>\\( \\text{slope} = \\frac{8\\ \\text{m} - 4\\ \\text{m}}{2\\ \\text{s} - 1\\ \\text{s}} = \\frac{4\\ \\text{m}}{1\\ \\text{s}} = 4\\ \\text{m/s} \\)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 13 -->
      <p>Using another pair of points (from \\( t_1 = 2 \\) s to \\( t_2 = 5 \\) s), the slope is</p>
      <p>\\( \\text{slope} = \\frac{20\\ \\text{m} - 8\\ \\text{m}}{5\\ \\text{s} - 2\\ \\text{s}} = \\frac{12\\ \\text{m}}{3\\ \\text{s}} = 4\\ \\text{m/s} \\)</p>
      <p>For another pair of points (from \\( t_1 = 3 \\) s to \\( t_2 = 6 \\) s), the slope is</p>
      <p>\\( \\text{slope} = \\frac{24\\ \\text{m} - 12\\ \\text{m}}{6\\ \\text{s} - 3\\ \\text{s}} = \\frac{12\\ \\text{m}}{3\\ \\text{s}} = 4\\ \\text{m/s} \\)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 14 -->
      <p>Notice that the slope is constant for each pair of points, and this verifies that the velocity is constant.</p>
      <p>Observe the graphs in table 8-2. Can you describe these graphs? Which of these graphs shows uniform motion? stationary? increasing velocity? moving in the negative direction?</p>
      <p>We can describe each graph by knowing the independent and dependent variables. The independent and dependent variables are plotted in the \\( x \\)- and \\( y \\)-axes, respectively. In a position-time graph, the independent variable is the time, while the position or displacement is the dependent variable.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 15 -->
      <div class="illustration">
        <img src="assets/images/position_time_graphs.jpg" alt="Various position-time graphs showing different types of motion">
        <div class="caption">Table 8-2. Descriptions of Different Position-Time Graphs with Examples</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 16 -->
      <div class="header">
        <span class="lesson-pill">Lesson 2</span>
        <div>
          <div class="title">EXAMPLE 8-3</div>
        </div>
      </div>
      <p>Consider the displacement-time graph below. Determine the velocity of the object and describe its motion using the graph.</p>
      <div class="illustration">
        <img src="assets/images/example_8_3_graph.jpg" alt="Displacement-time graph showing linear motion">
        <div class="caption">Displacement-time graph for Example 8-3</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 17 -->
      <p><strong>Given:</strong> Data points: \\( (0\\ \\text{s}, 0\\ \\text{m}) \\) and \\( (4\\ \\text{s}, 40\\ \\text{m}) \\)</p>
      <p><strong>Find:</strong> \\( \\vec{v} = ? \\)</p>
      <p><strong>Solution:</strong></p>
      <p>\\( \\vec{v} = \\frac{\\Delta \\vec{d}}{\\Delta t} \\)</p>
      <p>\\( = \\frac{40\\ \\text{m} - 0\\ \\text{m}}{4\\ \\text{s} - 0\\ \\text{s}} \\)</p>
      <p>\\( = 10\\ \\text{m/s} \\)</p>
    </div>
    `,
      `
    <div>
      <!-- Card 18 -->
      <p><strong>Rationalization:</strong> Since the graph is a straight line sloping upward, the object moves at a constant velocity of 10 m/s or in uniform motion.</p>
      <div class="info-card">
        <div class="info-title">MINI TEST 8-4</div>
        <div class="info-content">
          <div class="info-text">
            <p>A motorcycle running along a straight path is at the 20 m position from its point of origin after 2 s. If it runs at a constant velocity, at what time will it reach the (a) 40 m, (b) 60 m, (c) 80 m, and (d) 100 m positions? Note that the positions are all from the point of origin and that the time being asked is from the moment the motorcycle passes its point of origin. (e) Draw a position-time graph of the motorcycle's motion.</p>
            <p>For your rationalization, determine the slope of the position-time graph and describe the motion of the motorcycle.</p>
            <div class="start-btn-container">
              <q-btn data-route="/mini-test-8-4" unelevated class="start-btn">
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
