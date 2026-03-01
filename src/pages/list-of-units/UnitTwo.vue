<template>
    <q-page class="chapters-page">

        <!-- ── Header ── -->
        <div class="page-header">
            <q-toolbar class="center-toolbar">
                <q-btn flat dense round icon="arrow_back" aria-label="Go back" @click="goBack" class="btn-left" />
                <div class="toolbar-title">Unit II</div>
            </q-toolbar>
        </div>

        <!-- ── Hero Section ── -->
        <div class="hero-section">

            <!-- Floating decorative blobs -->
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>

            <!-- Unit image -->
            <div class="hero-image-wrap">
                <img src="assets/temp/Life Science.png" alt="Unit II" class="hero-img" />
                <div class="hero-img-glow"></div>
            </div>

            <!-- Unit badge + title -->
            <div class="hero-meta">
                <span class="unit-badge">Unit II</span>
                <h1 class="unit-title">Life Science</h1>
                <div class="unit-stats-row">
                    <div class="unit-stat">
                        <span class="stat-value">3</span>
                        <span class="stat-key">Chapters</span>
                    </div>
                    <div class="stat-sep"></div>
                    <div class="unit-stat">
                        <span class="stat-value">22</span>
                        <span class="stat-key">Lessons</span>
                    </div>
                    <div class="stat-sep"></div>
                    <div class="unit-stat">
                        <span class="stat-value">8h</span>
                        <span class="stat-key">Est. time</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Description Card ── -->
        <div class="desc-card">
            <div class="desc-title-row">
                <p class="desc-title">Life Science</p>
                <button class="tts-btn" :class="{ 'tts-active': isSpeaking }" @click="toggleSpeak"
                    :aria-label="isSpeaking ? 'Stop reading' : 'Read aloud'">
                    <q-icon :name="isSpeaking ? 'stop' : 'volume_up'" size="18px" />
                    <span class="tts-ripple" v-if="isSpeaking"></span>
                </button>
            </div>

            <p class="desc-text">
                Living things have their own unique characteristics that allow them to live and thrive in different
                conditions. They have unique characteristics that enable them to adapt and survive. They have the
                ability to multiply, regulate and use energy, grow and develop, adapt to changing environment, and exist
                in an organized manner, among others. All the intricacies of life are found in living things.
            </p>
            <p class="desc-text">
                In this unit, you will discover the different characteristics of life that living things exhibit. Study
                each chapter to learn more about their composition, their ability to perpetuate, and their organization
                and order.
            </p>

            <div class="desc-chips">
                <div class="desc-chip chip-blue">
                    <q-icon name="biotech" size="14px" />
                    <span>The Microscope</span>
                </div>

                <div class="desc-chip chip-teal">
                    <q-icon name="device_hub" size="14px" />
                    <span>Cells</span>
                </div>

                <div class="desc-chip chip-yellow">
                    <q-icon name="eco" size="14px" />
                    <span>Energy in Ecosystems</span>
                </div>
            </div>
        </div>

        <!-- ── Bottom Sheet ── -->
        <div class="bottom-sheet" :style="{ transform: `translateY(${translateY}px)` }">

            <!-- Handle -->
            <div class="sheet-handle" @pointerdown="startDrag">
                <div class="handle-bar"></div>
                <div class="handle-label">
                    <span class="handle-title">Chapters</span>
                    <span class="handle-count">{{ chapters.length }} available</span>
                </div>
            </div>

            <!-- Chapter list -->
            <div class="sheet-content">
                <router-link v-for="chapter in chapters" :key="chapter.id" :to="chapter.route" class="chapter-link">
                    <div class="chapter-card" :style="{ '--card-bg': chapter.color, '--card-shadow': chapter.shadow }">

                        <!-- Left accent stripe -->
                        <div class="card-stripe"></div>

                        <!-- Icon -->
                        <div class="card-icon-wrap">
                            <img :src="chapter.icon" class="card-icon" :alt="chapter.title" />
                        </div>

                        <!-- Text -->
                        <div class="card-body">
                            <span class="card-label">{{ chapter.label }}</span>
                            <p class="card-title">{{ chapter.title }}</p>
                        </div>

                        <!-- Arrow -->
                        <div class="card-arrow">
                            <q-icon name="chevron_right" size="22px" />
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

    </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { audioManager } from 'src/utils/audioManager'

/* ── TTS ── */
const isSpeaking = ref(false)

const descContent = `Life Science
Living things have their own unique characteristics that allow them to live and thrive in different conditions. They have unique characteristics that enable them to adapt and survive. They have the ability to multiply, regulate and use energy, grow and develop, adapt to changing environment, and exist in an organized manner, among others. All the intricacies of life are found in living things.
In this unit, you will discover the different characteristics of life that living things exhibit. Study each chapter to learn more about their composition, their ability to perpetuate, and their organization and order.`

async function toggleSpeak() {
    if (isSpeaking.value) {
        await TextToSpeech.stop()
        audioManager.restoreBg()
        isSpeaking.value = false
        return
    }

    isSpeaking.value = true
    audioManager.duckBg()

    try {
        await TextToSpeech.speak({
            text: descContent,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient'
        })
    } finally {
        audioManager.restoreBg()
        isSpeaking.value = false
    }
}

onUnmounted(async () => {
    if (isSpeaking.value) {
        await TextToSpeech.stop()
        audioManager.restoreBg()
    }
})

/* ── Bottom Sheet Physics ── */
const translateY = ref(0)
let startY = 0
let startTranslate = 0
let dragging = false
let rafId = null

const COLLAPSED = () => window.innerHeight * 0.62
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
        translateY.value = Math.min(COLLAPSED(), Math.max(EXPANDED, next))
        rafId = null
    })
}

function endDrag() {
    dragging = false
    translateY.value = translateY.value < window.innerHeight * 0.3 ? EXPANDED : COLLAPSED()
    window.removeEventListener('pointermove', onDrag)
    window.removeEventListener('pointerup', endDrag)
}

/* ── Data ── */
const chapters = [
    // UNIT II – Life Science
    {
        id: 4,
        label: "Chapter 4",
        title: "The Microscope and the Microscopic Cell",
        route: "/chapter-4",
        color: "#EC407A", // Pink
        shadow: "#AD1457", // Darker Pink
        icon: "assets/icons/microscope.png"
    },
    {
        id: 5,
        label: "Chapter 5",
        title: "Cellular Reproduction and Fertilization",
        route: "/chapter-5",
        color: "#FB8C00", // Orange
        shadow: "#E65100", // Darker Orange
        icon: "assets/icons/cell.png"
    },
    {
        id: 6,
        label: "Chapter 6",
        title: "Energy Flow in the Ecosystem",
        route: "/chapter-6",
        color: "#9CCC65", // Light Green
        shadow: "#558B2F", // Darker Green
        icon: "assets/icons/ecosystem.png"
    }
]

function goBack() {
    window.history.length > 1 ? window.history.back() : window.location.assign('/')
}
</script>

<style scoped>
/* ── Variables ── */
:root {
    --primary: #42a7ff;
    --primary-dark: #1a7fd4;
    --white: #ffffff;
    --radius: 16px;
}

/* ── Base ── */
.chapters-page {
    font-family: "MyFont", sans-serif;
    background: #42a7ff;
    min-height: 100vh;
    overflow-x: hidden;
}

/* ── Header ── */
.page-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: transparent;
}

.center-toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 52px;
    padding: 0 16px;
}

.toolbar-title {
    font-size: 22px;
    font-weight: 800;
    color: white;
    letter-spacing: 0.3px;
}

.btn-left {
    color: white !important;
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.15) !important;
    border-radius: 10px;
    transition: background 0.2s ease;
}

.btn-left:hover {
    background: rgba(255, 255, 255, 0.25) !important;
}

/* ── Hero Section ── */
.hero-section {
    position: relative;
    padding: 8px 20px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    overflow: hidden;
}

/* Decorative blobs */
.blob {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
}

.blob-1 {
    width: 200px;
    height: 200px;
    top: -80px;
    right: -60px;
}

.blob-2 {
    width: 120px;
    height: 120px;
    top: 60px;
    left: -40px;
}

.blob-3 {
    width: 80px;
    height: 80px;
    bottom: 20px;
    right: 20px;
}

/* Hero image */
.hero-image-wrap {
    position: relative;
    z-index: 2;
}

.hero-img {
    width: 220px;
    height: 220px;
    object-fit: cover;
    border-radius: 24px;
    box-shadow:
        8px 8px 0px rgba(0, 0, 0, 0.18),
        0 0 0 4px rgba(255, 255, 255, 0.2);
    display: block;
}

.hero-img-glow {
    position: absolute;
    inset: 10px;
    border-radius: 20px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent 70%);
    pointer-events: none;
}

/* Hero meta */
.hero-meta {
    text-align: center;
    z-index: 2;
}

.unit-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 20px;
    padding: 4px 12px;
    margin-bottom: 10px;
}

.unit-title {
    font-size: 32px;
    font-weight: 900;
    color: #ffffff;
    margin: 0 0 16px 0;
    line-height: 1.15;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Stats row */
.unit-stats-row {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 50px;
    padding: 10px 20px;
}

.unit-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
}

.stat-key {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.65);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.stat-sep {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.3);
}

/* ── Description Card ── */
.desc-card {
    position: relative;
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    padding: 24px 20px 100px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.desc-card-accent {
    display: none;
}

/* Title row with inline TTS button */
.desc-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 2px solid #eef2f7;
}

.desc-title {
    font-size: 17px;
    font-weight: 800;
    color: #111827;
    margin: 0;
}

/* TTS speaker button */
.tts-btn {
    position: relative;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #e0f2ff;
    color: #1a7fd4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
    overflow: hidden;
}

.tts-btn:hover {
    background: #c4e5ff;
    transform: scale(1.05);
}

.tts-btn:active {
    transform: scale(0.95);
}

.tts-btn.tts-active {
    background: #42a7ff;
    color: #ffffff;
}

/* Ripple pulse when speaking */
.tts-ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid #42a7ff;
    animation: tts-pulse 1.4s ease-out infinite;
    pointer-events: none;
}

@keyframes tts-pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    100% {
        transform: scale(2);
        opacity: 0;
    }
}

.desc-text {
    font-size: 14px;
    line-height: 1.75;
    color: #4b5563;
    margin: 0 0 12px 0;
    text-align: justify;
}

.desc-text:last-of-type {
    margin-bottom: 18px;
}

/* Topic chips */
.desc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
}

.desc-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 20px;
    letter-spacing: 0.2px;
}

.chip-blue {
    background: #e0f2ff;
    color: #1a7fd4;
}

.chip-teal {
    background: #d0f5f3;
    color: #1a9e96;
}

.chip-yellow {
    background: #fff4cc;
    color: #b57800;
}

/* ── Bottom Sheet ── */
.bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 72vh;
    background: #f8faff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.14);
    display: flex;
    flex-direction: column;
    will-change: transform;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 50;
}

/* Handle */
.sheet-handle {
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    padding: 12px 20px 10px;
    cursor: grab;
    touch-action: none;
    border-bottom: 1px solid #eef2f7;
}

.sheet-handle:active {
    cursor: grabbing;
}

.handle-bar {
    width: 40px;
    height: 4px;
    background: #d1d5db;
    border-radius: 2px;
    margin: 0 auto 10px;
}

.handle-label {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.handle-title {
    font-size: 17px;
    font-weight: 800;
    color: #111827;
}

.handle-count {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
}

/* Sheet content */
.sheet-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* ── Chapter Cards ── */
.chapter-link {
    text-decoration: none;
    display: block;
}

.chapter-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--card-bg);
    border-radius: 18px;
    padding: 14px 14px 14px 0;
    box-shadow: 0 6px 0 0 var(--card-shadow);
    position: relative;
    overflow: hidden;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.chapter-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 9px 0 0 var(--card-shadow);
}

.chapter-card:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 0 var(--card-shadow);
}

/* Left accent stripe */
.card-stripe {
    width: 6px;
    align-self: stretch;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 0 4px 4px 0;
    flex-shrink: 0;
}

/* Icon */
.card-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.28);
    border: 2px solid rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.card-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
}

/* Text */
.card-body {
    flex: 1;
    min-width: 0;
}

.card-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 3px;
}

.card-title {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    line-height: 1.3;
}

/* Arrow */
.card-arrow {
    color: rgba(255, 255, 255, 0.75);
    flex-shrink: 0;
    padding-right: 4px;
}

/* ── Responsive ── */
@media (min-width: 600px) {
    .hero-img {
        width: 280px;
        height: 280px;
    }

    .unit-title {
        font-size: 40px;
    }

    .sheet-content {
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
    }

    .desc-card {
        padding: 32px 32px 120px;
    }
}
</style>