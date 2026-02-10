<template>
    <div class="login-page">
        <div class="login-card">
            <!-- Header with Logo -->
            <div class="login-header">
                <div class="logo-container">
                    <img src="/logo/welcome.png" alt="App Logo" class="app-logo" />
                </div>
                <div class="header-text">
                    <h1 class="title">Welcome Students!</h1>
                    <p class="subtitle">Select your profile to continue</p>
                </div>
            </div>

            <!-- Profiles List -->
            <div v-if="students.length > 0" class="profiles-container">
                <div class="profiles-header">
                    <div class="profiles-header-card">
                        <span class="profiles-title">Saved Profiles</span>
                        <span class="profiles-count">{{ students.length }}</span>
                    </div>
                </div>

                <div class="profiles-grid" ref="profilesGrid" @scroll="handleScroll" @touchstart="handleGridTouchStart">
                    <div v-for="student in students" :key="student.studentId" class="profile-card"
                        :class="{ 'profile-card-deleting': deletingStudent === student.studentId }"
                        @click="handleProfileClick(student)" @mousedown="handleMouseDown(student.studentId)"
                        @mouseup="handleMouseUp" @mouseleave="handleMouseUp"
                        @touchstart="handleTouchStart(student.studentId, $event)" @touchend="handleTouchEnd"
                        @touchcancel="handleTouchEnd">

                        <div class="profile-content">
                            <div class="profile-avatar">
                                <img v-if="student.avatar" :src="student.avatar" class="profile-avatar-image"
                                    :alt="student.name" />
                                <span v-else class="profile-avatar-text">{{ getInitials(student.name) }}</span>
                            </div>
                            <div class="profile-info">
                                <div class="profile-name">{{ student.name }}</div>
                                <div class="profile-section">Section : {{ student.section }}</div>
                            </div>
                            <q-icon name="chevron_right" color="black" size="24px" class="arrow-icon" />
                        </div>

                        <!-- Delete Overlay -->
                        <div v-if="deletingStudent === student.studentId" class="delete-overlay"
                            @click.stop="confirmDelete(student)">
                            <q-icon name="delete" color="white" size="32px" />
                            <span class="delete-text">Delete Profile</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
                <div class="empty-icon">👤</div>
                <h3 class="empty-title">No Profiles Yet</h3>
                <p class="empty-description">Create your first profile to get started</p>
            </div>

            <!-- Fixed Add Profile Button -->
            <div class="fixed-actions">
                <button class="add-profile-btn" @click="showAddProfile = true">
                    <span class="btn-icon">+</span>
                    <span class="btn-text">Add New Profile</span>
                </button>
            </div>
        </div>

        <!-- Add Profile Modal -->
        <q-dialog v-model="showAddProfile" persistent>
            <q-card class="modal-card">
                <div class="title-card-overlay">
                    <div class="title-card">Create New Profile</div>
                </div>

                <q-card-section class="modal-content">
                    <p class="text-center text-white q-mb-lg q-mt-none">
                        Add your details to create a new profile
                    </p>

                    <div class="q-gutter-y-lg">
                        <div>
                            <div class="input-label text-white q-mb-xs">Name</div>
                            <q-input v-model="newName" outlined dense placeholder="Enter your full name"
                                class="custom-input">
                                <template v-slot:prepend>
                                    <q-icon name="person" color="white" />
                                </template>
                            </q-input>
                        </div>

                        <div>
                            <div class="input-label text-white q-mb-xs">Section</div>
                            <q-input v-model="newSection" outlined dense placeholder="Enter your section"
                                class="custom-input">
                                <template v-slot:prepend>
                                    <q-icon name="school" color="white" />
                                </template>
                            </q-input>
                        </div>

                        <div>
                            <div class="input-label text-white q-mb-xs">Choose Avatar</div>
                            <div class="avatar-grid">
                                <div v-for="(avatar, index) in avatars" :key="index" class="avatar-item"
                                    :class="{ 'avatar-selected': selectedAvatar === avatar }"
                                    @click="selectAvatar(avatar)">
                                    <img :src="avatar" class="avatar-image" />
                                    <div v-if="selectedAvatar === avatar" class="avatar-check">
                                        <q-icon name="check" color="white" size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions class="modal-actions">
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
import { ref, onMounted, onUnmounted } from 'vue'
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
const deletingStudent = ref(null)
const profilesGrid = ref(null)
let longPressTimer = null
const longPressDuration = 500 // 500ms for long press

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
    selectedAvatar.value = avatars[0]
    // Add global click listener to detect clicks outside
    document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
    // Clean up event listener
    document.removeEventListener('click', handleOutsideClick)
})

const loadStudents = () => {
    try {
        const storedStudents = LocalStorage.getItem('students') || []
        students.value = storedStudents.map(student => ({
            studentId: student.studentId,
            name: student.name,
            section: student.section,
            avatar: student.avatar || avatars[0],
            progress: student.progress || {},
            chapterTest: student.chapterTest || { correct: 0, wrong: 0 }
        }))
    } catch (error) {
        console.error('Error loading students:', error)
        students.value = []
    }
}

const createStudent = (name, section, avatar = '') => {
    try {
        const studentsList = LocalStorage.getItem('students') || []
        const existingStudent = studentsList.find(s =>
            s.name.toLowerCase() === name.toLowerCase() &&
            s.section.toLowerCase() === section.toLowerCase()
        )

        if (existingStudent) {
            return { error: 'Student already exists' }
        }

        const newStudent = {
            studentId: 'STU-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            section: section.trim(),
            avatar: avatar || avatars[0],
            progress: {},
            chapterTest: { correct: 0, wrong: 0 },
            createdAt: new Date().toISOString()
        }

        studentsList.push(newStudent)
        LocalStorage.set('students', studentsList)
        return newStudent
    } catch (error) {
        console.error('Error creating student:', error)
        return { error: 'Failed to create student' }
    }
}

const deleteStudent = (studentId) => {
    try {
        const studentsList = LocalStorage.getItem('students') || []
        const updatedList = studentsList.filter(s => s.studentId !== studentId)
        LocalStorage.set('students', updatedList)
        loadStudents()
        return true
    } catch (error) {
        console.error('Error deleting student:', error)
        return false
    }
}

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const selectAvatar = (avatar) => {
    selectedAvatar.value = avatar
}

// Cancel delete mode
const cancelDeleteMode = () => {
    deletingStudent.value = null
}

// Handle scroll - cancel delete mode when scrolling
const handleScroll = () => {
    if (deletingStudent.value) {
        cancelDeleteMode()
    }
}

// Handle touch on grid (outside cards)
const handleGridTouchStart = (event) => {
    // Check if the touch is on the grid itself (not on a card)
    if (event.target.classList.contains('profiles-grid') && deletingStudent.value) {
        cancelDeleteMode()
    }
}

// Handle clicks outside the deleting card
const handleOutsideClick = (event) => {
    if (!deletingStudent.value) return

    // Check if click is outside all profile cards
    const clickedCard = event.target.closest('.profile-card')
    const clickedDeleteOverlay = event.target.closest('.delete-overlay')

    // If clicked outside cards or on a different card, cancel delete mode
    if (!clickedCard || (clickedCard && !clickedDeleteOverlay &&
        !clickedCard.querySelector('.delete-overlay'))) {
        cancelDeleteMode()
    }
}

// Handle mouse events for desktop
const handleMouseDown = (studentId) => {
    longPressTimer = setTimeout(() => {
        deletingStudent.value = studentId
    }, longPressDuration)
}

const handleMouseUp = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
    }
}

// Handle touch events for mobile
const handleTouchStart = (studentId) => {
    // Don't start long press if already in delete mode
    if (deletingStudent.value && deletingStudent.value !== studentId) {
        cancelDeleteMode()
        return
    }

    longPressTimer = setTimeout(() => {
        deletingStudent.value = studentId
    }, longPressDuration)
}

const handleTouchEnd = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer)
        longPressTimer = null
    }
}

const handleProfileClick = (student) => {
    // Only navigate if not in delete mode
    if (!deletingStudent.value) {
        loginWithProfile(student)
    } else {
        // Cancel delete mode
        cancelDeleteMode()
    }
}

const confirmDelete = (student) => {
    $q.dialog({
        title: 'Delete Profile',
        message: `Are you sure you want to delete ${student.name}'s profile? This action cannot be undone.`,
        persistent: true,
        ok: {
            label: 'Delete',
            color: 'negative',
            flat: false
        },
        cancel: {
            label: 'Cancel',
            color: 'primary',
            flat: true
        }
    }).onOk(() => {
        const success = deleteStudent(student.studentId)
        if (success) {
            $q.notify({
                type: 'positive',
                message: 'Profile deleted successfully',
                position: 'top',
                timeout: 2000
            })
        } else {
            $q.notify({
                type: 'negative',
                message: 'Failed to delete profile',
                position: 'top',
                timeout: 2000
            })
        }
        deletingStudent.value = null
    }).onCancel(() => {
        deletingStudent.value = null
    })
}

const loginWithProfile = (student) => {
    setCurrentUser({ ...student, avatar: student.avatar || avatars[0] })
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

    const newStudent = createStudent(newName.value.trim(), newSection.value.trim(), selectedAvatar.value || avatars[0])

    if (newStudent.error) {
        $q.notify({
            type: 'warning',
            message: newStudent.error,
            position: 'top',
            timeout: 2000
        })
        return
    }

    loadStudents()
    setCurrentUser(newStudent)

    $q.notify({
        type: 'positive',
        message: 'Welcome! Profile created successfully',
        position: 'top',
        timeout: 2000
    })

    newName.value = ''
    newSection.value = ''
    selectedAvatar.value = avatars[0]
    showAddProfile.value = false
    $router.push('/')
}
</script>

<style scoped>
/* Base Layout */
:deep(body),
:deep(html),
:deep(#q-app) {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    /* background: #8ce4d1; */
    position: fixed;
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
    padding: 16px;
    box-sizing: border-box;
    background: #4534ff;
}

.login-card {
    width: 100%;
    max-width: 480px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 90px;
    box-sizing: border-box;
}

/* Header */
.login-header {
    text-align: center;
    flex-shrink: 0;
    padding: 5vh 0 2vh;
}

.logo-container {
    margin: 0 auto 16px;
    display: flex;
    justify-content: center;
}

.app-logo {
    max-width: min(280px, 60vw);
    max-height: 280px;
    animation: slow-bounce 4s ease-in-out infinite;
}

@keyframes slow-bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

.title {
    font-size: clamp(1.8rem, 5vw, 2.2rem);
    font-weight: 700;
    margin-bottom: 2px;
    background: linear-gradient(45deg, #ffffff, #e3f3ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
}

.subtitle {
    font-size: clamp(1rem, 3vw, 1.2rem);
    color: #ffffff;
    font-weight: 600;
    margin-top: 2px;
}

/* Profiles Container */
.profiles-container,
.empty-state {
    flex: 1;
    overflow: hidden;
    border-radius: 16px;
    padding: 16px;
    border: 2px solid #000;
    box-shadow: 0 4px 0 #0d3660;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profiles-container {
    background: linear-gradient(145deg, #f5f5f5, #eef0f3);
}

.empty-state {
    background: linear-gradient(145deg, #0d47a1, #1565c0);
    text-align: center;
    justify-content: center;
    align-items: center;
    padding: 40px 16px 100px;
}

/* Profiles Header */
.profiles-header {
    flex-shrink: 0;
    margin-bottom: 8px;
}

.profiles-header-card {
    border: 2px solid #000;
    border-radius: 12px;
    background: #2138ba;
    box-shadow: 0 4px 0 #354dd4;
    padding: 8px 16px;
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
    border: 1px solid #000;
    box-shadow: 0 2px 0 #000;
}

/* Profiles Grid */
.profiles-grid {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;
}

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

/* Profile Card */
.profile-card {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid #1f21a5;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 70px;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.profile-content {
    display: flex;
    align-items: center;
    padding: 14px;
    width: 100%;
    transition: filter 0.3s ease;
}

.profile-card:hover .profile-content {
    background: #2088f8;
    color: white;
}

.profile-card:hover {
    box-shadow: 0 4px 0 #000;
}

/* Delete Mode Styles */
.profile-card-deleting {
    pointer-events: auto;
}

.profile-card-deleting .profile-content {
    filter: blur(3px);
    opacity: 0.3;
}

.profile-card-deleting:hover {
    transform: none;
    box-shadow: none;
}

/* Delete Overlay */
.delete-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: rgba(239, 68, 68, 0.95);
    z-index: 10;
    cursor: pointer;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.delete-text {
    color: white;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.delete-overlay:hover {
    background: rgba(220, 38, 38, 0.98);
}

.profile-avatar {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    border: 2px solid #000;
    box-shadow: 0 2px 0 #000;
    overflow: hidden;
    background: linear-gradient(135deg, #4299e1, #3182ce);
    flex-shrink: 0;
}

.profile-avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-avatar-text {
    color: white;
    font-weight: 700;
    font-size: 1rem;
}

.profile-info {
    flex: 1;
    min-width: 0;
}

.profile-name {
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-name:hover {
    color: white;
}

.profile-section {
    color: #000;
    font-size: 0.8rem;
}

.profile-section:hover {
    color: white;
}

.arrow-icon {
    transition: transform 0.3s ease;
}

.profile-card:hover .arrow-icon {
    transform: translateX(5px);
}

/* Empty State */
.empty-icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
    opacity: 0.8;
}

.empty-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 8px;
}

.empty-description {
    color: #a0c8ff;
    font-size: 0.95rem;
    max-width: 80%;
}

/* Fixed Add Button */
.fixed-actions {
    position: fixed;
    bottom: 16px;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
    z-index: 1000;
}

.add-profile-btn {
    width: 100%;
    padding: 14px;
    background: #42a7ff;
    color: white;
    border: 2px solid #000;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 0 #2138ba;
    min-height: 52px;
}

.add-profile-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 #192c97;
}

.add-profile-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #000;
}

.btn-icon {
    font-size: 1.2rem;
}

/* Modal */
:deep(.q-dialog__backdrop) {
    background-color: rgba(0, 0, 0, 0.7);
}

.modal-card {
    border: 2px solid #000;
    border-radius: 16px;
    background: linear-gradient(145deg, #0d47a1, #1565c0);
    box-shadow: 0 4px 0 #0d3660;
    position: relative;
    overflow: visible;
    max-width: 400px;
    width: 90vw;
}

.title-card-overlay {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
}

.title-card {
    border: 2px solid #000;
    border-radius: 12px;
    background: #38da18;
    box-shadow: 0 4px 0 #6cc20b;
    font-weight: 700;
    padding: 6px 24px;
    font-size: 1rem;
    color: white;
}

.modal-content {
    padding: 2rem 1.5rem 0.5rem;
}

.modal-content p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.input-label {
    font-weight: 700;
    margin-bottom: 0.25rem;
}

/* Form Inputs */
:deep(.custom-input .q-field__control) {
    border-radius: 8px;
    border: 2px solid #000;
    background: #0d3660;
}

:deep(.custom-input .q-field__control:before),
:deep(.custom-input .q-field__control:after) {
    display: none;
}

:deep(.custom-input .q-field__native) {
    color: white;
    font-size: 1rem;
    padding-left: 4px;
}

:deep(.custom-input .q-field__native::placeholder) {
    color: rgba(255, 255, 255, 0.7);
}

:deep(.custom-input .q-field__prepend) {
    padding: 0 8px;
}

/* Avatar Grid */
.avatar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 8px;
}

.avatar-item {
    position: relative;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
}

.avatar-item:hover {
    border-color: #42A5F5;
    transform: scale(1.05);
}

.avatar-selected {
    border-color: #42A5F5;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.3);
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-check {
    position: absolute;
    inset: 0;
    background: rgba(66, 165, 245, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Modal Actions */
.modal-actions {
    padding: 0 1.5rem 1.5rem;
}

.cancel-btn,
.create-btn {
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 700;
    min-height: 48px;
}

.cancel-btn {
    background: white;
    color: #000;
    box-shadow: 0 4px 0 #9e9e9e;
}

.create-btn {
    background: #21BA45;
    color: white;
    box-shadow: 0 4px 0 #21BA45;
}

.cancel-btn:hover,
.create-btn:hover {
    transform: translateY(-2px);
}

.cancel-btn:active,
.create-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #000;
}

/* Responsive */
@media (max-width: 320px) {
    .app-logo {
        max-width: min(220px, 55vw);
        max-height: 220px;
    }

    .title {
        font-size: 1.6rem;
    }

    .subtitle {
        font-size: 0.9rem;
    }

    .profile-card .profile-content {
        padding: 12px;
    }

    .profile-card {
        min-height: 65px;
    }

    .profile-avatar {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .add-profile-btn {
        min-height: 48px;
        font-size: 0.9rem;
    }

    .avatar-item {
        height: 60px;
    }

    .modal-card {
        width: 95vw;
    }
}

@media (max-width: 480px) {
    .app-logo {
        max-width: min(260px, 58vw);
        max-height: 260px;
    }
}

@media (min-width: 481px) {
    .app-logo {
        max-width: 280px;
        max-height: 280px;
    }

    .fixed-actions {
        bottom: 20px;
    }
}

@media (max-height: 700px) {
    .login-header {
        padding: 3vh 0 1vh;
    }

    .app-logo {
        max-width: min(240px, 50vw);
        max-height: 240px;
    }

    .title {
        font-size: 1.6rem;
    }

    .subtitle {
        font-size: 0.9rem;
    }

    .profile-card {
        min-height: 60px;
    }

    .profile-card .profile-content {
        padding: 10px;
    }

    .profile-avatar {
        width: 40px;
        height: 40px;
    }
}

@media (max-height: 600px) {
    .login-header {
        padding: 2vh 0 1vh;
    }

    .app-logo {
        max-width: min(200px, 45vw);
        max-height: 200px;
    }

    .title {
        font-size: 1.4rem;
    }

    .subtitle {
        font-size: 0.8rem;
    }

    .profile-card {
        min-height: 55px;
    }

    .profile-card .profile-content {
        padding: 8px;
    }

    .profile-avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
    }

    .add-profile-btn {
        min-height: 44px;
        padding: 10px;
        font-size: 0.9rem;
    }
}

/* iOS Fix */
@supports (-webkit-touch-callout: none) {

    .login-page,
    :deep(#q-app) {
        height: -webkit-fill-available;
    }
}
</style>

<style>
/* Global Overrides */
.q-field--outlined .q-field__control,
.q-field--outlined .q-field__native {
    color: white;
}

.q-dialog__backdrop {
    background-color: rgba(0, 0, 0, 0.7);
}

.q-btn__content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.q-dialog__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 16px;
}
</style>