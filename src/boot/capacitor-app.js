// src/boot/capacitor-app.js
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

export default () => {
    // 🚫 Do nothing on web / browser
    if (!Capacitor.isNativePlatform()) return

    // ✅ Android back button handling
    App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
            App.exitApp()
        }
    })
}
