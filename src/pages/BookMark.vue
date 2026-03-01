<template>
    <q-layout view="lHh Lpr lFf">
        <!-- Header -->
        <q-header class="text-white header-no-border" style="background: #008BFF !important;">
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

                <!-- ── Floating bubbles ── -->
                <div class="bubbles" aria-hidden="true">
                    <div class="bubble b1"></div>
                    <div class="bubble b2"></div>
                    <div class="bubble b3"></div>
                    <div class="bubble b4"></div>
                    <div class="bubble b5"></div>
                    <div class="bubble b6"></div>
                    <div class="bubble b7"></div>
                    <div class="bubble b8"></div>
                </div>

                <!-- Bookmark Counter Card -->
                <div class="counter-card-wrapper q-mx-md q-mt-sm q-mb-md">
                    <img src="assets/icons/bookmark.png" class="counter-bookmark-icon" alt="bookmark" />

                    <div class="counter-card">
                        <div class="counter-content">
                            <div class="row items-center justify-between">
                                <div class="counter-label">Total Bookmarks</div>
                                <div class="counter-value">{{ bookmarks.length }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="q-px-md q-pb-md content-layer">
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
/* ── Root backgrounds ── */
:deep(.q-page-container) {
    padding: 0 !important;
    padding-bottom: 0 !important;
    background: #42a7ff !important;
    min-height: 100vh !important;
}

:deep(.q-page) {
    min-height: 100vh;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    background: transparent !important;
}

:deep(body),
:deep(html) {
    background: #0c1374 !important;
    margin: 0;
    padding: 0;
}

/* ── Page — same gradient as IndexPage ── */
.bookmarks-page {
    background: linear-gradient(135deg, #5DA9FF 0%, #C084FC 100%);
    min-height: 100dvh;
    padding-top: 60px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    position: relative;
    overflow: hidden;
}

/* ── Header — matches IndexPage header exactly ── */
.header-no-border {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.text-white {
    color: white !important;
}

/* ============================== */
/* FLOATING BUBBLES               */
/* ============================== */

.bubbles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

.bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    animation: bubble-float linear infinite;
}

.b1 {
    width: 180px;
    height: 180px;
    left: 8%;
    bottom: -200px;
    animation-duration: 18s;
    animation-delay: 0s;
}

.b2 {
    width: 90px;
    height: 90px;
    left: 22%;
    bottom: -120px;
    animation-duration: 14s;
    animation-delay: 2s;
}

.b3 {
    width: 130px;
    height: 130px;
    left: 45%;
    bottom: -160px;
    animation-duration: 20s;
    animation-delay: 5s;
}

.b4 {
    width: 60px;
    height: 60px;
    left: 60%;
    bottom: -90px;
    animation-duration: 12s;
    animation-delay: 1s;
}

.b5 {
    width: 200px;
    height: 200px;
    left: 75%;
    bottom: -230px;
    animation-duration: 22s;
    animation-delay: 7s;
}

.b6 {
    width: 50px;
    height: 50px;
    left: 88%;
    bottom: -80px;
    animation-duration: 10s;
    animation-delay: 3s;
}

.b7 {
    width: 110px;
    height: 110px;
    left: 35%;
    bottom: -140px;
    animation-duration: 16s;
    animation-delay: 9s;
}

.b8 {
    width: 75px;
    height: 75px;
    left: 5%;
    bottom: -100px;
    animation-duration: 13s;
    animation-delay: 4s;
}

@keyframes bubble-float {
    0% {
        transform: translateY(0) scale(1);
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 0.6;
    }

    100% {
        transform: translateY(-110vh) scale(1.1);
        opacity: 0;
    }
}

/* Content must sit above the bubble layer */
.content-layer {
    position: relative;
    z-index: 1;
}

/* ============================== */
/* COUNTER CARD                   */
/* ============================== */

.counter-card-wrapper {
    position: relative;
    padding-top: 24px;
    z-index: 1;
}

.counter-card {
    color: white;
    background: #ffc412;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border-bottom: 6px solid #c99a0e;
}

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

/* ============================== */
/* BOOKMARKS LIST                 */
/* ============================== */

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

.card-inner {
    padding: 14px 16px;
}

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
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.timestamp {
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 11px;
}

.timestamp .q-icon {
    color: rgba(255, 255, 255, 0.85) !important;
}

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

/* ============================== */
/* DELETE OVERLAY                 */
/* ============================== */

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

/* ============================== */
/* EMPTY STATE                    */
/* ============================== */

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

/* ============================== */
/* KEYFRAMES                      */
/* ============================== */

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