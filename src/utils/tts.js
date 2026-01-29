import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export async function speakText(text) {
    // If running on Android (native)
    if (Capacitor.getPlatform() !== 'web') {
        try {
            await TextToSpeech.speak({
                text,
                lang: 'en-US',
                rate: 1.0,
                pitch: 1.0,
            });
        } catch (err) {
            console.error('TTS error:', err);
        }
    } else {
        // Browser fallback
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 1.0;
        synth.speak(utter);
    }
}

export async function stopSpeaking() {
    if (Capacitor.getPlatform() !== 'web') {
        await TextToSpeech.stop();
    } else {
        window.speechSynthesis.cancel();
    }
}
