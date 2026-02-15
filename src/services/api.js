import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


const apiClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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
    getUsuarioActual: () => extractData(apiClient.get('/usuario')),
    desloguear: () => extractData(apiClient.post('/logout'))
}



export default {
    zonas,
    servicios,
    categorias,
    usuarios
};
