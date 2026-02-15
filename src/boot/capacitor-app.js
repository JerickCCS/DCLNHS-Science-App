// src/boot/capacitor-app.js
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

export default async () => {
    // 🚫 Do nothing on web / browser
    if (!Capacitor.isNativePlatform()) return

    console.log('Capacitor boot: Starting...')

    // ✅ Android back button handling
    App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
            App.exitApp()
        }
    })

    console.log('Capacitor boot: Complete')
}