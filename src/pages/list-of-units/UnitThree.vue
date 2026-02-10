<template>
    <q-page class="chapters-page">
        <!-- Header inside page -->
        <div class="page-header">
            <q-toolbar class="center-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="btn-left" />
                <div class="toolbar-title">Unit III</div>
            </q-toolbar>
        </div>

        <!-- Main Content -->
        <div class="page-content q-pa-md">
            <!-- Main Image -->
            <div class="main-image q-mb-md">
                <img src="assets/temp/Forces in Action.png" alt="Unit III" class="main-img" />
            </div>

            <!-- Description -->
            <div class="unit-description q-pb-xl text-body1">
                <p class="text-bold text-h6 text-center">Force, Motion, and Energy</p>
                <p>
                    Force, motion, and energy are fundamental concepts in physics that explain how objects
                    move and interact. Understanding these principles helps us describe the behavior of
                    everything from a rolling ball to the motion of planets.
                </p>
                <p>
                    This unit introduces the basic ideas of forces and how they cause motion, the different
                    types of energy, and how energy is transferred and transformed in everyday situations.
                </p>
            </div>
        </div>

        <!-- Bottom Sheet -->
        <div class="bottom-sheet" :style="{ transform: `translateY(${translateY}px)` }">
            <!-- Handle -->
            <div class="sheet-handle" @pointerdown="startDrag">
                <div class="handle-bar"></div>
                <div class="handle-text">Chapters</div>
            </div>

            <!-- Content -->
            <div class="sheet-content q-pa-md">
                <div v-for="chapter in chapters" :key="chapter.id" class="q-mb-md">
                    <router-link :to="chapter.route" class="no-link">
                        <q-card class="q-pa-md row items-center chapter-card" :style="{
                            backgroundColor: chapter.color,
                            '--shadow-color': chapter.shadow
                        }" clickable>
                            <div class="chapter-icon-container">
                                <img :src="chapter.icon" class="chapter-icon" />
                            </div>
                            <div class="col">
                                <div class="text-subtitle1 text-bold text-white">
                                    {{ chapter.label }}
                                </div>
                                <div class="text-body2 text-white">
                                    {{ chapter.title }}
                                </div>
                            </div>
                            <q-icon name="chevron_right" size="28px" color="white" />
                        </q-card>
                    </router-link>
                </div>
            </div>
        </div>

    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/* ---------- Bottom Sheet Physics ---------- */
const translateY = ref(0)
let startY = 0
let startTranslate = 0
let dragging = false
let rafId = null

const COLLAPSED = () => window.innerHeight * 0.6
const EXPANDED = 0

onMounted(() => {
    translateY.value = COLLAPSED()
})

function startDrag(e) {
    dragging = true
    startY = e.clientY
    startTranslate = translateY.value

    e.target.setPointerCapture(e.pointerId)
    window.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', endDrag)
}

function onDrag(e) {
    if (!dragging || rafId) return

    rafId = requestAnimationFrame(() => {
        const delta = e.clientY - startY
        const next = startTranslate + delta

        translateY.value = Math.min(
            COLLAPSED(),
            Math.max(EXPANDED, next)
        )

        rafId = null
    })
}

function endDrag() {
    dragging = false

    translateY.value =
        translateY.value < window.innerHeight * 0.3
            ? EXPANDED
            : COLLAPSED()

    window.removeEventListener('pointermove', onDrag)
    window.removeEventListener('pointerup', endDrag)
}

/* ---------- Data ---------- */
const chapters = [
    // UNIT III – Force, Motion, and Energy
    {
        id: 7,
        label: "Chapter 7",
        title: "Forces in Action",
        route: "/chapter-7",
        color: "#26A69A", // Teal
        shadow: "#00695C", // Darker Teal
        icon: "assets/icons/force.png"
    },
    {
        id: 8,
        label: "Chapter 8",
        title: "Fundamentals of Motion",
        route: "/chapter-8",
        color: "#8E24AA", // Purple
        shadow: "#6A1B9A", // Darker Purple
        icon: "assets/icons/motion.png"
    },
    {
        id: 9,
        label: "Chapter 9",
        title: "Heat Transfer and Saving Energy",
        route: "/chapter-9",
        color: "#E53935", // Red
        shadow: "#B71C1C", // Darker Red
        icon: "assets/icons/heat.png"
    }
]

function goBack() {
    window.history.length > 1
        ? window.history.back()
        : window.location.assign('/')
}
</script>

<style scoped>
/* ---------- Global Background ---------- */
.chapters-page {
    background: #42a7ff !important;
    min-height: 100vh;
}

/* ---------- Header (Now inside page) ---------- */
.page-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #42a7ff;
    box-shadow: none;
}

.center-toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 50px;
}

.toolbar-title {
    font-size: 26px;
    font-weight: bold;
    color: white;
}

/* Back Button Styling */
.btn-left {
    color: white;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent !important;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.2s ease;
}

.btn-left:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateY(-50%) scale(1.05);
}

/* Icon color for back button */
.btn-left .q-icon {
    color: white !important;
}

/* ---------- Page Content ---------- */
.page-content {
    background: transparent;
}

/* ---------- Main Image ---------- */
.main-image {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.main-img {
    width: 100%;
    max-width: 350px;
    height: auto;
    border-radius: 16px;
    box-shadow: 7px 7px 0px 0px rgba(0, 0, 0, 0.16);
}

/* ---------- Description ---------- */
.unit-description {
    background: white;
    color: #374151;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 90px;
    box-shadow: 7px 7px 0px 0px rgba(0, 0, 0, 0.16);
    position: relative;
    text-align: justify;
}

.unit-description p {
    margin-bottom: 12px;
    line-height: 1.6;
}

.unit-description p:last-child {
    margin-bottom: 0;
}

.unit-description .text-h6 {
    color: #3b28cc;
}

/* ---------- Bottom Sheet ---------- */
.bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70vh;
    background: white;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    will-change: transform;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 50;
}

/* ---------- Sheet Handle ---------- */
.sheet-handle {
    background-color: #f8f9fb;
    padding: 8px 0;
    text-align: center;
    cursor: grab;
    touch-action: none;
}

.sheet-handle:active {
    cursor: grabbing;
}

.handle-bar {
    width: 40px;
    height: 4px;
    background: #ccc;
    border-radius: 2px;
    margin: 0 auto 4px;
}

.handle-text {
    color: #666;
    font-size: 14px;
    font-weight: 500;
}

.sheet-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    background: #f8f9fa;
}

/* ---------- Chapter Cards ---------- */
.chapter-card {
    border-radius: 16px;
    position: relative;
    border: none;
    box-shadow: 0 8px 0 0 var(--shadow-color) !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 90px;
}

.chapter-card .q-card__section {
    padding: 0;
}

.chapter-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 0 0 var(--shadow-color) !important;
}

.chapter-card:active {
    transform: translateY(4px);
    box-shadow: 0 4px 0 0 var(--shadow-color) !important;
}

/* ---------- Fixed Chapter Icon ---------- */
.chapter-icon-container {
    position: relative;
    margin-right: 16px;
}

.chapter-icon {
    width: 48px;
    height: 48px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    position: relative;
    z-index: 2;
}

.no-link {
    text-decoration: none;
    display: block;
}
</style>