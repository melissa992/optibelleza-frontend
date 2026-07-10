import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { PlayArrow, Visibility } from '@mui/icons-material';
import snellenImg from '../../assets/snellen.jpg';
import EyeTestModal from './EyeTestModal';

const EyeTestSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{ py: 4, bgcolor: '#fdfbf7' }}>
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                        color: 'white',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                        },
                    }}
                >
                    <Grid container alignItems="stretch">
                        {/* Text and Actions Content */}
                        <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 6 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Visibility sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        fontWeight: 700,
                                        letterSpacing: 2,
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    Novedad Exclusiva
                                </Typography>
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2.5,
                                    lineHeight: 1.2,
                                    background: 'linear-gradient(45deg, #FFFFFF 60%, #ffe9a6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                                }}
                            >
                                ¡Haz tu test de la vista desde casa y comprueba si necesitas lentes!
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: '#cccccc',
                                    maxWidth: '550px',
                                    fontSize: '1.05rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                Mide tu agudeza visual de forma totalmente gratuita y en menos de 3 minutos. Nuestro test interactivo con guía por voz te indicará si es momento de renovar o adquirir tus primeras gafas.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayArrow />}
                                onClick={handleOpenModal}
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: '#000000',
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    borderRadius: 3,
                                    textTransform: 'uppercase',
                                    boxShadow: `0 4px 14px rgba(196, 160, 67, 0.4)`,
                                    '&:hover': {
                                        bgcolor: '#b39036',
                                        boxShadow: `0 6px 20px rgba(196, 160, 67, 0.6)`,
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Iniciar Test Gratis
                            </Button>
                        </Grid>

                        {/* Image Content */}
                        {!isMobile && (
                            <Grid
                                item
                                xs={12}
                                md={5}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: '#ffffff',
                                    borderTopRightRadius: 16,
                                    borderBottomRightRadius: 16,
                                    p: 3,
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={snellenImg}
                                    alt="Tabla de Snellen"
                                    sx={{
                                        maxHeight: '320px',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Container>

            {/* Modal de Examen */}
            <EyeTestModal open={modalOpen} onClose={handleCloseModal} />
        </Box>
    );
};

export default EyeTestSection;
