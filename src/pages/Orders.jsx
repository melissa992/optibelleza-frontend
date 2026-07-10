import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { ordersAPI } from '../api/client';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getUserOrders();
            setOrders(response.data);
        } catch (error) {
            setError('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'warning',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'error',
        };
        return statusColors[status?.toLowerCase()] || 'default';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#c4a043' }} />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 80, color: '#BDBDBD', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    No tienes pedidos aún
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tus pedidos aparecerán aquí una vez que realices una compra
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                Mis Pedidos
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} key={order.order_id}>
                        <Paper sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                {/* Order Info */}
                                <Grid item xs={12} md={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Pedido #{order.order_id}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Estado:</strong>
                                    </Typography>
                                    <Chip
                                        label={order.order_status || 'Pendiente'}
                                        color={getStatusColor(order.order_status)}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid>

                                {/* Product Info */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <img
                                            src={order.product_image || 'https://via.placeholder.com/80'}
                                            alt={order.product_name}
                                            style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                                        />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {order.product_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Talla: {order.size}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Cantidad: {order.product_quantity}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Shipping Info */}
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body2">
                                        <strong>Dirección:</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.user_address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Método de envío:</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.shipping_method}
                                    </Typography>
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} md={2}>
                                    <Typography variant="body2">
                                        <strong>Total:</strong>
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#c4a043' }}>
                                        ${order.price * order.product_quantity}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Pago: {order.payment}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Orders;

