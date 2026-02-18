<script setup>
import { useusuarioStore } from '@/stores/usuario'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

import { ref } from 'vue'

const usuarioStore = useusuarioStore()
const router = useRouter()
const errorLogin = ref('')

const loguearse = async (values) => {
  errorLogin.value = ''
  console.log('Formulario enviado con:', values)
  const resultado = await usuarioStore.iniciarSesion(values)
  if (resultado.success) {
    router.push('/')
  } else {
    console.error('Error de login:', resultado.message)
    errorLogin.value = resultado.message
  }
}
const schema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Introduce un correo electrónico válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña debe tener máximo 50 caracteres'),
})
</script>
<template>
  <div class="login-container">
    <div class="image-container">
      <div>
        <img
          :src="'/src/assets/img/InicioSesion.png'"
          alt="Imagen de inicio de sesión"
          class="login-image"
        />
      </div>
    </div>
    <div class="formulario-container">
      <div>
        <h1>Bienvenido a TASKLINK</h1>
        <p>Inicia sesión para acceder a tu cuenta, descubrir nuevas oportunidades laborales.</p>
        <div class="informaciónFormulario">
          <Form @submit="loguearse" class="formulario" :validation-schema="schema">
            <div>
              <div>
                <p>Correo Electronico</p>
                <Field name="email" type="email" placeholder="Ingresa tu correo electrónico" />
              </div>
              <ErrorMessage name="email" class="error-message" />
            </div>

            <div>
              <div>
                <p>Contraseña</p>
                <Field name="password" type="password" placeholder="Ingresa tu contraseña" />
              </div>
              <ErrorMessage name="password" class="error-message" />
            </div>

            <div v-if="errorLogin" class="general-error">
              {{ errorLogin }}
            </div>

            <button type="submit">Iniciar Sesión</button>
            <div class="login-footer-links">
              <a class="contraOlvidada" @click="router.push('/restablecer-contraseña')"
                >¿Olvidaste tu contraseña?</a
              >
              <div class="divider-small"></div>
              <p class="registro-prompt">
                ¿No tienes cuenta?
                <a class="noTienesCuenta" @click="router.push('/registro')">Regístrate ahora</a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Contenedor de la página */
.login-container {
  display: grid;
  grid-template-columns: 40% 60%;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}

/* Contenedor izquierdo - imagen */
.image-container {
  position: relative;
  overflow: hidden;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset -5px 0 20px rgba(0, 0, 0, 0.1);
}

/* Imagen con animación y efecto hover */
.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  /* ya tiene el contenedor redondeado */
  transition:
    transform 0.6s ease,
    filter 0.6s ease;
  animation: float 15s ease-in-out infinite alternate;
}

/* Animación flotante sutil */
@keyframes float {
  0% {
    transform: scale(1) translateY(0);
  }

  100% {
    transform: scale(1.03) translateY(-10px);
  }
}

/* Zoom sutil al pasar el mouse */
.image-container:hover .login-image {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, rgba(43, 78, 162, 0.2), rgba(79, 124, 255, 0.2));
  z-index: 1;
}

/* Si quieres agregar texto encima de la imagen */
.image-container div {
  position: relative;
  z-index: 2;
}

.logo-text h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.logo-text p {
  font-size: 1.2rem;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

.formulario-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fbff;
  padding: 2.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.formulario-container > div {
  width: 100%;
  max-width: 500px; /* Aumentado de 420px */
  text-align: center;
}

.formulario-container h1 {
  font-size: 2.5rem; /* Aumentado ligeramente */
  font-weight: 700;
  color: #2b4ea2;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.formulario-container p {
  font-size: 1.05rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Contenedor del formulario */
.informaciónFormulario {
  width: 100%;
}

/* Estilo de los campos dentro del formulario */
.formulario > div {
  margin-bottom: 1.5rem;
  text-align: left;
}

.formulario > div > div {
  margin-bottom: 0.5rem;
}

.formulario p {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

/* Campos de entrada */
.formulario input[type='email'],
/* Campos de entrada más grandes */
.formulario input[type="email"],
.formulario input[type="password"] {
  width: 100%;
  padding: 1rem 1.2rem; /* Aumentado */
  border: 1px solid #d1d5db;
  border-radius: 12px; /* Más redondeado */
  font-size: 1.1rem; /* Más grande */
  background-color: #fff;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  outline: none;
  box-sizing: border-box;
}

.formulario input[type='email']:focus,
.formulario input[type='password']:focus {
  border-color: #4f7cff;
  box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.2);
}

/* Mensajes de error */
.error-message {
  display: block;
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.375rem;
  font-weight: 500;
  text-align: left;
}

/* Botón más grande */
.formulario button[type='submit'] {
  width: 100%;
  padding: 1.1rem; /* Aumentado */
  background: linear-gradient(135deg, #2b4ea2, #4f7cff);
  color: white;
  font-size: 1.2rem; /* Más grande */
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s,
    box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(43, 78, 162, 0.3);
  margin-top: 1rem;
}

.general-error {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #e53e3e;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
}

.formulario button[type='submit']:hover {
  transform: translateY(-2px);
  opacity: 0.95;
  box-shadow: 0 6px 16px rgba(43, 78, 162, 0.4);
}

.formulario button[type='submit']:active {
  transform: translateY(0);
}

/* Tablet y dispositivos medianos */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 45% 55%;
  }

  .formulario-container h1 {
    font-size: 2.2rem;
  }

  .formulario-container p {
    font-size: 1rem;
  }
}

/* Tablet pequeña y móviles grandes */
@media (max-width: 900px) {
  .login-container {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
  }

  .image-container {
    height: 280px;
    border-radius: 0 0 30px 30px;
    border-top-right-radius: 0;
  }

  .formulario-container {
    padding: 2.5rem 2rem;
    min-height: calc(100vh - 280px);
  }

  .formulario-container h1 {
    font-size: 2rem;
  }

  .formulario-container p {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .formulario-container > div {
    max-width: 450px;
  }
}

/* Móviles */
@media (max-width: 767px) {
  .image-container {
    height: 220px;
    border-radius: 0 0 20px 20px;
  }

  .formulario-container {
    padding: 2rem 1.5rem;
  }

  .formulario-container h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .formulario-container p {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  .formulario input[type='email'],
  .formulario input[type='password'] {
    padding: 0.9rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
  }

  .formulario button[type='submit'] {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 10px;
  }

  .formulario > div {
    margin-bottom: 1.25rem;
  }

  .login-footer-links {
    margin-top: 1.25rem;
    gap: 10px;
  }

  .contraOlvidada {
    font-size: 0.85rem;
  }

  .registro-prompt {
    font-size: 0.9rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .image-container {
    height: 180px;
    border-radius: 0 0 15px 15px;
  }

  .formulario-container {
    padding: 1.5rem 1rem;
  }

  .formulario-container h1 {
    font-size: 1.5rem;
  }

  .formulario-container p {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .formulario-container > div {
    max-width: 100%;
  }

  .formulario p {
    font-size: 0.9rem;
  }

  .formulario input[type='email'],
  .formulario input[type='password'] {
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
  }

  .formulario button[type='submit'] {
    padding: 0.95rem;
    font-size: 1rem;
  }

  .login-footer-links {
    margin-top: 1rem;
  }
}

/* Móviles muy pequeños */
@media (max-width: 360px) {
  .formulario-container {
    padding: 1.25rem 0.75rem;
  }

  .formulario-container h1 {
    font-size: 1.35rem;
  }

  .formulario-container p {
    font-size: 0.8rem;
  }

  .formulario input[type='email'],
  .formulario input[type='password'] {
    padding: 0.8rem 0.9rem;
    font-size: 0.9rem;
  }

  .formulario button[type='submit'] {
    padding: 0.9rem;
    font-size: 0.95rem;
  }
}

/* Enlaces de pie de página del login */
.login-footer-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.contraOlvidada {
  font-size: 0.9rem;
  color: #4f7cff;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
}

.contraOlvidada:hover {
  color: #2b4ea2;
  text-decoration: underline;
}

.divider-small {
  width: 40px;
  height: 1px;
  background-color: #e2e8f0;
}

.registro-prompt {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0 !important;
}

.noTienesCuenta {
  color: #2b4ea2;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-left: 4px;
}

.noTienesCuenta:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>
