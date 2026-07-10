import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
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
    // Ocultar imagen en celulares verticales pequeños (menos de 600px)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
                        // Layout Flexbox robusto e inmune a wrapping indeseado
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Text and Actions Content */}
                    <Box 
                        sx={{ 
                            flex: 1, 
                            p: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
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
                    </Box>

                    {/* Image Content - Centered to the right of the card */}
                    {!isMobile && (
                        <Box
                            sx={{
                                flexShrink: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: { xs: 4, md: 6 },
                                pl: { sm: 0 }, // Reducir padding izquierdo para que quede más cerca del texto
                            }}
                        >
                            <Paper
                                elevation={6}
                                sx={{
                                    bgcolor: '#ffffff',
                                    borderRadius: 4,
                                    p: 2.5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '320px',
                                    width: '210px',
                                    boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={snellenImg}
                                    alt="Tabla de Snellen"
                                    sx={{
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Paper>
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Modal de Examen */}
            <EyeTestModal open={modalOpen} onClose={handleCloseModal} />
        </Box>
    );
};

export default EyeTestSection;
