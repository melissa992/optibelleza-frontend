import { createTheme } from '@mui/material/styles';

// OptiTech Color Palette: Yellow, Black, White
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#c4a043', // Gold
            light: '#FFD54F',
            dark: '#FFA000',
            contrastText: '#000000',
        },
        secondary: {
            main: '#000000', // Black
            light: '#212121',
            dark: '#000000',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FAFAFA',
        },
        text: {
            primary: '#000000',
            secondary: '#424242',
        },
        error: {
            main: '#D32F2F',
        },
        success: {
            main: '#388E3C',
        },
        warning: {
            main: '#F57C00',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            color: '#000000',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            color: '#000000',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            color: '#000000',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#000000',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
            color: '#000000',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1rem',
            color: '#000000',
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                },
                contained: {
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#c4a043',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
            },
        },
    },
});

export default theme;
