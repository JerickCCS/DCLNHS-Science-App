<template>
    <q-page padding class="bg-grey-1">
        <q-card flat bordered>
            <q-card-section class="row items-center">
                <div class="text-h6">LocalStorage Manager</div>
                <q-space />
                <q-btn color="primary" icon="refresh" label="Reload" @click="loadStorage" />
                <q-btn color="negative" icon="delete_forever" label="Clear All" class="q-ml-sm" @click="clearAll" />
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-tree :nodes="treeData" node-key="id" default-expand-all dense>
                    <template #default-header="prop">
                        <div class="row items-center full-width">
                            <q-icon :name="prop.node.icon" size="16px" class="q-mr-sm" />
                            <div class="text-weight-medium">{{ prop.node.label }}</div>

                            <q-space />

                            <q-btn v-if="prop.node.canAdd" flat dense size="sm" icon="add"
                                @click.stop="openAddDialog(prop.node)" />
                            <q-btn v-if="prop.node.canEdit" flat dense size="sm" icon="edit"
                                @click.stop="openEditDialog(prop.node)" />
                            <q-btn v-if="prop.node.canDelete" flat dense size="sm" icon="delete" color="negative"
                                @click.stop="deleteNode(prop.node)" />
                        </div>
                    </template>
                </q-tree>
            </q-card-section>
        </q-card>

        <!-- Add / Edit Dialog -->
        <q-dialog v-model="dialog.open">
            <q-card style="min-width: 400px">
                <q-card-section class="text-h6">
                    {{ dialog.mode === 'add' ? 'Add Value' : 'Edit Value' }}
                </q-card-section>

                <q-card-section>
                    <q-input v-if="dialog.showKey" v-model="dialog.key" label="Key" dense autofocus />
                    <q-select v-model="dialog.type" :options="typeOptions" label="Type" dense />
                    <q-input v-model="dialog.value" label="Value" dense autogrow :hint="valueHint" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn color="primary" label="Save" @click="saveDialog" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LocalStorage, Dialog } from 'quasar'

const treeData = ref([])

const dialog = ref({
    open: false,
    mode: 'add',
    target: null,
    key: '',
    value: '',
    type: 'string',
    showKey: true
})

const typeOptions = ['string', 'number', 'boolean', 'object', 'array']

const valueHint = computed(() => {
    if (dialog.value.type === 'object') return 'JSON object (e.g. {"a":1})'
    if (dialog.value.type === 'array') return 'JSON array (e.g. [1,2,3])'
    return ''
})

function loadStorage() {
    const nodes = []
    LocalStorage.getAllKeys().forEach(key => {
        const value = LocalStorage.getItem(key)
        nodes.push(buildNode(key, value, null))
    })
    treeData.value = nodes
}

function clearAll() {
    Dialog.create({
        title: 'Confirm',
        message: 'Clear all localStorage data?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        LocalStorage.clear()
        loadStorage()
    })
}

function buildNode(key, value, parent) {
    const isObject = value !== null && typeof value === 'object'
    const isArray = Array.isArray(value)

    const node = {
        id: Math.random().toString(36).substr(2, 9),
        label: `${key}`,
        key,
        value,
        parent,
        icon: isArray ? 'list' : isObject ? 'folder' : 'description',
        canAdd: isObject || isArray,
        canEdit: true,
        canDelete: true,
        children: []
    }

    if (isObject) {
        Object.keys(value).forEach(childKey => {
            node.children.push(buildNode(childKey, value[childKey], node))
        })
    }

    if (isArray) {
        value.forEach((item, index) => {
            node.children.push(buildNode(index, item, node))
        })
    }

    return node
}

function openAddDialog(node) {
    dialog.value = {
        open: true,
        mode: 'add',
        target: node,
        key: '',
        value: '',
        type: 'string',
        showKey: !Array.isArray(node.value)
    }
}

function openEditDialog(node) {
    dialog.value = {
        open: true,
        mode: 'edit',
        target: node,
        key: node.key,
        value: stringifyValue(node.value),
        type: detectType(node.value),
        showKey: node.parent !== null && !Array.isArray(node.parent.value)
    }
}

function saveDialog() {
    const { mode, target, key, value, type } = dialog.value
    const parsedValue = parseValue(value, type)

    if (mode === 'add') {
        if (Array.isArray(target.value)) {
            target.value.push(parsedValue)
        } else {
            target.value[key] = parsedValue
        }
    } else {
        if (target.parent === null) {
            LocalStorage.set(target.key, parsedValue)
            loadStorage()
            dialog.value.open = false
            return
        }

        if (Array.isArray(target.parent.value)) {
            target.parent.value[target.key] = parsedValue
        } else {
            if (key !== target.key) delete target.parent.value[target.key]
            target.parent.value[key] = parsedValue
        }
    }

    persistRoot(target)
    loadStorage()
    dialog.value.open = false
}

function deleteNode(node) {
    Dialog.create({
        title: 'Confirm',
        message: `Delete "${node.label}"?`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        if (node.parent === null) {
            LocalStorage.remove(node.key)
        } else if (Array.isArray(node.parent.value)) {
            node.parent.value.splice(node.key, 1)
            persistRoot(node)
        } else {
            delete node.parent.value[node.key]
            persistRoot(node)
        }
        loadStorage()
    })
}

function persistRoot(node) {
    let root = node
    while (root.parent !== null) root = root.parent
    LocalStorage.set(root.key, root.value)
}

function parseValue(value, type) {
    if (type === 'number') return Number(value)
    if (type === 'boolean') return value === 'true'
    if (type === 'object' || type === 'array') {
        return JSON.parse(value || (type === 'array' ? '[]' : '{}'))
    }
    return value
}

function stringifyValue(value) {
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
}

function detectType(value) {
    if (Array.isArray(value)) return 'array'
    if (value !== null && typeof value === 'object') return 'object'
    return typeof value
}

loadStorage()
</script>
