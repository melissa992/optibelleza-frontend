import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Visibility, Email, Phone, LocationOn } from '@mui/icons-material';

import logoImg from '../../assets/logo.png';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#000000',
                color: 'white',
                py: 6,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                component="img"
                                src={logoImg}
                                alt="OptiTech Logo"
                                sx={{
                                    height: 32,
                                    mr: 1.5,
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#c4a043' }}>
                                OptiTech
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                            Tu tienda de confianza para gafas de calidad. Encuentra el estilo perfecto
                            que se adapta a ti.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#c4a043' }}>
                            Enlaces Rápidos
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/products" color="inherit" underline="hover" sx={{ color: '#BDBDBD' }}>
                                Productos
                            </Link>
                            <Link href="/orders" color="inherit" underline="hover" sx={{ color: '#BDBDBD' }}>
                                Mis Pedidos
                            </Link>
                            <Link href="/cart" color="inherit" underline="hover" sx={{ color: '#BDBDBD' }}>
                                Carrito
                            </Link>
                        </Box>
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#c4a043' }}>
                            Contacto
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 18, color: '#c4a043' }} />
                                <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                                    info@optitech.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 18, color: '#c4a043' }} />
                                <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                                    +1 (555) 123-4567
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 18, color: '#c4a043' }} />
                                <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                                    Ciudad, País
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #424242', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#BDBDBD' }}>
                        © {new Date().getFullYear()} OptiTech. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

