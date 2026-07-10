import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://optibelleza-backend.onrender.com';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for CORS with credentials
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't auto-redirect on 401, let components handle it
        // Only clear token if it's actually invalid (not for public endpoints)
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            // Don't clear token for public product endpoints
            const publicEndpoints = [
                '/api/products',
                '/api/featured_product_mounts',
                '/api/new_product_mounts'
            ];
            const isPublicEndpoint = publicEndpoints.some(endpoint => url.includes(endpoint));

            if (!isPublicEndpoint) {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => apiClient.post('/api/auth/register', userData),
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    adminLogin: (credentials) => apiClient.post('/api/auth/admin', credentials),
    getCurrentUser: () => apiClient.get('/api/users/me'),
    logout: () => apiClient.get('/docs/api/logout_user'),
};

// Products API
export const productsAPI = {
    getAll: (params) => apiClient.get('/api/products', { params }),
    getById: (id) => apiClient.get(`/api/products/${id}`),
    getFeatured: () => apiClient.get('/api/featured_product_mounts'),
    getNew: () => apiClient.get('/api/new_product_mounts'),
    // Admin endpoints
    create: (productData) => apiClient.post('/api/admin/products', productData),
    update: (id, productData) => apiClient.put(`/api/admin/products/${id}`, productData),
    delete: (id) => apiClient.delete(`/api/admin/products/${id}`),
};

// Cart API
export const cartAPI = {
    addItem: (item) => apiClient.post('/api/cart/add_item_cart', item),
    getAll: () => apiClient.get('/api/cart/all_cart_items'),
    increaseQuantity: (productName) => apiClient.put('/api/cart/increase_cart_item', { product_name: productName }),
    decreaseQuantity: (productName) => apiClient.put('/api/cart/decrease_cart_item', { product_name: productName }),
    deleteItem: (name) => apiClient.get(`/api/cart/delete_cart_item/${name}`),
};

// Orders API
export const ordersAPI = {
    create: (orderData) => apiClient.post('/api/order/add_order', orderData),
    getUserOrders: () => apiClient.get('/api/order/current_user_all_order'),
    getAll: () => apiClient.get('/api/order/all_order'), // Admin endpoint
    delete: (id) => apiClient.get(`/api/order/delete_order/${id}`),
};

export default apiClient;
