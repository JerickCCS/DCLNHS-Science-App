<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">LocalStorage Monitor</div>
        <div>Current Storage: <strong>{{ storageSize }}</strong></div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list bordered padding>
          <q-item-label header>Keys & Sizes</q-item-label>
          <q-item v-for="(item, index) in storageItems" :key="index">
            <q-item-section>
              <div><strong>{{ item.key }}</strong></div>
              <div>{{ item.size }} bytes</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Refresh" @click="updateStorage" />
        <q-btn color="negative" label="Clear Storage" @click="clearStorage" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const storageSize = ref('0 KB')
const storageItems = ref([])

function calculateStorage() {
  let total = 0
  const items = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    const size = (key.length + value.length)
    total += size
    items.push({ key, size })
  }

  storageSize.value = (total / 1024).toFixed(2) + ' KB'
  storageItems.value = items
}

function updateStorage() {
  calculateStorage()
  $q.notify({
    message: 'LocalStorage updated!',
    color: 'green',
    position: 'top'
  })
}

function clearStorage() {
  localStorage.clear()
  updateStorage()
  $q.notify({
    message: 'LocalStorage cleared!',
    color: 'red',
    position: 'top'
  })
}

onMounted(() => {
  calculateStorage()
})
</script>

<style scoped>
q-card {
  max-width: 600px;
  margin: auto;
}
</style>
