import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Chip,
    Paper,
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/client';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data);
        } catch (error) {
            setError('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setAddingToCart(true);
        const result = await addToCart(product.id, quantity);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setQuantity(1);
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setAddingToCart(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#c4a043' }} />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Producto no encontrado'}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/products')}
                sx={{ mb: 3 }}
            >
                Volver a Productos
            </Button>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Product Image */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <img
                            src={product.product_image || 'https://via.placeholder.com/600x600?text=No+Image'}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </Paper>
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                    <Box>
                        {product.shoes_type && (
                            <Chip
                                label={product.shoes_type}
                                color={product.shoes_type === 'Featured' ? 'primary' : 'secondary'}
                                sx={{ mb: 2 }}
                            />
                        )}

                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                            {product.name}
                        </Typography>

                        <Typography variant="h4" sx={{ color: '#c4a043', fontWeight: 700, mb: 2 }}>
                            ${product.price}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Categoría:</strong> {product.shoes_category}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            {product.shoes_stock > 0 ? (
                                <Chip label={`Stock disponible: ${product.shoes_stock}`} color="success" />
                            ) : (
                                <Chip label="Agotado" color="error" />
                            )}
                        </Box>

                        {product.shoes_description && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Descripción
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {product.shoes_description}
                                </Typography>
                            </Box>
                        )}

                        {/* Quantity */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Cantidad
                            </Typography>
                            <TextField
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                inputProps={{ min: 1, max: product.shoes_stock }}
                                sx={{ width: 120 }}
                            />
                        </Box>

                        {/* Add to Cart Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ShoppingCart />}
                            onClick={handleAddToCart}
                            disabled={product.shoes_stock === 0 || addingToCart}
                            sx={{ py: 1.5 }}
                        >
                            {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetail;

