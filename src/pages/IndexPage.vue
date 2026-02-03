<template>
  <q-layout view="hHr LpR lFf">
    <!-- Header -->
    <q-header class="header-gradient">
      <q-toolbar class="q-pa-md">
        <div class="avatar-container relative-position" @click="sidebarOpen = true">
          <q-avatar size="60px" class="profile-avatar">
            <img class="profile-image" :src="student.avatar || 'assets/temp/pfp.png'" />
          </q-avatar>
          <!-- Small icon overlay -->
          <div class="avatar-overlay-icon">
            <img src="assets/icons/profile.png" alt="icon" />
          </div>
        </div>

        <div class="header-info q-ml-md">
          <div class="text-h6 text-white text-weight-bold">{{ student.name }}</div>
          <div class="text-body2 text-white" style="opacity: 0.9;">{{ student.section }}</div>
        </div>

        <q-space />

        <!-- Bookmarks -->
        <div class="text-center q-mr-md">
          <q-btn flat round color="white" @click="goToBookmarks">
            <img src="assets/icons/bookmark.png" style="width: 28px; height: 28px;" />
          </q-btn>
          <div class="text-white text-caption" style="margin-top: -4px;">Bookmarks</div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="dashboard-page" no-padding>

        <!-- Sidebar -->
        <q-drawer v-model="sidebarOpen" side="right" overlay bordered :width="220" class="sidebar-drawer">
          <div class="q-pa-md">
            <div class="sidebar-title text-h5 text-primary text-weight-bold text-center q-mb-md">
              Menu
            </div>
            <q-list>
              <q-item clickable v-ripple @click="openEditProfile">
                <q-item-section avatar>
                  <img src="assets/icons/edit.png" style="width: 20px; height: 20px;" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-large text-h6 text-bold text-black">Edit Profile</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="settingsOpen = true">
                <q-item-section avatar>
                  <img src="assets/icons/audio.png" style="width: 20px; height: 20px;" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-large text-h6 text-bold text-black">Audio</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <img src="assets/icons/about.png" style="width: 20px; height: 20px;" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-large text-h6 text-bold text-black">About</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <img src="assets/icons/logout.png" style="width: 20px; height: 20px;" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-large text-h6 text-bold text-black">Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-drawer>

        <!-- Edit Profile Modal -->
        <q-dialog v-model="editProfileModal" persistent>
          <q-card class="edit-profile-modal unified-card" style="min-width: 90vw; max-width: 500px; max-height: 80vh;">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">Edit Profile</div>
            </q-card-section>

            <q-scroll-area style="height: calc(80vh - 150px);" class="modal-scroll-area">
              <q-card-section class="q-pt-lg">
                <!-- Current Avatar Preview -->
                <div class="row justify-center q-mb-lg">
                  <div class="current-avatar-preview-container">
                    <img :src="editForm.avatar || student.avatar || 'assets/temp/pfp.png'"
                      class="current-avatar-image" />
                  </div>
                </div>

                <!-- Name and Section Fields -->
                <div class="form-fields q-px-sm">
                  <q-input v-model="editForm.name" label="Name" outlined class="q-mb-md unified-input"
                    :rules="[val => !!val || 'Name is required']" dense />

                  <q-input v-model="editForm.section" label="Section" outlined class="q-mb-lg unified-input"
                    :rules="[val => !!val || 'Section is required']" dense />

                  <!-- Avatar Selection -->
                  <div class="text-subtitle1 text-weight-medium q-mb-md text-primary">Choose Avatar</div>
                  <div class="avatar-grid">
                    <div v-for="(avatar, index) in avatars" :key="index" class="avatar-item unified-card"
                      :class="{ 'avatar-selected': editForm.avatar === avatar }" @click="selectAvatar(avatar)">
                      <img :src="avatar" class="avatar-option-image"
                        :class="{ 'avatar-option-selected': editForm.avatar === avatar }" />
                      <div v-if="editForm.avatar === avatar" class="avatar-selected-overlay">
                        <q-icon name="check" color="white" size="24px" />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-scroll-area>

            <q-card-actions align="right" class="q-pa-md modal-actions">
              <q-btn flat label="Cancel" color="grey" @click="cancelEdit" :disabled="saving" class="unified-btn" />
              <q-btn label="Save" color="primary" @click="saveProfile" :loading="saving"
                :disable="!editForm.name || !editForm.section" class="unified-btn" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Dashboard Content -->
        <div class="q-pa-md dashboard-content q-pb-lg">
          <!-- HOME TAB -->
          <div v-if="activeTab === 'home'">
            <q-card class="q-mb-lg overall-progress-card">
              <q-card-section>
                <div class="q-mb-xs">
                  <div class="text-h6 text-white text-weight-bold q-mb-sm">Overall Progress</div>
                  <q-linear-progress :value="progress.overall / 100" size="12px" color="white" class="q-mb-sm"
                    rounded />

                  <!-- Even simpler single line -->
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

            <div class="text-h5 text-primary text-weight-bold q-mb-md section-title">Units</div>
            <div class="units-grid">
              <q-card v-for="unit in units" :key="unit.id" class="unit-card" flat bordered @click="goToUnit(unit)">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="60px" class="q-mr-xs"
                        :style="{ backgroundColor: unit.bgColor, borderRadius: '6px' }">
                        <img :src="unit.icon" style="width: 38px; height: 38px;" />
                      </q-avatar>

                      <div>
                        <div class="unit-title text-weight-bold">{{ unit.name }}</div>
                        <div class="unit-description">{{ unit.description }}</div>
                      </div>
                    </div>
                    <div>
                      <img src="assets/icons/arrow.png" class="lock-icon" />
                    </div>
                  </div>
                  <q-linear-progress :value="unit.progress / 100" size="10px" color="blue-6" class="q-mt-sm" rounded />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- STATISTICS TAB -->
          <div v-if="activeTab === 'stats'" class="stats-page">
            <div class="text-h5 text-primary text-weight-bold q-mb-md section-title">Progress Statistics</div>

            <!-- Quiz Statistics Card -->
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
                    <img src="assets/icons/arrow.png" style="width: 24px; height: 24px;" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Bar Chart: Unit progress -->
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
                <div style="height:250px">
                  <Bar :data="chartData" :options="chartOptions" />
                </div>
              </q-card-section>
            </q-card>

            <!-- Pie Chart Card -->
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
                <div style="height:250px">
                  <Pie :data="pieData" :options="pieOptions" />
                </div>
              </q-card-section>
            </q-card>

            <!-- Chapter Test Summary Card -->
            <q-card class="chapter-test-summary-card q-mb-md" @click="goToChapterTestStats">
              <q-card-section class="q-pa-md">
                <div class="row items-center justify-between">
                  <div class="row items-center">
                    <q-avatar size="50px" class="q-mr-md" style="background-color: #4CAF50; border-radius: 10px;">
                      <img src="assets/icons/check-wrong.png" style="width: 28px; height: 28px;" />
                    </q-avatar>
                    <div>
                      <div class="text-h6 text-weight-bold card-title">Chapter Test Summary</div>
                      <div class="text-caption card-subtitle">Performance analysis of chapter tests</div>
                    </div>
                  </div>
                </div>

                <div class="row justify-around items-center q-mt-md chapter-test-stats">
                  <div class="row items-center">
                    <div class="color-square" style="background-color: #4CAF50;"></div>
                    <div class="text-h6 q-ml-sm stat-text">Correct: {{ student.chapterTest.correct }}</div>
                  </div>

                  <div class="row items-center">
                    <div class="color-square" style="background-color: #F44336;"></div>
                    <div class="text-h6 q-ml-sm stat-text">Wrong: {{ student.chapterTest.wrong }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Unit Progress Cards with Expandable Lessons -->
            <div v-for="unit in units" :key="unit.id" class="q-mb-md">
              <q-card class="unit-progress-card">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between" @click="toggleUnitDetails(unit)">
                    <div class="row items-center">
                      <q-avatar size="50px" class="q-mr-md"
                        :style="{ backgroundColor: unit.bgColor, borderRadius: '10px' }">
                        <img :src="unit.icon" style="width: 28px; height: 28px;" />
                      </q-avatar>
                      <div>
                        <div class="text-h6 text-weight-bold card-title">{{ unit.name }}</div>
                        <div class="text-caption card-subtitle">Progress: {{ unit.progress }}%</div>
                      </div>
                    </div>
                    <div>
                      <img src="assets/icons/arrow.png" :style="{
                        transform: expandedUnit === unit.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        width: '20px'
                      }" />
                    </div>
                  </div>

                  <q-linear-progress :value="unit.progress / 100" :color="getProgressColor(unit.bgColor)" size="12px"
                    rounded class="q-mt-md" />

                  <!-- Expandable Lessons Section -->
                  <q-slide-transition>
                    <div v-if="expandedUnit === unit.id" class="lessons-expansion">
                      <div class="text-subtitle2 text-weight-medium q-mt-md q-mb-sm lessons-header">Lessons</div>
                      <div class="lesson-list">
                        <div v-for="lessonId in UNIT_LESSON_IDS[unit.id]" :key="lessonId" class="lesson-row">
                          <div class="lesson-title">{{ getLessonTitle(lessonId) }}</div>
                          <img v-if="currentUser.progress[lessonId]?.completed" src="/icons/check.png" alt="completed"
                            class="lesson-icon" />
                          <img v-else src="/icons/incomplete.png" alt="incomplete" class="lesson-icon" />
                        </div>
                      </div>
                    </div>
                  </q-slide-transition>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Floating Footer Tabs -->
        <div class="floating-footer">
          <q-tabs v-model="activeTab" align="justify" indicator-color="transparent" active-color="yellow-5"
            class="text-white footer-tabs">
            <q-tab name="home">
              <template v-slot:default>
                <img src="assets/icons/home.png" style="width: 24px; height: 24px;" />
              </template>
            </q-tab>
            <q-tab name="stats">
              <template v-slot:default>
                <img src="assets/icons/chart-histogram.png" style="width: 24px; height: 24px;" />
              </template>
            </q-tab>
          </q-tabs>
        </div>

        <q-dialog v-model="settingsOpen">
          <q-card style="min-width:300px;">
            <q-card-section>
              <div class="text-h6 text-primary">Audio Settings</div>

              <q-toggle v-model="bgMusicEnabled" label="Background Music" @update:model-value="audioManager.toggleBg" />

              <q-toggle v-model="sfxEnabled" label="Touch Sounds" @update:model-value="audioManager.toggleSfx" />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'
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

const settingsOpen = ref(false)
const editProfileModal = ref(false)
const bgMusicEnabled = ref(true)
const sfxEnabled = ref(true)
const expandedUnit = ref(null)
const saving = ref(false)

// Constants
const TOTAL_LESSONS = 92 // Total number of lessons across all units

// Lesson titles mapping - this should match your lesson data structure
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

// Avatar options - using placeholder images
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

// Edit form data
const editForm = reactive({
  name: '',
  section: '',
  avatar: ''
})

// register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

const sidebarOpen = ref(false)
const activeTab = ref('home')
const student = reactive({
  name: '',
  section: '',
  avatar: '',
  id: null,
  chapterTest: {
    correct: 0,
    wrong: 0
  }
})

const progress = reactive({ overall: 0, completed: 0 })
const units = ref([])
const currentUser = reactive({})

const router = useRouter()

// Helper function to get lesson title
const getLessonTitle = (lessonId) => {
  return LESSON_TITLES[lessonId] || `Lesson ${lessonId}`
}

// Helper function to get progress bar color based on unit color
const getProgressColor = (bgColor) => {
  // Return a matching color for the progress bar
  const colorMap = {
    '#42A5F5': 'blue-6',
    '#66BB6A': 'green-6',
    '#FFA726': 'orange-6',
    '#AB47BC': 'purple-6'
  }
  return colorMap[bgColor] || 'primary'
}

const openEditProfile = () => {
  // Set current values to edit form
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
  resetEditForm()
}

const resetEditForm = () => {
  // Don't clear immediately - wait for modal to close
  setTimeout(() => {
    editForm.name = ''
    editForm.section = ''
    editForm.avatar = ''
  }, 300)
}

const saveProfile = async () => {
  saving.value = true

  // Validate form
  if (!editForm.name.trim() || !editForm.section.trim()) {
    console.error('Name and section are required')
    saving.value = false
    return
  }

  try {
    // Update student data
    student.name = editForm.name.trim()
    student.section = editForm.section.trim()
    student.avatar = editForm.avatar

    // Update in LocalStorage
    const user = LocalStorage.getItem('currentUser')
    if (user) {
      user.name = editForm.name.trim()
      user.section = editForm.section.trim()
      user.avatar = editForm.avatar
      LocalStorage.set('currentUser', user)

      // Also update students storage - THIS IS THE FIX!
      updateStudentInStorage(user) // Changed from updateUserProgressInStorage
    }

    // Also update currentUser for consistency
    currentUser.name = editForm.name.trim()
    currentUser.section = editForm.section.trim()
    currentUser.avatar = editForm.avatar

    console.log('Profile saved successfully:', {
      name: student.name,
      section: student.section,
      avatar: student.avatar
    })

  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    // Close modal after a short delay
    setTimeout(() => {
      editProfileModal.value = false
      saving.value = false
      resetEditForm()
    }, 300)
  }
}

// Function to update student in storage
const updateStudentInStorage = (updatedStudent) => {
  try {
    // Get all students from storage
    const students = LocalStorage.getItem('students') || []
    const studentIndex = students.findIndex(s => s.studentId === updatedStudent.studentId)

    if (studentIndex !== -1) {
      // Update the student in the students array
      students[studentIndex] = {
        ...students[studentIndex],
        name: updatedStudent.name,
        section: updatedStudent.section,
        avatar: updatedStudent.avatar
      }
      LocalStorage.set('students', students)
      console.log('Updated student in students array:', students[studentIndex])
    } else {
      // If student doesn't exist in students array, add them
      students.push({
        studentId: updatedStudent.studentId,
        name: updatedStudent.name,
        section: updatedStudent.section,
        avatar: updatedStudent.avatar,
        progress: updatedStudent.progress || {},
        chapterTest: updatedStudent.chapterTest || { correct: 0, wrong: 0 }
      })
      LocalStorage.set('students', students)
      console.log('Added new student to students array')
    }
  } catch (error) {
    console.error('Error updating student:', error)
  }
}

const goToBookmarks = () => router.push({ name: 'bookmark-page' })
const logout = () => {
  LocalStorage.remove('currentUser')
  router.push({ name: 'login-page' })
}
const goToUnit = (unit) => router.push(unit.route)
const goToQuizStats = () => router.push({ name: 'quiz-stats' })
const goToChapterTestStats = () => router.push({ name: 'chapter-test-stats' })
const toggleUnitDetails = (unit) => {
  expandedUnit.value = expandedUnit.value === unit.id ? null : unit.id
}

const UNIT_LESSON_IDS = {
  1: Array.from({ length: 27 }, (_, i) => i + 1),
  2: Array.from({ length: 22 }, (_, i) => i + 28),
  3: Array.from({ length: 21 }, (_, i) => i + 50),
  4: Array.from({ length: 22 }, (_, i) => i + 71)
}

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Unit Progress (%)',
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
      data: []
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

const pieData = ref({
  labels: ['Completed', 'Remaining'],
  datasets: [
    {
      backgroundColor: ['#4CAF50', '#E0E0E0'],
      data: [0, 0]
    }
  ]
})

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

onMounted(() => {
  const url = new URL(window.location.href);

  // Force reload if not yet reloaded
  if (!url.searchParams.has('_reloaded')) {
    url.searchParams.set('_reloaded', '1');
    window.location.replace(url.toString());
    return;
  }

  // Clean up the flag after reload so it can reload again next time
  if (url.searchParams.has('_reloaded')) {
    url.searchParams.delete('_reloaded');
    window.history.replaceState({}, document.title, url.pathname + url.hash);
  }

  const user = LocalStorage.getItem('currentUser');
  if (!user) {
    router.push({ name: 'login-page' });
    return;
  }

  // Get the student from the students array to ensure we have the latest data
  const students = LocalStorage.getItem('students') || [];
  const studentFromStorage = students.find(s => s.studentId === user.studentId);

  // Use data from students array if available, otherwise from currentUser
  const finalStudent = studentFromStorage || user;

  // Update currentUser with the latest data from storage
  Object.assign(currentUser, finalStudent)

  // Update student reactive object with data from students array
  student.name = finalStudent.name
  student.section = finalStudent.section
  student.avatar = finalStudent.avatar || ''
  student.id = finalStudent.studentId
  student.chapterTest = finalStudent.chapterTest || { correct: 0, wrong: 0 }

  // Also ensure currentUser in localStorage has the latest data
  if (studentFromStorage) {
    // Sync currentUser with the data from students array
    LocalStorage.set('currentUser', {
      ...user,
      name: studentFromStorage.name,
      section: studentFromStorage.section,
      avatar: studentFromStorage.avatar
    })
  }

  // Calculate progress based on total 92 lessons
  const allLessons = Object.values(finalStudent.progress || {})
  const completedLessons = allLessons.filter(l => l.completed).length

  progress.completed = completedLessons
  // Fix: Calculate overall progress based on total 92 lessons
  progress.overall = TOTAL_LESSONS ? Math.round((completedLessons / TOTAL_LESSONS) * 100) : 0

  units.value = [
    {
      id: 1,
      name: 'UNIT 1',
      description: 'Science of Materials',
      icon: 'icons/scientist.gif',
      bgColor: '#42A5F5', // blue
      locked: false,
      progress: Math.round(
        UNIT_LESSON_IDS[1].filter(id => (finalStudent.progress || {})[id]?.completed).length /
        UNIT_LESSON_IDS[1].length * 100
      ),
      route: 'unit-1'
    },
    {
      id: 2,
      name: 'UNIT 2',
      description: 'Life Science',
      icon: 'icons/petri-dish.gif',
      bgColor: '#66BB6A', // green
      locked: false,
      progress: Math.round(
        UNIT_LESSON_IDS[2].filter(id => (finalStudent.progress || {})[id]?.completed).length /
        UNIT_LESSON_IDS[2].length * 100
      ),
      route: 'unit-2'
    },
    {
      id: 3,
      name: 'UNIT 3',
      description: 'Force, Motion, and Energy',
      icon: 'icons/boot-with-lightning.gif',
      bgColor: '#FFA726', // orange
      locked: false,
      progress: Math.round(
        UNIT_LESSON_IDS[3].filter(id => (finalStudent.progress || {})[id]?.completed).length /
        UNIT_LESSON_IDS[3].length * 100
      ),
      route: 'unit-3'
    },
    {
      id: 4,
      name: 'UNIT 4',
      description: 'Earth and Space Science',
      icon: 'icons/global.gif',
      bgColor: '#AB47BC', // purple
      locked: false,
      progress: Math.round(
        UNIT_LESSON_IDS[4].filter(id => (finalStudent.progress || {})[id]?.completed).length /
        UNIT_LESSON_IDS[4].length * 100
      ),
      route: 'unit-4'
    }
  ]

  // Update bar chart
  chartData.value.labels = units.value.map(u => u.name)
  chartData.value.datasets[0].data = units.value.map(u => u.progress)

  // Update pie chart - based on total 92 lessons
  pieData.value.datasets[0].data = [completedLessons, TOTAL_LESSONS - completedLessons]

  //Audio
  const settings = audioManager.getSettings()
  bgMusicEnabled.value = settings.bgMusicEnabled
  sfxEnabled.value = settings.sfxEnabled
})
</script>

<style lang="scss" scoped>
.q-page-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dashboard-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .profile-avatar {
    .profile-image {
      border: 5px solid white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
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

    &:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }
  }
}

.edit-icon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sidebar-drawer {
  .sidebar-title {
    border-bottom: 2px solid #e3f2fd;
    padding-bottom: 8px;
  }

  .sidebar-item {
    border-radius: 8px;
    margin-bottom: 4px;

    &:hover {
      background: #e3f2fd;
    }
  }
}

.dashboard-content {
  max-width: 600px;
  margin: 0 auto;

  /* Reserve space for nav bar + footer */
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

/* Section titles with white text for better contrast */
.section-title {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


/* ============================== */
/* EDIT PROFILE MODAL STYLES */
/* ============================== */

/* Unified card design for modal */
.edit-profile-modal.unified-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-bottom: 6px solid #42A5F5;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-bottom-width: 8px;
  }
}

/* Current avatar preview with border on image */
.current-avatar-preview-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  .current-avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 6px solid #42A5F5;
    border-radius: 12px;
    box-sizing: border-box;
  }
}

/* Unified input styling */
.unified-input {
  .q-field__control {
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.95);
    transition: all 0.2s ease;

    &:hover {
      border-color: #42A5F5;
    }
  }

  &.q-field--outlined .q-field__control:before {
    border: none;
  }
}

/* Avatar grid styling */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-item.unified-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  height: 90px;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    border-color: #42A5F5;
  }
}

.avatar-option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.avatar-option-selected {
  border: 3px solid #42A5F5;
}

.avatar-selected {
  background-color: rgba(66, 165, 245, 0.2);
  border: 2px solid #42A5F5;

  .avatar-option-image {
    border: 3px solid #42A5F5;
  }
}

.avatar-selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(66, 165, 245, 0.7);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

/* Unified button styling */
.unified-btn {
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* ============================== */
/* UNIFIED CARD DESIGN SYSTEM */
/* ============================== */

/* Base card styling for all interactive cards */
.quiz-statistics-card,
.chart-card,
.unit-progress-card,
.chapter-test-summary-card,
.overall-progress-card,
.unit-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
}

/* Individual card border colors - BOTTOM BORDER STYLING */
.quiz-statistics-card {
  border-bottom: 6px solid #2196F3;

  &:hover {
    border-bottom-width: 8px;
  }
}

.chart-card {
  border-bottom: 6px solid #9C27B0;

  &:hover {
    border-bottom-width: 8px;
  }
}

.unit-progress-card {
  border-bottom: 6px solid #42A5F5;

  &:hover {
    border-bottom-width: 8px;
  }
}

.chapter-test-summary-card {
  border-bottom: 6px solid #4CAF50;

  &:hover {
    border-bottom-width: 8px;
  }
}

.overall-progress-card {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border-bottom: 6px solid #E65100;

  &:hover {
    border-bottom-width: 8px;
  }
}

.unit-card {
  border-bottom: 6px solid #9575CD;

  &:hover {
    border-bottom-width: 8px;
  }
}

/* Card title and subtitle colors */
.card-title {
  color: #1a237e !important;
}

.card-subtitle {
  color: #5f6368 !important;
}

.stat-text {
  color: #1a237e !important;
}

/* Chapter test summary - ensure horizontal alignment on all screens */
.chapter-test-stats {
  flex-wrap: nowrap !important;

  .row.items-center {
    flex-wrap: nowrap !important;
    white-space: nowrap;
  }
}

/* Plain progress stats styling */
.plain-progress-stats {
  padding: 4px 0 0 0;

  .text-center {
    flex: 1;
    padding: 0 4px;

    .stat-number {
      font-size: 20px;
      font-weight: 700;
      color: white;
      line-height: 1;
      margin-bottom: 0;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 11px;
      line-height: 1.2;
      margin-top: 0;
      padding-top: 0;
    }
  }
}

.plain-progress-stats {
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

/* Force horizontal layout for all cards with icon-text-arrow structure */
.quiz-statistics-card .row.items-center.justify-between,
.unit-card .row.items-center.justify-between,
.chapter-test-summary-card .row.items-center.justify-between,
.unit-progress-card .row.items-center.justify-between {
  flex-wrap: nowrap !important;
}

.quiz-statistics-card .row.items-center,
.unit-card .row.items-center,
.chart-card .row.items-center,
.unit-progress-card .row.items-center,
.chapter-test-summary-card .row.items-center {
  flex-wrap: nowrap !important;
  min-width: 0;
}

/* Ensure consistent padding */
.quiz-statistics-card .q-card-section,
.unit-card .q-card-section,
.chart-card .q-card-section,
.unit-progress-card .q-card-section,
.chapter-test-summary-card .q-card-section,
.overall-progress-card .q-card-section {
  padding: 16px;
}

/* Consistent avatar styling */
.quiz-statistics-card .q-avatar,
.unit-card .q-avatar,
.chart-card .q-avatar,
.unit-progress-card .q-avatar,
.chapter-test-summary-card .q-avatar {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

/* Consistent text styling */
.quiz-statistics-card .text-h6,
.unit-card .unit-title,
.chart-card .text-h6,
.unit-progress-card .text-h6,
.chapter-test-summary-card .text-h6,
.overall-progress-card .text-h6 {
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 4px;
  font-size: 16px;
}

.quiz-statistics-card .text-caption,
.unit-card .unit-description,
.chart-card .text-caption,
.unit-progress-card .text-caption,
.chapter-test-summary-card .text-caption {
  color: #5f6368;
  font-size: 13px;
  line-height: 1.4;
}

/* Arrow icon consistency */
.quiz-statistics-card img[src*="arrow-right.png"],
.unit-card img[src*="arrow.png"],
.chart-card img[src*="arrow-right.png"],
.unit-progress-card img[src*="arrow-right.png"],
.chapter-test-summary-card img[src*="arrow-right.png"] {
  width: 20px;
  height: 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.quiz-statistics-card:hover img[src*="arrow-right.png"],
.unit-card:hover img[src*="arrow.png"],
.chapter-test-summary-card:hover img[src*="arrow-right.png"] {
  transform: translateX(4px);
}

/* Progress bars */
.overall-progress-card .q-linear-progress,
.unit-card .q-linear-progress,
.unit-progress-card .q-linear-progress {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Chapter test summary specific styling */
.color-square {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.chapter-test-summary-card .text-h6 {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

/* ============================== */
/* EXPANDABLE LESSONS STYLING */
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
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #1a237e;
  transition: all 0.2s ease;
  border: 1px solid rgba(66, 165, 245, 0.2);

  &:hover {
    background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
    transform: translateX(4px);
  }
}

.lesson-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

/* ============================== */
/* FLOATING FOOTER */
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
  transition: all 0.3s ease;
  min-height: 48px;
  flex: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

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
/* RESPONSIVE ADJUSTMENTS */
/* ============================== */

.units-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding-bottom: 80px;
}

.unit-title {
  font-size: 16px;
  color: #1a237e;
}

.unit-description {
  font-size: 13px;
  color: #5f6368;
}

/* Avatar grid responsive adjustments */
@media (max-width: 480px) {
  .avatar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .avatar-item.unified-card {
    height: 80px;
  }

  .current-avatar-preview-container {
    width: 100px;
    height: 100px;

    .current-avatar-image {
      border-width: 4px;
    }
  }
}

@media (max-width: 480px) {
  .dashboard-page {
    padding-bottom: 0;
  }

  .dashboard-content {
    padding-bottom: 5px;
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

  /* Card adjustments for mobile */
  .quiz-statistics-card .q-avatar,
  .unit-card .q-avatar,
  .chart-card .q-avatar,
  .unit-progress-card .q-avatar,
  .chapter-test-summary-card .q-avatar {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px;
    min-height: 44px;
    margin-right: 12px !important;
  }

  .quiz-statistics-card .text-h6,
  .unit-card .unit-title,
  .chart-card .text-h6,
  .unit-progress-card .text-h6,
  .chapter-test-summary-card .text-h6,
  .overall-progress-card .text-h6 {
    font-size: 15px;
  }

  .quiz-statistics-card .text-caption,
  .unit-card .unit-description,
  .chart-card .text-caption,
  .unit-progress-card .text-caption,
  .chapter-test-summary-card .text-caption {
    font-size: 12px;
  }

  /* Chapter test stats on mobile */
  .chapter-test-stats {
    justify-content: space-between !important;

    .row.items-center {
      flex: 1;
      justify-content: center;
    }

    .text-h6 {
      font-size: 14px;
    }

    .color-square {
      width: 16px;
      height: 16px;
    }
  }

  /* Lesson list on mobile */
  .lesson-list {
    max-height: 160px;
    gap: 6px;
  }

  .lesson-row {
    padding: 10px 12px;
    font-size: 12px;
  }

  .lesson-icon {
    width: 16px;
    height: 16px;
  }

  /* Adjust padding on mobile */
  .quiz-statistics-card .q-card-section,
  .unit-card .q-card-section,
  .chart-card .q-card-section,
  .unit-progress-card .q-card-section,
  .chapter-test-summary-card .q-card-section,
  .overall-progress-card .q-card-section {
    padding: 14px;
  }
}
</style>