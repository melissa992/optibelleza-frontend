import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
} from '@mui/material';
import { ShoppingCart, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {/* Type Badge */}
            {product.shoes_type && (
                <Chip
                    label={product.shoes_type}
                    color={product.shoes_type === 'Featured' ? 'primary' : 'secondary'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: 600,
                    }}
                />
            )}

            {/* Product Image */}
            <CardMedia
                component="img"
                height="240"
                image={product.product_image || 'https://via.placeholder.com/300x240?text=No+Image'}
                alt={product.name}
                sx={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                }}
                onClick={() => navigate(`/products/${product.id}`)}
            />

            {/* Product Info */}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { color: '#c4a043' },
                    }}
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    {product.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.shoes_category}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#c4a043' }}>
                        ${product.price}
                    </Typography>
                    {product.shoes_stock > 0 ? (
                        <Chip label={`Stock: ${product.shoes_stock}`} size="small" color="success" />
                    ) : (
                        <Chip label="Agotado" size="small" color="error" />
                    )}
                </Box>
            </CardContent>

            {/* Actions */}
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/products/${product.id}`)}
                >
                    Ver Detalles
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;

