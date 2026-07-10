import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.getAll();
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await cartAPI.addItem({
                id: productId,
                product_quantity: quantity,
            });

            if (response.data.status === 'out of stock') {
                return { success: false, message: 'Producto agotado' };
            }

            await fetchCart();
            return { success: true, message: 'Producto agregado al carrito' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al agregar al carrito',
            };
        }
    };

    const increaseQuantity = async (productName) => {
        try {
            const response = await cartAPI.increaseQuantity(productName);
            if (response.data.status === 'not in stock') {
                return { success: false, message: 'No hay más stock disponible' };
            }
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Error al actualizar cantidad' };
        }
    };

    const decreaseQuantity = async (productName) => {
        try {
            await cartAPI.decreaseQuantity(productName);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Error al actualizar cantidad' };
        }
    };

    const removeFromCart = async (productName) => {
        try {
            await cartAPI.deleteItem(productName);
            await fetchCart();
            return { success: true, message: 'Producto eliminado del carrito' };
        } catch (error) {
            return { success: false, message: 'Error al eliminar producto' };
        }
    };



    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.product_quantity,
        0
    );

    const cartCount = cartItems.reduce(
        (count, item) => count + item.product_quantity,
        0
    );

    const value = {
        cartItems,
        loading,
        cartTotal,
        cartCount,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
