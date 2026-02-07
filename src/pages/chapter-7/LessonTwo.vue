<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 2: Net Force</q-toolbar-title>
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
                        <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage"
                            no-caps>Previous</q-btn>

                        <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div>

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
        const lessonId = lesson ? String(lesson.id) : "51"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div class="title">Lesson 2 Net Force</div>
      </div>
      <p>When two or more forces act on a body at different points, the consequent motion of the body is determined by the net force.</p>
      <div class="illustration">
        <img src="assets/img" alt="Net force illustration">
        <div class="caption">Net force illustration</div>
      </div>
      <p>When two people push a crate at the same time in the same direction (figure 7-6), the forces add up to a net force. If each person exerts a force of 2 N, then the net force is 4 N. However, if they push with the same magnitude but in opposite directions (figure 7-7a on the next page), then the net force is zero.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-6. The net force of two forces in the same direction is the sum of these forces.">
        <div class="caption">Figure 7-6. The net force of two forces in the same direction is the sum of these forces.</div>
      </div>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-7. The net force of two forces in opposite directions is the difference between the magnitudes of these forces.">
        <div class="caption">Figure 7-7. The net force of two forces in opposite directions is the difference between the magnitudes of these forces.</div>
      </div>
      <p>For opposing forces with different magnitudes (figure 7-7b), the direction of the net force is always the same as the direction of the force with greater magnitude. F net is the vector sum of all the forces acting on it.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div class="title">Free-Body Diagram</div>
      </div>
      <p>In many situations, multiple forces, such as the force of gravity, normal force, friction, and applied force, come into play. Let's look at this example:</p>
      <p>Figure 7-8 illustrates various forces applied on a crate. Initially, an applied force (FA) pushes the crate to the right. However, counteracting this motion is the force of friction (F) between the floor and the crate, eventually bringing it to a halt. Additionally, there is an upward normal force (FN) and a downward force of gravity (FG) acting on the crate.</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-8. Pushing a crate and its free-body diagram">
        <div class="caption">Figure 7-8. Pushing a crate and its free-body diagram</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p>To easily understand the net force acting on an object, you can use a free-body diagram. Follow these steps to draw a free-body diagram:</p>
      <p>1. Determine the specific object for which you want to draw the free-body diagram.</p>
      <p>2. Isolate the object you are analyzing from its surroundings. Represent with a dot.</p>
      <p>3. Identify all the forces acting on the object.</p>
      <p>4. Use arrows on a Cartesian plane to represent these forces. If forces are not along the cardinal directions (north, south, west, and east), specify their angles with respect to a reference axis.</p>
      <p>5. Label all the forces on the body.</p>
      <p>6. Double-check to ensure you have included all relevant forces.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <div class="info-card">
  <div class="info-title">MINI LAB 7-1</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>Objective:</strong> Determine the net force of a system.</p>
        <p><strong>Materials:</strong></p>
        <p>• 3 identical metal forks or spoons</p>
        <p>• 1 piece of 250 mL drinking glass</p>
        <p>• 3 identical glass bottles</p>
        <p>• water</p>
        <p>• ruler</p>
        <p><strong>Procedure:</strong></p>
        <p><strong>1.</strong> Place the three identical glass bottles equidistant from each other. Use a ruler to measure the distances (approximately 15-20 cm).</p>
        <p><strong>2.</strong> Place the metal forks on top of the bottles and intertwine them at the center.</p>
        <p><strong>3.</strong> Balance the drinking glass on top of intertwined forks.</p>
        <p><strong>4.</strong> Carefully pour water into the drinking glass until it is half-filled.</p>
        <p><strong>Data and Analysis:</strong></p>
        <p><strong>1.</strong> What are the types of force acting on the system?</p>
        <p><strong>2.</strong> What is the net force of the system?</p>
      </div>
      <div class="start-btn-container">
        <q-btn data-route="/mini-lab-7-1" unelevated class="start-btn">
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
      <div class="header">
        <div class="title">Balanced and Unbalanced Forces</div>
      </div>
      <p>To observe the effects of various forces acting on an object, it is important to determine the net force acting upon the object. For two-dimensional problems, the net force should be calculated by combining forces acting in the same direction (e.g., along the x- or y-axis).</p>
      <p>Based on figure 7-9, the forces in the x-axis are friction and applied forces, while the gravitational and normal forces are along the y-axis. If the applied force, the frictional force, the normal force, and the force of gravity are 144 N, 94 N, 490 N, and 490 N, respectively, what is the net force along the x- and y-axes? Frictional and gravitational forces are negative, while normal and applied forces are positive. Combining forces along the x- and y-axes, the net forces are as follows:</p>
      <div class="illustration">
        <img src="assets/img" alt="Figure 7-9. A free-body diagram of the cart being pushed in figure 7-8.">
        <div class="caption">Figure 7-9. A free-body diagram of the cart being pushed in figure 7-8.</div>
      </div>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p>If the net force is zero, it indicates a state of balanced forces. In this case, the object will either remain stationary or move at a constant speed in a constant direction. Conversely, if the net force is not zero, the forces acting on the body are unbalanced, causing the body to move in the direction of the net force.</p>
      <p>The net force on the crate is 50 N along the x-axis and 0 N along the y-axis. The forces acting on the crate along the x-axis are unbalanced, causing it to move to the East. On the other hand, the forces acting along the y-axis are balanced, indicating that the object remains stationary along the y direction. Thus, the crate moves to the East after applying a 144 N force to it, while there is no motion along the y-axis.</p>
      <p>A nonzero net force, or unbalanced force, can cause a stationary body to move or a moving body to change its speed and/or direction of motion. On the other hand, a zero net force, or balanced force, does not cause any change in the motion of the body. Stationary objects will remain at rest, while moving objects will remain moving at a constant speed and in a constant direction of motion.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <div class="info-card">
  <div class="info-title">MINI TEST</div>
  <div class="info-content">
    <div class="info-text">
      <div class="mini-questions">
        <p><strong>1.</strong> Calculate the net force: 2 N, east, and 5 N, west</p>
        <p><strong>2.</strong> Calculate the net force: 10 N, south, and 5 N, south</p>
        <p><strong>3.</strong> Calculate the net force: 20 N, north, and 60 N, south</p>
        <p><strong>4.</strong> Calculate the net force: 100 N, northeast, and 60 N, southwest</p>
        <p><strong>5.</strong> Calculate the net force: 150 N, southeast, and 300 N, northwest</p>
        <p><strong>6.</strong> Identify forces and draw a free-body diagram: A floating stationary ball</p>
        <p><strong>7.</strong> Identify forces and draw a free-body diagram: A kid playing on a frictionless slide</p>
        <p><strong>8.</strong> Identify forces and draw a free-body diagram: A man lifting a load</p>
        <p><strong>9.</strong> Identify forces and draw a free-body diagram: A man pushing a crate upward along an inclined plane</p>
        <p><strong>10.</strong> Identify forces and draw a free-body diagram: A man descending on a parachute</p>
        <p><strong>11.</strong> Determine balanced/unbalanced forces: tossing a coin</p>
        <p><strong>12.</strong> Determine balanced/unbalanced forces: sitting on a chair</p>
        <p><strong>13.</strong> Determine balanced/unbalanced forces: throwing a ball</p>
        <p><strong>14.</strong> Determine balanced/unbalanced forces: a falling stone</p>
        <p><strong>15.</strong> Determine balanced/unbalanced forces: hanging a mobile sculpture</p>
        <p><strong>16.</strong> Determine balanced/unbalanced forces: a car moving at a constant speed</p>
        <p><strong>17.</strong> Determine balanced/unbalanced forces: the stable structure of a building</p>
        <p><strong>18.</strong> Determine balanced/unbalanced forces: a kid sliding on a pool slide</p>
        <p><strong>19.</strong> Determine balanced/unbalanced forces: swinging a hammer to drive a nail</p>
        <p><strong>20.</strong> Determine balanced/unbalanced forces: a box on top of a table</p>
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
