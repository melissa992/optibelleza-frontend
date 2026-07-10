import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    Divider,
    Alert,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleIncrease = async (productName) => {
        const result = await increaseQuantity(productName);
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleDecrease = async (productName) => {
        await decreaseQuantity(productName);
    };

    const handleRemove = async (productName) => {
        const result = await removeFromCart(productName);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 80, color: '#BDBDBD', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Tu carrito está vacío
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Agrega productos para comenzar tu compra
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/products')}
                >
                    Explorar Productos
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                Carrito de Compras
            </Typography>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    {cartItems.map((item) => (
                        <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Product Image */}
                                <Grid item xs={3} sm={2}>
                                    <img
                                        src={item.product_image || 'https://via.placeholder.com/100'}
                                        alt={item.product_name}
                                        style={{ width: '100%', borderRadius: 8 }}
                                    />
                                </Grid>

                                {/* Product Info */}
                                <Grid item xs={9} sm={4}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {item.product_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Talla: {item.size}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Categoría: {item.shoes_category}
                                    </Typography>
                                </Grid>

                                {/* Quantity Controls */}
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDecrease(item.product_name)}
                                            sx={{ bgcolor: '#F5F5F5' }}
                                        >
                                            <Remove />
                                        </IconButton>
                                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                                            {item.product_quantity}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleIncrease(item.product_name)}
                                            sx={{ bgcolor: '#F5F5F5' }}
                                        >
                                            <Add />
                                        </IconButton>
                                    </Box>
                                </Grid>

                                {/* Price */}
                                <Grid item xs={4} sm={2}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#c4a043' }}>
                                        ${item.price * item.product_quantity}
                                    </Typography>
                                </Grid>

                                {/* Remove Button */}
                                <Grid item xs={2} sm={1}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemove(item.product_name)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Resumen del Pedido
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>${cartTotal}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Envío:</Typography>
                                <Typography>Gratis</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Total:
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#c4a043' }}>
                                ${cartTotal}
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/checkout')}
                            sx={{ mb: 2 }}
                        >
                            Proceder al Pago
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate('/products')}
                        >
                            Continuar Comprando
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;

