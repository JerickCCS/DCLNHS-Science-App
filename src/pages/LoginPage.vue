<template>
    <div class="login-page">
        <!-- Background Elements -->
        <div class="background-blobs">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
        </div>

        <div class="login-card">
            <!-- Header with Logo -->
            <div class="login-header">
                <div class="logo-container">
                    <img src="/logo/logo.png" alt="App Logo" class="app-logo" />
                    <div class="logo-glow"></div>
                </div>
                <div class="header-text">
                    <h1 class="title">Welcome Students!</h1>
                    <p class="subtitle">Select your profile to continue</p>
                </div>
            </div>

            <!-- Profiles List -->
            <div v-if="students.length > 0" class="profiles-container">
                <!-- Updated Profiles Header with modal design -->
                <div class="profiles-header-modal">
                    <div class="profiles-header-card">
                        <span class="profiles-title">Saved Profiles</span>
                        <span class="profiles-count">{{ students.length }}</span>
                    </div>
                </div>

                <div class="profiles-grid">
                    <div v-for="student in students" :key="student.name + student.section" class="profile-card-modal"
                        @click="loginWithProfile(student)">
                        <div class="profile-avatar-modal">
                            <img v-if="student.avatar" :src="student.avatar" class="profile-avatar-image"
                                :alt="student.name" />
                            <span v-else class="profile-avatar-text">{{ getInitials(student.name) }}</span>
                        </div>
                        <div class="profile-info-modal">
                            <div class="profile-name-modal">{{ student.name }}</div>
                            <div class="profile-section-modal">
                                Section : {{ student.section }}
                            </div>
                        </div>
                        <div class="profile-action-modal">
                            <div class="arrow-icon-modal">→</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Profiles State with modal design -->
            <div v-else class="empty-state-modal">
                <div class="empty-icon-modal">👤</div>
                <h3 class="empty-title-modal">No Profiles Yet</h3>
                <p class="empty-description-modal">Create your first profile to get started</p>
            </div>

            <!-- Fixed Add Profile Button at Bottom -->
            <div class="fixed-actions-container">
                <button class="add-profile-btn-modal" @click="showAddProfile = true">
                    <span class="btn-icon-modal">+</span>
                    <span class="btn-text-modal">Add New Profile</span>
                </button>
            </div>
        </div>

        <!-- Add Profile Modal -->
        <q-dialog v-model="showAddProfile" persistent>
            <q-card class="modal-card q-pa-none">
                <!-- Red Title Card (Properly Overlapping) -->
                <div class="title-card-overlay row flex-center">
                    <div class="title-card bg-negative text-white q-px-xl q-py-sm text-center">
                        Create New Profile
                    </div>
                </div>

                <!-- Modal Content -->
                <q-card-section class="modal-content q-pt-xl q-pb-md q-px-lg">
                    <!-- Instruction Text -->
                    <p class="text-center text-white q-mb-lg q-mt-none">
                        Add your details to create a new profile
                    </p>

                    <!-- Form -->
                    <div class="q-gutter-y-lg">
                        <!-- Name Input -->
                        <div>
                            <div class="input-label text-white q-mb-xs">Name</div>
                            <q-input v-model="newName" outlined dense placeholder="Enter your full name"
                                bg-color="dark-blue-input" class="custom-input full-width">
                                <template v-slot:prepend>
                                    <q-icon name="person" color="white" />
                                </template>
                            </q-input>
                        </div>

                        <!-- Section Input -->
                        <div>
                            <div class="input-label text-white q-mb-xs">Section</div>
                            <q-input v-model="newSection" outlined dense placeholder="Enter your section"
                                bg-color="dark-blue-input" class="custom-input full-width">
                                <template v-slot:prepend>
                                    <q-icon name="school" color="white" />
                                </template>
                            </q-input>
                        </div>

                        <!-- Avatar Selection -->
                        <div>
                            <div class="input-label text-white q-mb-xs">Choose Avatar</div>
                            <div class="avatar-selection-grid">
                                <div v-for="(avatar, index) in avatars" :key="index" class="avatar-selection-item"
                                    :class="{ 'avatar-selection-selected': selectedAvatar === avatar }"
                                    @click="selectAvatar(avatar)">
                                    <img :src="avatar" class="avatar-selection-image" />
                                    <div v-if="selectedAvatar === avatar" class="avatar-selection-check">
                                        <q-icon name="check" color="white" size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <!-- Modal Actions -->
                <q-card-actions class="modal-actions q-px-lg q-pb-lg q-pt-none">
                    <div class="row full-width q-col-gutter-sm">
                        <div class="col-6">
                            <q-btn label="Cancel" flat class="cancel-btn full-width" @click="showAddProfile = false"
                                no-caps />
                        </div>
                        <div class="col-6">
                            <q-btn label="Create Profile" class="create-btn full-width" @click="addProfile" no-caps />
                        </div>
                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'
import { setCurrentUser } from 'src/utils/session'

const $q = useQuasar()
const $router = useRouter()

const students = ref([])
const showAddProfile = ref(false)
const newName = ref('')
const newSection = ref('')
const selectedAvatar = ref('')

// Avatar options - matching the index page
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

onMounted(() => {
    loadStudents()
    // Set default avatar
    selectedAvatar.value = avatars[0]
})

// Load students from localStorage
const loadStudents = () => {
    try {
        const storedStudents = LocalStorage.getItem('students') || []
        // Ensure each student has an avatar property
        students.value = storedStudents.map(student => ({
            studentId: student.studentId,
            name: student.name,
            section: student.section,
            avatar: student.avatar || avatars[0], // Fallback to first avatar
            progress: student.progress || {},
            chapterTest: student.chapterTest || { correct: 0, wrong: 0 }
        }))
    } catch (error) {
        console.error('Error loading students:', error)
        students.value = []
    }
}

// Create a new student
const createStudent = (name, section, avatar = '') => {
    try {
        // Get existing students
        const studentsList = LocalStorage.getItem('students') || []

        // Check if student already exists
        const existingStudent = studentsList.find(s =>
            s.name.toLowerCase() === name.toLowerCase() &&
            s.section.toLowerCase() === section.toLowerCase()
        )

        if (existingStudent) {
            return { error: 'Student already exists' }
        }

        // Create new student with unique ID
        const studentId = generateStudentId()
        const newStudent = {
            studentId: studentId,
            name: name.trim(),
            section: section.trim(),
            avatar: avatar || avatars[0], // Store the selected avatar
            progress: {}, // Initialize empty progress
            chapterTest: {
                correct: 0,
                wrong: 0
            },
            createdAt: new Date().toISOString()
        }

        // Add to students array
        studentsList.push(newStudent)

        // Save to localStorage
        LocalStorage.set('students', studentsList)

        return newStudent
    } catch (error) {
        console.error('Error creating student:', error)
        return { error: 'Failed to create student' }
    }
}

// Generate unique student ID
const generateStudentId = () => {
    return 'STU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

// Get initials for avatar fallback
const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

// Avatar selection
const selectAvatar = (avatar) => {
    selectedAvatar.value = avatar
}

const loginWithProfile = (student) => {
    // Ensure the student object has all required properties including avatar
    const completeStudent = {
        ...student,
        avatar: student.avatar || avatars[0]
    }
    setCurrentUser(completeStudent)
    $router.push('/')
}

const addProfile = () => {
    if (!newName.value || !newSection.value) {
        $q.notify({
            type: 'negative',
            message: 'Please fill in both fields',
            position: 'top',
            timeout: 2000
        })
        return
    }

    // Ensure we have a valid avatar selected
    const avatarToUse = selectedAvatar.value || avatars[0]

    // Create student with avatar
    const newStudent = createStudent(newName.value.trim(), newSection.value.trim(), avatarToUse)

    if (newStudent.error) {
        $q.notify({
            type: 'warning',
            message: newStudent.error,
            position: 'top',
            timeout: 2000
        })
        return
    }

    // Reload students list
    loadStudents()

    // Set current user with the complete student data including avatar
    setCurrentUser(newStudent)

    $q.notify({
        type: 'positive',
        message: 'Welcome! Profile created successfully',
        position: 'top',
        timeout: 2000
    })

    // Reset form
    newName.value = ''
    newSection.value = ''
    selectedAvatar.value = avatars[0]
    showAddProfile.value = false

    // Navigate to dashboard
    $router.push('/')
}
</script>

<style scoped>
/* Global body fixes */
:deep(body),
:deep(html) {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: #8ce4d1;
    position: fixed;
}

:deep(#q-app) {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    padding: 16px;
    box-sizing: border-box;
    background: #8ce4d1;
}

.login-card {
    width: 100%;
    max-width: 480px;
    height: 100vh;
    max-height: 100vh;
    background: transparent;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    /* Add padding-bottom to account for fixed button */
    padding-bottom: 90px;
}

/* Fixed header section */
.login-header {
    text-align: center;
    flex-shrink: 0;
    padding-top: 5vh;
    padding-bottom: 2vh;
}

/* Increased logo size */
.logo-container {
    position: relative;
    width: min(220px, 45vw);
    height: min(220px, 45vw);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Responsive logo - Made larger */
.app-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
    position: relative;
    animation: slow-bounce 4s ease-in-out infinite;
    max-width: 200px;
    max-height: 200px;
}

@keyframes slow-bounce {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }

    100% {
        transform: translateY(0);
    }
}

.header-text {
    margin-top: -5px;
}

.title {
    font-size: clamp(1.8rem, 5vw, 2.2rem);
    font-weight: 700;
    margin-bottom: 2px;
    background: linear-gradient(45deg, #2c5282, #4299e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
}

.subtitle {
    font-size: clamp(1rem, 3vw, 1.2rem);
    color: #2d3748;
    font-weight: 600;
    margin-top: 2px;
    line-height: 1.2;
}

/* Scrollable content area - FIXED OVERLAP */
.profiles-container {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: linear-gradient(145deg, #f5f5f5, #eef0f3) !important;
    border-radius: 16px;
    padding: 16px;
    border: 2px solid #000000 !important;
    box-shadow: 0 4px 0 #0d3660 !important;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 0;
    /* Add padding at bottom for button */
    padding-bottom: 80px;
}

/* MODAL-STYLE PROFILES HEADER */
.profiles-header-modal {
    position: relative;
    margin-bottom: 8px;
    flex-shrink: 0;
}

.profiles-header-card {
    border: 2px solid #000000 !important;
    border-radius: 12px !important;
    background: #2138ba !important;
    box-shadow: 0 4px 0 #354dd4 !important;
    font-weight: bold !important;
    text-align: center !important;
    padding: 8px 16px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 44px;
}

.profiles-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.profiles-count {
    background: white;
    color: #4635a8;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
    border: 1px solid #000000;
    box-shadow: 0 2px 0 #000000;
}

/* SCROLLABLE AREA */
.profiles-grid {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;
    padding-bottom: 0;
}

/* Custom scrollbar styling */
.profiles-grid::-webkit-scrollbar {
    width: 4px;
}

.profiles-grid::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.profiles-grid::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

.profiles-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4);
}

/* MODAL-STYLE PROFILE CARDS */
.profile-card-modal {
    display: flex;
    align-items: center;
    padding: 14px;
    background: #ffffff !important;
    border: 2px solid #1f21a5 !important;
    border-radius: 12px !important;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    min-height: 70px;
    box-sizing: border-box;
}

.profile-card-modal:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 0 #000000 !important;
    background: #2088f8 !important;
    color: white;
}

.profile-avatar-modal {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
    border: 2px solid #000000;
    box-shadow: 0 2px 0 #000000;
    overflow: hidden;
    background: linear-gradient(135deg, #4299e1, #3182ce);
}

.profile-avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.profile-avatar-text {
    color: white;
    font-weight: 700;
    font-size: 1rem;
}

.profile-info-modal {
    flex: 1;
    min-width: 0;
}

.profile-name-modal {
    font-weight: 600;
    color: rgb(0, 0, 0);
    margin-bottom: 4px;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-section-modal {
    color: #000000;
    font-size: 0.8rem;
    white-space: nowrap;
}

.profile-action-modal {
    display: flex;
    align-items: center;
    color: white;
    font-weight: 500;
    flex-shrink: 0;
}

.arrow-icon-modal {
    font-size: 1.5rem;
    font-weight: bold;
    transition: transform 0.3s ease;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.profile-card-modal:hover .arrow-icon-modal {
    transform: translateX(5px);
}

/* MODAL-STYLE EMPTY STATE */
.empty-state-modal {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    text-align: center;
    padding: 40px 16px;
    background: linear-gradient(145deg, #0d47a1, #1565c0) !important;
    border-radius: 16px;
    border: 2px solid #000000 !important;
    box-shadow: 0 4px 0 #0d3660 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0;
    /* Add padding for button */
    padding-bottom: 100px;
}

.empty-icon-modal {
    font-size: 2.5rem;
    margin-bottom: 16px;
    opacity: 0.8;
    color: white;
}

.empty-title-modal {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
}

.empty-description-modal {
    color: #a0c8ff;
    font-size: 0.95rem;
    max-width: 80%;
    line-height: 1.4;
}

/* FIXED BOTTOM BUTTON CONTAINER - Improved positioning */
.fixed-actions-container {
    position: fixed;
    bottom: 16px;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
    z-index: 1000;
    background: transparent;
}

/* MODAL-STYLE ADD PROFILE BUTTON */
.add-profile-btn-modal {
    width: 100%;
    padding: 14px;
    background: #2138ba !important;
    color: white;
    border: 2px solid #000000 !important;
    border-radius: 12px !important;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 0 #2138ba !important;
    min-height: 52px;
}

.add-profile-btn-modal:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #21BA45 !important;
}

.add-profile-btn-modal:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #000000 !important;
}

.btn-icon-modal {
    font-size: 1.2rem;
    font-weight: 300;
}

/* Avatar Selection Grid */
.avatar-selection-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 8px;
}

.avatar-selection-item {
    position: relative;
    width: 100%;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
}

.avatar-selection-item:hover {
    border-color: #42A5F5;
    transform: scale(1.05);
}

.avatar-selection-selected {
    border-color: #42A5F5;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.3);
}

.avatar-selection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-selection-check {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(66, 165, 245, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* =========================================================================== */
/* MODAL STYLES */
/* =========================================================================== */

/* Dialog Backdrop */
:deep(.q-dialog__backdrop) {
    background-color: rgba(0, 0, 0, 0.7) !important;
}

/* Modal Card - Main Container */
.modal-card {
    border: 2px solid #000000 !important;
    border-radius: 16px !important;
    background: linear-gradient(145deg, #0d47a1, #1565c0) !important;
    box-shadow: 0 4px 0 #0d3660 !important;
    position: relative !important;
    overflow: visible !important;
    max-width: 400px !important;
    width: 90vw !important;
}

/* Title card overlay - Centered at top */
.title-card-overlay {
    position: absolute !important;
    top: -20px !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 10 !important;
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
}

/* REDUCED MODAL TITLE CARD SIZE */
.title-card {
    border: 2px solid #000000 !important;
    border-radius: 12px !important;
    background: #C10015 !important;
    box-shadow: 0 4px 0 #C10015 !important;
    font-weight: bold !important;
    text-align: center !important;
    white-space: nowrap !important;
    padding: 6px 24px !important;
    font-size: 1rem !important;
}

/* Modal content area */
.modal-content {
    padding-top: 2rem !important;
    padding-bottom: 0.5rem !important;
}

.modal-content p {
    font-size: 1rem !important;
    margin-bottom: 1.5rem !important;
    line-height: 1.4 !important;
}

/* Input labels */
.input-label {
    font-weight: bold !important;
    margin-bottom: 0.25rem !important;
    display: block !important;
}

/* Custom Dark Blue Color for Inputs */
.bg-dark-blue-input {
    background-color: #0d3660 !important;
}

/* Form Inputs - Dark Blue Background */
:deep(.custom-input .q-field__control) {
    border-radius: 8px !important;
    border: 2px solid #000000 !important;
    background-color: #0d3660 !important;
}

:deep(.custom-input .q-field__control:before),
:deep(.custom-input .q-field__control:after) {
    display: none !important;
}

:deep(.custom-input .q-field__native) {
    color: white !important;
    font-size: 1rem !important;
}

:deep(.custom-input .q-field__native::placeholder) {
    color: rgba(255, 255, 255, 0.7) !important;
}

/* ADD SPACING BETWEEN ICON AND PLACEHOLDER TEXT */
:deep(.custom-input .q-field__prepend) {
    padding-right: 8px !important;
    padding-left: 8px !important;
}

/* Ensure the input text has proper spacing */
:deep(.custom-input .q-field__native) {
    padding-left: 4px !important;
}

/* Remove the margin from the icon itself */
:deep(.custom-input .q-icon) {
    margin-right: 0 !important;
    margin-left: 0 !important;
}

/* Keep the control container without extra padding */
:deep(.custom-input .q-field__control) {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

/* Modal buttons container */
.modal-actions {
    padding: 0 1.5rem 1.5rem 1.5rem !important;
}

/* Cancel button styling */
.cancel-btn {
    border: 2px solid #000000 !important;
    border-radius: 8px !important;
    background: white !important;
    color: #000000 !important;
    font-weight: bold !important;
    box-shadow: 0 4px 0 #9e9e9e !important;
    min-height: 48px !important;
}

.cancel-btn:hover {
    transform: translateY(-2px) !important;
}

.cancel-btn:active {
    transform: translateY(2px) !important;
    box-shadow: 0 2px 0 #000000 !important;
}

/* Create button styling */
.create-btn {
    border: 2px solid #000000 !important;
    border-radius: 8px !important;
    background: #21BA45 !important;
    color: white !important;
    font-weight: bold !important;
    box-shadow: 0 4px 0 #21BA45 !important;
    min-height: 48px !important;
    white-space: nowrap !important;
}

.create-btn:hover {
    transform: translateY(-2px) !important;
}

.create-btn:active {
    transform: translateY(2px) !important;
    box-shadow: 0 2px 0 #000000 !important;
}

/* =========================================================================== */
/* RESPONSIVE ADJUSTMENTS - Single layout for all screen sizes */
/* =========================================================================== */

/* For very small screens */
@media (max-width: 320px) {
    .login-page {
        padding: 12px;
    }

    .logo-container {
        width: 160px;
        height: 160px;
    }

    .app-logo {
        max-width: 150px;
        max-height: 150px;
    }

    .title {
        font-size: 1.6rem;
    }

    .subtitle {
        font-size: 0.9rem;
    }

    .profiles-container {
        padding: 12px;
        gap: 8px;
        padding-bottom: 10px;
    }

    .empty-state-modal {
        padding-bottom: 90px;
    }

    .profiles-header-card {
        padding: 6px 12px;
        min-height: 40px;
    }

    .profiles-title {
        font-size: 0.85rem;
    }

    .profile-card-modal {
        padding: 12px;
        min-height: 65px;
    }

    .profile-avatar-modal {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .profile-name-modal {
        font-size: 0.9rem;
    }

    .add-profile-btn-modal {
        min-height: 48px;
        font-size: 0.9rem;
        padding: 12px;
    }

    .avatar-selection-grid {
        gap: 6px;
    }

    .avatar-selection-item {
        height: 60px;
    }

    .modal-card {
        width: 95vw !important;
    }
}

/* For small screens */
@media (max-width: 480px) {
    .login-page {
        padding: 16px;
    }

    .logo-container {
        width: min(200px, 45vw);
        height: min(200px, 45vw);
    }

    .app-logo {
        max-width: 180px;
        max-height: 180px;
    }

    .profiles-container {
        padding-bottom: 10px;
    }

    .empty-state-modal {
        padding-bottom: 100px;
    }

    .fixed-actions-container {
        bottom: 16px;
    }
}

/* For medium/large screens - same layout */
@media (min-width: 481px) {
    .login-page {
        padding: 20px;
    }

    .login-card {
        max-width: 420px;
    }

    .logo-container {
        width: 220px;
        height: 220px;
    }

    .app-logo {
        max-width: 200px;
        max-height: 200px;
    }

    .profiles-container {
        padding-bottom: 10px;
    }

    .empty-state-modal {
        padding-bottom: 110px;
    }

    .fixed-actions-container {
        bottom: 20px;
    }
}

/* Height-based adjustments */
@media (max-height: 700px) {
    .login-header {
        padding-top: 3vh;
        padding-bottom: 1vh;
    }

    .logo-container {
        width: min(180px, 35vw);
        height: min(180px, 35vw);
    }

    .app-logo {
        max-width: 160px;
        max-height: 160px;
    }

    .title {
        font-size: 1.6rem;
    }

    .subtitle {
        font-size: 0.9rem;
    }

    .profiles-container {
        padding: 12px;
        gap: 8px;
        padding-bottom: 10px;
    }

    .empty-state-modal {
        padding-bottom: 90px;
    }

    .profile-card-modal {
        min-height: 60px;
        padding: 10px;
    }

    .profile-avatar-modal {
        width: 40px;
        height: 40px;
    }

    .add-profile-btn-modal {
        min-height: 48px;
        padding: 12px;
    }
}

@media (max-height: 600px) {
    .login-header {
        padding-top: 2vh;
        padding-bottom: 1vh;
    }

    .logo-container {
        width: min(160px, 30vw);
        height: min(160px, 30vw);
    }

    .app-logo {
        max-width: 140px;
        max-height: 140px;
    }

    .title {
        font-size: 1.4rem;
    }

    .subtitle {
        font-size: 0.8rem;
    }

    .profiles-container {
        padding: 10px;
        padding-bottom: 10px;
    }

    .empty-state-modal {
        padding-bottom: 80px;
    }

    .profiles-header-card {
        min-height: 36px;
        padding: 4px 10px;
    }

    .profile-card-modal {
        min-height: 55px;
        padding: 8px;
    }

    .profile-avatar-modal {
        width: 35px;
        height: 35px;
        margin-right: 8px;
    }

    .add-profile-btn-modal {
        min-height: 44px;
        padding: 10px;
        font-size: 0.9rem;
    }
}

/* Fix for iOS Safari */
@supports (-webkit-touch-callout: none) {
    .login-page {
        height: -webkit-fill-available;
    }

    :deep(#q-app) {
        height: -webkit-fill-available;
    }
}

/* Ensure modal is centered on all screens */
:deep(.q-dialog__inner) {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 100% !important;
    padding: 16px !important;
}
</style>

<!-- Global styles remain the same -->
<style>
.q-field--outlined .q-field__control {
    color: white !important;
}

.q-field--outlined .q-field__native {
    color: white !important;
}

.q-dialog__backdrop {
    background-color: rgba(0, 0, 0, 0.7) !important;
}

.q-btn__content {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.q-field {
    width: 100% !important;
}

.q-dialog__inner {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
</style>