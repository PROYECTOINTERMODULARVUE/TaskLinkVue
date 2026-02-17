import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


const apiClient = axios.create({
    baseURL: `${SERVER_URL}api`,
    withCredentials: true, withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'

    }
});

const webClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

const extractData = async (promise) => {
    const response = await promise;
    return response.data;
};

const zonas = {
    getAll: () => extractData(apiClient.get(`/zonas`)),
    getOne: (id) => extractData(apiClient.get(`/zonas/${id}`)),
    create: (item) => extractData(apiClient.post(`/zonas`, item)),
    modify: (item) => extractData(apiClient.put(`/zonas/${item.id}`, item)),
    //zonasPorCategoria: (id) => extractData(apiClient.get(`/zonas?categoria=${id}`,)),
    //zonasPorPlataforma: (id) => extractData(apiClient.get(`/zonas?plataforma=${id}`,)),
    //delete: (id) => extractData(apiClient.delete(`/zonas/${id}`)),
}

const servicios = {
    getAll: () => extractData(apiClient.get(`/servicios`)),
    getOne: (id) => extractData(apiClient.get(`/servicios/${id}`)),
    create: (item) => extractData(apiClient.post(`/servicios`, item)),
    modify: (item) => extractData(apiClient.put(`/servicios/${item.id}`, item)),
    serviciosPorCategoria: (idCategoria) => extractData(apiClient.get(`/servicios/categoria/${idCategoria}`,)),
    delete: (id) => extractData(apiClient.delete(`/servicios/${id}`)),
}

const categorias = {
    getAll: () => extractData(apiClient.get(`/categorias`)),
    getOne: (id) => extractData(apiClient.get(`/categorias/${id}`)),
    create: (item) => extractData(apiClient.post(`/categorias`, item)),
    modify: (item) => extractData(apiClient.put(`/categorias/${item.id}`, item)),
    //categoriasPorGrupo: (id) => extractData(apiClient.get(`/categorias?empresa=${id}`,)),
    delete: (id) => extractData(apiClient.delete(`/categorias/${id}`)),
}
const usuarios = {
    getUsuarioActual: () => extractData(apiClient.get('/usuario')),     // → /api/usuario
    desloguear: () => extractData(webClient.post('/logout')),          // → /logout
    login: async (credentials) => {
        await webClient.get('/sanctum/csrf-cookie');
        return extractData(webClient.post('/login', credentials));
    },
    register: async (userData) => {
        await webClient.get('/sanctum/csrf-cookie');
        return extractData(webClient.post('/register', userData));
    },
    updateProfilePhoto: (formData) => extractData(apiClient.post('/usuario/foto', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })),
    updateProfile: (data) => extractData(apiClient.put('/usuario', data)),
    updatePassword: (data) => extractData(apiClient.put('/usuario/password', data)),
    // Admin methods
    getAll: (params) => extractData(apiClient.get('/usuarios', { params })),
    update: (id, data) => extractData(apiClient.put(`/usuarios/${id}`, data)),
}

const reservas = {
    getAll: () => extractData(apiClient.get(`/reservas`)),
    getOne: (id) => extractData(apiClient.get(`/reservas/${id}`)),
    create: (item) => extractData(apiClient.post(`/reservas`, item)),
    modify: (item) => extractData(apiClient.put(`/reservas/${item.id}`, item)),
    delete: (id) => extractData(apiClient.delete(`/reservas/${id}`)),
    reservasPorUsuario: (idUsuario) => extractData(apiClient.get(`/reservas/usuario/${idUsuario}`,)),
    reservasPorServicio: (idServicio) => extractData(apiClient.get(`/reservas/servicio/${idServicio}`,)),
    reservasPorZona: (idZona) => extractData(apiClient.get(`/reservas/zona/${idZona}`,)),
    reservasPorFecha: (fecha) => extractData(apiClient.get(`/reservas/fecha/${fecha}`,)),
    reservasPorFechaYServicio: (fecha, idServicio) => extractData(apiClient.get(`/reservas/fecha/${fecha}/servicio/${idServicio}`,)),
    reservasPorFechaYZona: (fecha, idZona) => extractData(apiClient.get(`/reservas/fecha/${fecha}/zona/${idZona}`,)),
    reservasPorFechaYUsuario: (fecha, idUsuario) => extractData(apiClient.get(`/reservas/fecha/${fecha}/usuario/${idUsuario}`,)),
    reservasPorFechaYServicioYZona: (fecha, idServicio, idZona) => extractData(apiClient.get(`/reservas/fecha/${fecha}/servicio/${idServicio}/zona/${idZona}`,)),
    reservasPorFechaYUsuario: (fecha, idUsuario) => extractData(apiClient.get(`/reservas/fecha/${fecha}/usuario/${idUsuario}`,)),
    reservasPorFechaYServicioYZona: (fecha, idServicio, idZona) => extractData(apiClient.get(`/reservas/fecha/${fecha}/servicio/${idServicio}/zona/${idZona}`,)),
}

const proveedor = {
    getServicios: () => extractData(apiClient.get('/proveedor/servicios')),
    createServicio: (data) => extractData(apiClient.post('/proveedor/servicios', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })),
    updateServicio: (id, data) => extractData(apiClient.post(`/proveedor/servicios/${id}?_method=PUT`, data, { // POST with _method=PUT for FormData compatibility if needed, or simple PUT if JSON
        headers: {
            // 'Content-Type': 'multipart/form-data' // If sending files on update
        }
    })),
    // Simple update for non-file data (like toggle active)
    updateServicioJson: (id, data) => extractData(apiClient.put(`/proveedor/servicios/${id}`, data)),
    deleteServicio: (id) => extractData(apiClient.delete(`/proveedor/servicios/${id}`)),
    getReservas: () => extractData(apiClient.get('/proveedor/reservas')),
    getEstadisticas: () => extractData(apiClient.get('/proveedor/estadisticas')),
}



export default {
    zonas,
    servicios,
    categorias,
    usuarios,
    reservas,
    proveedor
};
