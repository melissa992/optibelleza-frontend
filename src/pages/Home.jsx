import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    Chip,
    CircularProgress,
} from '@mui/material';
import { ArrowForward, ArrowBack, ArrowForwardIos, LocalShipping } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/client';

const Home = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const featuredScrollRef = useRef(null);
    const newScrollRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Try to fetch products, but handle auth errors gracefully
            const [featuredRes, newRes] = await Promise.all([
                productsAPI.getFeatured().catch(() => ({ data: [] })),
                productsAPI.getNew().catch(() => ({ data: [] })),
            ]);
            setFeaturedProducts(featuredRes.data);
            setNewProducts(newRes.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Don't show error to user, just show empty state
        } finally {
            setLoading(false);
        }
    };

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 300;
            ref.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const ProductCarousel = ({ products, scrollRef, title, viewAllLink }) => (
        <Box sx={{ mb: 6 }}>
            {/* Section Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                    }}
                >
                    {title}
                </Typography>
                <Button
                    endIcon={<ArrowForwardIos />}
                    onClick={() => navigate(viewAllLink)}
                    sx={{
                        color: '#000',
                        textDecoration: 'underline',
                        '&:hover': { color: '#c4a043' },
                    }}
                >
                    Ver todos los {title.toLowerCase()}
                </Button>
            </Box>

            {/* Carousel Container */}
            <Box sx={{ position: 'relative' }}>
                {/* Left Arrow */}
                <IconButton
                    onClick={() => scroll(scrollRef, 'left')}
                    sx={{
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: '#c4a043' },
                    }}
                >
                    <ArrowBack />
                </IconButton>

                {/* Products Scroll Container */}
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            bgcolor: '#f1f1f1',
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: '#c4a043',
                            borderRadius: 4,
                        },
                    }}
                >
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            sx={{
                                minWidth: 280,
                                maxWidth: 280,
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 4,
                                },
                            }}
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            {/* Discount Badge */}
                            {product.shoes_type === 'Featured' && (
                                <Chip
                                    label="-20%"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        bgcolor: '#D32F2F',
                                        color: 'white',
                                        fontWeight: 700,
                                        zIndex: 1,
                                    }}
                                />
                            )}

                            <CardMedia
                                component="img"
                                height="240"
                                image={product.product_image || 'https://via.placeholder.com/280x240?text=No+Image'}
                                alt={product.name}
                                sx={{ objectFit: 'cover' }}
                            />

                            <CardContent>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#666',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    {product.shoes_category}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {product.shoes_type === 'Featured' && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textDecoration: 'line-through',
                                                color: '#999',
                                            }}
                                        >
                                            ${Math.round(product.price * 1.25)}
                                        </Typography>
                                    )}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: product.shoes_type === 'Featured' ? '#D32F2F' : '#000',
                                        }}
                                    >
                                        ${product.price}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Right Arrow */}
                <IconButton
                    onClick={() => scroll(scrollRef, 'right')}
                    sx={{
                        position: 'absolute',
                        right: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: '#c4a043' },
                    }}
                >
                    <ArrowForward />
                </IconButton>
            </Box>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#c4a043' }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '400px', md: '500px' },
                    bgcolor: '#F5F5F5',
                    overflow: 'hidden',
                }}
            >
                {/* Background Image */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '50%',
                        height: '100%',
                        backgroundImage: 'url(https://images.unsplash.com/photo-1731289657094-e5550604fc3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Content */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 500,
                            textAlign: 'right',
                            pr: { xs: 2, md: 0 },
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: '#4A5FBF',
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                            }}
                        >
                            Envío gratis 🚚
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                color: '#4A5FBF',
                                fontWeight: 500,
                                textAlign: 'center',
                            }}
                        >
                            en todas tus compras online
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
                            Lleva tus gafas favoritas directo a tu casa
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/products')}
                            sx={{
                                bgcolor: '#4A5FBF',
                                color: 'white',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#3A4FAF',
                                },
                                display: 'flex',
                                left: '30%',
                                justifyContent: 'center',
                            }}
                        >
                            Compra ahora
                        </Button>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#999', textAlign: 'center' }}>
                            Solo hasta el 20 de diciembre
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Free Shipping Banner */}
            <Box
                sx={{
                    bgcolor: '#c4a043',
                    py: 2,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        <LocalShipping sx={{ fontSize: 32 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            ENVÍO GRATIS en todas tus compras online
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Products Sections */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <ProductCarousel
                        products={featuredProducts}
                        scrollRef={featuredScrollRef}
                        title="GAFAS DE SOL"
                        viewAllLink="/products?type=Featured"
                    />
                )}

                {/* New Products */}
                {newProducts.length > 0 && (
                    <ProductCarousel
                        products={newProducts}
                        scrollRef={newScrollRef}
                        title="GAFAS DE VISTA"
                        viewAllLink="/products?type=New"
                    />
                )}
            </Container>

            {/* Promotional Banner */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '300px', md: '400px' },
                    backgroundImage: 'url(https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        p: 4,
                        mr: { xs: 2, md: 8 },
                        maxWidth: 400,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        GAFAS DE VISTA
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                        Encuentra el estilo perfecto que se adapta a ti
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/products')}
                    >
                        Compra aquí
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;

