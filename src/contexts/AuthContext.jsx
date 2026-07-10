import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchCurrentUser = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Try admin login first
            try {
                const adminResponse = await authAPI.adminLogin({ email, password });
                const { token: newToken } = adminResponse.data;
                localStorage.setItem('token', newToken);
                localStorage.setItem('role', 'admin');
                setToken(newToken);
                await fetchCurrentUser();
                return { success: true, role: 'admin' };
            } catch (adminError) {
                // If admin login fails, try user login
                const response = await authAPI.login({ email, password });
                const { token: newToken } = response.data;
                localStorage.setItem('token', newToken);
                localStorage.setItem('role', 'user');
                setToken(newToken);
                await fetchCurrentUser();
                return { success: true, role: 'user' };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al iniciar sesión',
            };
        }
    };

    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            // Auto-login after registration
            return await login(userData.email, userData.password);
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al registrarse',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: localStorage.getItem('role') === 'admin',
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
