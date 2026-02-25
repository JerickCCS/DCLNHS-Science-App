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
                <div class="counter-card-wrapper q-mx-md q-mt-sm q-mb-md">
                    <!-- Icon lives OUTSIDE the card, in the wrapper, so nothing clips it at top or sides -->
                    <img src="assets/icons/bookmark.png" class="counter-bookmark-icon" alt="bookmark" />

                    <div class="counter-card">
                        <!-- Invisible spacer on the left so text never overlaps the icon -->
                        <div class="counter-content">
                            <div class="row items-center justify-between">
                                <div class="counter-label">Total Bookmarks</div>
                                <div class="counter-value">{{ bookmarks.length }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="q-px-md q-pb-md">
                    <!-- Bookmarks List -->
                    <div v-if="bookmarks.length > 0" class="bookmarks-list">
                        <div v-for="(bm, idx) in bookmarks" :key="idx" class="bookmark-card-container">
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
                                    <div class="card-inner row items-center no-wrap">

                                        <!-- Left: Bookmark Icon -->
                                        <div class="bookmark-icon-wrapper q-mr-md flex-shrink-0">
                                            <q-icon name="bookmark" size="20px" class="bookmark-icon" />
                                        </div>

                                        <!-- Center: Title + Timestamp -->
                                        <div class="card-text col">
                                            <div class="lesson-title text-weight-bold ellipsis-2-lines">
                                                {{ getLessonTitle(bm.lessonId) }}
                                            </div>
                                            <div class="row items-center timestamp q-mt-xs">
                                                <q-icon name="schedule" size="12px" class="q-mr-xs" />
                                                <span v-if="bm.timestamp">Saved {{ formatTimestamp(bm.timestamp)
                                                }}</span>
                                                <span v-else>Recently saved</span>
                                            </div>
                                        </div>

                                        <!-- Right: Page Badge -->
                                        <div class="page-wrapper q-ml-md flex-shrink-0">
                                            <div class="page-badge-custom">
                                                <span class="page-text">Page {{ bm.page + 1 }}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <!-- Delete icon overlay -->
                                <div v-if="longPressIndex === idx" class="delete-overlay">
                                    <div class="delete-content">
                                        <q-icon name="delete" size="36px" class="delete-icon-center text-negative" />
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

        const cardColors = [
            { card: '#2979ff', border: '#1565c0', icon: '#ef4444' },
            { card: '#00c853', border: '#009624', icon: '#eab308' },
            { card: '#d500f9', border: '#aa00ff', icon: '#0ea5e9' },
            { card: '#4dd0e1', border: '#00acc1', icon: '#22c55e' },
            { card: '#ff6d00', border: '#e65100', icon: '#a855f7' },
        ]

        const startLongPress = (idx) => {
            if (longPressTimer) clearTimeout(longPressTimer)
            longPressTimer = setTimeout(() => {
                longPressIndex.value = idx
            }, 500)
        }

        const endLongPress = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer)
                longPressTimer = null
            }
        }

        const handleCardClick = (idx, bm) => {
            if (longPressIndex.value === idx) {
                confirmDelete(idx)
            } else if (longPressIndex.value === -1) {
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

        const handleScroll = () => resetLongPress()

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
            deleteDialog.value = { show: true, index: idx }
        }

        const getCardColor = (idx) => cardColors[idx % cardColors.length].card
        const getBorderColor = (idx) => cardColors[idx % cardColors.length].border
        const getIconColor = (idx) => cardColors[idx % cardColors.length].icon

        const formatTimestamp = (timestamp) => {
            if (!timestamp) return 'recently'
            const now = new Date()
            const saved = new Date(timestamp)
            const diffMs = now - saved
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMs / 3600000)
            const diffDays = Math.floor(diffMs / 86400000)

            if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
            else if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
            else return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
        }

        onMounted(() => {
            bookmarks.value = loadBookmarks()
            const now = new Date().toISOString()
            bookmarks.value.forEach(bm => {
                if (!bm.timestamp) bm.timestamp = now
            })
            saveBookmarks(bookmarks.value)
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
            getCardColor,
            getBorderColor,
            getIconColor,
            formatTimestamp
        }
    }
}
</script>

<style scoped>
/* FIX 1: Match page-container background to gradient end color + ensure full height */
:deep(.q-page-container) {
    padding: 0 !important;
    padding-bottom: 0 !important;
    background: hsla(274, 100%, 52%, 1) !important;
    min-height: 100vh !important;
}

:deep(.q-page) {
    min-height: 100vh;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    background: linear-gradient(180deg, hsla(245, 85%, 62%, 1) 0%, hsla(274, 100%, 52%, 1) 100%) !important;
}

/* FIX 2: Cover html root as well so overscroll/rubber-band has no white */
:deep(body),
:deep(html) {
    background: hsla(274, 100%, 52%, 1) !important;
    margin: 0;
    padding: 0;
}

/* FIX 3: Use gradient + 100dvh so mobile browser chrome doesn't cause a gap */
.bookmarks-page {
    background: linear-gradient(180deg, hsla(245, 85%, 62%, 1) 0%, hsla(274, 100%, 52%, 1) 100%);
    min-height: 100dvh;
    padding-top: 60px;
    padding-bottom: env(safe-area-inset-bottom, 0);
}

.header-no-border {
    border-bottom: none !important;
    box-shadow: none !important;
}

.text-white {
    color: white !important;
}

/* Counter Card */
.counter-card-wrapper {
    position: relative;
    padding-top: 24px;
    /* bleed space above card */
}

.counter-card {
    color: white;
    background: #ffc412;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border-bottom: 6px solid #c99a0e;
}

/* The icon is a sibling of .counter-card (not a child),
   so .counter-card's overflow:hidden never touches it.
   The wrapper has no overflow:hidden so the top bleed is completely free.
   We use clip-path inset() to cut the icon's BOTTOM so it appears
   flush with the card's bottom edge (excluding the 6px border). 
   
   The icon top is at wrapper top (y=0).
   The card starts at y=24px (padding-top).
   The card bottom (excluding border) is at wrapper bottom - 6px.
   Icon height = 100% of wrapper.
   Bottom clipping amount = 6px border = (6 / wrapperHeight).
   We approximate with a fixed pixel inset since the card height is ~56px:
   wrapper ≈ 80px total, so bottom inset = 6px of the image itself. */
.counter-bookmark-icon {
    position: absolute;
    top: 12px;
    left: 8px;
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: top;
    z-index: 3;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.18));
    pointer-events: none;
    /* Clip off the bottom portion that falls below the card's colored area.
       The card border is 6px. Clip that from the bottom of the image. */
    clip-path: inset(0 0 17px 0 round 0);
}

.counter-content {
    padding: 14px 20px;
    margin-left: 72px;
}

.counter-label {
    font-size: 15px;
    font-weight: 600;
    opacity: 0.9;
}

.counter-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
}

/* Bookmarks List */
.bookmarks-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 32px;
}

.bookmark-card-container {
    position: relative;
}

/* Compact Card */
.bookmark-card {
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--card-color);
    border: none;
    border-bottom: 5px solid var(--border-color);
    position: relative;
    transition: transform 0.15s ease;
}

.bookmark-card:active:not(.long-pressed) {
    transform: scale(0.98);
}

.card-content-overlay {
    transition: filter 0.3s ease;
}

.card-content-overlay.blurred {
    filter: blur(4px);
}

/* Inner layout */
.card-inner {
    padding: 14px 16px;
}

/* Bookmark Icon */
.bookmark-icon-wrapper {
    background: white;
    border-radius: 8px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.bookmark-icon {
    color: var(--icon-color) !important;
}

/* Text */
.card-text {
    min-width: 0;
}

.lesson-title {
    font-size: 14px;
    color: white;
    line-height: 1.3;
}

.ellipsis-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.timestamp {
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 11px;
}

.timestamp .q-icon {
    color: rgba(255, 255, 255, 0.85) !important;
}

/* Page Badge (right side) */
.page-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
}

.page-badge-custom {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 6px 10px;
    white-space: nowrap;
}

.page-text {
    font-size: 13px;
    font-weight: 700;
    color: white;
    letter-spacing: 0.3px;
}

/* Delete overlay */
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
}

.delete-content {
    display: flex;
    align-items: center;
    gap: 10px;
    pointer-events: auto;
}

.delete-icon-center {
    background: white;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.delete-label {
    color: white;
    font-weight: 600;
    font-size: 14px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease;
}

/* Empty State */
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
</style>