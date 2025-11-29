import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import App from './App.vue'
import router from './router'
import { wagmiAdapter } from './composables/useWallet'

const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
app.use(VueQueryPlugin, {})

app.mount('#app')
