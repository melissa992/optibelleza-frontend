import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api/client';
import ProductCard from '../components/product/ProductCard';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        type: searchParams.get('type') || '',
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.type) params.type = filters.type;

            const response = await productsAPI.getAll(params);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);

        // Update URL params
        const params = {};
        if (newFilters.category) params.category = newFilters.category;
        if (newFilters.type) params.type = newFilters.type;
        setSearchParams(params);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                Nuestros Productos
            </Typography>

            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Categoría"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="Deportivas">Deportivas</MenuItem>
                            <MenuItem value="Casual">Casual</MenuItem>
                            <MenuItem value="Formal">Formal</MenuItem>
                            <MenuItem value="Sol">Sol</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Tipo"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Featured">Destacados</MenuItem>
                            <MenuItem value="New">Nuevos</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Box>

            {/* Products Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#c4a043' }} />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : products.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No se encontraron productos
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Products;

