// src/composables/katexTTS.js
import { ref } from "vue"
import { Capacitor } from "@capacitor/core"
import { TextToSpeech } from "@capacitor-community/text-to-speech"
import { audioManager } from "src/utils/audioManager"

/**
 * Custom TTS composable for lesson pages with KaTeX and HTML content
 * @param {Array<string>} rawPages - Array of lesson HTML page strings
 */
export function useTTSLesson(rawPages) {
    const isPlaying = ref(false)
    const textToRead = ref("")

    // Extract and clean text from raw HTML + KaTeX for a given page index
    const getTextForSpeech = (pageIndex) => {
        if (!rawPages[pageIndex]) return ""

        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = rawPages[pageIndex]
        let text = tempDiv.innerText?.trim() || ""

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

    const speakText = async (text) => {
        if (!text) return

        try {
            if (Capacitor.getPlatform() !== "web") {
                console.log("Calling TTS.speak...")
                await TextToSpeech.speak({
                    text,
                    lang: "en-US",
                    rate: 1.0,
                    pitch: 1.0,
                })
                console.log("TTS.speak completed")
                isPlaying.value = false
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
            console.error("Error during TTS:", err)
            isPlaying.value = false
            audioManager.restoreBg()
        }
    }

    const stopSpeaking = async () => {
        try {
            if (Capacitor.getPlatform() !== "web") {
                await TextToSpeech.stop()
            } else if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel()
            }
        } catch (err) {
            console.error("Error stopping TTS:", err)
        } finally {
            isPlaying.value = false
            audioManager.restoreBg()
        }
    }

    // Toggle TTS for a given page index
    const toggleAudio = async (pageIndex) => {
        if (!rawPages[pageIndex]) return

        if (isPlaying.value) {
            await stopSpeaking()
            return
        }

        const text = getTextForSpeech(pageIndex)
        if (!text) return

        textToRead.value = text
        isPlaying.value = true
        audioManager.duckBg()
        await speakText(text)
    }

    return { isPlaying, textToRead, speakText, stopSpeaking, toggleAudio, getTextForSpeech }
}