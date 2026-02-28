<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 2: Measurements and Data Organization in Science</div>
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
    const lessonId = lesson ? String(lesson.id) : "2"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      // Card 1
      `
      <div>
        
        <div class="header">
          <div class="banner">
        <img src="assets/img/chapter 1/measurements-title.png" alt="measurements">
        <p style="display: none;">Measurements and Data Organization In Science</p>
      </div>
          <div class="subtitle">Scientific investigations involve observing and collecting information or data an organizing them for easy interpretation and analysis the data can be qualitative or quantitative qualitative data are descriptive information about the qualities or characteristics of an object or any subject of the study they do not have numerical values quantitative data such as measurements contain numbers</div>
          </div>
        </div>
      </div>
      </div>
      `,

      // Card 2
      `
      <div>
        <div class="header">
          <div>
            <div class="title">Measurements</div>
          </div>
        </div>

          <p>
            Correct expression of measurements makes scientific results reliable and reproducible. It
is therefore important to recall some basic knowledge about measurements.
          </p>
        </div>

        <p>
            Measurements are quantitative observations that consist of a number and a unit. They
are usually described as accurate or precise. Accuracy is the nearness of agreement between
a measured value and a true or accepted value. It is usually related to precision, which refers
to how close individual measurements are with each other. Since errors may happen during
measuring, inaccuracies in measurements may arise, leading to a deviation from the true
value.
        </p>
      </div>
      `,

      // Card 3
      `
      <div>
        <p>
            The units of measure give meaning to numerical values. The two common systems
of measurement are the English system and the metric system. The English system is used in
the United States and in few other countries, while most countries adopt the metric systerm
Examples of English system units are inch, foot (plural: feet), and mile for length; and ounce
and gallon for volume. In the metric system, the commonly used units are meter for length
and liter for volume.
        </p>
        <div class="illustration">
          <img src="assets/img/chapter 1/system units.png" alt="SI Base Units">
          <div class="caption">English and Metric Systems</div>
        </div>
        </div>
        
      `,

      // Card 4
      `
      <div>
        <p>
            In 1960, the General Conference on Weights and Measures established the International
System of Units, abbreviated as SI. This system is an updated version of the metric system and
is continuously modified based on new findings in science and technology. The base units of
Sl are listed in table 1-1.
        </p>
        <div class="illustration">
          <img src="assets/img/chapter 1/The SI Base Units.png" alt="SI Base Units">
          <div class="caption">The SI Base Units</div>
        </div>
      </div>
      `,

      // Card 5
      `
      <div>
        <p>The SI uses prefixes with equivalent multipliers or factors , which are helpful when expressing very small or very large measurements . These are fractions or multiples of a base unit . For example , mass can be reported in units of gram ( g ) , kilogram ( kg ) , or milligram ( mg ) . A kilogram is equivalent to 1000 ( 10 ) grams , while a milligram is 0.001 ( or 10³ ) of a gram . The common prefixes with their symbols and equivalent multipliers are given in table 1-2 .</p>
        <div class="illustration">
          <img src="assets/img/chapter 1/Common Prefixes in SI.png">
          <div class="caption">Table 1-2. Common Prefixes in SI</div>
        </div>
      </div>
      `,

      // Card 6
      `
      <div>
        <p>In science , the most common measurements used are length , mass , volume , and temperature . Length is the distance between two points and can be expressed in its SI unit meter . Hoawever , when dealing with small quantities , using the unit centimeter ( cm ) or millimeter ( mm ) is more convenient.</p>
        <p> Mass is the quantity of matter in an object . It is often used interchangeably with weight , but the two are different concepts . Mass is a constant value , while weight , which is the force that gravity exerts on an object , varies on location .</p>
        <div class="illustration">
          <img src="assets/img/chapter 1/Science Measurements.png">
          <div class="caption">Science Measurements</div>
        </div>

        
      </div>
      `,

      // Card 7
      `
      <div>
        <p>
          Volume is the amount of space occupied by matter . It can be computed from other measurements such as the length , width , and height . As a derived quantity , it is usually expressed in terms of the unit for length . Hence , the standard SI unit for volume is the cubic meter ( m³ ) . Another commonly used unit is the cubic centimeter ( cm³ ) , abbreviated as cc . For liquids , volume measurement is usually expressed in liters ( L ) or milliliters ( mL ) .
        </p>

        <div class="illustration">
          <img src="assets/img/chapter 1/Volume.png">
          <div class="caption">Volumes</div>
        </div>
      </div>
      `,

      // Card 8
      `
      <div>
        <p>
Temperature is a measure of how hot or cold a body is. It is usually measured using a
thermometer and is commonly expressed in degrees Celsius (°C), degrees Fahrenheit (°F),
and kelvin (K). Figure 1-3 illustrates how the three temperature scales are related.
        </p>
          <div class="illustration">
          <img src="assets/img/chapter 1/Temperature Scales.png">
          <div class="caption">Figure 1-3 The three main temperature scales are the Kelvin and Celsius, and Fahrenheit scales.</div>
        </div>

      </div>
      `,

      // Card 9
      `
      <div>
        <div class="header">
          <div>
            <div class="title">Converting Units of Measurements</div>
          </div>
        </div>

        <p>Measurements can be converted from one unit to another
through the factor-label method, or dimensional analysis. This
method may require one or more conversion factors to convert a
given unit into the desired unit. It works as follows:</p>
      </div>
      <div class="illustration">
        <img src="assets/img/chapter 1/factor-label-method.png" alt="Placeholder">
        <div class="caption">Factor-label method, or dimensional analysis</div>
      </div>
    </div>
    `,
      `
    <div>
       <p>The second term in the equation, called the conversion factor, is a standard equivalence 
of two units. For example, one kilogram is equivalent to 2.205 pounds. Such a factor must
be written correctly to avoid errors during conversion. Its denominator should bear the unit
similar to the given quantity, and the numerator should bear the desired unit. An application
of this is shown in Examples 1-1.</p>
      <p>For temperatures, converting measurements from one unit
to another applies the following derived relationships among the
three scales. Tf, Tc, and Tk are the temperatures expressed in degree
Fahrenheit, degree Celsius, and kelvin, respectively.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/fahrenheit-celsius-kelvin.png" alt="Placeholder">
      </div>
    </div>
    `,
      `
    <div>
      <div class="header">
        <span class="lesson-pill">Examples 1-1</span>
        <div></div>
      </div>
      <p>1. Convert 100.0 pounds to kilograms.</p>
      <p><i>Given:</i> mass = 100.0 lb</p>
      <p><i>Find:</i> mass in kg</p>
      <p><i>Solution:</i></p>
      <div class="illustration">
        <img src="assets/img/chapter 1/example-1.png" alt="Placeholder">
        <p>The unit lb (pound) cancels out, leaving the desired unit, the kg.</p>
      </div>
      <p>2. The normal human body temperature is 37°C. What is this temperature in degrees Fahrenheit?</p>
      <p><i>Given:</i> T<sub>c</sub> = 37°C</p>
      <p><i>Find:</i> temperature in degrees Fahrenheit (°F)</p>
      <p><i>Solution:</i></p>
      <div class="illustration">
        <img src="assets/img/chapter 1/example-2.png" alt="Placeholder">
      </div>
      <p>Thus, 37°C is equal to 98.6°F</p>
      <p>3. A household consumed 12 m³ of water in the past month. How many liters of water did they consume?</p>
      <p><i>Given:</i> volume = 12 m³</p>
      <p><i>Find:</i> volume in L</p>
      <p><i>Solution:</i></p>
      <div class="illustration">
        <img src="assets/img/chapter 1/example-3.png" alt="Placeholder">
        </div>
    </div>
    `,
      `
    <div>
      <div class="info-card">
  <div class="info-title">MINI TEST 1-2</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> What is your mass in kg? Convert it to pounds</p>
        <p><strong>2.</strong> What is your height in feet? Convert it to meters</p>
        <p><strong>3.</strong> The optimum temperature in storing ice cream is between -20°F and -10°F. (a) What is this temperature in range in Celsius? (b) How about kelvin?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-1-2" unelevated class="start-btn">
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
      <div class="header">
          <div>
            <div class="title">Organizing Scientific Data</div>
          </div>
        </div>
      
        <p>In science, several tools are used in recording and organizing observations, including
measurements, during an experiment. The commonly used tools are data tables and graphs.</p>
        <p>Data tables contain rows for observations or
data points, and columns for variables or categories.
An example is a data table of an experiment in
which the position of an object is measured per
second (figure 1-4). Notice that the columns are the
categories, while the rows are the observations or
data points. If another value for time will be added,
you will add another row. If you want to add another category, you will add another column.</p>
      </div>
        <table border="1" style="width:100%; text-align:center;">
  <tr>
    <th>Time (s)</th>
    <th>Position (m)</th>
  </tr>
  <tr>
    <td>0</td>
    <td>0</td>
  </tr>
  <tr>
    <td>1</td>
    <td>3</td>
  </tr>
  <tr>
    <td>2</td>
    <td>9</td>
  </tr>
  <tr>
    <td>3</td>
    <td>9</td>
  </tr>
  <tr>
    <td>4</td>
    <td>12</td>
  </tr>
  <tr>
    <td>5</td>
    <td>15</td>
  </tr>
</table>

        <p>Figure 1-4. Data table on time versus position</p>
    </div>
    `,
      `
    <div>
      <p>Graphs are pictorial representations of data. They allow for easy comparison of trends
and values. The most common types of graph are the bar graph, pie graph, line graph, and
scatter graph.</p>
      <p>Bar graphs are used to compare data with the use of bars. Each bar corresponds to a
category or variable. The height of each bar represents the magnitude for the category or
variable.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure-1-5.png" alt="Placeholder">
        <div class="caption">Figure 1-5. A bar graph showing the average long-jump distance achieved by different groups</div>
      </div>
    </div>
    `,
      `
    <div>
      <p>Pie graphs are used to show the relative magnitude of data compared to the whole. This
means they present percentages. A pie graph is divided into slices, with the size of each slice
proportional to the percentage of the data it represents.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure-1-6.png" alt="Placeholder">
        <div class="caption">Figure 1-6. A pie graph showing the percentages of students who achieved certain range of long-jump distances</div>
      </div>
    </div>
    `,
      `
    <div>
      <p>Line graphs are used to show how one variable changes over time. In a line graph, time
is plotted in the horizontal axis, while the values of the variable being observed is plotted in
the horizontal axis.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure-1-7.png" alt="Placeholder">
        <div class="caption">Figure 1-7. A line graph of the long-jump distances achieved by a student in five months</div>
      </div>
    </div>
    `,
      `
    <div>
      <p>Scatter graphs are used to show the relationship of one variable to another variable. These
graphs are composed of a horizontal axis and a vertical axis, with data points that may be
connected by a line. One variable is plotted along the horizontal axis, while another variable
is plotted along the vertical axis.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1/figure-1-8.png" alt="Placeholder">
        <div class="caption">Figure 1-8. A scatter graph showing the long-jump distances achieved with different exercise times.</div>
      </div>
      <p>Scatter graphs can also be used to show how one variable changes with respect to another
variable. In this case, the variable that is being changed is plotted along the horizontal axis
while the variable that changes based on the changes of the first variable is plotted along the
vertical axis.</p>
      <p>The line in the graph, called the best-fit line or trend line, shows the linear relationship
between the two variables. In figure 1-8, you can see that, except for the last data point, all shew
that long-jump distance is directly related to the duration of exercise. The last data point is
called an outlier. Outliers in a scatter graph are data points that do not follow the general trend
of the data in the graph. They can be taken as an abnormality and treated as an erroneous data
or can be analyzed by the experimenter to infer conclusions about the set of data points. You
will learn more about this in your higher science courses.</p>
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
      /* Reload Fix */ /* Reload Fix */

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
