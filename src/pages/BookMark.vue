<template>
    <q-layout view="lHh Lpr lFf">
        <!-- Header -->
        <q-header class="text-white header-no-border" style="background: #42a7ff !important;">
            <q-toolbar class="relative-position">
                <!-- Back button (left) -->
                <q-btn flat dense round icon="arrow_back" @click="goBack" class="absolute-left q-ml-sm text-white" />

                <!-- Centered title -->
                <div class="absolute-center text-h6 text-weight-bold text-white">
                    Bookmarks
                </div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page class="bookmarks-page">
                <!-- Bookmark Counter Card -->
                <div class="counter-card q-mx-md q-mt-sm q-mb-md">
                    <div class="counter-content">
                        <div class="row items-center justify-between">
                            <div class="counter-label">Total Bookmarks</div>
                            <div class="counter-value">{{ bookmarks.length }}</div>
                        </div>
                    </div>
                    <div class="counter-border"></div>
                </div>

                <!-- Content -->
                <div class="q-pa-md">
                    <!-- Bookmarks Grid -->
                    <div v-if="bookmarks.length > 0" class="bookmarks-grid">
                        <div v-for="(bm, idx) in bookmarks" :key="idx" class="bookmark-card-container">
                            <!-- Bookmark Card -->
                            <q-card class="bookmark-card cursor-pointer" @click="handleCardClick(idx, bm)"
                                @touchstart="startLongPress(idx)" @touchend="endLongPress" @touchcancel="endLongPress"
                                @mousedown="startLongPress(idx)" @mouseup="endLongPress" @mouseleave="endLongPress"
                                :class="{ 'long-pressed': longPressIndex === idx }" :style="{
                                    '--card-color': getCardColor(idx),
                                    '--border-color': getBorderColor(idx),
                                    '--icon-color': getIconColor(idx)
                                }">

                                <!-- Content overlay (blurred on long press) -->
                                <div class="card-content-overlay" :class="{ 'blurred': longPressIndex === idx }">
                                    <q-card-section class="card-content">
                                        <!-- Card Header -->
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="row items-center">
                                                <!-- Bookmark Icon -->
                                                <div class="bookmark-icon-wrapper">
                                                    <q-icon name="bookmark" size="sm" class="bookmark-icon" />
                                                </div>

                                                <!-- Lesson Number -->
                                                <div class="lesson-number text-caption text-weight-medium">
                                                    Item {{ bm.lessonId }}
                                                </div>
                                            </div>

                                            <!-- Page Indicator -->
                                            <q-badge color="primary" text-color="white" class="page-badge">
                                                Page {{ bm.page + 1 }}
                                            </q-badge>
                                        </div>

                                        <!-- Lesson Title -->
                                        <div class="text-h6 text-weight-bold q-mb-xs ellipsis-2-lines">
                                            {{ getLessonTitle(bm.lessonId) }}
                                        </div>

                                        <!-- Last Accessed -->
                                        <div class="row items-center text-caption timestamp q-mt-sm">
                                            <q-icon name="schedule" size="14px" class="q-mr-xs" />
                                            <span v-if="bm.timestamp">
                                                Saved {{ formatTimestamp(bm.timestamp) }}
                                            </span>
                                            <span v-else>Recently saved</span>
                                        </div>
                                    </q-card-section>

                                    <!-- Bottom Border -->
                                    <div class="card-border"></div>
                                </div>

                                <!-- Delete icon overlay (unblurred) -->
                                <div v-if="longPressIndex === idx" class="delete-overlay">
                                    <div class="delete-content">
                                        <q-icon name="delete" size="48px" class="delete-icon-center text-negative" />
                                        <div class="delete-label">Tap to delete</div>
                                    </div>
                                </div>
                            </q-card>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="empty-state text-center">
                        <q-icon name="bookmark_border" size="64px" color="white" class="empty-icon" />
                        <div class="text-h6 text-white q-mt-md">No bookmarks yet</div>
                        <div class="text-body1 text-white q-mt-xs">
                            Save pages as you read to find them later
                        </div>
                    </div>
                </div>

                <!-- Delete Confirmation Dialog -->
                <q-dialog v-model="deleteDialog.show">
                    <q-card>
                        <q-card-section>
                            <div class="text-h6">Delete Bookmark?</div>
                        </q-card-section>

                        <q-card-section class="q-pt-none">
                            Are you sure you want to delete this bookmark?
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn flat label="Cancel" color="primary" v-close-popup />
                            <q-btn flat label="Delete" color="negative" v-close-popup
                                @click="deleteBookmark(deleteDialog.index)" />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar'
import { getCurrentUser } from "src/utils/session"
import { flatLessons } from "src/utils/lessons"

export default {
    name: "BookmarksPage",
    setup() {
        const router = useRouter()
        const $q = useQuasar()
        const bookmarks = ref([])
        const deleteDialog = ref({
            show: false,
            index: -1
        })
        const longPressIndex = ref(-1)
        const progress = ref(1)
        let longPressTimer = null

        // Card colors with corresponding border colors (matching Statistics page style)
        const cardColors = [
            { card: '#42a5f5', border: '#1e88e5', icon: '#ffffff' }, // blue
            { card: '#66bb6a', border: '#43a047', icon: '#ffffff' }, // green
            { card: '#ab47bc', border: '#8e24aa', icon: '#ffffff' }, // purple
            { card: '#26a69a', border: '#1f8f85', icon: '#ffffff' }, // teal (mini_lab)
            { card: '#ffa726', border: '#fb8c00', icon: '#ffffff' }, // orange (mini_test)
        ]

        const startLongPress = (idx) => {
            // Clear any existing timer
            if (longPressTimer) {
                clearTimeout(longPressTimer)
            }

            longPressTimer = setTimeout(() => {
                longPressIndex.value = idx
            }, 500) // 500ms for long press
        }

        const endLongPress = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer)
                longPressTimer = null
            }
            // Don't reset longPressIndex here - let it stay until user interacts elsewhere
        }

        const handleCardClick = (idx, bm) => {
            // If card is in long press mode, show delete dialog
            if (longPressIndex.value === idx) {
                confirmDelete(idx)
            }
            // Otherwise, navigate to bookmark
            else if (longPressIndex.value === -1) {
                router.push({
                    name: bm.route,
                    query: { page: bm.page },
                })
            }
        }

        const resetLongPress = () => {
            longPressIndex.value = -1
            if (longPressTimer) {
                clearTimeout(longPressTimer)
                longPressTimer = null
            }
        }

        const handleScroll = () => {
            resetLongPress()
        }

        const goBack = () => {
            if (window.history.length > 1) {
                window.history.back()
            } else {
                router.push('/')
            }
        }

        const loadBookmarks = () => {
            const user = getCurrentUser()
            if (!user) return []
            const key = user.studentId ?? user.id ?? user.name
            const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
            const bookmarks = allBookmarks[key] || []

            // Sort bookmarks by timestamp (newest first)
            return bookmarks.sort((a, b) => {
                const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
                const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
                return timeB - timeA
            })
        }

        const saveBookmarks = (arr) => {
            const user = getCurrentUser()
            if (!user) return
            const key = user.studentId ?? user.id ?? user.name
            let allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}")
            allBookmarks[key] = arr
            localStorage.setItem("bookmarks", JSON.stringify(allBookmarks))
        }

        const getLessonTitle = (lessonId) => {
            const lesson = flatLessons.find((l) => String(l.id) === String(lessonId))
            return lesson ? lesson.title : `Lesson ${lessonId}`
        }

        const deleteBookmark = (idx) => {
            bookmarks.value.splice(idx, 1)
            saveBookmarks(bookmarks.value)
            resetLongPress()
            $q.notify({
                message: 'Bookmark deleted',
                color: 'negative',
                icon: 'delete',
                position: 'top'
            })
        }

        const confirmDelete = (idx) => {
            deleteDialog.value = {
                show: true,
                index: idx
            }
        }

        const goToLessons = () => {
            router.push('/lessons')
        }

        const getCardColor = (idx) => {
            return cardColors[idx % cardColors.length].card
        }

        const getBorderColor = (idx) => {
            return cardColors[idx % cardColors.length].border
        }

        const getIconColor = (idx) => {
            // Return the original icon color (not white)
            const colors = [
                '#ef4444', // red
                '#eab308', // yellow
                '#0ea5e9', // sky
                '#22c55e', // green
                '#a855f7', // purple
            ]
            return colors[idx % colors.length]
        }

        const formatTimestamp = (timestamp) => {
            if (!timestamp) return 'recently'
            const now = new Date()
            const saved = new Date(timestamp)
            const diffMs = now - saved
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)

            if (diffMins < 60) {
                return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
            } else {
                return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
            }
        }

        onMounted(() => {
            bookmarks.value = loadBookmarks()
            // Add timestamps to existing bookmarks if missing
            const now = new Date().toISOString()
            bookmarks.value.forEach(bm => {
                if (!bm.timestamp) {
                    bm.timestamp = now
                }
            })
            saveBookmarks(bookmarks.value)

            // Add scroll listener to reset long press
            window.addEventListener('scroll', handleScroll)
        })

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        return {
            bookmarks,
            deleteDialog,
            longPressIndex,
            progress,
            startLongPress,
            endLongPress,
            handleCardClick,
            goBack,
            deleteBookmark,
            confirmDelete,
            getLessonTitle,
            goToLessons,
            getCardColor,
            getBorderColor,
            getIconColor,
            formatTimestamp
        }
    }
}
</script>

<style scoped>
/* Fix for white space at bottom */
:deep(.q-page-container) {
    padding: 0 !important;
    padding-bottom: 0 !important;
    background: #42a7ff !important;
}

:deep(.q-page) {
    min-height: 100vh;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    background: #42a7ff !important;
}

:deep(body) {
    background: #42a7ff !important;
    margin: 0;
    padding: 0;
}

.bookmarks-page {
    background: #42a7ff;
    min-height: 100vh;
    padding-top: 60px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    margin-bottom: 0;
}

.header-no-border {
    border-bottom: none !important;
    box-shadow: none !important;
}

.text-white {
    color: white !important;
}

.q-btn .q-icon {
    color: white !important;
}

/* Remove padding from q-page-container */
.no-padding {
    padding-top: 20px !important;
}

/* Counter Card Styles - Using Statistics page red style */
.counter-card {
    color: white;
    background: #ef5350;
    /* Red background */
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border-bottom: 6px solid;
    border-bottom-color: #d32f2f;
    /* Darker red border */
}

.counter-content {
    padding: 20px;
}

.counter-label {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.9;
}

.counter-value {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
}

.counter-border {
    height: 6px;
    background: #d32f2f;
    /* Darker red border */
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}

/* Bookmarks Grid */
.bookmarks-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 32px;
}

@media (min-width: 768px) {
    .bookmarks-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.bookmark-card-container {
    position: relative;
}

.bookmark-card {
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--card-color);
    border: none;
    position: relative;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    border-bottom: 6px solid;
    border-bottom-color: var(--border-color);
    transition: transform 0.2s ease;
}

.bookmark-card:active:not(.long-pressed) {
    transform: scale(0.98);
}

/* Content overlay that gets blurred */
.card-content-overlay {
    flex: 1;
    transition: filter 0.3s ease;
}

.card-content-overlay.blurred {
    filter: blur(4px);
}

.card-content {
    flex: 1;
    padding: 20px;
    color: white;
}

/* Delete overlay (not blurred) */
.delete-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none;
    /* Allow clicks to pass through to the card */
}

.delete-content {
    text-align: center;
    pointer-events: auto;
    /* But allow clicks on the delete content */
}

.delete-icon-center {
    background: white;
    border-radius: 50%;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-label {
    color: white;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    padding: 0 16px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease;
}

/* White bookmark icon wrapper with colored icon */
.bookmark-icon-wrapper {
    background: white;
    border-radius: 8px;
    padding: 6px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.bookmark-icon {
    color: var(--icon-color) !important;
}

.lesson-number {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
}

.page-badge {
    background: rgba(255, 255, 255, 0.3) !important;
    border-radius: 6px;
    padding: 4px 10px;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

.ellipsis-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* White timestamp text */
.timestamp {
    color: rgba(255, 255, 255, 0.9) !important;
}

.timestamp .q-icon {
    color: rgba(255, 255, 255, 0.9) !important;
}

.card-border {
    display: none;
    /* Using border-bottom instead */
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes popIn {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Empty state - full screen centered */
.empty-state {
    padding: 20px;
    min-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.empty-icon {
    opacity: 0.5;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>