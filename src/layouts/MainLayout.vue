<template>
  <q-layout view="lHh Lpr lFf" class="q-safe-area">
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition name="crossfade" mode="out-in" @after-leave="onAfterLeave">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
const onAfterLeave = () => {
  window.scrollTo(0, 0)
}
</script>

<style scoped>
.crossfade-enter-active,
.crossfade-leave-active {
  transition: opacity 0.2s ease;
}

.crossfade-enter-from,
.crossfade-leave-to {
  opacity: 0;
}

.q-page-container {
  overflow-x: hidden;
}
</style>