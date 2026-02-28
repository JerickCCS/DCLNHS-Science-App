<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <div class="lesson-toolbar">
        <button class="toolbar-btn" @click="goBack">
          <q-icon name="arrow_back" size="24px" />
        </button>
        <div class="lesson-toolbar-title">Lesson 1: The Cellular Reproduction</div>
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
    const lessonId = lesson ? String(lesson.id) : "36"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">The Cellular Reproduction</div>
      </div>
      <p>Cell division is a very important process in an organism. It either makes an exact copy of a preexisting cell or an entirely different cell in terms of amount and variability of genetic material. Cells reproduce through two types of cell division: mitosis and meiosis. Mitosis produces identical cells that make growth and repair possible. Meiosis produces unique cells with half the normal number of genetic materials, and gives rise to sex cells or gametes that are involved in sexual reproduction. It is through meiosis and sexual reproduction that traits from the parents are passed on to their offspring.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 2 -->
      <div class="header">
        <div class="title">The Cell Cycle</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-1">
        <div class="caption">Figure 5-1. A sample 16-hour cell cycle of a typical body cell.</div>
      </div>
      <p>Once a cell is fully grown, it either stops growing or divides and produces more cells through cellular reproduction. In multicellular organisms, cellular reproduction gives the body the ability to grow and repair worn-out tissues. In unicellular organisms, on the other hand, cellular reproduction enables the production of identical copies of an individual organism.</p>
      <p>Cells follow a cycle of growth and division known as the cell cycle (figure 5-1). Every time a parent cell undergoes the cell cycle, it produces daughter cells. Therefore, the cell cycle always leads to an increased number of cells.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 3 -->
      <p>There are two main stages in the cell cycle: interphase and mitotic phase (M phase). The interphase stage is longer than the mitotic phase. In a 24-hour cell cycle, almost 23 hours is spent for interphase, and only an hour for cell division. The completion of the whole cycle varies depending on the cell type. Some cells complete the cycle within minutes; others after several hours or even years. In the human body, most cells divide every 12 to 24 hours.</p>
      <p>Cell division refers to the process in which a cell (parent cell) divides to produce more cells (daughter cells). The nucleus of a cell plays a central role in cell division. It contains the chromosomes, which are threadlike molecular structures that carry hereditary information contained in deoxyribonucleic acid (DNA). During the synthesis phase of interphase, these chromosomes are replicated so that each daughter cell will have the same number of chromosomes as the parent cell.</p>
      <p>Aside from the nucleus, the microtubules and microfilaments also play key roles in cell division. Microtubules form spindle fibers that pull the sister chromatids (identical chromatids that are formed through the replication of a chromosome during the interphase) apart. Microfilaments aid in the division of the cytoplasm and formation of cell membranes in the daughter cells.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">Interphase: Preparation for Cell Division</div>
      </div>
      <p>Scientists used to think that the interphase is simply a resting stage. Today, it is widely established that during interphase cells actively perform the majority of their functions. In addition, the materials needed for cell division are produced during this stage.</p>
      <p>The cell's chromosomes are in chromatin form during interphase. Chromatin is a thin fibrous form of DNA wound around proteins called histones. After interphase, the chromatin undergoes condensation, a process in which the chromatin becomes shorter and denser. Condensation is made possible by a protein complex called condensin, which is made of proteins that interact with one another. It triggers the tight coiling of the chromosomes into a pair of sister chromatids. Figure 5-2 shows an organizational diagram of the structure of a chromosome up to the DNA.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-2">
        <div class="caption">Figure 5-2. Diagram showing the structure of (a) chromosome, (b) condensed chromatin loops, (c) chromatin loops, (d) chromatin, (e) nucleosome, and (f) DNA double helix</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 5 -->
      <p>Interphase can be divided into three phases. The first phase is the first gap phase (G1 phase), which is the primary growth phase of the cell. It is also called the gap phase because it serves as the interval between cytokinesis and DNA synthesis. During the G1 phase, the cell grows and increases in size. Proteins are also synthesized and cell</p>
      <p>The second phase is the synthesis phase (S phase), in which the DNA of the cell, including the chromosomes, is replicated. Replication results in two identical structures called sister chromatids. Histones, a group of relatively small, basic proteins which form the core of the nucleosome, and other materials vital to the replication of chromosomes, are also formed during this phase. A nucleosome is a small, round structure consisting of a portion of DNA coiled around a cluster of histone protein molecules.</p>
      <p>The last phase is the second gap phase (G2 phase), which fills the gap between DNA synthesis. During the G2 phase, the cells synthesize organelles and other materials, many of which have specific roles in cell division.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 6 -->
      <div class="header">
        <div class="title">Cell Division</div>
      </div>
      <p>Most of the cells in the body are constantly being replaced because they are dividing. Bone cells make new bone cells, and skin cells make new skin cells. Even at this moment, thousands of cells throughout your body are being replaced by new ones.</p>
      <p>Depending on the type of cell, some divide very fast (e.g., skin cells and red blood cells), while others divide less often (e.g., nerve cells and brain cells). Some cells, once formed, do not divide at all. In muscle cells, the nucleus divides but the cytoplasm does not. Skeletal muscle cells increase in size but do not divide; the muscles you had when you were a baby are still the ones you have now, only bigger.</p>
      <p>Not all cells divide in the same manner because there are different cell types. Multicellular organisms are made up of two basic cell types: somatic cells and germ cells. Somatic cells are essentially every cell in the body, such as brain and skin cells, with the exception of the germ cells. They are diploid cells, which means they contain two sets of chromosomes (2n). Germ cells are cells that produce the male and female gametes (sperm and egg). The gametes are haploid cells which contain a single set of chromosomes (n). In humans, somatic cells contain 46 chromosomes (2n), while gametes have 23 chromosomes (n). Diploid cells are produced through mitosis, while haploid cells are produced through meiosis. In unicellular organisms, such as the Paramecium, cells divide through binary fission.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 7 -->
      <div class="header">
        <div class="title">Mitosis</div>
      </div>
      <p>Mitosis is a type of cell division in which two identical daughter cells are produced from a single parent cell. Mitosis involves four phases: prophase, metaphase, anaphase, and telophase. At the end of telophase, two diploid cells containing the same set of chromosomes from the parent cell are produced.</p>
      <p>Cytokinesis is the physical division of the cytoplasm of a parent cell into two. This process occurs concurrently with the latter stages of mitosis. In animal cells, cytokinesis involves the formation of a cleavage furrow, which pinches off or divides the cell into two. In plants, instead of being cleaved, a cell plate forms between the two new nuclei. The cell plate enlarges and elongates until it merges with the cell walls, and eventually forms a new cell wall. Figure 5-7 on page 100 compares cytokinesis in an animal cell and a plant cell.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 8 -->
      <div class="header">
        <div class="title">The Stages of Mitosis</div>
      </div>
      <p><strong>1. Prophase (2n=46) (figure 5-3)</strong></p>
      <p>The nucleolus disappears in the nucleus. This serves as a "starting signal."</p>
      <p>The nuclear membrane disintegrates.</p>
      <p>The chromatin fibers become more tightly coiled as they condense into discrete chromosomes.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 9 -->
      <p>Each chromosome appears as two identical sister chromatids joined at the centromere.</p>
      <p>In the cytoplasm, the spindle fibers begin to form. They are made of microtubules arranged between the two centrioles.</p>
      <p>The centrioles move away from each other, propelled by the lengthening bundles of microtubules between them.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-3">
        <div class="caption">Figure 5-3. Prophase</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 10 -->
      <p><strong>2. Metaphase (2n=46) (figure 5-4)</strong></p>
      <p>The centrioles are now at the opposite poles of the cell.</p>
      <p>The chromosomes gather at the metaphase plate, an imaginary plane that is equidistant from the two centrioles. The centromeres align with one another at the metaphase plate.</p>
      <p>Each sister chromatid faces the opposite poles of the cell. The kinetochore of identical chromatids is attached to the spindle fibers radiating from the opposite ends of the parent cell.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-4">
        <div class="caption">Figure 5-4. Metaphase</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 11 -->
      <p><strong>3. Anaphase (2n=46) (figure 5-5)</strong></p>
      <p>The once joined sister chromatids begin to move along the microtubules toward the opposite poles of the cell.</p>
      <p>The spindle fibers become shorter, pulling the chromosomes along with them.</p>
      <p>Each chromatid is now considered an individual chromosome.</p>
      <p>At the end of anaphase, the two poles of the cell have an equal set of chromosomes.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-5">
        <div class="caption">Figure 5-5. Anaphase</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 12 -->
      <p>4. Telophase (2n=46) (figure 5-6)</p>
      <p>Nuclear membranes start to re-form at the two poles of the cell where the chromosomes have gathered. The nuclear membranes are reconstructed from the fragments of the former nuclear membrane of the cell.</p>
      <p>The nucleoli reappear, and the chromatin fibers of each chromosome uncoil.</p>
      <p>The end of telophase marks the completion of the equal division of a nucleus into two genetically identical nuclei. This is called karyogenesis.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-6">
        <div class="caption">Figure 5-6. Telophase</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-7">
        <div class="caption">Figure 5-7. Cytokinesis in (a) an animal cell and (b) a plant cell</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 13 -->
      <div class="header">
        <div class="title">Meiosis</div>
      </div>
      <p>At the onset of life, a small region below the hindgut of the embryo serves as the location of the primordial germ cell. As an individual grows, the somatic cells of the embryo continuously divide through mitosis to form the body and its organs. These organs will remain dormant until the individual reaches puberty, when they will start to produce sex cells.</p>
      <p>When maternal and paternal chromosomes combine during fertilization, chromosomes with the same size and shape form pairs. These pairs are called homologous chromosomes or homologues, which have the same set of genes.</p>
      <p>Unlike mitosis, meiosis involves two cell divisions (meiosis I and meiosis II) and only one phase of DNA replication. The two cell divisions result in cells with a haploid number (n) of chromosomes. Note that in some species, a second interphase also occurs before meiosis II. However, DNA replication only occurs prior to meiosis I.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 14 -->
      <p>In meiosis, one parent cell produces four daughter cells. Because of crossing-over, each daughter cell is genetically unique. Crossing-over, as shown in figure 5-8, takes place during prophase I, where homologous chromosomes pair up and exchange genetic materials at the point of contact called the chiasma (pl. chiasmata).</p>
      <div class="illustration">
        <img src="assets/img" alt="">
        <div class="caption">Figure 5-8. Crossing-over of homologous chromosomes</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 15 -->
      <div class="header">
        <div class="title">The Stages of Meiosis I</div>
      </div>
      <p><strong>1. Prophase I (2n=46) (figure 5-9)</strong></p>
      <p>At the start of prophase I, the chromosomes, each composed of two sister chromatids, have already been duplicated. The chromosomes pair with their homologues in a process called synapsis. The paired homologues form a tetrad (since it is composed of four chromatids), cross over each other, and exchange genetic materials in a process called crossing-over.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-9">
        <div class="caption">Figure 5-9. Prophase I</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 16 -->
      <p><strong>2. Metaphase I (2n=46) (figure 5-10)</strong></p>
      <p>When spindle fibers are fully formed, the paired homologous chromosomes align at the metaphase plate, with the homologues facing the opposite poles.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-10">
        <div class="caption">Figure 5-10. Metaphase I</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 17 -->
      <p><strong>3. Anaphase I (2n=46) (figure 5-11)</strong></p>
      <p>Members of homologous pairs separate from each other and move toward opposite poles. The positioning of each pair of homologues at the metaphase plate and their subsequent direction of movement are random events. Their migration to the poles does not follow a specific pattern.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-11">
        <div class="caption">Figure 5-11. Anaphase I</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 18 -->
      <p><strong>4. Telophase I and Cytokinesis (n=23) (figure 5-12)</strong></p>
      <p>In this stage, two daughter cells are formed. Each daughter cell contains only one chromosome from each homologous pair. This means that each daughter cell contains only a haploid number of chromosomes. The result of telophase I is required for meiosis II.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-12">
        <div class="caption">Figure 5-12. Telophase I and cytokinesis</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 19 -->
      <div class="header">
        <div class="title">The Stages of Meiosis II</div>
      </div>
      <p><strong>1. Prophase II (n=23) (figure 5-13)</strong></p>
      <p>There is no DNA replication in this stage. The sister chromatids of each chromosome are still attached at the centromere.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-13">
        <div class="caption">Figure 5-13. Prophase II</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 20 -->
      <p><strong>2. Metaphase II (n=23) (figure 5-14)</strong></p>
      <p>Each chromosome aligns at the metaphase plate with the sister chromatids facing the opposite poles.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-14">
        <div class="caption">Figure 5-14. Metaphase II</div>
      </div>
      <p>3. Anaphase II (n=23) (figure 5-15)</p>
      <p>The sister chromatids of each chromosome in this stage separate and migrate toward opposite poles.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-15">
        <div class="caption">Figure 5-15. Anaphase II</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 21 -->
      <p><strong>4. Telophase II and Cytokinesis (n=23) (figure 5-16)</strong></p>
      <p>Cell division is completed in this stage. Four haploid cells are formed. After cytokinesis, each gamete has a haploid number of chromosomes.</p>
      <p>image</p>
      <p>Figure 5-16. Telophase II and cytokinesis</p>
    </div>
    `,
      `
    <div>
      <!-- Card 22 -->
      <div class="info-card">
  <div class="info-title">MINI TEST 5-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Make a list of the differences and similarities between mitosis and meiosis which may include phases, chromosome make-up and importance. Then, make an illustration that will visually present this information.</p>
        <p><strong>2.</strong> How is the genetic information passed on from parents to offspring through the process of meiosis? What are the implications of the importance of meiosis in organisms?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test-5-1" unelevated class="start-btn">
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
