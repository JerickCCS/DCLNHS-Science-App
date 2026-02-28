<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 2: The Particle Nature of the Three States of Matter</div>
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
    const lessonId = lesson ? String(lesson.id) : "10"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
    <div>
        <div class="header">
            <div class="title">The Particle Nature of the Three States of Matter</div>
        </div>
        <p><strong>How do the three states of matter compare in terms of the arrangement and behavior of their particles?</strong></p>
        <p>Understanding the basic principles of the particle nature of matter helps in visualizing the three states of matter at the microscopic level. Take a look at Figure 2-3.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-3.png" alt="figure 2-3">
            <div class="caption">Figure 2-3. The particles of solid, liquid, and gas are arranged differently.</div>
        </div>
        <p>Solids have a definite shape and volume and a rigid structure. There is very minimal space between their particles, which are held together by strong attractive forces. Since their particles are closely packed and arranged, solids are highly dense, thus restricting their movement to just vibrating in place. Moreover, the small interparticle distance in solids means that they are generally incompressible.</p>
    </div>
    `,
      `
    <div>
        <p>In contrast, liquids have particles that are farther apart than those in solids; thus, they are less dense than solids. The forces of attraction between liquid particles are weaker than those between solid particles. The liquid particles are free to slide past one another, allowing liquids to flow freely and assume the shape of their container. In other words, liquids have a definite volume. The looser arrangement of particles means that liquids are slightly compressible--that is, they can be made to come closer together by applying pressure.</p>
        <p>The particles of gases are weakly attracted to one another and are quite far apart; this makes gases highly compressible and the least dense among the three states of matter. The particles of gases move freely and randomly around a container. Moreover, gases can easily expand and fill any available space. Thus, they have no definite shape and volume.</p>
    </div>
    `,
      `
    <div>
        <p>Table 2-1 summarizes the properties of the three states of matter explained in terms of the basic principles of the particle nature of matter.</p>
        <p><strong>Table 2-1 Properties of the Three States of Matter</strong></p>
        <div style="overflow-x: auto;">
  <table border="1" style="width: 900px; min-width: 100%; border-collapse: collapse; table-layout: fixed; text-align: left; font-family: Arial, sans-serif; border: 2px solid #333;">
      <thead>
          <tr style="background: linear-gradient(to right, #4facfe, #00f2fe); color: white;">
              <th style="padding: 12px; width: 150px;">State</th>
              <th style="padding: 12px; width: 240px;">Arrangement of Particles</th>
              <th style="padding: 12px; width: 240px;">Movement of Particles</th>
              <th style="padding: 12px; width: 300px;">Observed Properties</th>
          </tr>
      </thead>
      <tbody>
          <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;">
                  <img src="assets/img/chapter 2/solid.png" alt="Solid" style="width: 30px; vertical-align: middle; margin-right: 5px;">
                  Solid
              </td>
              <td style="padding: 10px;">Closely packed and orderly arranged</td>
              <td style="padding: 10px;">Vibrate in their fixed positions</td>
              <td style="padding: 10px;">Has definite shape and volume; high density; incompressible</td>
          </tr>
          <tr style="background-color: #ffffff;">
              <td style="padding: 10px;">
                  <img src="assets/img/chapter 2/liquid.png" alt="Liquid" style="width: 30px; vertical-align: middle; margin-right: 5px;">
                  Liquid
              </td>
              <td style="padding: 10px;">Closer together than in gases; no regular or rigid arrangement</td>
              <td style="padding: 10px;">Slide past one another</td>
              <td style="padding: 10px;">Assumes the shape of its container and has a definite volume; lower density than solids; generally incompressible</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;">
                  <img src="assets/img/chapter 2/gas.png" alt="Gas" style="width: 30px; vertical-align: middle; margin-right: 5px;">
                  Gas
              </td>
              <td style="padding: 10px;">Far apart</td>
              <td style="padding: 10px;">Move very quickly and randomly</td>
              <td style="padding: 10px;">No definite shape and volume; lowest density among the three states; highly compressible</td>
          </tr>
      </tbody>
  </table>
</div>
    </div>
    `,
      `
    <div>
        <p>The forces of attraction between particles of matter tend to pull them together, while the random movement of the particles tends to spread them apart. Which factors determine whether matter is in a solid, liquid, or gaseous state?</p>
        <p>Moving particles possess motion energy. When the motion energy is low, the force of attraction between the particles is much stronger than the forces pulling them apart. In this case, matter exists as a solid. The particles of a solid vibrate in their fixed positions.</p>
        <p>When the particles of matter have moderate motion energy, the force of attraction between the particles is just enough to keep them close but not constrained in fixed positions. This is true in liquids.</p>
    </div>
    `,
      `
    <div>
        <p>The gas particles have high motion energy that is much greater than the forces of attraction between them. Thus, these particles are much farther apart and spread easily and randomly into any available space.</p>
        <p>Particles of matter that are in constant motion possess motion energy, which is measured in terms of temperature. When matter is heated, the motion energy of its particles increases, and the forces of attraction between them are reduced.</p>
    </div>
    `,
      `
    <div>
        <p>Let us consider a typical example-water (Figure 2-4). Water below 0°C is solid ice. When heated, say up to 30°C, its particles will have higher motion energy and weaker forces of attraction between them. Thus, the particles move faster and begin to slide past one another, becoming liquid in a process called melting. Heating liquid water, say up to 100°C, further increases its particles' motion energy and decreases the strength of their attractive forces. Thus, the particles move even faster and farther away from one another, becoming water vapor in a process called evaporation. Note: Motion energy, termed as kinetic energy, will be introduced in your Grade 8 science.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-4.png" alt="figure 2-4">
            <div class="caption">Figure 2-4. The state of matter changes with a change in the behavior and arrangement of water particles during heating and cooling</div>
        </div>
    </div>
    `,
      `
    <div>
        <p>In contrast, when heat from matter is removed (i.e., cooling), the motion energy of the particles decreases, causing the particles to move slowly. Thus, attractive forces dominate and bring the particles closer together. As water changes from gas to liquid (condensation) then to solid (freezing), its particles move closer together and become more orderly. Try to describe the particles of a substance that undergoes sublimation (solid to gas) and deposition (gas to solid).</p>
    </div>
    `,
      `
    <div>
        <div class="info-card">
            <div class="info-title">MINI TEST 2-3</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p><strong>1.</strong> If a solid substance in a container is heated, what will be the arrangement of its particles when the substance melts and becomes liquid? Choose from the figures below (labeled A to C) and explain your choice.</p>
                        <p><strong>2.</strong> If the melted substance in item 1 is heated continuously until it comes to a boil, what will be the arrangement of the particles as the substance becomes gas?</p>
                    </div>
                    <div class="mini-right">
                        <img src="assets/img/chapter 2/abc.png" alt="Particle arrangements for solid, liquid, and gas states">
                    </div>
                    <div class="start-btn-container">
                        <q-btn data-route="/mini-test-2-3" unelevated class="start-btn">
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
        <div class="title">The Particle Nature of Pure Substances and Mixtures</div>
        <p>Matter can be classified into pure substances and mixtures. Pure substances are further classified into elements and compounds. An element is considered the simplest substance because it contains only one kind of atom, which is the basic particle of matter. A compound is made up of atoms of two or more elements that are chemically combined. These descriptions suggest that an element and a compound differ in terms of the kind of particle units (eg. isolated atoms, cluster of atoms) they have. Mixtures are composed of two or more pure substances that are physically combined.</p>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-5.png" alt="figure 2-5">
            <div class="caption">Figure 2-5. Particle drawings of (A) an element X, (B) an element Y, (C) a compound formed from elements X and Y, and (D) a mixture of elements X and Y</div>
        </div>
    </div>
    `,
      `
    <div>
        <p>Visual representations of the main classifications of matter are shown in Figure 2-5. How will you describe the compound formed from elements X and Y, as shown in Figure 2-5(C? What about the mixture of elements X and Y shown in Figure 2-5(D)?</p>
        <p>The particles of elements, compounds, and mixtures can be distinguished from on another using particle drawings such as those in Figure 2-5. These models provide concrete visual representations of particles of matter that are too small to be seen by the naked eye. Each sphere in the models represents an atom.</p>
    </div>
    `,
      `
    <div>
        <p>Figure 2-5(A) and (B), with only one type of atom, represent an element. Figure 2-5(C), however, illustrates two attached dissimilar atoms. It therefore represents a compound with two chemically combined atoms. In figure 2-5(D), the two atoms combined physically represent a mixture.</p>
        <p>These particle drawings can also be used to show state changes. For example, the changes in the state of water can be represented using the cluster of atoms that make up water. Each cluster of atoms, called a molecule, has two hydrogen atoms and one oxygen atom. Figure 2-6 shows these state changes. However, unlike other substances, water expands when it freezes because of the special force of attraction between its particles. This is a unique property of water, which you will explore later in your higher chemistry courses.</p>
    </div>
    `,
      `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 2/figure 2-6.png" alt="figure 2-6">
            <div class="caption">Figure 2-6. Water molecules during state changes</div>
        </div>
    </div>
    `,
      `
    <div>
        <div class="info-card">
            <div class="info-title">MINI TEST 2-4</div>
            <div class="info-content">
                <div class="info-text">
                    <div class="mini-questions">
                        <p>A carbon dioxide molecule is composed of one carbon atom and two oxygen atoms. Draw the arrangement and motion of carbon dioxide molecules during sublimation.</p>
                    </div>
                    <div class="start-btn-container">
                        <q-btn data-route="/mini-test-2-4" unelevated class="start-btn">
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
