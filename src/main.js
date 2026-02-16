import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'
import { useusuarioStore } from './stores/usuario'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const usuarioStore = useusuarioStore()
usuarioStore.cargarUsuario()

app.mount('#app')
