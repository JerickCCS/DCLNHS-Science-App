import { LocalStorage } from 'quasar'

// Save the current user (after login)
export function setCurrentUser(student) {
    LocalStorage.set('currentUser', student)
}

// Get the current user (any page can call this)
export function getCurrentUser() {
    return LocalStorage.getItem('currentUser') || null
}

// Remove current user (for logout)
export function clearCurrentUser() {
    LocalStorage.remove('currentUser')
}
