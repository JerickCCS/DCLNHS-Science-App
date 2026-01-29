import { Loading, QSpinnerHourglass } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
    // Show loader before route navigation
    router.beforeEach((to, from, next) => {
        Loading.show({
            spinner: QSpinnerHourglass,
            message: 'Loading...',
            spinnerColor: 'primary',
            backgroundColor: 'white',
        })
        next()
    })

    // Hide loader after route is ready
    router.afterEach(() => {
        setTimeout(() => {
            Loading.hide()
        }, 400) // short delay to prevent flicker
    })
})
