<template>
  <q-layout view="hHr LpR lFf">
    <!-- Header -->
    <q-header class="header-gradient">
      <div class="my-toolbar q-pa-md">
        <div class="avatar-container relative-position" @click="sidebarOpen = true">
          <q-avatar size="60px" class="profile-avatar">
            <img class="profile-image" :src="student.avatar || 'assets/temp/pfp.png'" />
          </q-avatar>
          <div class="avatar-overlay-icon">
            <img src="assets/icons/profile.png" alt="icon" />
          </div>
        </div>

        <div class="header-info q-ml-md">
          <div class="text-h6 text-white text-weight-bold">{{ student.name }}</div>
          <div class="text-body2 text-white" style="opacity: 0.9;">{{ student.section }}</div>
        </div>

        <div class="toolbar-spacer"></div>

        <div class="bookmark-wrap">
          <button class="bookmark-btn" @click="goToBookmarks">
            <img src="assets/icons/bookmark.png" style="width: 28px; height: 28px;" />
          </button>
          <div class="text-white text-caption" style="margin-top: -4px;">Bookmarks</div>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <q-page class="dashboard-page" no-padding>

        <!-- Loading overlay -->
        <div v-if="isLoading" class="loading-overlay">
          <q-spinner-dots color="white" size="48px" />
          <div class="text-white q-mt-md text-body1">Loading...</div>
        </div>

        <!-- Sidebar -->
        <q-drawer v-model="sidebarOpen" side="right" overlay bordered :width="260" class="sidebar-drawer">
          <div class="sidebar-inner">
            <div class="sidebar-header">
              <img src="logo/logo.png" alt="logo" class="sidebar-logo" />
              <div class="sidebar-brand">Menu</div>
            </div>

            <div class="sidebar-divider"></div>

            <div class="sidebar-nav">
              <button class="nav-item" @click="openEditProfile">
                <div class="nav-icon-wrap">
                  <img src="assets/icons/edit.png" alt="edit" />
                </div>
                <span class="nav-label">Edit Profile</span>
                <q-icon name="chevron_right" size="18px" class="nav-arrow" />
              </button>

              <button class="nav-item" @click="settingsOpen = true; sidebarOpen = false">
                <div class="nav-icon-wrap">
                  <img src="assets/icons/audio.png" alt="audio" />
                </div>
                <span class="nav-label">Audio</span>
                <q-icon name="chevron_right" size="18px" class="nav-arrow" />
              </button>

              <button class="nav-item" @click="aboutOpen = true; sidebarOpen = false">
                <div class="nav-icon-wrap">
                  <img src="assets/icons/about.png" alt="about" />
                </div>
                <span class="nav-label">About</span>
                <q-icon name="chevron_right" size="18px" class="nav-arrow" />
              </button>

              <div class="nav-spacer"></div>

              <button class="nav-item nav-logout" @click="logout">
                <div class="nav-icon-wrap logout-icon-wrap">
                  <img src="assets/icons/logout.png" alt="logout" />
                </div>
                <span class="nav-label">Logout</span>
                <q-icon name="chevron_right" size="18px" class="nav-arrow" />
              </button>
            </div>
          </div>
        </q-drawer>

        <!-- Edit Profile Modal -->
        <q-dialog v-model="editProfileModal" persistent>
          <div class="edit-modal-wrapper">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-header-bg"></div>
              <div class="modal-header-content">
                <div class="modal-avatar-ring" role="button" tabindex="0" aria-label="Change avatar"
                  @click="scrollToAvatarPicker" @keydown.enter="scrollToAvatarPicker">
                  <img :src="editForm.avatar || student.avatar || 'assets/temp/pfp.png'" class="modal-avatar-img" />
                  <div class="modal-avatar-badge">
                    <q-icon name="photo_camera" size="14px" color="white" />
                  </div>
                </div>
                <div class="modal-title">Edit Profile</div>
                <div class="modal-subtitle">Customize your student profile</div>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
              <q-scroll-area ref="avatarScrollArea" style="height: calc(60vh - 80px);" class="modal-scroll">
                <div class="modal-form-section">
                  <!-- Name Field -->
                  <div class="custom-field">
                    <label class="field-label">
                      <q-icon name="person" size="14px" class="field-label-icon" />
                      Full Name
                    </label>
                    <div class="field-input-wrap">
                      <input v-model="editForm.name" class="field-input" placeholder="Enter your name" type="text" />
                    </div>
                  </div>

                  <!-- Section Field -->
                  <div class="custom-field">
                    <label class="field-label">
                      <q-icon name="class" size="14px" class="field-label-icon" />
                      Section
                    </label>
                    <div class="field-input-wrap">
                      <input v-model="editForm.section" class="field-input" placeholder="Enter your section"
                        type="text" />
                    </div>
                  </div>

                  <!-- Avatar Picker -->
                  <div class="avatar-section" ref="avatarPickerRef">
                    <div class="avatar-section-header">
                      <div class="avatar-section-line"></div>
                      <span class="avatar-section-label">Choose Avatar</span>
                      <div class="avatar-section-line"></div>
                    </div>
                    <div class="avatar-picker-grid">
                      <div v-for="(avatar, index) in avatars" :key="index" class="avatar-pick-item"
                        :class="{ 'is-selected': editForm.avatar === avatar }" role="radio"
                        :aria-checked="editForm.avatar === avatar" :aria-label="`Avatar ${index + 1}`" tabindex="0"
                        @click="selectAvatar(avatar)" @keydown.enter="selectAvatar(avatar)">
                        <img :src="avatar" class="avatar-pick-img" />
                        <div v-if="editForm.avatar === avatar" class="avatar-pick-check">
                          <q-icon name="check" color="white" size="16px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button class="modal-btn cancel-btn" @click="cancelEdit" :disabled="saving">
                Cancel
              </button>
              <button class="modal-btn save-btn" @click="saveProfile"
                :disabled="saving || !editForm.name.trim() || !editForm.section.trim()">
                <span v-if="!saving">Save Changes</span>
                <span v-else class="saving-dots">Saving<span class="dot">.</span><span class="dot">.</span><span
                    class="dot">.</span></span>
              </button>
            </div>
          </div>
        </q-dialog>

        <!-- About Dialog -->
        <q-dialog v-model="aboutOpen">
          <q-card style="min-width: 300px; border-radius: 16px;">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">About</div>
              <div class="text-body2 text-grey-8">
                This app is an interactive science learning platform for Grade 7 students.
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Dashboard Content with Tab Transition -->
        <div class="q-pa-md dashboard-content q-pb-lg">
          <transition :name="tabTransition" mode="out-in">
            <!-- HOME TAB -->
            <div v-if="activeTab === 'home'" key="home">
              <q-card class="q-mb-lg overall-progress-card">
                <q-card-section>
                  <div class="q-mb-xs">
                    <div class="text-h6 text-white text-weight-bold q-mb-sm">Overall Progress</div>
                    <q-linear-progress :value="progress.overall / 100" size="12px" color="white" class="q-mb-sm"
                      rounded />
                    <div class="row justify-between items-center plain-progress-stats q-pt-xs">
                      <div class="column items-center">
                        <div class="text-h6 text-white text-weight-bold">{{ progress.overall }}%</div>
                        <div class="text-caption text-white" style="opacity: 0.9;">Progress</div>
                      </div>
                      <div class="column items-center">
                        <div class="text-h6 text-white text-weight-bold">{{ progress.completed }}</div>
                        <div class="text-caption text-white" style="opacity: 0.9;">Lessons Completed</div>
                      </div>
                      <div class="column items-center">
                        <div class="text-h6 text-white text-weight-bold">{{ TOTAL_LESSONS }}</div>
                        <div class="text-caption text-white" style="opacity: 0.9;">Total Lessons</div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <div class="text-h5 text-weight-bold q-mb-md section-title">Units</div>
              <div class="units-grid">
                <q-card v-for="unit in units" :key="unit.id" class="unit-card" bordered role="button" tabindex="0"
                  :aria-label="`Go to ${unit.name}: ${unit.description}`" @click="goToUnit(unit)"
                  @keydown.enter="goToUnit(unit)">
                  <q-card-section class="q-pa-md">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-avatar size="60px" class="q-mr-xs"
                          :style="{ backgroundColor: unit.bgColor, borderRadius: '6px' }">
                          <img :src="unit.icon" style="width: 38px; height: 38px;" />
                        </q-avatar>
                        <div>
                          <div class="unit-title text-weight-bold text-white">{{ unit.name }}</div>
                          <div class="unit-description text-white">{{ unit.description }}</div>
                        </div>
                      </div>
                      <div>
                        <q-icon name="chevron_right" size="24px" color="white" />
                      </div>
                    </div>
                    <q-linear-progress :value="unit.progress / 100" size="10px" color="white" class="q-mt-sm" rounded />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- STATISTICS TAB -->
            <div v-else-if="activeTab === 'stats'" key="stats" class="stats-page">
              <div class="text-h5 text-primary text-weight-bold q-mb-md section-title">Progress Statistics</div>

              <q-card class="quiz-statistics-card q-mb-md" @click="goToQuizStats">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="50px" class="q-mr-md" style="background-color: #2196F3; border-radius: 10px;">
                        <img src="icons/brain.png" style="width: 28px; height: 28px;" />
                      </q-avatar>
                      <div>
                        <div class="text-h6 text-weight-bold card-title">Quiz Statistics</div>
                        <div class="text-caption card-subtitle">View detailed quiz performance and analytics</div>
                      </div>
                    </div>
                    <div>
                      <q-icon name="chevron_right" size="24px" color="grey-7" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Unit Progress Chart — with empty state -->
              <q-card class="chart-card q-mb-md">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-avatar size="50px" class="q-mr-md" style="background-color: #9C27B0; border-radius: 10px;">
                        <img src="icons/progress.png" style="width: 28px; height: 28px;" />
                      </q-avatar>
                      <div>
                        <div class="text-h6 text-weight-bold card-title">Unit Progress Overview</div>
                        <div class="text-caption card-subtitle">Visual representation of your progress across all units
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="progress.completed > 0" style="height:250px">
                    <Bar :data="computedChartData" :options="chartOptions" />
                  </div>
                  <div v-else class="empty-chart-state">
                    <q-icon name="bar_chart" size="48px" color="grey-4" />
                    <div class="text-grey-5 q-mt-sm text-body2">Complete some lessons to see your progress here!</div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Completion Pie Chart — with empty state -->
              <q-card class="chart-card q-mb-md">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-avatar size="50px" class="q-mr-md" style="background-color: #FF9800; border-radius: 10px;">
                        <img src="assets/icons/pie-graph.png" style="width: 28px; height: 28px;" />
                      </q-avatar>
                      <div>
                        <div class="text-h6 text-weight-bold card-title">Completion Distribution</div>
                        <div class="text-caption card-subtitle">Overall lesson completion breakdown</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="progress.completed > 0" style="height:250px">
                    <Pie :data="computedPieData" :options="pieOptions" />
                  </div>
                  <div v-else class="empty-chart-state">
                    <q-icon name="pie_chart" size="48px" color="grey-4" />
                    <div class="text-grey-5 q-mt-sm text-body2">No lessons completed yet — start learning!</div>
                  </div>
                </q-card-section>
              </q-card>

              <div v-for="unit in units" :key="unit.id" class="q-mb-md">
                <q-card class="unit-progress-card">
                  <q-card-section class="q-pa-md">
                    <div class="row items-center justify-between" role="button" tabindex="0"
                      :aria-expanded="expandedUnit === unit.id" :aria-label="`Toggle details for ${unit.name}`"
                      @click="toggleUnitDetails(unit)" @keydown.enter="toggleUnitDetails(unit)">
                      <div class="row items-center">
                        <div>
                          <div class="text-h6 text-weight-bold card-title">{{ unit.name }}</div>
                          <div class="text-caption card-subtitle">{{ unit.description }} • {{ unit.progress }}%</div>
                        </div>
                      </div>
                      <div>
                        <q-icon name="chevron_right" size="24px" color="grey-7" :style="{
                          transform: expandedUnit === unit.id ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }" />
                      </div>
                    </div>

                    <q-linear-progress :value="unit.progress / 100" :color="getProgressColor(unit.bgColor)" size="12px"
                      rounded class="q-mt-md" />

                    <q-slide-transition>
                      <div v-if="expandedUnit === unit.id && UNIT_LESSON_IDS[unit.id]" class="lessons-expansion">
                        <div class="text-subtitle2 text-weight-medium q-mt-md q-mb-sm lessons-header">Lessons</div>
                        <div class="lesson-list">
                          <div v-for="lessonId in UNIT_LESSON_IDS[unit.id]" :key="lessonId" class="lesson-row">
                            <div class="lesson-title">{{ getLessonTitle(lessonId) }}</div>
                            <div v-if="currentUser.progress && currentUser.progress[lessonId]?.completed"
                              class="lesson-status-text completed" aria-label="Completed">✅</div>
                            <div v-else class="lesson-status-text incomplete" aria-label="Not completed">○</div>
                          </div>
                        </div>
                      </div>
                    </q-slide-transition>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </transition>
        </div>

        <!-- Floating Footer Tabs -->
        <div class="floating-footer">
          <q-tabs v-model="activeTab" align="justify" indicator-color="transparent" active-color="yellow-5"
            class="text-white footer-tabs" @update:model-value="onTabChange">
            <q-tab name="home" aria-label="Home">
              <template v-slot:default>
                <img src="assets/icons/home.png" style="width: 24px; height: 24px;" />
              </template>
            </q-tab>
            <q-tab name="stats" aria-label="Statistics">
              <template v-slot:default>
                <img src="assets/icons/chart-histogram.png" style="width: 24px; height: 24px;" />
              </template>
            </q-tab>
          </q-tabs>
        </div>

        <!-- Audio Settings Dialog -->
        <q-dialog v-model="settingsOpen">
          <q-card style="min-width:300px; border-radius: 16px;">
            <q-card-section>
              <div class="text-h6 text-primary">Audio Settings</div>
              <q-toggle v-model="bgMusicEnabled" label="Background Music" @update:model-value="audioManager.toggleBg" />
              <q-toggle v-model="sfxEnabled" label="Touch Sounds" @update:model-value="audioManager.toggleSfx" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import { audioManager } from 'src/utils/audioManager'

// ─── Constants (ideally move to src/constants/lessons.js) ───────────────────

const TOTAL_LESSONS = 92

const UNIT_LESSON_IDS = {
  1: Array.from({ length: 27 }, (_, i) => i + 1),
  2: Array.from({ length: 22 }, (_, i) => i + 28),
  3: Array.from({ length: 21 }, (_, i) => i + 50),
  4: Array.from({ length: 22 }, (_, i) => i + 71)
}

const LESSON_TITLES = {
  1: "Lesson 1: Scientific Models",
  2: "Lesson 2: Measurements and Data Organization in Science",
  3: "Lesson 3: Common Laboratory Tools, Equipment, and Wares",
  4: "Lesson 4: Doing Scientific Investigations",
  5: "Technology in Focus",
  6: "Chapter Review",
  7: "Activity 1: Measurement of Some Physical Quantities",
  8: "Chapter Test",
  9: "Lesson 1: The Particles of Matter",
  10: "Lesson 2: The Particle Nature of the Three States of Matter",
  11: "Technology in Focus",
  12: "Chapter Review",
  13: "Activity 2: The Particle Nature of Matter",
  14: "Chapter Test",
  15: "STEM Challenge",
  16: "Lesson 1: The Nature of Solutions",
  17: "Lesson 2: Solubility and Saturation",
  18: "Lesson 3: Factors That Affect Solubility",
  19: "Lesson 4: Expressing Concentration of Solutions",
  20: "Lesson 5: Practical Examples of Solutions: Acids, Bases, and Salt Solutions",
  21: "Technology in Focus",
  22: "Chapter Review",
  23: "Activity 3: Some Factors Affecting Solubility",
  24: "Activity 4: Percent by Mass of Salt in Aqueous Solutions",
  25: "Activity 5: Chemistry of Acids and Bases",
  26: "Chapter Test",
  27: "STEM Challenge",
  28: "Lesson 1: The Microscope: Parts and Function",
  29: "Lesson 2: The Cell: The Basic Unit of Life",
  30: "Technology in Focus",
  31: "Chapter Review",
  32: "Activity 6: Parts of a Compound Microscope",
  33: "Activity 7: Focusing Specimens under the Compound Microscope",
  34: "Chapter Test",
  35: "STEM Challenge",
  36: "Lesson 1: The Cellular Reproduction",
  37: "Lesson 2: Perpetuation of Organisms",
  38: "Technology in Focus",
  39: "Chapter Review",
  40: "Activity 8: Meiosis: Modeling Crossing-Over",
  41: "Activity 9: Sexual Reproduction in Plants",
  42: "Chapter Test",
  43: "Lesson 1: Levels of Biological Organization",
  44: "Lesson 2: Energy Flow in an Ecosystem",
  45: "Technology in Focus",
  46: "Chapter Review",
  47: "Activity 10: Creating a Mini-Pond Ecosystem",
  48: "Chapter Test",
  49: "STEM Challenge",
  50: "Lesson 1: Force and Interaction",
  51: "Lesson 2: Net Force",
  52: "Technology in Focus",
  53: "Chapter Review",
  54: "Activity 11: Measuring Forces",
  55: "Chapter Test",
  56: "Lesson 1: Basic Concepts of Motion",
  57: "Lesson 2: Uniform Motion",
  58: "Technology in Focus",
  59: "Chapter Review",
  60: "Activity 12: Factors Affecting Motion in Toy Cars",
  61: "Chapter Test",
  62: "STEM Challenge",
  63: "Lesson 1: Basic Concepts of Energy and Temperature",
  64: "Lesson 2: Modes of Heat Transfer",
  65: "Lesson 3: Saving Energy Efficiency",
  66: "Technology in Focus",
  67: "Chapter Review",
  68: "Activity 13: Particles in Motion",
  69: "Chapter Test",
  70: "STEM Challenge",
  71: "Lesson 1: Earthquakes along Faults",
  72: "Lesson 2: Measuring Earthquakes",
  73: "Lesson 3: Earthquake Preparedness",
  74: "Technology in Focus",
  75: "Chapter Review",
  76: "Activity 14: Simulation of an Earthquake",
  77: "Chapter Test",
  78: "STEM Challenge",
  79: "Lesson 1: The Earth's Atmosphere",
  80: "Lesson 2: Movement in the Atmosphere",
  81: "Technology in Focus",
  82: "Chapter Review",
  83: "Activity 15: Uneven Heating of Earth's Surface",
  84: "Activity 16: Amount of Water Vapor in the Air",
  85: "Chapter Test",
  86: "STEM Challenge",
  87: "Lesson 1: Earth's Motions",
  88: "Lesson 2: Seasons in the Philippines",
  89: "Technology in Focus",
  90: "Chapter Review",
  91: "Activity 17: Earth's Seasons",
  92: "Chapter Test"
}

const avatars = [
  '/assets/avatars/1.jpg',
  '/assets/avatars/2.jpg',
  '/assets/avatars/3.jpg',
  '/assets/avatars/4.jpg',
  '/assets/avatars/5.jpg',
  '/assets/avatars/6.jpg',
  '/assets/avatars/7.jpg',
  '/assets/avatars/8.jpg',
  '/assets/avatars/9.jpg'
]

// ─── Chart.js setup ──────────────────────────────────────────────────────────

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}

// ─── State ───────────────────────────────────────────────────────────────────

const $q = useQuasar()
const router = useRouter()

// FIX: track previous tab separately so onTabChange always reads the correct old value
const previousTab = ref('home')
const activeTab = ref('home')
const tabTransition = ref('tab-slide-left')
const tabOrder = ['home', 'stats']

const isLoading = ref(true)
const settingsOpen = ref(false)
const aboutOpen = ref(false)
const editProfileModal = ref(false)
const bgMusicEnabled = ref(true)
const sfxEnabled = ref(true)
const expandedUnit = ref(null)
const saving = ref(false)
const sidebarOpen = ref(false)

const avatarScrollArea = ref(null)
const avatarPickerRef = ref(null)

const student = reactive({ name: '', section: '', avatar: '', id: null, chapterTest: { correct: 0, wrong: 0 } })
const progress = reactive({ overall: 0, completed: 0 })
const units = ref([])
const currentUser = reactive({})
const editForm = reactive({ name: '', section: '', avatar: '' })

// ─── Computed chart data (FIX: use computed so Vue reactivity is reliable) ───

const computedChartData = computed(() => ({
  labels: units.value.map(u => u.name),
  datasets: [{
    label: 'Unit Progress (%)',
    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
    data: units.value.map(u => u.progress)
  }]
}))

const computedPieData = computed(() => ({
  labels: ['Completed', 'Remaining'],
  datasets: [{
    backgroundColor: ['#4CAF50', '#E0E0E0'],
    data: [progress.completed, TOTAL_LESSONS - progress.completed]
  }]
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getLessonTitle = (lessonId) => LESSON_TITLES[lessonId] || `Lesson ${lessonId}`

const getProgressColor = (bgColor) => {
  const colorMap = {
    '#42A5F5': 'blue-6',
    '#66BB6A': 'green-6',
    '#FFA726': 'orange-6',
    '#AB47BC': 'purple-6'
  }
  return colorMap[bgColor] || 'primary'
}

const calculateUnitProgress = (unitId, userProgress) => {
  const lessonIds = UNIT_LESSON_IDS[unitId]
  const completed = lessonIds.filter(id => userProgress[id]?.completed).length
  return Math.round((completed / lessonIds.length) * 100)
}

const updateStudentInStorage = (updatedStudent) => {
  try {
    const students = LocalStorage.getItem('students') || []
    const studentIndex = students.findIndex(s => s.studentId === updatedStudent.studentId)
    if (studentIndex !== -1) {
      students[studentIndex] = {
        ...students[studentIndex],
        name: updatedStudent.name,
        section: updatedStudent.section,
        avatar: updatedStudent.avatar
      }
    } else {
      students.push({
        studentId: updatedStudent.studentId,
        name: updatedStudent.name,
        section: updatedStudent.section,
        avatar: updatedStudent.avatar,
        progress: updatedStudent.progress || {},
        chapterTest: updatedStudent.chapterTest || { correct: 0, wrong: 0 }
      })
    }
    LocalStorage.set('students', students)
  } catch (error) {
    console.error('Error updating student in storage:', error)
  }
}

// ─── Tab transition (FIX: use previousTab so direction is always correct) ────

const onTabChange = (newTab) => {
  const oldIndex = tabOrder.indexOf(previousTab.value)
  const newIndex = tabOrder.indexOf(newTab)
  tabTransition.value = newIndex > oldIndex ? 'tab-slide-left' : 'tab-slide-right'
  previousTab.value = newTab
}

// ─── Edit Profile ─────────────────────────────────────────────────────────────

const scrollToAvatarPicker = () => {
  // Scroll the modal scroll area down so user can see the avatar picker
  if (avatarScrollArea.value) {
    avatarScrollArea.value.setScrollPosition('vertical', 9999, 300)
  }
}

const openEditProfile = () => {
  editForm.name = student.name
  editForm.section = student.section
  editForm.avatar = student.avatar || avatars[0]
  editProfileModal.value = true
  sidebarOpen.value = false
}

const selectAvatar = (avatar) => {
  editForm.avatar = avatar
}

const cancelEdit = () => {
  editProfileModal.value = false
  setTimeout(() => {
    editForm.name = ''
    editForm.section = ''
    editForm.avatar = ''
  }, 300)
}

const saveProfile = async () => {
  if (!editForm.name.trim() || !editForm.section.trim()) return
  saving.value = true
  try {
    const updates = {
      name: editForm.name.trim(),
      section: editForm.section.trim(),
      avatar: editForm.avatar
    }
    student.name = updates.name
    student.section = updates.section
    student.avatar = updates.avatar
    currentUser.name = updates.name
    currentUser.section = updates.section
    currentUser.avatar = updates.avatar

    const user = LocalStorage.getItem('currentUser')
    if (user) {
      Object.assign(user, updates)
      LocalStorage.set('currentUser', user)
      updateStudentInStorage(user)
    }

    $q.notify({
      type: 'positive',
      message: 'Profile saved successfully!',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('Error saving profile:', error)
    // FIX: notify user on failure instead of silently failing
    $q.notify({
      type: 'negative',
      message: 'Failed to save profile. Please try again.',
      position: 'top',
      timeout: 3000
    })
  } finally {
    setTimeout(() => {
      editProfileModal.value = false
      saving.value = false
      editForm.name = ''
      editForm.section = ''
      editForm.avatar = ''
    }, 300)
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const goToBookmarks = () => router.push({ name: 'bookmark-page' })

const logout = () => {
  LocalStorage.remove('currentUser')
  router.push({ name: 'login-page' })
}

// FIX: use named routes consistently instead of plain strings
const goToUnit = (unit) => router.push({ name: unit.route })

const goToQuizStats = () => router.push({ name: 'quiz-stats' })

const toggleUnitDetails = (unit) => {
  expandedUnit.value = expandedUnit.value === unit.id ? null : unit.id
}

// ─── Data initialisation ──────────────────────────────────────────────────────

const initializeData = (userData) => {
  const userProgress = userData.progress || {}
  const allLessonIds = Object.keys(LESSON_TITLES).map(Number)
  const completedLessons = allLessonIds.filter(id => userProgress[id]?.completed).length

  progress.completed = completedLessons
  progress.overall = Math.round((completedLessons / TOTAL_LESSONS) * 100)

  units.value = [
    {
      id: 1,
      name: 'UNIT 1',
      description: 'Science of Materials',
      icon: 'icons/scientist.gif',
      bgColor: '#42A5F5',
      locked: false,
      progress: calculateUnitProgress(1, userProgress),
      route: 'unit-1'
    },
    {
      id: 2,
      name: 'UNIT 2',
      description: 'Life Science',
      icon: 'icons/petri-dish.gif',
      bgColor: '#66BB6A',
      locked: false,
      progress: calculateUnitProgress(2, userProgress),
      route: 'unit-2'
    },
    {
      id: 3,
      name: 'UNIT 3',
      description: 'Force, Motion, and Energy',
      icon: 'icons/boot-with-lightning.gif',
      bgColor: '#FFA726',
      locked: false,
      progress: calculateUnitProgress(3, userProgress),
      route: 'unit-3'
    },
    {
      id: 4,
      name: 'UNIT 4',
      description: 'Earth and Space Science',
      icon: 'icons/global.gif',
      bgColor: '#AB47BC',
      locked: false,
      progress: calculateUnitProgress(4, userProgress),
      route: 'unit-4'
    }
  ]
}

// ─── Mounted ──────────────────────────────────────────────────────────────────

onMounted(() => {
  /* const url = new URL(window.location.href)
  if (!url.searchParams.has('_reloaded')) {
    url.searchParams.set('_reloaded', '1')
    window.location.replace(url.toString())
    return
  }
  if (url.searchParams.has('_reloaded')) {
    url.searchParams.delete('_reloaded')
    window.history.replaceState({}, document.title, url.pathname + url.hash)
  } */

  const user = LocalStorage.getItem('currentUser')
  if (!user) {
    router.push({ name: 'login-page' })
    return
  }

  const students = LocalStorage.getItem('students') || []
  const studentFromStorage = students.find(s => s.studentId === user.studentId)
  const finalStudent = studentFromStorage || user

  Object.assign(currentUser, finalStudent)
  student.name = finalStudent.name
  student.section = finalStudent.section
  student.avatar = finalStudent.avatar || ''
  student.id = finalStudent.studentId
  student.chapterTest = finalStudent.chapterTest || { correct: 0, wrong: 0 }

  if (studentFromStorage) {
    LocalStorage.set('currentUser', {
      ...user,
      name: studentFromStorage.name,
      section: studentFromStorage.section,
      avatar: studentFromStorage.avatar
    })
  }

  initializeData(finalStudent)

  const settings = audioManager.getSettings()
  bgMusicEnabled.value = settings.bgMusicEnabled
  sfxEnabled.value = settings.sfxEnabled

  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.bookmark-wrap {
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.bookmark-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  flex-grow: 0 !important;
  flex-shrink: 0 !important;
}

.my-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.toolbar-spacer {
  flex: 1;
}

/* ============================== */
/* TAB TRANSITIONS                */
/* ============================== */

.tab-slide-left-enter-active,
.tab-slide-left-leave-active,
.tab-slide-right-enter-active,
.tab-slide-right-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.tab-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.tab-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.tab-slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* ============================== */
/* PAGE BASE                      */
/* ============================== */

.q-page-container {
  background: #42a7ff;
}

.dashboard-page {
  background: linear-gradient(135deg, #5DA9FF 0%, #C084FC 100%);
  min-height: 100vh;
  position: relative;
}

.header-gradient {
  background: #008BFF;
  border-bottom: 6px solid #0c1374;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-page {
  padding-bottom: 80px;
}

/* ============================== */
/* LOADING OVERLAY                */
/* ============================== */

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #5DA9FF 0%, #C084FC 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ============================== */
/* AVATAR CONTAINER               */
/* ============================== */

.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .profile-avatar .profile-image {
    border: 5px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .avatar-overlay-icon {
    position: absolute;
    bottom: 0;
    right: -5px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    border: 2px solid #008BFF;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1;

    img {
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
  }
}

/* ============================== */
/* SIDEBAR                        */
/* ============================== */

.sidebar-drawer {
  background: #f8faff;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 20px;
  background: linear-gradient(160deg, #008BFF 0%, #0c1374 100%);
}

.sidebar-logo {
  width: 72px;
  height: 72px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  margin-bottom: 12px;
}

.sidebar-brand {
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.sidebar-divider {
  height: 3px;
  background: linear-gradient(90deg, #008BFF, #7c3aed, #008BFF);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 16px 14px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 14px;
  border-radius: 14px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  margin-bottom: 6px;
  -webkit-tap-highlight-color: rgba(0, 139, 255, 0.12);

  &:active {
    background: rgba(0, 139, 255, 0.1);
    transform: scale(0.98);
  }
}

.nav-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #e8f0fe;
  border: 2px solid #c5d8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }
}

.logout-icon-wrap {
  background: #ffeaed;
  border-color: #ffcdd2;
}

.nav-label {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1a237e;
}

.nav-arrow {
  color: #b0bec5;
}

.nav-logout .nav-label {
  color: #e53935;
}

.nav-logout .nav-arrow {
  color: #e57373;
}

.nav-spacer {
  flex: 1;
  min-height: 20px;
}

/* ============================== */
/* EDIT PROFILE MODAL             */
/* ============================== */

.edit-modal-wrapper {
  width: 92vw;
  max-width: 480px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  padding-bottom: 28px;
  overflow: hidden;
}

.modal-header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #008BFF 0%, #0c1374 100%);
  border-radius: 0 0 50% 50% / 0 0 30px 30px;
}

.modal-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 0;
}

.modal-avatar-ring {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  margin-bottom: 14px;

  &:focus-visible {
    outline: 3px solid #FF6D00;
    outline-offset: 3px;
    border-radius: 50%;
  }
}

.modal-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-avatar-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 28px;
  height: 28px;
  background: #FF6D00;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.modal-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 4px;
}

.modal-body {
  flex: 1;
  overflow: hidden;
}

.modal-form-section {
  padding: 24px 20px 16px;
}

.custom-field {
  margin-bottom: 18px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #7986cb;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.field-label-icon {
  color: #7986cb;
}

.field-input-wrap {
  background: #f3f6ff;
  border: 2px solid #dce3ff;
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: #008BFF;
    box-shadow: 0 0 0 3px rgba(0, 139, 255, 0.12);
    background: #fff;
  }
}

.field-input {
  width: 100%;
  padding: 13px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #1a237e;
  background: none;
  border: none;
  outline: none;
  border-radius: 12px;
  box-sizing: border-box;

  &::placeholder {
    color: #b0bec5;
    font-weight: 400;
  }
}

.avatar-section {
  margin-top: 4px;
}

.avatar-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.avatar-section-line {
  flex: 1;
  height: 1px;
  background: #e8eaf6;
}

.avatar-section-label {
  font-size: 12px;
  font-weight: 700;
  color: #7986cb;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  white-space: nowrap;
}

.avatar-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.avatar-pick-item {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.18s ease, transform 0.15s ease;
  background: #f0f4ff;

  &:active {
    transform: scale(0.95);
  }

  &.is-selected {
    border-color: #008BFF;
    box-shadow: 0 0 0 3px rgba(0, 139, 255, 0.2);
  }

  &:focus-visible {
    outline: 3px solid #008BFF;
    outline-offset: 2px;
  }
}

.avatar-pick-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-pick-check {
  position: absolute;
  inset: 0;
  background: rgba(0, 139, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px 20px;
  border-top: 1px solid #f0f4ff;
  background: #fff;
}

.modal-btn {
  flex: 1;
  padding: 13px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cancel-btn {
  background: #f0f4ff;
  color: #5c6bc0;
  flex: 0.65;
}

.save-btn {
  background: linear-gradient(135deg, #008BFF 0%, #0c1374 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(0, 139, 255, 0.35);
}

.saving-dots .dot {
  animation: blink 1.2s infinite;
  opacity: 0;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}

/* ============================== */
/* DASHBOARD CONTENT              */
/* ============================== */

.dashboard-content {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

.section-title {
  color: #ffffff !important;
}

.overall-progress-card {
  background: #FF6D00;
  border: none;
  border-radius: 16px;
  box-shadow: 7px 7px 0px 0px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.plain-progress-stats {
  padding: 4px 0 0 0;

  .column {
    gap: 2px;
  }

  .text-h6 {
    line-height: 1;
    margin-bottom: 0;
  }

  .text-caption {
    line-height: 1.1;
    margin-top: 0;
  }
}

.units-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding-bottom: 80px;
}

.unit-card {
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 16px;
  box-shadow: 7px 7px 0px 0px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &:nth-child(1) {
    background: #ff2b83;
  }

  &:nth-child(2) {
    background: #ff2b2b;
  }

  &:nth-child(3) {
    background: #97ec20;
  }

  &:nth-child(4) {
    background: #b028ff;
  }

  &:focus-visible {
    outline: 3px solid white;
    outline-offset: 2px;
  }
}

.unit-title {
  font-size: 24px;
  color: #1a237e;
  margin-bottom: 2px;
  line-height: 1.2;
  font-weight: 700;
}

.unit-description {
  font-size: 16px;
  color: #5f6368;
  line-height: 1.3;
  margin-top: 0;
  font-weight: 500;
}

/* ============================== */
/* EMPTY CHART STATE              */
/* ============================== */

.empty-chart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  padding: 16px;
}

/* ============================== */
/* STATS CARDS                    */
/* ============================== */

.quiz-statistics-card,
.chart-card,
.unit-progress-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 16px;
  box-shadow: 7px 7px 0px 0px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  overflow: hidden;
}

.card-title {
  color: #1a237e !important;
}

.card-subtitle {
  color: #5f6368 !important;
}

.quiz-statistics-card .row.items-center.justify-between,
.unit-card .row.items-center.justify-between,
.unit-progress-card .row.items-center.justify-between {
  flex-wrap: nowrap !important;
}

.quiz-statistics-card .row.items-center,
.unit-card .row.items-center,
.chart-card .row.items-center,
.unit-progress-card .row.items-center {
  flex-wrap: nowrap !important;
  min-width: 0;
}

.quiz-statistics-card .q-card-section,
.unit-card .q-card-section,
.chart-card .q-card-section,
.unit-progress-card .q-card-section,
.overall-progress-card .q-card-section {
  padding: 16px;
}

.quiz-statistics-card .q-avatar,
.unit-card .q-avatar,
.chart-card .q-avatar,
.unit-progress-card .q-avatar {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.quiz-statistics-card .text-h6,
.unit-card .unit-title,
.chart-card .text-h6,
.unit-progress-card .text-h6,
.overall-progress-card .text-h6 {
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 2px;
  font-size: 16px;
}

.quiz-statistics-card .text-caption,
.unit-card .unit-description,
.chart-card .text-caption,
.unit-progress-card .text-caption {
  color: #5f6368;
  font-size: 13px;
  line-height: 1.4;
}

.overall-progress-card .q-linear-progress,
.unit-card .q-linear-progress,
.unit-progress-card .q-linear-progress {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ============================== */
/* EXPANDABLE LESSONS             */
/* ============================== */

.lessons-expansion {
  border-top: 2px solid rgba(66, 165, 245, 0.3);
  margin-top: 12px;
  padding-top: 12px;
}

.lessons-header {
  color: #1a237e !important;
  font-weight: 600;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.lesson-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e3f2fd;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #1a237e;
  border: 1px solid rgba(66, 165, 245, 0.2);
}

.lesson-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-status-text {
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 12px;

  &.completed {
    color: #4CAF50;
  }

  &.incomplete {
    color: #9E9E9E;
  }
}

/* ============================== */
/* FLOATING FOOTER                */
/* ============================== */

.floating-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #008BFF;
  border: 4px solid #0c1374;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  box-sizing: border-box;
  margin: 0 !important;
  padding: 0 !important;
}

.floating-footer .q-tabs {
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 16px 16px 0 0;
}

.footer-tabs {
  height: 56px;
  margin: 0 !important;
  padding: 0 !important;
}

.footer-tabs .q-tab {
  border-radius: 14px;
  margin: 4px;
  min-height: 48px;
  flex: 1;

  &.q-tab--active {
    background: rgba(255, 255, 255, 0.2);
  }

  img {
    width: 22px;
    height: 22px;
  }
}

.footer-tabs .q-tab__content {
  margin: 0;
  padding: 0;
}

.floating-footer .q-tabs__indicator {
  display: none;
}

/* ============================== */
/* RESPONSIVE                     */
/* ============================== */

@media (max-width: 480px) {
  .sidebar-logo {
    width: 60px;
    height: 60px;
  }

  .sidebar-brand {
    font-size: 18px;
  }

  .nav-item {
    padding: 13px 12px;
  }

  .nav-icon-wrap {
    width: 38px;
    height: 38px;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .nav-label {
    font-size: 15px;
  }

  .edit-modal-wrapper {
    width: 96vw;
  }

  .modal-avatar-ring {
    width: 88px;
    height: 88px;
  }

  .modal-title {
    font-size: 18px;
  }

  .avatar-picker-grid {
    gap: 8px;
  }

  .modal-form-section {
    padding: 20px 16px 12px;
  }

  .modal-footer {
    padding: 12px 16px 16px;
  }

  .footer-tabs {
    height: 52px;

    .q-tab {
      min-height: 44px;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .quiz-statistics-card .q-avatar,
  .unit-card .q-avatar,
  .chart-card .q-avatar,
  .unit-progress-card .q-avatar {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px;
    min-height: 44px;
    margin-right: 12px !important;
  }

  .unit-title {
    font-size: 19px;
  }

  .unit-description {
    font-size: 14px;
  }

  .lesson-list {
    max-height: 160px;
    gap: 6px;
  }

  .lesson-row {
    padding: 10px 12px;
    font-size: 12px;
  }

  .lesson-status-text {
    font-size: 16px;
    margin-left: 8px;
  }

  .quiz-statistics-card .q-card-section,
  .unit-card .q-card-section,
  .chart-card .q-card-section,
  .unit-progress-card .q-card-section,
  .overall-progress-card .q-card-section {
    padding: 14px;
  }
}
</style>