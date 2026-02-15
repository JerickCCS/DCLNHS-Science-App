<template>
  <q-layout view="lHh Lpr lFf" class="q-safe-area">
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in" @before-enter="onBeforeEnter" @after-leave="onAfterLeave">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const transitionName = ref('fade-slide')

// Track previous route depth for smart transitions
let previousDepth = 0

// Determine transition direction based on route hierarchy
watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (!from || !to) {
      transitionName.value = 'fade-slide'
      return
    }

    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length

    // Forward navigation (going deeper)
    if (toDepth > fromDepth || toDepth > previousDepth) {
      transitionName.value = 'slide-left'
    }
    // Backward navigation (going back)
    else if (toDepth < fromDepth || toDepth < previousDepth) {
      transitionName.value = 'slide-right'
    }
    // Same level navigation
    else {
      transitionName.value = 'fade-slide'
    }

    previousDepth = toDepth
  }
)

const onBeforeEnter = () => {
  // Optional: Add any pre-transition logic
}

const onAfterLeave = () => {
  // Optional: Cleanup after transition
  window.scrollTo(0, 0)
}
</script>

<style scoped>
/* Fade + Slide (default) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Slide Left (forward navigation) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}

/* Slide Right (backward navigation) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30%);
}

/* Ensure smooth positioning */
.q-page-container {
  overflow-x: hidden;
}
</style>