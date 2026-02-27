<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar class="toolbar-row"> <q-btn flat dense round icon="arrow_back" aria-label="Go back"
                    @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 5: Practical Examples of Solutions: Acids, Bases, and Salt
                    Solutions</q-toolbar-title>
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
                        <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage"
                            no-caps>Previous</q-btn>

                        <div class="text-subtitle2 text-white">{{ currentPage + 1 }} / {{ pages.length }}</div>

                        <q-btn class="nav-button" @click="nextPage"
                            :label="currentPage === pages.length - 1 ? 'Finish' : 'Next'"
                            :style="currentPage === pages.length - 1 ? finishButtonStyle : null" no-caps />
                    </div>

                    <div class="speak-btn" @click="toggleAudio">
                        <img :src="isPlaying ? '/icons/stop.png' : '/icons/speak.png'" alt="Speak Button"
                            class="cursor-pointer" style="width: 20px; height: 20px;" />
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
        const lessonId = lesson ? String(lesson.id) : "20"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
        <div class="header">
            <div class="title">Practical Examples of Solutions: Acids, Bases, and Salt Solutions</div>
        </div>
        <p style="font-weight: bold; font-weight: bold; padding-top: 10px; margin-bottom: 5px; font-size: 19px;">What are practical examples of solutions in everyday life?</p>
        <p>In your everyday activities, you often come across various types of solutions. For example, various household chemicals, like vinegar (a mixture of acetic acid and water) is used in cooking, while bleach (a solution of sodium hypochlorite) is used in disinfecting or cleaning. In Mini Lab 3-1, you get to prepare salt in a water mixture and observe that adding salt to water causes it to dissolve and form a solution. If sodium chloride is used in water, the resulting solution is a saline solution.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Acidic and Basic Solutions</div>
        </div>
        <p>You may be familiar with many common acids and bases. Acetic acid is the major component of vinegar; while vitamin C is ascorbic acid. Ammonia is the pungent base present in cleaning agents and disinfectants. Magnesium hydroxide and other bases compose antacids, medicines used to treat hyperacidity. While acids and bases have practical uses, their effects are not always beneficial.</p>
        <p>Acids and bases have distinct properties. Knowing these properties will help us distinguish and use these substances properly and appropriately. These substances are present in the different aspects of daily life—from the essential functions of the body systems to the use of cleaning products, medicines, and cosmetics.</p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 3/figure 3-8.png" alt="Figure 3-8. Acetic acid is a major component of vinegar.">
            <div class="caption">Figure 3-8. Acetic acid is a major component of vinegar.</div>
        </div>
        <p>Acids have the following general properties:</p>
        <p>• Acids taste sour. Acetic acid and lactic acid give sourness to vinegar and sour milk, respectively.</p>
        <p>• Acids cause a color change in plant dyes, which serve as acid-base indicators. They also turn blue litmus paper to red.</p>
    </div>
    `,
            `
    <div>
        <p>• Acids react to certain metals, such as calcium, magnesium, and iron, producing hydrogen gas.</p>
        <p>• Acids conduct electricity when in aqueous solutions. A solution of sulfuric acid in water can conduct electricity.</p>
        <p>Here are some examples of acid solutions, commonly found in both home and school environments, that can react with litmus paper. Litmus paper is a strip of paper treated with a natural water-soluble dye that changes color depending on whether the substance it is soaked in is acidic or basic.</p>
    </div>
    `,
            `
    <div>
        <p>Sulfuric acid (H₂SO₄), also called oil of vitriol, is used to manufacture dyes, pigments, fertilizers, explosives, drugs, detergents, and inorganic salts and other acids. It is commonly found in a variety of cleaning products, including oven cleaners and toilet bowl cleaners. It is also used in petroleum refining and metallurgical processes. It is also used in schools, primarily in chemistry laboratories for titration experiments and solution preparations.</p>
        <p>Hydrochloric acid (HCl), also known as muriatic acid, is a solution of hydrogen chloride gas in water. It is commercially available as a concentrated solution of 36% HCl by mass. It is also utilized as a chlorinating agent and in the processing of some food products. It composes the gastric juice in the stomach that aids in the breakdown of food during digestion. Like sulfuric acid, it is commonly used in titration experiments and observation of solubility and gas evolution.</p>
    </div>
    `,
            `
    <div>
        <p>Citric acid (HOC(CH₂CO₂H)₃) is a natural preservative that is commonly used in the kitchen, especially in baking and cooking. Citric acid may be found in citrus fruits like lemons and oranges, and it is also used in other forms of food preservation.</p>
        <p>Acetic acid (CH₃COOH), also called ethanoic acid, is a component of vinegar produced from the fermentation of natural carbohydrates. It is found in body fluids and plant juices. In industries, it is the primary material in the preparation of acetates, which are substances used in the production of plastics, photographic films, and textiles.</p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 3/figure 3-9.png" alt="Figure 3-9. (A) Blue litmus paper turns red when exposed to acids, such as orange juice. (B) Red litmus paper turns blue when placed in bases, such as soap.">
            <div class="caption">Figure 3-9. (A) Blue litmus paper turns red when exposed to acids, such as orange juice. (B) Red litmus paper turns blue when placed in bases, such as soap.</div>
        </div>
    </div>
    `,
            `
    <div>
        <p>In contrast, bases have the following distinct properties:</p>
        <p>• Bases taste bitter. The basic substances contained in ampalaya extract make it bitter.</p>
        <p>• Bases are slippery or soapy. This property is exhibited by soaps and detergents that contain bases.</p>
        <p>• Bases also cause color change in plant dyes. They change the color of red litmus paper to blue.</p>
        <p>• Bases, like acids, can also conduct electricity when in aqueous solutions.</p>
    </div>
    `,
            `
    <div>
        <p>Here are some examples of basic solutions, commonly found in both home and school environments, that can also react with litmus paper.</p>
        <p>Sodium hydroxide (NaOH), commonly called caustic soda or lye, is the most widely used base. The solution of sodium hydroxide neutralizes acids in various chemical processes. Sodium hydroxide is a raw material in soap making. It is also used in schools primarily in chemistry laboratories for titration experiments and solution preparations.</p>
        <p>Magnesium hydroxide (Mg(OH)₂), a white powder largely produced from seawater, is the primary source of magnesium metal. In water, it forms a suspension called milk of magnesia, which is used to relieve hyperacidity and constipation. It is also used in discussions about solubility and in explaining the behavior of sparingly soluble bases.</p>
    </div>
    `,
            `
    <div>
        <p>Ammonium hydroxide (NH₄OH), also called aqua ammonia, is a solution of ammonia gas in water. Ordinary household ammonia is a dilute ammonium hydroxide solution commonly used as a cleaning agent. An aqueous solution of ammonia is used as an inhalant (smelling salt) to prevent or treat fainting. The substance is also used as a primary material in the fertilizer industry.</p>
    </div>
    `,
            `
    <div>
        <div class="header">
            <div class="title">Salt Solutions</div>
        </div>
        <p>The aqueous solution of sodium chloride (NaCl) has a wide range of uses. It has medicinal uses and can be used as a gargle to help soothe sore throat or even in wound cleaning. A cutting-edge application features a water lamp that runs on a saline solution, allowing the energy produced to be used for charging a smartphone. Sports drinks are formulated as solutions, featuring a mix of dissolved salt, sugar, and various other ingredients blended seamlessly into water. This combination aims to provide hydration, replenish electrolytes, and offer a source of energy during physical activities.</p>
    </div>
    `,
            `
    <div>
        <div class="illustration">
            <img src="assets/img/chapter 3/figure 3-10.png" alt="Figure 3-10. Sodium chloride is used as a saline solution for cleaning wounds and used as a solvent for electrolysis.">
            <div class="caption">Figure 3-10. Sodium chloride is used as a saline solution for cleaning wounds and used as a solvent for electrolysis.</div>
        </div>
        <p>Aside from NaCl, here are some examples of salt solutions commonly found in both home and school environments.</p>
    </div>
    `,
            `
    <div>
        <p>Magnesium sulfate (MgSO₄), or Epsom salt, is commonly used in bathwater to promote relaxation and provide relief for sore muscles. In chemistry laboratories, it is commonly used to study crystallization or as a component in specific chemical reactions.</p>
        <p>Sodium bicarbonate (NaHCO₃), or baking soda, has a wide range of uses. It is commonly used in baking to help the dough rise and create a light texture in baked goods. Additionally, it is often used as a cleaning agent due to its ability to remove stains and odors. Its versatility makes it a staple in many households. It is also regarded as a base and utilized in investigations to study the characteristics of bases.</p>
    </div>
    `,
            `
    <div>
        <p>Sodium acetate (CH₃COONa) may be used in pickling or preserving certain foods and can be found in certain food products. It is commonly utilized in chemistry experiments, especially when discussing acid-base reactions and solution properties.</p>
    </div>
    `,
            `
    <div>
        <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Make a Venn diagram to compare and contrast the general properties of acids and bases.</p>
        <p><strong>2.</strong> Provide one or two examples of acid, base, and salt solutions that you can easily get at home or in your school in addition to the examples given above. Discuss how these solutions will react with litmus indicators.</p>
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
        <div class="header">
            <div class="title">SCIENCE PIONEER</div>
        </div>
        <p>Maria Y. Orosa, a renowned food scientist and chemist, made noteworthy contributions to food advancements. Famous for her creation of banana ketchup, a popular condiment in Filipino cooking, Orosa completely transformed the world of Filipino cuisine. Aside from her involvement in the development of banana ketchup and salt-based preservation, Orosa also explored the use of vinegar and canning in food preservation methods.</p>
    </div>
    `,
            `
    <div>
        <p>Her unique perspective on food science had a profound impact, influencing the culinary traditions of the Philippines and igniting a passion for food among scientists and enthusiasts from the younger generation. Her work showcased the versatility of salt in culinary arts, highlighting its ability to enhance flavors and preserve food.</p>
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