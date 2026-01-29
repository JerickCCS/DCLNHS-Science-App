<template>
    <div class="lesson-container">
        <div id="viewer">
            <div v-html="renderedPages[currentPage]"></div>
        </div>

        <!-- Navigation Buttons -->
        <div class="buttons">
            <q-btn class="nav-button" :disable="currentPage === 0" @click="prevPage" no-caps>
                Previous
            </q-btn>
            <q-btn class="nav-button" :disable="currentPage === renderedPages.length - 1" @click="nextPage" no-caps>
                Next
            </q-btn>
        </div>

        <!-- Speak Button -->
        <div class="speak-btn" :class="{ active: isPlaying }" @click="playAudio">
            <i :class="isPlaying ? 'fa-solid fa-stop' : 'fa-solid fa-volume-high'"></i>
        </div>

        <!-- Page indicator -->
        <div class="page-indicator">
            {{ currentPage + 1 }} / {{ renderedPages.length }}
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { marked } from 'marked'

export default {
    name: 'LessonViewer',
    props: {
        lessonData: {
            type: Object,
            required: true,
            validator: (value) => {
                return value.skeleton && value.content && Array.isArray(value.skeleton.pages)
            }
        }
    },
    setup(props) {
        const currentPage = ref(0)
        const isPlaying = ref(false)
        let audio = null

        // Configure marked for better rendering
        marked.setOptions({
            breaks: true,
            gfm: true
        })

        const renderedPages = computed(() => {
            return props.lessonData.skeleton.pages.map(page => {
                return renderPage(page, props.lessonData.content)
            })
        })

        const renderPage = (pageStructure, contentData) => {
            let html = '<div>'

            pageStructure.sections.forEach(section => {
                switch (section.type) {
                    case 'header':
                        html += renderHeader(section, contentData)
                        break
                    case 'content':
                        html += renderContent(section, contentData)
                        break
                    case 'question':
                        html += renderQuestion(section, contentData)
                        break
                    case 'media':
                        html += renderMedia(section, contentData)
                        break
                    case 'illustration':
                        html += renderIllustration(section, contentData)
                        break
                    case 'model-viewer':
                        html += renderModelViewer(section, contentData)
                        break
                    case 'mini-test':
                        html += renderMiniTest(section, contentData)
                        break
                    default:
                        console.warn(`Unknown section type: ${section.type}`)
                }
            })

            html += '</div>'
            return html
        }

        const renderHeader = (section, contentData) => {
            const content = contentData[section.contentKey] || {}
            return `
        <div class="header">
          <span class="lesson-pill">${content.lesson || 'Lesson'}</span>
          <div>
            <div class="title">${content.title || 'Untitled'}</div>
            <div class="subtitle">${content.subtitle || ''}</div>
          </div>
        </div>
      `
        }

        const renderContent = (section, contentData) => {
            const content = contentData[section.contentKey] || ''
            return `<div class="content-section">${marked(content)}</div>`
        }

        const renderQuestion = (section, contentData) => {
            const content = contentData[section.contentKey] || {}
            return `
        <div class="question">
          <div class="question-header">
            <i class="fa-solid fa-key"></i>
            <span>${content.question || 'Question'}</span>
          </div>
          <div>${marked(content.answer || '')}</div>
        </div>
      `
        }

        const renderMedia = (section, contentData) => {
            const content = contentData[section.contentKey] || {}

            if (section.mediaType === 'video') {
                return `
          <div class="video-container">
            <video controls width="100%">
              <source src="${content.src}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <div class="caption">${content.caption || ''}</div>
          </div>
        `
            }
            return ''
        }

        const renderIllustration = (section, contentData) => {
            const content = contentData[section.contentKey] || {}
            return `
        <div class="illustration">
          <img src="${content.src}" alt="${content.alt || ''}">
          ${content.caption ? `<div class="caption">${content.caption}</div>` : ''}
        </div>
      `
        }

        const renderModelViewer = (section, contentData) => {
            const content = contentData[section.contentKey] || {}
            return `
        <div class="model-viewer-block">
          <model-viewer 
            src="${content.src}" 
            alt="${content.alt || '3D Model'}" 
            camera-controls 
            auto-rotate 
            ar
            interaction-prompt="auto"
            loading="eager">
          </model-viewer>
          <div class="caption">${content.caption || ''}</div>
        </div>
      `
        }

        const renderMiniTest = (section, contentData) => {
            const content = contentData[section.contentKey] || {}
            const questionsHtml = (content.questions || [])
                .map((q, i) => `<div class="item"><strong>${i + 1}.</strong> ${q}</div>`)
                .join('')

            return `
        <div class="mini-test">
          <div class="mini-left">
            <div class="mini-pill">${content.title || 'MINI TEST'}</div>
            <div class="mini-list">
              ${questionsHtml}
            </div>
          </div>
          <div class="mini-right">
            <img src="${content.image?.src}" alt="${content.image?.alt || ''}">
          </div>
        </div>
      `
        }

        const playAudio = () => {
            if (audio && !audio.paused) {
                audio.pause()
                audio.currentTime = 0
                isPlaying.value = false
                return
            }

            const audioSrc = props.lessonData.skeleton.pages[currentPage.value]?.audio
            if (!audioSrc) return

            if (audio) {
                audio.pause()
                audio.currentTime = 0
            }

            audio = new Audio(audioSrc)
            audio.play().catch(console.error)
            isPlaying.value = true

            audio.onended = () => {
                isPlaying.value = false
            }
        }

        const nextPage = () => {
            if (currentPage.value < renderedPages.value.length - 1) {
                currentPage.value++
                stopAudio()
            }
        }

        const prevPage = () => {
            if (currentPage.value > 0) {
                currentPage.value--
                stopAudio()
            }
        }

        const stopAudio = () => {
            if (audio) {
                audio.pause()
                audio.currentTime = 0
                isPlaying.value = false
            }
        }

        // Watch for lesson data changes and reset to first page
        watch(() => props.lessonData, () => {
            currentPage.value = 0
            stopAudio()
        })

        onMounted(() => {
            // Load model-viewer script if needed
            if (!document.querySelector('script[src*="model-viewer"]')) {
                const script = document.createElement('script')
                script.type = 'module'
                script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
                document.head.appendChild(script)
            }
        })

        onUnmounted(() => {
            stopAudio()
        })

        return {
            currentPage,
            isPlaying,
            renderedPages,
            playAudio,
            nextPage,
            prevPage
        }
    }
}
</script>

<style scoped>
.lesson-container {
    margin: 0;
    padding: 0;
    height: 95vh;
    width: 100%;
    font-family: "Baloo 2", sans-serif;
    background: #fffefb;
    color: #111827;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

#viewer {
    flex: none;
    height: calc(100vh - 150px);
    margin: 10px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 3px 3px 0px #222;
    border-top: 2px solid #444;
    border-left: 2px solid #444;
    border-right: 4px solid #444;
    border-bottom: 4px solid #444;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: fixed;
}

#viewer> :deep(div) {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 12px;
    box-sizing: border-box;
}

.speak-btn {
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #6B46C1;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 3px 3px 0px #222;
    z-index: 1000;
}

.speak-btn.active {
    background: #e53935;
}

.page-indicator {
    position: fixed;
    bottom: 100px;
    left: 20px;
    background: rgba(107, 70, 193, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 1000;
}

.buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 10px;
    padding: 12px;
    background: #96e080;
    border-top: 3px solid #222;
    z-index: 100;
}

.nav-button {
    flex: 1;
    min-width: 100px;
    padding: 12px;
    border: 3px solid #222;
    border-radius: 6px;
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fffbe7;
    font-weight: bold;
    cursor: pointer;
    font-family: "Baloo 2", cursive;
    text-transform: uppercase;
    box-shadow: 3px 3px 0px #222;
    transition: transform .2s, box-shadow .2s;
}

.nav-button:hover {
    transform: translateY(-3px);
    box-shadow: 5px 5px 0px #222;
    background: #e53935;
}

.nav-button:disabled,
.nav-button.disabled {
    background: #ccc !important;
    border-color: #999 !important;
    color: #666 !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
    transform: none !important;
}

/* Content Styles */
:deep(.header) {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
}

:deep(.lesson-pill) {
    background: #6B46C1;
    color: white;
    border-radius: 25px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 2px 2px 0px #222;
}

:deep(.title) {
    font-size: 6vw;
    font-weight: 700;
    margin: 0;
    line-height: 1.4;
    color: #1f2937;
}

:deep(.subtitle) {
    font-size: 4.5vw;
    color: #6b7280;
    margin-top: 4px;
    line-height: 1.4;
}

:deep(.content-section),
:deep(.question) {
    margin-top: 18px;
}

:deep(.question-header) {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 5vw;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1.4;
    padding: 8px 0;
    border-bottom: 3px solid #6B46C1;
}

:deep(.question-header i) {
    color: #6B46C1;
    font-size: 1.2em;
}

:deep(p) {
    font-size: 4.5vw;
    line-height: 1.6;
    margin: 0 0 16px 0;
    text-align: justify;
}

:deep(.video-container) {
    text-align: center;
    margin: 24px 0;
}

:deep(.video-container video) {
    width: 100%;
    max-width: 600px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.illustration) {
    text-align: center;
    margin: 24px 0;
}

:deep(.illustration img) {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.caption) {
    margin-top: 12px;
    font-size: 4vw;
    font-weight: 600;
    line-height: 1.4;
    color: #374151;
    font-style: italic;
}

:deep(.model-viewer-block) {
    text-align: center;
    margin: 22px 0;
}

:deep(.model-viewer-block model-viewer) {
    width: 100%;
    height: 50vh;
    border: 2px solid #bdbdbd;
    border-radius: 10px;
    background: #fff;
}

:deep(.mini-test) {
    margin-top: 32px;
    padding: 20px;
}

:deep(.mini-pill) {
    background: #6B46C1;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 16px;
    box-shadow: 2px 2px 0px #222;
}

:deep(.mini-list .item) {
    font-size: 4.5vw;
    line-height: 1.6;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #d1d5db;
}

:deep(.mini-list .item:last-child) {
    border-bottom: none;
}

:deep(.mini-right) {
    text-align: center;
    margin-top: 20px;
}

:deep(.mini-right img) {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mobile layout */
@media (max-width: 600px) {
    :deep(.mini-test) {
        flex-direction: column;
        align-items: flex-start;
    }

    :deep(.mini-left) {
        width: 100%;
        order: 0;
    }

    :deep(.mini-right) {
        width: 100%;
        order: 1;
        display: flex;
        justify-content: center;
        margin-bottom: 12px;
    }

    :deep(.mini-right img) {
        max-width: 80%;
        height: auto;
    }

    :deep(.mini-list) {
        width: 100%;
        order: 2;
    }
}

/* Desktop overrides */
@media (min-width: 768px) {
    :deep(.title) {
        font-size: 32px;
        line-height: 1.3;
    }

    :deep(.subtitle) {
        font-size: 18px;
        line-height: 1.4;
    }

    :deep(.question-header) {
        font-size: 20px;
        line-height: 1.4;
    }

    :deep(p),
    :deep(.mini-list .item) {
        font-size: 16px;
        line-height: 1.5;
    }

    :deep(.caption) {
        font-size: 14px;
        line-height: 1.3;
    }

    :deep(.mini-pill) {
        font-size: 14px;
        line-height: 1.4;
    }

    :deep(.mini-test) {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
    }

    :deep(.mini-left) {
        flex: 1;
    }

    :deep(.mini-right) {
        width: 200px;
        margin-top: 0;
    }
}
</style>