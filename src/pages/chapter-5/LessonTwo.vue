<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
        <q-toolbar-title class="navbar-title">"Lesson 2: Perpetuation of Organisms</q-toolbar-title>
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
    const lessonId = lesson ? String(lesson.id) : "37"

    const bookmarkedPages = ref([])

    // --- Lesson pages ---
    const pages = ref([
      `
    <div>
      <!-- Card 1 -->
      <p>Lesson 2</p>
      <div class="header">
        <div class="title">Perpetuation of Organisms</div>
      </div>
      <p>During the process of reproduction, the determinants of inherited physical characteristics, the genes, are passed on from parent(s) to offspring. Prior to this, genes of the parent(s) are replicated, forming another set of genes for the offspring.</p>
      <p>There are two types of reproduction: asexual and sexual. In asexual reproduction, all have one characteristic in common-a set of genes coming from only one parent is passed on to the new individual, resulting in the offspring having traits that are exactly like those of the parent's.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 2 -->
      <p>In sexual reproduction, two parents-male and female- are needed to produce an offspring. The female provides the egg cell, while the male the sperm cell. Fertilization occurs when these two sex cells successfully unite. A zygote that has the genes of both parents is then formed. Therefore, unlike in asexual reproduction, the offspring in sexual reproduction are not identical to the parents.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div class="title">Asexual Reproduction</div>
      </div>
      <p>Asexual reproduction, as mentioned previously, is the type of reproduction that involves only one parent. The offspring will be exactly the same as the parent since only a single parent contributes to the type of traits the offspring will inherit. There is no genetic variation in asexual reproduction. Offsprings are clones of their parent.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">Asexual Reproduction in Simple Life-Forms</div>
      </div>
      <p><strong>Binary Fission</strong></p>
      <p>Binary fission is almost similar to mitosis, but occurs in a simpler way and at a faster rate in bacteria because they do not have a nucleus, numerous organelles, and a long and complicated genetic material. A bacterium replicates its circular DNA followed by cytokinesis to produce two similar daughter bacterial cells.</p>
      <p>Binary fission also happens in unicellular protists in three directions: longitudinal (Euglena), transverse (Paramecium), and irregular (Amoeba) as shown in figure 5-17.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 5 -->
      <p>Multiple fission is observed in parasitic protists. The process involves the multiple division of the parent nucleus into several daughter nuclei. This is followed by division of the cytoplasm into several units to enclose the daughter nuclei separately.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 5-17">
        <div class="caption">Figure 5-17. Binary fission in protists may be (a) longitudinal, (b) transverse, or (c) irregular.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 6 -->
      <p><strong>Budding</strong></p>
      <p>Budding is seen in yeast cells (figure 5-18). First, the parent's nucleus undergoes division. One of the daughter nuclei will be pushed to the perimeter of the cell. This will create a bud, as a constriction is formed between it and the vegetative structure of the parent yeast. When the bud separates from the parent yeast, it will start to develop into an adult.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-18">
        <div class="caption">Figure 5-18. Yeasts can reproduce through budding.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 7 -->
      <p><strong>Sporulation</strong></p>
      <p>Most fungi divide both sexually and asexually. Asexual reproduction happens through spore formation of the aerial hyphae of a fungus. The end of this hyphae will become swollen because of the dividing cells inside. These cells will develop into spores and the swollen tip of the hyphae will be the spore sac that encloses and protects the spores. Dispersal is through wind, water, or insect pollination. The growth of the spores happens when they land in a moist environment.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 8 -->
      <div class="header">
        <div class="title">Asexual Reproduction in Animals</div>
      </div>
      <p>In animals, the common types of asexual reproduction are regeneration, fragmentation, and budding. Through regeneration, an organism can regrow a part that has been injured or has fallen off as seen on figure 5-20. A new organism (of the same kind) may also grow from the detached body part. Some echinoderms, such as the sea star, reproduce through regeneration. Fragmentation occurs when the body of the parent breaks into distinct pieces, each of which can become an offspring. Planaria reproduces in this manner (figure 5-19).</p>
    </div>
    `,
      `
    <div>
      <!-- Card 9 -->
      <div class="illustration">
        <img src="assets/img" alt="figure 5-19">
        <div class="caption">Figure 5-19. Planaria reproduces through fragmentation.</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-20">
        <div class="caption">Figure 5-20. Sea stars reproduce through regeneration.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 10 -->
      <p>Budding in animals has two types: external and internal. In external budding, an offspring grows out of the body of the parent. Hydra exhibits this type of reproduction (figure 5-21). In internal budding, a parent releases a specialized mass of cells called gemmules that can develop into an offspring. Sponges exhibit this type of reproduction (figure 5-22).</p>
    </div>
    `,
      `
    <div>
      <!-- Card 11 -->
      <div class="illustration">
        <img src="assets/img" alt="figure 5-21">
        <div class="caption">Figure 5-21. Hydra reproduces through budding.</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="">
        <div class="caption">Figure 5-22. Sponges form gemmules through internal budding.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 12 -->
      <div class="header">
        <div class="title">Asexual Reproduction in Plants</div>
      </div>
      <p>Asexual reproduction in plants, or vegetative reproduction, produces offspring that are genetically identical to its single parent (sometimes referred to as parent clone). Plants reproduce asexually in a variety of ways through certain organs or parts, such as the stem or roots.</p>
      <p>Stolons, also known as runners, are horizontal stems from which the roots of new plants grow. Wild strawberry plants are connected by stolons (figure 5-23). Grasses have preformed roots at the nodes along the stem. As the stems bend over or break off and come in contact with the soil, the preformed roots penetrate the soil. They become new attachment sites for the plant.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 13 -->
      <p>Rhizomes are underground runners. They are modified stems specialized for reproduction and storage. New plants arise from rhizomes' nodes. Ginger reproduces in this manner (figure 5-24).</p>
      <p>Tubers, such as potatoes (figure 5-25), are underground storage stems from which new plants can grow.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 14 -->
      <p>Bulbs are underground storage units that divide, allowing plants to form new bulbs. Onion and garlic reproduce through bulbs (figure 5-26).</p>
      <p>Bulblet is a term coined for a unique form of asexual reproduction. In some types of garlic, bulblets form in the parent plant's stem in place of flower heads (figure 5-27).</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 1:1">
        <div class="caption">Figure 1:1 Picture of plants</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 15 -->
      <p>Parts of a plant may also form buds and grow into a new plant in a process called fragmentation. Fragmentation may also occur when a plant part that is not specialized for reproduction breaks off from the parent plant and grows into a new plant. Opuntia microdasys, or bunny ear cactus, has brittle stems and leaves. These often break off when animals walk by and brush against them. Any part of the broken-off stems or leaves touching the ground will form roots and grow into a new plant under appropriate conditions.</p>
      <p>Plantlets are miniature versions of a parent plant. These tissues may even develop roots while still attached to the parent plant. The leaves of Bryophyllum pinnatum, or the katakataka plant, and Kalanchoe daigremontiana, or the mother of thousands, reproduce through plantlets.</p>
      <p>Artificial vegetative reproduction is a type of human-induced plant asexual reproduction. One method of artificial vegetative reproduction uses stem cuttings. Try planting some stem cuttings of gumamela in a flowerpot. After some time, you will observe new roots growing at the base of the stem, and eventually, a new plant grows.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 16 -->
      <p>SCIENCE PIONEER</p>
      <p>Luther Burbank (1849-1926) is considered a pioneer in agricultural science. In the 1870s, he developed more than 800 new strains of fruits, vegetables, flowers, and grasses. Many of his hybrids, in particular, were important to the revolution in agriculture and food production in the 20th century. One of his earliest achievements was the Russet Burbank potato. Burbank developed this blight-resistant variant to prevent the decimation of potato crops, like what happened in Ireland in the late 1840s and early 1850s.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 17 -->
      <div class="info-card">
  <div class="info-title">MINI LAB 5-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Materials:</strong> potato or sweet potato, garlic clove, ginger, peperomia or mother of millions leaf, pots with loam soil, and trowel</p>
        <p><strong>Procedure:</strong> Place the potato, garlic clove, ginger, and peperomia or mother of millions leaf in a pot with loam soil. Water sparingly every day for one week. Observe what happens.</p>
        <p><strong>Guide Questions:</strong></p>
        <p><strong>1.</strong> Research what part of the new plant is a potato, a garlic clove, and a ginger.</p>
        <p><strong>2.</strong> After a week, what happens to the planted materials?</p>
        <p><strong>3.</strong> Where does the new plant come from?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-5-1" unelevated class="start-btn">
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
      <!-- Card 18 -->
      <div class="header">
        <div class="title">Sexual Reproduction</div>
      </div>
      <p>As mentioned earlier, sexual reproduction involves two parents that contribute genetic material to the offspring. One parent contributes the egg and the other parent the sperm. The sperm and the egg are produced through a meiotic cycle called spermatogenesis and oogenesis, respectively. Spermatogenesis happens in the male reproductive system, which produces four sperm cells from one parent spermatogonia. Oogenesis happens in the female reproductive system, which produces only one egg cell from one parent oogonia. Fertilization occurs when the egg cell is united with a sperm cell to form a zygote. Offsprings produced through sexual reproduction vary genetically.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 19 -->
      <div class="header">
        <div class="title">Sexual Reproduction in Animals</div>
      </div>
      <p>In most cases, the male gamete, or the spermatozoon, is relatively motile and usually has a flagellum. On the other hand, the female gamete or the ovum is nonmotile and relatively larger than the male gamete. When two haploid (n) gametes fuse through fertilization, they form a diploid (2n) cell called zygote.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 20 -->
      <div class="header">
        <div class="title">Sexual Reproduction in Plants</div>
      </div>
      <p>Plants may also reproduce sexually through their reproductive parts. These parts produce sex cells or gametes in the form of ovules and pollen grains.</p>
      <p>Observe flowers in a garden. What is their most attractive part? Generally, the petals are the most attractive of all flower parts. Petals attract insects and other pollinators through their colors and nectaries (glands that secrete nectars, a sweet liquid that serves as food to some insects). The insects and other pollinators that are attracted to the flowers then pollinate them.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 21 -->
      <p>Flowers are the reproductive organs that produce the egg and sperm cells in plants. Look at the illustration in figure 5-29 and examine the flower parts. The male reproductive organ is called the stamen, which is made up of two parts: the anther and filament. The anther produces pollen grains, which contain the sperm cell. The filament supports or holds the anther.</p>
      <div class="illustration">
        <img src="assets/img" alt="figure 5-29">
        <div class="caption">Figure 5-29. A perfect flower has both male and female reproductive parts.</div>
      </div>
    </div>
    `,
      `
    <div>
      <!-- Card 22 -->
      <p>The female reproductive organ is the pistil. The pistil is composed of the stigma, style, and ovary. The stigma is where the pollen grains land in a process called pollination. The style, which anchors the stigma, is where the sperm nuclei travel to reach the ovary. The ovary, which houses the ovule, contains the egg cells. When the sperm that passes through the style reaches the egg in the ovule, the two reproductive cells fuse in a process called fertilization.</p>
      <p>Flowers with both male and female reproductive organs are called perfect or bisexual flowers. On the other hand, flowers that have only one of the reproductive organs are called imperfect or unisexual flowers such as squash and corn.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 23 -->
      <div class="header">
        <div class="title">Types of Fertilization</div>
      </div>
      <p>There are two mechanisms by which fertilization takes place: external and internal.</p>
      <p>External fertilization occurs when the eggs are fertilized outside the body. This type of fertilization is common among aquatic organisms, such as frogs: the sperm swims in the water and locates the egg cells released by the female. On the other hand, internal fertilization occurs when the eggs are fertilized in the female reproductive tract. In most terrestrial organisms, including humans, internal fertilization is an adaptation to prevent the fertilized egg from dehydration.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 24 -->
      <div class="header">
        <div class="title">Fertilization and the Transfer of Traits</div>
      </div>
      <p>At the time of fertilization, a sperm cell penetrates an egg cell. Both the sex cells or gametes (sperm and egg) are haploid cells-cells that contain a single set of chromosomes. The sperm carries a copy of all the traits of the male parent. This will combine with the traits of the female parent carried by the egg cell. The union of the egg cell and sperm cell called fertilization brings the diploid or completes the number of chromosomes of the cell. This union creates a zygote. Therefore, the traits of the zygote are a combination of the male and female parents' traits carried and passed on through the chromosomes.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 25 -->
      <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> How does fertilization occur?</p>
        <p><strong>2.</strong> What is the difference between internal and external fertilization?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test" unelevated class="start-btn">
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
      <!-- Card 26 -->
      <div class="header">
        <div class="title">Advantages and Disadvantages of Asexual and Sexual Reproduction</div>
      </div>
      <p>Each method of reproduction has its own advantages and disadvantages. Generally, in asexual reproduction, organisms can multiply their number in a shorter amount of time. Another advantage is that the offspring will have the same characteristics as the parent. This is an advantage to farmers who want to increase production of a certain crop with desirable traits. Through asexual reproduction, offsprings can be produced from seedless varieties of plants. In general, seedless fruits and vegetables have longer shelf lives and are of better quality than their counterparts with seeds. This makes them highly desirable for growers and consumers alike.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 27 -->
      <p>However, having no genetic variation can make species vulnerable to sudden changes in environmental conditions. This means that a single disease can wipe out entire populations of genetically identical species, which can lead to economic losses in the case of agriculturally important crops.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 28 -->
      <p>On the other hand, sexual reproduction results in genetic variation, which may contribute to higher survival rates in contrast to species reproduced asexually. It gives sexually reproduced organisms a greater chance of survival in case of epidemics or infections. Genetic variation allows them to better adapt to changes in the environment.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 29 -->
      <p>However, sexual reproduction may also be disadvantageous in some ways. Finding a mate and producing gametes are factors that slow down the success of sexual reproduction. also no guarantee that the sex cells will successfully fuse and form In fertilization, there a zygote. If a zygote does form, however, it will take time to grow and develop. Hereditary diseases and disorders, such as Klinefelter syndrome, hemophilia, color blindness, and sickle cell anemia, can also be passed down to the offsprings.</p>
    </div>
    `,
      `
    <div>
      <!-- Card 30 -->
      <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Enumerate three advantages and disadvantages each of sexual and asexual reproduction.</p>
        <p><strong>2.</strong> Explain how sexual reproduction is a basis of heredity.</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-test" unelevated class="start-btn">
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
