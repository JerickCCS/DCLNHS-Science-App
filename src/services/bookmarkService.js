// src/services/bookmarkService.js
import { useRouter } from "vue-router"
import { getCurrentUser } from "src/utils/session"

export function useBookmarks() {
    const router = useRouter()

    const getKey = () => {
        const user = getCurrentUser()
        if (!user) return null
        return user.studentId ?? user.id ?? user.name
    }

    const getAll = () => {
        const key = getKey()
        if (!key) return {}
        const store = JSON.parse(localStorage.getItem("bookmarks") || "{}")
        return store[key] || {}
    }

    const saveAll = (data) => {
        const key = getKey()
        if (!key) return
        const store = JSON.parse(localStorage.getItem("bookmarks") || "{}")
        store[key] = data
        localStorage.setItem("bookmarks", JSON.stringify(store))
    }

    const add = (lessonId, page, routeName) => {
        const all = getAll()
        if (!all[lessonId]) all[lessonId] = { pages: [], routeName }
        if (!all[lessonId].pages.includes(page)) {
            all[lessonId].pages.push(page)
        }
        saveAll(all)
    }

    const remove = (lessonId, page) => {
        const all = getAll()
        if (!all[lessonId]) return
        all[lessonId].pages = all[lessonId].pages.filter(p => p !== page)
        saveAll(all)
    }

    const toggle = (lessonId, page, routeName) => {
        const all = getAll()
        if (all[lessonId]?.pages.includes(page)) {
            remove(lessonId, page)
        } else {
            add(lessonId, page, routeName)
        }
    }

    const goTo = (lessonId, page) => {
        const all = getAll()
        const entry = all[lessonId]
        if (!entry) return
        router.push({
            name: entry.routeName,
            params: { lessonId },
            query: { page }
        })
    }

    return { getAll, add, remove, toggle, goTo }
}
