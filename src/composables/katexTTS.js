// src/composables/katexTTS.js
import { ref } from "vue"
import { Capacitor } from "@capacitor/core"
import { audioManager } from "src/utils/audioManager"

/**
 * Custom TTS composable for lesson pages with KaTeX and HTML content
 * @param {Array<string>} rawPages - Array of lesson HTML page strings
 */
export function useTTSLesson(rawPages) {
    const isPlaying = ref(false)
    const textToRead = ref("")

    const getTextToSpeech = async () => {
        if (Capacitor.getPlatform() === "web") {
            return null
        }
        // Dynamic import prevents minification issues
        const { TextToSpeech } = await import("@capacitor-community/text-to-speech")
        return TextToSpeech
    }

    // Extract clean text from raw HTML + KaTeX
    const getTextForSpeech = (pageIndex) => {
        if (!rawPages[pageIndex]) return ""

        const pageContent = rawPages[pageIndex]
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = pageContent
        let text = tempDiv.textContent || tempDiv.innerText || ""

        // Remove LaTeX delimiters
        text = text.replace(/\\\(|\\\)|\$\$|\\\\/g, " ")

        // Handle \text{}, \vec{}, \Delta, fractions
        text = text.replace(/\\text\{([^}]+)\}/g, "$1")
        text = text.replace(/\\vec\{([^}]+)\}/g, "$1 vector")
        text = text.replace(/\\Delta/g, "delta")
        text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (_, n, d) => `${n} over ${d}`)

        // Remove leftover backslashes and curly braces
        text = text.replace(/[\\{}]/g, " ")

        // Replace math symbols for speech
        text = text
            .replace(/=/g, " equals ")
            .replace(/\+/g, " plus ")
            .replace(/-/g, " minus ")
            .replace(/\//g, " per ")
            .replace(/\?/g, " question mark ")

        // Units
        text = text
            .replace(/\bm\s*\/\s*s\b/g, " meters per second")
            .replace(/\bm\b/g, " meters")
            .replace(/\bs\b/g, " seconds")

        // Final cleanup
        return text.replace(/\s+/g, " ").trim()
    }

    // Speak text
    const speakText = async (text) => {
        if (!text) return
        try {
            if (Capacitor.getPlatform() !== "web") {
                const TTS = await getTextToSpeech()
                if (TTS) {
                    await TTS.speak({ text, lang: "en-US", rate: 1.0, pitch: 1.0 })
                    isPlaying.value = false
                }
            } else if ("speechSynthesis" in window) {
                const synth = window.speechSynthesis
                synth.cancel()
                const utter = new SpeechSynthesisUtterance(text)
                utter.lang = "en-US"
                utter.rate = 1.0
                utter.pitch = 1.0
                utter.onend = () => {
                    isPlaying.value = false
                    audioManager.restoreBg()
                }
                synth.speak(utter)
            } else {
                console.warn("speechSynthesis not supported")
                isPlaying.value = false
            }
        } catch (err) {
            console.warn("TTS error:", err)
            isPlaying.value = false
        }
    }

    // Stop speaking
    const stopSpeaking = async () => {
        try {
            if (Capacitor.getPlatform() !== "web") {
                const TTS = await getTextToSpeech()
                if (TTS) {
                    await TTS.stop()
                }
            } else if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel()
            }
        } catch (err) {
            console.warn("Error stopping TTS:", err)
        } finally {
            isPlaying.value = false
            audioManager.restoreBg()
        }
    }

    // Toggle TTS for a page index
    const toggleAudio = async (pageIndex) => {
        if (!rawPages[pageIndex]) return

        if (isPlaying.value) {
            await stopSpeaking()
            return
        }

        isPlaying.value = true
        textToRead.value = getTextForSpeech(pageIndex)

        if (!textToRead.value) {
            isPlaying.value = false
            return
        }

        audioManager.duckBg()
        await speakText(textToRead.value)
    }

    return { isPlaying, textToRead, speakText, stopSpeaking, toggleAudio, getTextForSpeech }
}