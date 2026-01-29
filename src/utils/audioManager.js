import { LocalStorage } from 'quasar'

const bgAudio = new Audio('/assets/audio/app-music.mp3')
bgAudio.loop = true
bgAudio.volume = 0.5

const clickAudio = new Audio('/assets/sfx/click.mp3')
clickAudio.volume = 0.7

const NORMAL_BGM_VOLUME = 0.5
const DIMMED_BGM_VOLUME = 0

function getSettings() {
    return {
        bgMusicEnabled: LocalStorage.getItem('bgMusicEnabled') ?? true,
        sfxEnabled: LocalStorage.getItem('sfxEnabled') ?? true,
        bgMusicTime: LocalStorage.getItem('bgMusicTime') ?? 0
    }
}

function saveSettings(settings) {
    LocalStorage.set('bgMusicEnabled', settings.bgMusicEnabled)
    LocalStorage.set('sfxEnabled', settings.sfxEnabled)
    LocalStorage.set('bgMusicTime', settings.bgMusicTime ?? 0)
}

function fadeTo(targetVol, step = 0.05, interval = 80) {
    clearInterval(fadeTo._timer)
    fadeTo._timer = setInterval(() => {
        if (Math.abs(bgAudio.volume - targetVol) < step) {
            bgAudio.volume = targetVol
            clearInterval(fadeTo._timer)
        } else if (bgAudio.volume < targetVol) {
            bgAudio.volume = Math.min(bgAudio.volume + step, targetVol)
        } else {
            bgAudio.volume = Math.max(bgAudio.volume - step, targetVol)
        }
    }, interval)
}

/* ✅ VIDEO DUCKING (same behavior as TTS) */
function bindVideoDucking() {
    document.addEventListener(
        'play',
        (e) => {
            if (e.target.tagName === 'VIDEO') {
                audioManager.duckBg()
            }
        },
        true
    )

    document.addEventListener(
        'pause',
        (e) => {
            if (e.target.tagName === 'VIDEO') {
                audioManager.restoreBg()
            }
        },
        true
    )

    document.addEventListener(
        'ended',
        (e) => {
            if (e.target.tagName === 'VIDEO') {
                audioManager.restoreBg()
            }
        },
        true
    )
}

export const audioManager = {
    playBg() {
        const { bgMusicEnabled } = getSettings()
        if (bgMusicEnabled) bgAudio.play().catch(() => { })
    },

    stopBg() {
        bgAudio.pause()
        const settings = getSettings()
        settings.bgMusicTime = bgAudio.currentTime
        saveSettings(settings)
    },

    toggleBg(enabled) {
        const settings = getSettings()
        settings.bgMusicEnabled = enabled
        saveSettings(settings)

        if (enabled) {
            bgAudio.play().catch(() => {
                document.addEventListener(
                    'click',
                    () => {
                        if (bgAudio.paused) bgAudio.play()
                    },
                    { once: true }
                )
            })
        } else {
            bgAudio.pause()
            settings.bgMusicTime = bgAudio.currentTime
            saveSettings(settings)
        }
    },

    playClick() {
        const { sfxEnabled } = getSettings()
        if (sfxEnabled) {
            clickAudio.currentTime = 0
            clickAudio.play()
        }
    },

    toggleSfx(enabled) {
        const settings = getSettings()
        settings.sfxEnabled = enabled
        saveSettings(settings)
    },

    /* ✅ Used by BOTH TTS and VIDEO */
    duckBg() {
        if (!bgAudio.paused) fadeTo(DIMMED_BGM_VOLUME)
    },

    restoreBg() {
        if (!bgAudio.paused) fadeTo(NORMAL_BGM_VOLUME)
    },

    init() {
        const settings = getSettings()
        bgAudio.currentTime = settings.bgMusicTime || 0

        if (settings.bgMusicEnabled) {
            bgAudio.play().catch(() => {
                document.addEventListener(
                    'click',
                    () => {
                        if (bgAudio.paused) bgAudio.play()
                    },
                    { once: true }
                )
            })
        }

        bgAudio.addEventListener('timeupdate', () => {
            const s = getSettings()
            s.bgMusicTime = bgAudio.currentTime
            saveSettings(s)
        })

        /* ✅ ENABLE VIDEO AUDIO CONTROL */
        bindVideoDucking()
    },

    getSettings
}

/* import { LocalStorage } from 'quasar'

const bgAudio = new Audio('/assets/audio/app-music.mp3')
bgAudio.loop = true
bgAudio.volume = 0.5        // CHANGED: force silent BGM

const clickAudio = new Audio('/assets/sfx/click.mp3')
clickAudio.volume = 0.7

const NORMAL_BGM_VOLUME = 0.5    // CHANGED
const DIMMED_BGM_VOLUME = 0    // CHANGED

function getSettings() {
    return {
        bgMusicEnabled: LocalStorage.getItem('bgMusicEnabled') ?? true,
        sfxEnabled: LocalStorage.getItem('sfxEnabled') ?? true,
        bgMusicTime: LocalStorage.getItem('bgMusicTime') ?? 0
    }
}

function saveSettings(settings) {
    LocalStorage.set('bgMusicEnabled', settings.bgMusicEnabled)
    LocalStorage.set('sfxEnabled', settings.sfxEnabled)
    LocalStorage.set('bgMusicTime', settings.bgMusicTime ?? 0)
}

function fadeTo(targetVol, step = 0.05, interval = 80) {
    clearInterval(fadeTo._timer)
    fadeTo._timer = setInterval(() => {
        if (Math.abs(bgAudio.volume - targetVol) < step) {
            bgAudio.volume = targetVol
            clearInterval(fadeTo._timer)
        } else if (bgAudio.volume < targetVol) {
            bgAudio.volume = Math.min(bgAudio.volume + step, targetVol)
        } else {
            bgAudio.volume = Math.max(bgAudio.volume - step, targetVol)
        }
    }, interval)
}

export const audioManager = {
    playBg() {
        const { bgMusicEnabled } = getSettings()
        if (bgMusicEnabled) bgAudio.play().catch(() => { })
    },

    stopBg() {
        bgAudio.pause()
        const settings = getSettings()
        settings.bgMusicTime = bgAudio.currentTime
        saveSettings(settings)
    },

    toggleBg(enabled) {
        const settings = getSettings()
        settings.bgMusicEnabled = enabled
        saveSettings(settings)

        if (enabled) {
            bgAudio.play().catch(() => {
                document.addEventListener(
                    'click',
                    () => {
                        if (bgAudio.paused) bgAudio.play()
                    },
                    { once: true }
                )
            })
        } else {
            // stop music safely
            bgAudio.pause()
            settings.bgMusicTime = bgAudio.currentTime
            saveSettings(settings)
        }
    },


    playClick() {
        const { sfxEnabled } = getSettings()
        if (sfxEnabled) {
            clickAudio.currentTime = 0
            clickAudio.play()
        }
    },

    toggleSfx(enabled) {
        const settings = getSettings()
        settings.sfxEnabled = enabled
        saveSettings(settings)
    },

    duckBg() {
        if (!bgAudio.paused) fadeTo(DIMMED_BGM_VOLUME)
    },

    restoreBg() {
        if (!bgAudio.paused) fadeTo(NORMAL_BGM_VOLUME)
    },

    init() {
        const settings = getSettings()
        bgAudio.currentTime = settings.bgMusicTime || 0

        if (settings.bgMusicEnabled) {
            bgAudio.play().catch(() => {
                document.addEventListener(
                    'click',
                    () => {
                        if (bgAudio.paused) bgAudio.play()
                    },
                    { once: true }
                )
            })
        }

        bgAudio.addEventListener('timeupdate', () => {
            const s = getSettings()
            s.bgMusicTime = bgAudio.currentTime
            saveSettings(s)
        })
    },

    getSettings
}
 */