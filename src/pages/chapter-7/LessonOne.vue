<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar class="toolbar-row"> <q-btn flat dense round icon="arrow_back" aria-label="Go back"
                    @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 1: Force and Interaction</q-toolbar-title>
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
                    <div id="viewer" ref="viewerRef">
                        <transition name="fade-slide" mode="out-in" @after-enter="onTransitionComplete">
                            <div :key="currentPage" v-html="getPageContent(currentPage)"></div>
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

                    <div class="speak-btn" @click="onToggleAudio">
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
        const lessonId = lesson ? String(lesson.id) : "50"

        // bookmarks
        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const rawPages = [
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">Lesson 1 Force and Interaction</div>
      </div>
      <p>Forces are present everywhere in your daily life. Whether you are sitting, standing, writing, or playing, different kinds of forces are at work. When you sit on a chair and you push on it, it pushes back on you. The same goes for when you stand on the floor. You press down, and the floor pushes back. When you write on paper, especially if it is a bit rough, you are applying force. Therefore, force is basically an interaction between two things or between something and its surroundings.</p>
      <p>A force is essentially a push or a pull, capable of setting an object into motion or bringing it to a halt. Moreover, it can even change the shape of an object when applied.</p>
      <p>Look at figure 7-1. Can you identify which of these illustrations demonstrate a force setting an object in motion, bringing it to a stop, or changing the shape of an object?</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-1. Effects of forces">
        <div class="caption">Figure 7-1. Effects of forces</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>In figures 7-1a and 7-1b, force is being used to stop an object. For instance, a catcher's hand must apply a force in the opposite direction of the football's movement to bring it to a stop. Similarly, when a driver steps on the brake, it creates friction between the brake pads and the surface of the brake rotor or drum, generating a force that opposes the motion of the wheels.</p>
      <p>In figures 7-1c and 7-1d, the forces acting on the objects cause them to move. When you kick a soccer ball, it moves in the same direction as the force you applied. Similarly, when the boy gives a push on the swing, the girl (and the swing) moves in the direction of that push. But eventually, the girl (and the swing) swings back because of gravity pulling it down, the tension in the chains, and the normal force from the seat.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <p>Lastly, in figures 7-le and 7-1f, you see forces that change the shape or deform an object. In order to mold a clay, you need to apply force on it. When you blow air into a balloon, the pressure inside increases because the air molecules push more against the walls, creating a force on the inside surface.</p>
      <p>Forces play a crucial role not only in the physical world, but also across various scientific disciplines, such as biology, chemistry, and Earth science. In the earlier chapters, you explored concepts in chemistry and biology that have direct connections to physics. For example, the solubility of a substance in a specific solvent is determined by the forces between solute and solvent particles. Furthermore, in processes such as mitosis and meiosis, forces come into play by ensuring the accurate separation of chromosomes to each daughter cell. In the next chapters, you will learn how forces in the Earth's mantle propel the movement of tectonic plates, giving rise to different phenomena such as earthquakes, volcanic eruptions, and the formation of mountain ranges.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <div class="header">
        <div class="title">Force Vector</div>
      </div>
      <p>Physical quantities can be classified as either scalar or vector. A scalar quantity is characterized solely by its magnitude, whereas a vector quantity possesses both magnitude and direction.</p>
      <p>Force is a vector quantity and is usually expressed in its SI unit, the newton (N). As a vector, force is represented as a line with an arrowhead at its tip. The length of the arrow indicates the magnitude of the force, while the arrowhead tells its direction.</p>
      <p>Meanwhile, the four cardinal directions—north (N), south (S), east (E), and west (W)—are fundamental conventions employed in a Cartesian plane. Consequently, north and east signify positive directions, while south and west signify their negative counterparts. Northwest (NW), southwest (SW), northeast (NE), and southeast (SE) form an angle of 45 degrees from the reference directions.</p>
      <div class="illustration">
        <img src="assets/img" alt="Cardinal directions diagram">
        <div class="caption">Cardinal directions diagram</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>Suppose a man slides a fruit crate along the floor by applying a 200 N force to the right. The 200 N is the magnitude of the force while its direction is to the right. To represent the applied force, you can draw a five-centimeter-long arrow directed to the right (figure 7-2). This scale (1 cm = 40 N), however, is arbitrary.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-2. Vector representation of a 200 N force applied to slide a fruit crate along the floor">
        <div class="caption">Figure 7-2. Vector representation of a 200 N force applied to slide a fruit crate along the floor</div>
      </div>
      <p>In the next section, you will learn the different types of force. Arrows are used to visually represent several forces acting on an object in specific directions.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <div class="header">
        <div class="title">Types of Force</div>
      </div>
      <p>In our previous discussions, you have encountered the terms friction, tension, normal force, and gravity. Forces can be mainly classified into two primary categories: contact forces and noncontact forces.</p>
      <p>Contact forces are exerted by direct physical contact between two objects. Here are some examples of contact forces:</p>
      <p>\\( \\vec{F}_N \\) <strong>Normal Force</strong> – This is the force exerted by a surface in contact with an object. For example, in figure 7-3a, the flower vase experiences a normal force exerted by the table it is resting on.</p>
  <p>\\( \\vec{F}_A \\) <strong>Applied Force</strong> – This is a force that is exerted directly on an object. For instance, in figure 7-3b, when you roll a bowling ball along a smooth alley, you apply force to it.</p>
  <p>\\( \\vec{F}_f \\) <strong>Friction Force</strong> – This force occurs when two surfaces are in contact and move past each other. As shown in figure 7-3c, the friction between the soles of your shoes and the ground allows you to move forward.</p>
  <p>\\( \\vec{F}_T \\) <strong>Tension Force</strong> – This is a pulling force exerted by a stretched rope, string, or cable on an attached object. For example, in figure 7-3d, a child is suspended by a rope, and the rope experiences tension, supporting the child's weight.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p>\\( \\vec{F}_S \\) <strong>Spring/Restoring Force</strong> – This force is present in springs, causing them to return to their original position after being stretched or compressed. As shown in figure 7-3e, when you compress a spring and let go, the restoring force brings it back to its equilibrium position.</p>
  <p>\\( \\vec{F}_{Air} \\) <strong>Air Resistance</strong> – This force opposes the motion of an object moving through the air. For example, in figure 7-3f, a falling parachute experiences increasing air resistance that eventually equals the force of gravity.</p>
  <p>\\( \\vec{F}_B \\) <strong>Buoyant Force</strong> – This is an upward force exerted by a fluid on a submerged object. In figure 7-3g, some objects, such as a boat, float in water because the buoyant force from the fluid is greater than their weight.</p>

      <div class="illustration">
        <img src="assets/img" alt="Figure 7-3. Contact forces">
        <div class="caption">Figure 7-3. Contact forces</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <div class="header">
        <div class="title">SCIENCE CAREER</div>
      </div>
      <p>Nuclear engineers work with strong nuclear forces responsible for the generation of energy from nuclear power plants. They design and develop nuclear equipment, ensure safety and compliance, conduct research, oversee maintenance and operations, manage radiation protection, and prepare for emergency responses.</p>
      <p>Another type of force does not involve direct contact. It acts at a distance and is called a non-contact force, also known as an action-at-a-distance or field force. There are several kinds of noncontact force:</p>
      <p>\\( \\vec{F}_G \\) <strong>Gravitational Force</strong> – This force is exerted by a massive object on another massive object. For instance, the gravitational force between the Earth and the moon in figure 7-4a.</p>
  <p>\\( \\vec{F}_E \\) or \\( \\vec{F}_M \\) <strong>Electromagnetic Force</strong> – This force can be either attractive or repulsive and acts between charged bodies. For example, in figure 7-4b, electrostatic force can be observed when a balloon is charged, attracting the hair. The magnetic force is evident when the magnet attracts the metal nails and screws, as shown in figure 7-4c.</p>

      <div class="illustration">
        <img src="assets/img" alt="Figure 7-4. Non-contact forces">
        <div class="caption">Figure 7-4. Non-contact forces</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <div class="header">
        <div class="title">Measuring Force</div>
      </div>
      <p>A basic method to measure force is by using a spring scale. This device consists of a spring with a pointer on one end and a hook on the other. When you hang an object on the hook, the spring stretches and the pointer indicates the measured force. However, it is important to ensure accuracy by calibrating the spring scale before use. This guarantees precise measurements.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-5. Calibrating a spring scale">
        <div class="caption">Figure 7-5. Calibrating a spring scale</div>
      </div>
      <p>To calibrate the spring balance, follow these steps:</p>
      <p>1. Use standard masses with known weights.</p>
      <p>2. Before hanging the standard mass, make sure that the spring balance reads "0". Perform the necessary adjustment to zero if needed.</p>
      <p>3. Attach one standard mass securely to the spring balance without allowing it to swing.</p>
      <p>4. Record the displayed reading for this mass.</p>
      <p>5. Do steps 3 and 4 for all the other masses.</p>
      <p>6. Compare the recorded readings with the known values of the weights. If there are discrepancies, adjustments may be necessary.</p>
      <p>7. Some spring balances have calibration features for fine-tuning readings. Just refer to the manufacturer's instructions for detailed adjustment procedures.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 10 -->
      <div class="header">
        <div class="title">SCIENCE HISTORY</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="Spring scale diagram">
        <div class="caption">A spring scale is used to measure the force or weight of an object. It has a spring fixed at one end and a hook at the other end.</div>
      </div>
      <p>Richard Salter invented the first spring scale in 1770. This device works by following Hooke's law, which states that the force applied to a spring is directly proportional to the elongation or displacement of the spring from its equilibrium position.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 11 -->
      <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Applying force on the brake lever</p>
        <p><strong>2.</strong> Applying force on the shopping cart</p>
        <p><strong>3.</strong> Applying force in molding the clay pot</p>
        <p><strong>4.</strong> Applying force on the ping-pong ball</p>
        <p><strong>5.</strong> Applying force on the javelin</p>
        <p><strong>6.</strong> 20 N, east</p>
        <p><strong>7.</strong> 100 N, west</p>
        <p><strong>8.</strong> 120 N, southeast</p>
        <p><strong>9.</strong> 85 N, north</p>
        <p><strong>10.</strong> 180 N, northwest</p>
        <p><strong>11.</strong> swinging a pendulum</p>
        <p><strong>12.</strong> pushing a box on an inclined plane</p>
        <p><strong>13.</strong> a stone hung using a spring balance</p>
        <p><strong>14.</strong> (Blank)</p>
        <p><strong>15.</strong> (Blank)</p>
        <p><strong>16.</strong> (Blank)</p>
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
            boxShadow: "7px 7px 0px 0px rgba(0, 0, 0, 0.16)"
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
