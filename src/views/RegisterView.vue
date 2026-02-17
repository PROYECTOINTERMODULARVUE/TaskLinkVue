<script setup>
import { useusuarioStore } from '@/stores/usuario'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

const usuarioStore = useusuarioStore()
const router = useRouter()

const registrarUsuario = async (values) => {
  console.log('Registrando usuario:', values)
  // Mapeamos los campos al formato que espera el backend si es necesario
  const userData = {
    name: values.name,
    email: values.email,
    password: values.password,
    password_confirmation: values.confirmPassword,
  }

  const resultado = await usuarioStore.registrar(userData)
  if (resultado.success) {
    router.push('/')
  } else {
    // Aquí se podría mostrar un mensaje de error global
    alert(resultado.message || 'Error al registrar el usuario')
  }
}

const schema = yup.object({
  name: yup
    .string()
    .required('El nombre completo es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Introduce un correo electrónico válido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Debes confirmar tu contraseña'),
})
</script>

<template>
  <div class="login-container">
    <div class="image-container">
      <div>
        <img
          :src="'/src/assets/img/InicioSesion.png'"
          alt="Registro TaskLink"
          class="login-image"
        />
      </div>
    </div>
    <div class="formulario-container">
      <div>
        <h1>Únete a TASKLINK</h1>
        <p>
          Crea tu cuenta hoy mismo y empieza a conectar con los mejores servicios o a ofrecer los
          tuyos.
        </p>

        <div class="informaciónFormulario">
          <Form @submit="registrarUsuario" class="formulario" :validation-schema="schema">
            <div class="form-group">
              <p>Nombre Completo</p>
              <Field name="name" type="text" placeholder="Escribe tu nombre y apellidos" />
              <ErrorMessage name="name" class="error-message" />
            </div>

            <div class="form-group">
              <p>Correo Electrónico</p>
              <Field name="email" type="email" placeholder="ejemplo@correo.com" />
              <ErrorMessage name="email" class="error-message" />
            </div>

            <div class="form-group">
              <p>Contraseña</p>
              <Field name="password" type="password" placeholder="Mínimo 8 caracteres" />
              <ErrorMessage name="password" class="error-message" />
            </div>

            <div class="form-group">
              <p>Confirmar Contraseña</p>
              <Field name="confirmPassword" type="password" placeholder="Repite tu contraseña" />
              <ErrorMessage name="confirmPassword" class="error-message" />
            </div>

            <button type="submit" :disabled="usuarioStore.cargando">
              {{ usuarioStore.cargando ? 'Registrando...' : 'Crear Cuenta' }}
            </button>

            <div class="login-footer-links">
              <p class="registro-prompt">
                ¿Ya tienes una cuenta?
                <a class="noTienesCuenta" @click="router.push('/login')">Inicia sesión</a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Copiamos y adaptamos los estilos de LoginView para mantener la consistencia */
.login-container {
  display: grid;
  grid-template-columns: 40% 60%;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
}

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

.login-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.6s ease,
    filter 0.6s ease;
  animation: float 15s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: scale(1) translateY(0);
  }
  100% {
    transform: scale(1.03) translateY(-10px);
  }
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

.formulario-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fbff;
  padding: 2.5rem;
  overflow-y: auto; /* Permitir scroll si el contenido es muy alto */
}

.formulario-container > div {
  width: 100%;
  max-width: 500px;
  text-align: center;
  padding: 20px 0;
}

.formulario-container h1 {
  font-size: 2.5rem;
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

.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

.form-group p {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.formulario input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: #fff;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  outline: none;
  box-sizing: border-box;
}

.formulario input:focus {
  border-color: #4f7cff;
  box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.2);
}

.error-message {
  display: block;
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.375rem;
  font-weight: 500;
}

button[type='submit'] {
  width: 100%;
  padding: 1.1rem;
  background: linear-gradient(135deg, #2b4ea2, #4f7cff);
  color: white;
  font-size: 1.2rem;
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

button[type='submit']:hover:not(:disabled) {
  transform: translateY(-2px);
  opacity: 0.95;
  box-shadow: 0 6px 16px rgba(43, 78, 162, 0.4);
}

button[type='submit']:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.registro-prompt {
  font-size: 0.95rem;
  color: #666;
}

.noTienesCuenta {
  color: #2b4ea2;
  font-weight: 700;
  cursor: pointer;
  margin-left: 4px;
}

.noTienesCuenta:hover {
  text-decoration: underline;
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
    height: 250px;
    border-radius: 0 0 30px 30px;
    border-top-right-radius: 0;
  }

  .formulario-container {
    padding: 2.5rem 2rem;
    min-height: calc(100vh - 250px);
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
    padding: 15px 0;
  }
}

/* Móviles */
@media (max-width: 767px) {
  .image-container {
    height: 200px;
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

  .formulario-container > div {
    padding: 10px 0;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group p {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .formulario input {
    padding: 0.9rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
  }

  button[type='submit'] {
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 10px;
  }

  .login-footer-links {
    margin-top: 1.25rem;
  }

  .registro-prompt {
    font-size: 0.9rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .image-container {
    height: 160px;
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
    padding: 5px 0;
  }

  .form-group {
    margin-bottom: 0.9rem;
  }

  .form-group p {
    font-size: 0.85rem;
  }

  .formulario input {
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
  }

  button[type='submit'] {
    padding: 0.95rem;
    font-size: 1rem;
  }

  .login-footer-links {
    margin-top: 1rem;
  }
}

/* Móviles muy pequeños */
@media (max-width: 360px) {
  .image-container {
    height: 140px;
  }

  .formulario-container {
    padding: 1.25rem 0.75rem;
  }

  .formulario-container h1 {
    font-size: 1.35rem;
  }

  .formulario-container p {
    font-size: 0.8rem;
  }

  .form-group {
    margin-bottom: 0.8rem;
  }

  .form-group p {
    font-size: 0.8rem;
  }

  .formulario input {
    padding: 0.8rem 0.9rem;
    font-size: 0.9rem;
  }

  button[type='submit'] {
    padding: 0.9rem;
    font-size: 0.95rem;
  }
}
</style>
