<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/services/api';

const isOpen = ref(false);
const message = ref('');
const chatHistory = ref([
    { role: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
]);
const messagesContainer = ref(null);
const isLoading = ref(false);

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        scrollToBottom();
    }
};

const scrollToBottom = async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const sendMessage = async () => {
    if (!message.value.trim() || isLoading.value) return;

    const userMessage = message.value;
    chatHistory.value.push({ role: 'user', text: userMessage });
    message.value = '';
    isLoading.value = true;
    
    await scrollToBottom();

    try {
        // Asegurar que la ruta /api/chatbot/chat existe en Laravel.
        const response = await api.chatbot.chat(userMessage); 
        
        chatHistory.value.push({ 
            role: 'bot', 
            text: response.message || response.answer || 'He recibido tu mensaje. ¿Cómo puedo ayudarte más?' 
        });
    } catch (error) {
        console.error('Chat error:', error);
        
        let errorMsg = 'Lo siento, no he podido conectar con mi cerebro. ';
        if (error.response?.status === 404) {
            errorMsg += 'El servidor dice que no encuentra el camino (404). Asegúrate de que el webhook de n8n está configurado.';
        } else {
            errorMsg += 'Hubo un problema con la conexión.';
        }

        chatHistory.value.push({ 
            role: 'bot', 
            text: errorMsg 
        });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>

<template>
    <div class="chat-widget-container">
        <!-- Floating Button -->
        <button 
            @click="toggleChat" 
            class="btn btn-primary chat-toggle-btn shadow-lg rounded-circle"
            title="Abrir chat de ayuda"
        >
            <i v-if="!isOpen" class="bi bi-chat-dots-fill fs-4"></i>
            <i v-else class="bi bi-x-lg fs-4"></i>
        </button>

        <!-- Chat Window -->
        <div v-if="isOpen" class="chat-window shadow-lg border card">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                <h6 class="mb-0">Asistente TaskLink</h6>
                <button @click="toggleChat" class="btn btn-link text-white p-0">
                    <i class="bi bi-dash-lg"></i>
                </button>
            </div>
            
            <div class="card-body chat-messages p-3" ref="messagesContainer">
                <div 
                    v-for="(msg, index) in chatHistory" 
                    :key="index" 
                    :class="['message-bubble mb-2', msg.role === 'user' ? 'user-msg ms-auto' : 'bot-msg me-auto']"
                >
                    {{ msg.text }}
                </div>
                <div v-if="isLoading" class="message-bubble bot-msg me-auto loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>

            <div class="card-footer p-2 bg-light">
                <form @submit.prevent="sendMessage" class="input-group">
                    <input 
                        v-model="message" 
                        type="text" 
                        class="form-control form-control-sm" 
                        placeholder="Escribe tu mensaje..."
                        :disabled="isLoading"
                    />
                    <button 
                        class="btn btn-primary btn-sm" 
                        type="submit"
                        :disabled="!message.trim() || isLoading"
                    >
                        <i class="bi bi-send-fill"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-widget-container {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 1050;
}

.chat-toggle-btn {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.chat-toggle-btn:hover {
    transform: scale(1.1);
}

.chat-window {
    position: absolute;
    bottom: 75px;
    right: 0;
    width: 320px;
    max-height: 450px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.chat-messages {
    height: 300px;
    overflow-y: auto;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
}

.message-bubble {
    max-width: 85%;
    padding: 8px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
    line-height: 1.4;
    word-wrap: break-word;
}

.user-msg {
    background-color: #e3f2fd;
    color: #0d47a1;
    border-bottom-right-radius: 2px;
}

.bot-msg {
    background-color: #ffffff;
    color: #333;
    border: 1px solid #dee2e6;
    border-bottom-left-radius: 2px;
}

.loading-dots span {
    animation: blink 1.4s infinite both;
    font-weight: bold;
    font-size: 1.2rem;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}
</style>
