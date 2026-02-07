<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-white text-black">
            <q-toolbar>
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="q-mr-sm" />
                <q-toolbar-title class="navbar-title">Lesson 4: Doing Scientific Investigations</q-toolbar-title>
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
                    <div id="viewer">
                        <transition name="fade-slide" mode="out-in">
                            <div :key="currentPage" v-html="pages[currentPage]"></div>
                        </transition>
                    </div>

                    <div class="buttons">
                        <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage"
                            no-caps>Previous</q-btn>

                        <!-- <div class="progress-section">
                            <div class="page-count">{{ currentPage + 1 }} / {{ pages.length }}</div>
                            <q-linear-progress :value="progress" size="10px" color="primary" />
                        </div> -->

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
        const lessonId = lesson ? String(lesson.id) : "4"

        const bookmarkedPages = ref([])

        // --- Lesson pages ---
        const pages = ref([
            `
    <div>
      <!-- Card 1 -->
      <div class="header">
        <div>
          <div class="title">Doing Scientific Investigations</div>
          <div class="subtitle">When you perform a scientific investigation, you have the opportunity to think and act like a scientist. You get to use different laboratory tools, apply the science process skills, employ the scientific method, and enjoy the thrill of doing science.</div>
        </div>
      </div>
      <p><strong>Science Process Skills</strong></p>
      <p>Science process skills are skills that scientists employ to acquire reliable information. The basic process skills are observing, measuring, inferring, classifying, predicting, and communicating.</p>
      <p>As a review of what you have learned in your previous science classes, science process skills are skills that scientists employ to acquire reliable information. The basic process skills are observing, measuring, inferring, classifying, predicting, and communicating.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 2 -->
      <p>Observing is a fundamental skill that requires the use of the five senses sight, hearing, touch, taste, and smell. It is a means of gathering qualitative and quantitative data. Measuring utilizes specific laboratory tools, such as a ruler or a graduated cylinder. Inferring is interpreting what is observed based on prior experience or information. Classifying is the skill of grouping objects or phenomena based on similar characteristics or attributes. Predicting is projecting outcomes based on reliable and consistent observations and inferences. Hence, predictions are not just random guesses; they can be tested and verified. They are obtained by analyzing trends or comparing historical and present conditions or events.</p>
      <p>Communicating means sharing the results of an investigation with the scientific community through journal publications or presentations in conferences. Communicating is essential in science because it makes the results of an investigation open for replication and verification. To communicate effectively, we need to employ methods or tools familiar to most people, such as informative statements, graphs, and charts.</p>
      <p>The basic process skills are the foundations of learning the more complex integrated process skills, which are highly useful in conducting experiments. The integrated skills are formulating models, defining operationally, formulating hypothesis, controlling variables, experimenting, and interpreting data. Formulating models refers to designing and creating appropriate scientific models to represent a concept or a process. Defining operationally means stating or describing how to measure a variable in an experiment. For example, Plant growth will be measured in centimeters per week.</p>
      <p>The other integrated process skills will be discussed in the next section.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 3 -->
      <div class="header">
        <div>
          <div class="title">Steps in Doing a Scientific Investigation</div>
        </div>
      </div>
      <p><strong>How do scientists solve problems?</strong></p>
      <p>Scientists solve problems by making careful and thorough investigations. They follow the scientific method to minimize mistakes while solving a problem. The scientific method is a systematic process of acquiring knowledge and validating observations through experimentation.</p>
      <div class="illustration">
        <img src="assets/img/chapter 1>figure 1-16.png" alt="figure 1-16">
        <div class="caption">figure 1-16</div>
      </div>
      <p>The steps of the scientific method can be summarized as follows:</p>
      <p>Step 1: Identifying the problem and formulating a hypothesis</p>
      <p>Step 2: Experimenting, observing, and gathering data</p>
      <p>Step 3: Making conclusions</p>
    </div>
    `,
            `
    <div>
      <!-- Card 4 -->
      <p><strong>Identifying the Problem and Formulating a Hypothesis</strong></p>
      <p>The first step in a scientific investigation is the identification of the problem. The problem is the main focus of an investigation, and should therefore be well defined. From the problem, scientists ask researchable questions and state them in a clear, specific, and testable way.</p>
      <p>When a problem is identified, a hypothesis is formulated. A hypothesis is a tentative answer to the problem. The hypothesis guides the researcher on what facts and data are relevant to solve the problem.</p>
      <p>A hypothesis can be stated in two ways:</p>
      <p>• <i>Null hypothesis</i> – the negative way: states that changing the factor being tested will have no effect on the result</p>
      <p>• <i>Alternative hypothesis</i> – the positive way: states that changing the factor being tested will have an effect on the result</p>
    </div>
    `,
            `
    <div>
      <!-- Card 5 -->
      <p>For example, if one is studying the effect of fertilizer on plant growth, here are the possible hypothesis:</p>
      <p>• <i>Null hypothesis</i>: Applying fertilizer does not affect plant growth.</p>
      <p>• <i>Alternative hypothesis</i>: Applying fertilizer improves plant growth.</p>
      <p>A hypothesis may not always be the answer to the identified problem. It may be refuted based on the results of the experiment. Therefore, an experiment must be carefully designed to support or refute the hypothesis. When a hypothesis holds true for numerous similar experiments, it becomes a theory.</p>
      <p><strong>Experimenting, Observing, and Gathering Data</strong></p>
      <p>The value and success of a scientific investigation depend on careful planning before conducting any experiment. The factors or conditions in an experiment must be controlled to get reproducible results.</p>
      <p>Experimentation is regarded as a cause-and-effect test between two variables. It aims to generate evidence to answer the problem to be solved. It involves identifying the experimental variables, making operational definitions of the terms and conditions to be used in the experiment, and outlining the experimental procedure.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 6 -->
      <p>The factors or conditions in an experiment are called variables, which are either observed, changed, or measured. The factor that is changed by the experimenter is referred to as the independent variable. The outcome of the observed effect of changing the independent variable is the dependent variable.</p>
      <p>During experimentation, careful and objective observations must be done. Observation means obtaining information about objects, situations, or events using the human senses and laboratory tools. Both qualitative and quantitative observations are essential data gathered during experimentation.</p>
      <p>Data acquisition, or data gathering, is an essential task in a scientific investigation. It involves not just simple collection and recording of data, but also the use of the science process skills, such as measuring, classifying, and comparing. Properly gathered data help establish experimental results as reliable and valid.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 7 -->
      <p><strong>Making Conclusions</strong></p>
      <p>Making conclusions begins with interpreting the gathered data. Raw data are processed and organized into more concise and meaningful statements about the identified problem. Conclusions based on findings are then drawn. A conclusion, therefore, is a direct response to the problem under investigation. Furthermore, it should state whether the hypothesis for the problem is accepted or rejected.</p>
      <p>In general, the success of any scientific investigation is influenced by how much the experimenter has adhered to the principles and steps of the scientific method. As an experimenter, your ability to do science the way scientists do it depends on your skills to identify a researchable problem, formulate a sound hypothesis, design an appropriate experiment to test your hypothesis, gather relevant data from the experiment, interpret the results, and derive a conclusion that answers the problem you have identified.</p>
      <p>The result or outcome of a scientific investigation should be communicated to the science community so that others can conduct similar, revised, or extended studies and investigations to support, refute, or improve the results. This is done through a publication in scientific journals and a presentation in conferences.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 8 -->
      <p><strong>Fair Testing in Science</strong></p>
      <p>In doing a scientific investigation, it is essential that the experimenter changes only one independent variable at a time and keeps the other variables in the experiment the same or constant. This is the principle of fair testing. When you do a fair test, you are expected to obtain meaningful and reliable results.</p>
      <p>Consider the following example. You and your friend would like to know which brand (Brand A or Brand B) of the available commercial carbonated drinks is sweeter. You perform a taste test on a cold Brand A sample and a warm Brand B sample. Is a fair test done in this case?</p>
      <p>Note that the two brands were tested at different temperatures. Therefore, this is not a fair test. To make the test fair, the only thing that should vary in the test is the brand of the carbonated drink. Before testing the sweetness, the sample from each brand must be at the same temperature. In doing so, only one variable is changed and the test is fair.</p>
    </div>
    `,
            `
    <div>
      <!-- Card 9 -->
      <div class="info-card">
        <div class="info-title">MINI TEST 1-3</div>
        <div class="info-content">
          <div class="info-text">
            <div class="mini-questions">
              <p><strong>1.</strong> You test the old batteries in other flashlights.</p>
              <p><strong>2.</strong> You think that the batteries might be worn out.</p>
              <p><strong>3.</strong> You need your flashlight, but it does not turn on.</p>
              <p><strong>4.</strong> Your flashlight finally turns on after replacing the batteries.</p>
              <p><strong>5.</strong> You test your flashlight after replacing the old batteries with new ones.</p>
            </div>
            <div class="start-btn-container">
              <q-btn data-route="/mini-test-1-3" unelevated class="start-btn">
                Answer
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
        ]);

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
