<script setup>
import { useRoute } from 'vue-router'
import AppMenu from './components/header/AppMenu.vue'
import { useusuarioStore } from './stores/usuario'
import { onMounted } from 'vue'
import FooterComponent from './components/FooterComponent.vue'
const route = useRoute()

const usuarioStore = useusuarioStore()

const rutasSinHeader = ['/login', '/registro', '/restablecer-contraseña']

onMounted(async () => {
  if (!usuarioStore.datosUsuario) {
    await usuarioStore.cargarUsuario()
  }

  // Cargar widget de n8n
  if (!document.getElementById('n8n-chat-script')) {
    const link = document.createElement('link')
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.id = 'n8n-chat-script'
    script.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js'
    script.type = 'module'
    script.onload = () => {
      import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(({ createChat }) => {
        createChat({
          webhookUrl: `${import.meta.env.VITE_N8N_URL}/webhook/${import.meta.env.VITE_N8N_CHAT_WEBHOOK_ID}`,
          mode: 'window',
           title: '¡Hola! 👋',
            subtitle: 'Asistente de TaskLink. Estamos aquí para ayudarte 24/7.',
            placeholder: 'Escribe tu pregunta...',
            initialMessages: [
                '¡Hola! 👋 Soy el asistente de TaskLink.',
                '¿Buscas algún servicio o quieres consultar el estado de una reserva?'
            ],
            i18n: {
                en: {
                    title: '¡Hola! 👋',
                    subtitle: 'Asistente de TaskLink. Estamos para ayudarte 24/7.',
                    inputPlaceholder: 'Escribe tu pregunta...',
            }
          }
        })

        // Forzar colores vía CSS (funciona seguro)
        const style = document.createElement('style')
        style.innerHTML = `
          :root {
            --chat--color--primary: #007bff !important;
            --chat--header--background: #001a33 !important;
          }
          .n8n-chat-widget {
            --chat--color--primary: #007bff !important;
          }
        `
        document.head.appendChild(style)
      })
    }
    document.body.appendChild(script)
  }
})
</script>

<template>
  <header v-if="!rutasSinHeader.includes(route.path)">
    <AppMenu />
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer v-if="!rutasSinHeader.includes(route.path)">
    <FooterComponent />
  </footer>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 100px;
  background-color: #cce6ff75;
  margin-bottom: 20px;
  gap: 10px;
  border: 1px solid lightgrey;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
