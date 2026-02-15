import { ref } from "vue"
import { Capacitor } from "@capacitor/core"
import { TextToSpeech } from "@capacitor-community/text-to-speech"
import { audioManager } from "src/utils/audioManager"

export function useTTS() {
    const isPlaying = ref(false)
    const textToRead = ref("")

    const speakText = async (text) => {
        if (!text) return

        try {
            if (Capacitor.getPlatform() !== "web") {
                // Use Capacitor TTS plugin on mobile
                console.log("Calling TTS.speak...")
                await TextToSpeech.speak({
                    text,
                    lang: "en-US",
                    rate: 1.0,
                    pitch: 1.0
                })
                console.log("TTS.speak completed")
            } else if ("speechSynthesis" in window) {
                // Use Web Speech API on web
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

    const toggleAudio = async (pageContent) => {
        if (!pageContent) return

        if (isPlaying.value) {
            await stopSpeaking()
            return
        }

        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = pageContent
        const text = tempDiv.innerText?.trim()
        if (!text) return

        textToRead.value = text
        isPlaying.value = true
        audioManager.duckBg()
        await speakText(text)
    }

    return { isPlaying, textToRead, speakText, stopSpeaking, toggleAudio }
}
