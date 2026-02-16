<script setup>
import { useusuarioStore } from '@/stores/usuario';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup'

const usuarioStore = useusuarioStore();
const router = useRouter();
const loguearse = async (values) => {
    console.log('Formulario enviado con:', values);
    const resultado = await usuarioStore.iniciarSesion(values);
    if (resultado.success) {
       router.push('/'); 
    } else {
        console.error('Error de login:', resultado.error);
    }
};
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
});
</script>
<template>
    <div class="login-container">
        <div class="image-container">
            <div>
                <img :src="'/src/assets/img/InicioSesion.png'" alt="Imagen de inicio de sesión" class="login-image">

            </div>

        </div>
        <div class="formulario-container">
            <div>
                <h1>Bienvenido a TASKLINK</h1>
                <p>Inicia sesión para acceder a tu cuenta,
                    descubrir nuevas oportunidades laborales.
                </p>
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


                        <button type="submit">Iniciar Sesión</button>
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
    grid-template-columns: 1fr 1fr;
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
    transition: transform 0.6s ease, filter 0.6s ease;
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

.formulario-container>div {
    width: 100%;
    max-width: 420px;
    text-align: center;
}

.formulario-container h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #2b4ea2;
    margin-bottom: 0.5rem;
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
.formulario>div {
    margin-bottom: 1.5rem;
    text-align: left;
}

.formulario>div>div {
    margin-bottom: 0.5rem;
}

.formulario p {
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem 0;
}

/* Campos de entrada */
.formulario input[type="email"],
.formulario input[type="password"] {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 1rem;
    background-color: #fff;
    transition: border-color 0.3s, box-shadow 0.3s;
    outline: none;
    box-sizing: border-box;
}

.formulario input[type="email"]:focus,
.formulario input[type="password"]:focus {
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

/* Botón de envío */
.formulario button[type="submit"] {
    width: 100%;
    padding: 0.95rem;
    background: linear-gradient(135deg, #2b4ea2, #4f7cff);
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s, box-shadow 0.3s;
    box-shadow: 0 4px 12px rgba(43, 78, 162, 0.3);
    margin-top: 0.5rem;
}

.formulario button[type="submit"]:hover {
    transform: translateY(-2px);
    opacity: 0.95;
    box-shadow: 0 6px 16px rgba(43, 78, 162, 0.4);
}

.formulario button[type="submit"]:active {
    transform: translateY(0);
}
</style>
