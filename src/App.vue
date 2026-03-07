<script setup>
import { useRoute } from 'vue-router'
import AppMenu from './components/header/AppMenu.vue'
import { useusuarioStore } from './stores/usuario'
import { onMounted, watch } from 'vue'
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
      inicializarChat()
    }
    document.body.appendChild(script)
  }
})

const inicializarChat = () => {
  import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(({ createChat }) => {
    // Eliminar widget previo si existe para evitar duplicados al re-inicializar
    const existingWidget = document.querySelector('.n8n-chat-widget')
    if (existingWidget) existingWidget.remove()

    const userEmail = usuarioStore.datosUsuario?.email || ''
    
    createChat({
      webhookUrl: `${import.meta.env.VITE_N8N_URL}/webhook/${import.meta.env.VITE_N8N_CHAT_WEBHOOK_ID}`,
      metadata: {
        email: userEmail
      },
      mode: 'window',
      title: '¡Hola! 👋',
      subtitle: userEmail 
        ? `Asistente para ${usuarioStore.datosUsuario.Nombre}. Estamos aquí para ayudarte.`
        : 'Asistente de TaskLink. Inicia sesión para ver tus reservas.',
      placeholder: 'Escribe tu pregunta...',
      initialMessages: [
        userEmail 
          ? `¡Hola ${usuarioStore.datosUsuario.Nombre}! 👋 ¿En qué puedo ayudarte hoy?` 
          : '¡Hola! 👋 Soy el asistente de TaskLink. ¿Buscas algún servicio o quieres consultar el estado de una reserva?',
        !userEmail ? 'Recuerda que para ver tus reservas personales debes iniciar sesión.' : ''
      ].filter(m => m !== ''),
      i18n: {
        en: {
          title: '¡Hola! 👋',
          subtitle: userEmail 
            ? `Asistente para ${usuarioStore.datosUsuario.Nombre}.`
            : 'Asistente de TaskLink. Por favor, inicia sesión.',
          inputPlaceholder: 'Escribe tu pregunta...',
        }
      }
    })

    // Forzar colores vía CSS (funciona seguro)
    const styleId = 'n8n-custom-styles'
    let style = document.getElementById(styleId)
    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }
    style.innerHTML = `
      :root {
        --chat--color--primary: #007bff !important;
        --chat--header--background: #001a33 !important;
      }
      /* Reglas para ocultar el chatbot de n8n */
      body.hide-chatbot .n8n-chat-widget,
      body.hide-chatbot #n8n-chat-widget,
      body.hide-chatbot div[class*="n8n-chat"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `
  })
}

// Re-inicializar el chat cuando el usuario cambia (login/logout)
watch(() => usuarioStore.datosUsuario, () => {
  if (document.getElementById('n8n-chat-script')) {
    inicializarChat()
  }
})

// Control de visibilidad del chatbot basado en la ruta
watch(() => route.path, (newPath) => {
  // Verificación más flexible (incluyendo posibles barras al final o parámetros)
  const pathsToHide = ['/login', '/registro', '/restablecer-contraseña', '/auth/google/callback']
  const shouldHide = pathsToHide.some(p => newPath.startsWith(p))
  
  if (shouldHide) {
    document.body.classList.add('hide-chatbot')
  } else {
    document.body.classList.remove('hide-chatbot')
  }
}, { immediate: true })
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
body {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
</style>
