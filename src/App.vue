<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Loading, QSpinnerHourglass } from 'quasar'
import { audioManager } from 'src/utils/audioManager'
import { App } from '@capacitor/app'

const router = useRouter()

onMounted(() => {

  // Loading spinner logic
  Loading.show({
    spinner: QSpinnerHourglass,
    message: 'Loading...',
    spinnerColor: 'primary',
    backgroundColor: 'white',
  })

  if (document.readyState === 'complete') {
    setTimeout(() => Loading.hide(), 400)
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => Loading.hide(), 400)
    })
  }

  // Initialize global background music
  audioManager.init()

  // Global click sound
  document.body.addEventListener('click', (e) => {
    const target = e.target
    if (target.closest('button, .q-btn, .q-item, a, .click-sound')) {
      audioManager.playClick()
    }
  })

  // Restore background music when changing pages
  router.beforeEach((to, from, next) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    audioManager.restoreBg()
    next()
  })

  // Stop all sounds when app is backgrounded or exited
  App.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) {
      audioManager.stopAll?.() || audioManager.stopBg?.()
    }
  })

  App.addListener('pause', () => {
    audioManager.stopAll?.() || audioManager.stopBg?.()
  })
})

// Cleanup listeners
onBeforeUnmount(() => {
  App.removeAllListeners()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
  position: absolute;
  width: 100%;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>