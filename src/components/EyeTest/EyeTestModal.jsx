import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    LinearProgress,
    Stack,
    Alert,
} from '@mui/material';
import {
    Warning,
    Smartphone,
    TabletAndroid,
    Computer,
    Tv,
    Close,
    VolumeUp,
    VolumeOff,
    CheckCircle,
    Cancel,
    Replay,
    Visibility,
    LocalMall,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Letras estándar de la tabla de Snellen
const SNELLEN_LETTERS = ['C', 'D', 'E', 'F', 'L', 'O', 'P', 'T', 'Z'];

// Tamaños base de las letras en rem (escala decreciente de Fila 1 a Fila 8)
const BASE_FONT_SIZES = [
    6.0,  // Fila 1 (20/200)
    4.2,  // Fila 2 (20/100)
    3.0,  // Fila 3 (20/70)
    2.2,  // Fila 4 (20/50)
    1.6,  // Fila 5 (20/40)
    1.2,  // Fila 6 (20/30)
    0.9,  // Fila 7 (20/25)
    0.7,  // Fila 8 (20/20)
];

// Cantidad de letras por fila
const LETTERS_COUNT_PER_ROW = [1, 2, 3, 4, 5, 6, 7, 8];

// Equivalencia de agudeza visual por fila
const VISUAL_ACUITY_VALUES = [
    '20/200',
    '20/100',
    '20/70',
    '20/50',
    '20/40',
    '20/30',
    '20/25',
    '20/20',
];

// Tiempos progresivos por fila (12, 14, 16, 18, 20, 22, 24, 26)
const ROW_TIMES = [12, 14, 16, 18, 20, 22, 24, 26];
const TOTAL_TEST_TIME = 152; // Suma de todos los tiempos

const EyeTestModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    // Estados del flujo del test
    // step: 0 = Disclaimer, 1 = Seleccionar Dispositivo, 2 = Instrucciones, 3 = Cuenta Regresiva, 4 = Examen en Curso, 5 = Formulario de Respuestas, 6 = Resultados
    const [step, setStep] = useState(0);
    const [device, setDevice] = useState('computer'); // 'mobile' | 'tablet' | 'computer' | 'tv'
    const [muted, setMuted] = useState(false);
    
    // Cuenta regresiva de preparación (15 segundos)
    const [prepCountdown, setPrepCountdown] = useState(15);
    
    // Examen en curso
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [rowCountdown, setRowCountdown] = useState(12); // Fila 1 inicia con 12s
    const [testLetters, setTestLetters] = useState([]); // Fila de letras autogeneradas
    
    // Respuestas del usuario
    const [userInputs, setUserInputs] = useState(Array(8).fill(''));
    const [results, setResults] = useState(null);

    // Refs para temporizadores y control de voz
    const timerRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Reiniciar estados del test al abrir/cerrar
    useEffect(() => {
        if (open) {
            setStep(0);
            setDevice('computer');
            setPrepCountdown(15);
            setCurrentRowIndex(0);
            setRowCountdown(12); // Primer fila inicia con 12s
            setUserInputs(Array(8).fill(''));
            setResults(null);
            generateTestLetters();
        } else {
            // Cancelar cualquier síntesis de voz activa
            if (synthRef.current) {
                synthRef.current.cancel();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [open]);

    // Generar letras aleatorias únicas (sin repetición en una misma fila)
    const generateTestLetters = () => {
        const generated = LETTERS_COUNT_PER_ROW.map((count) => {
            const available = [...SNELLEN_LETTERS];
            let row = '';
            for (let i = 0; i < count; i++) {
                const randIndex = Math.floor(Math.random() * available.length);
                row += available[randIndex];
                available.splice(randIndex, 1); // Remover la letra para evitar que se repita
            }
            return row;
        });
        setTestLetters(generated);
    };

    // Función auxiliar para reproducir voz en español
    const speak = (text) => {
        if (muted || !synthRef.current) return;
        
        synthRef.current.cancel(); // Cancelar voces anteriores para evitar encolamiento
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        
        const voices = synthRef.current.getVoices();
        const spanishVoice = voices.find(v => v.lang.startsWith('es'));
        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }

        synthRef.current.speak(utterance);
    };

    // Efecto que controla la cuenta regresiva de preparación (Paso 3)
    useEffect(() => {
        if (step === 3) {
            speak("Examen listo. Aléjate a la distancia recomendada y ten a la mano tu papel y lápiz, o cualquier cosa para anotar. Comenzamos en 15 segundos.");

            timerRef.current = setInterval(() => {
                setPrepCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setStep(4); // Avanzar a examen
                        return 15;
                    }
                    
                    if (prev <= 6) {
                        speak((prev - 1).toString());
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current && step === 3) clearInterval(timerRef.current);
        };
    }, [step]);

    // Efecto de control de tiempo único del examen en curso (Paso 4)
    // Se ejecuta una sola vez al entrar al paso 4 para evitar recreaciones y desajustes de intervalos
    useEffect(() => {
        if (step === 4) {
            setCurrentRowIndex(0);
            setRowCountdown(12);

            const speakCurrentRow = (index) => {
                if (index === 0) {
                    speak("Comenzamos el examen. Fila número 1. Por favor, anota en tu papel o dispositivo las letras que ves en pantalla.");
                } else {
                    speak(`Cambiando a la fila número ${index + 1}. Anota las letras de la fila ${index + 1}.`);
                }
            };

            speakCurrentRow(0);

            let localRowIndex = 0;
            let localCountdown = 12;

            timerRef.current = setInterval(() => {
                localCountdown--;
                setRowCountdown(localCountdown);

                if (localCountdown <= 0) {
                    localRowIndex++;
                    if (localRowIndex < 8) {
                        setCurrentRowIndex(localRowIndex);
                        const nextTime = ROW_TIMES[localRowIndex];
                        localCountdown = nextTime;
                        setRowCountdown(nextTime);
                        speakCurrentRow(localRowIndex);
                    } else {
                        clearInterval(timerRef.current);
                        speak("Examen finalizado. Por favor, regresa al dispositivo e ingresa en cada casilla las respuestas que anotaste.");
                        setStep(5); // Avanzar al formulario
                    }
                }
            }, 1000);
        }

        return () => {
            if (timerRef.current && step === 4) {
                clearInterval(timerRef.current);
            }
        };
    }, [step]);

    // Multiplicador de escala de tamaño según dispositivo (Verificación crítica de distancias y tamaños)
    const getDeviceScale = () => {
        switch (device) {
            case 'mobile': return 0.8;    // Pantalla pequeña a 1 metro
            case 'tablet': return 0.95;   // Pantalla mediana a 1.5 metros
            case 'tv': return 1.6;        // Pantalla grande a 3 metros
            case 'computer':
            default:
                return 1.0;               // Pantalla estándar a 2 metros
        }
    };

    const getDistanceLabel = () => {
        switch (device) {
            case 'mobile': return '1 metro (3 pies)';
            case 'tablet': return '1.5 metros (5 pies)';
            case 'tv': return '3 metros (10 pies)';
            case 'computer':
            default:
                return '2 metros (6.5 pies)';
        }
    };

    // Calcular el progreso acumulado proporcional del examen
    const getTestProgress = () => {
        let elapsed = 0;
        for (let i = 0; i < currentRowIndex; i++) {
            elapsed += ROW_TIMES[i];
        }
        elapsed += (ROW_TIMES[currentRowIndex] - rowCountdown);
        return (elapsed * 100) / TOTAL_TEST_TIME;
    };

    // Evaluar respuestas y calcular resultados
    const handleEvaluateResults = () => {
        const rowDetails = testLetters.map((realRow, index) => {
            const userInput = (userInputs[index] || '').toUpperCase().replace(/\s+/g, '');
            const target = realRow.toUpperCase();
            
            let hits = 0;
            const minLen = Math.min(userInput.length, target.length);
            for (let i = 0; i < minLen; i++) {
                if (userInput[i] === target[i]) {
                    hits++;
                }
            }

            const threshold = Math.ceil(target.length * 0.6);
            const isCorrect = hits >= threshold && userInput.length > 0;

            return {
                row: index + 1,
                real: target,
                user: userInput,
                acuity: VISUAL_ACUITY_VALUES[index],
                isCorrect,
                hits,
                total: target.length,
            };
        });

        // Agudeza visual por última fila consecutiva correcta
        let finalAcuityIndex = -1;
        for (let i = 0; i < rowDetails.length; i++) {
            if (rowDetails[i].isCorrect) {
                finalAcuityIndex = i;
            } else {
                break;
            }
        }

        let acuityValue = 'Menor a 20/200';
        let diagnosis = '';
        let recommendation = '';
        let severity = 'error';

        if (finalAcuityIndex >= 0) {
            acuityValue = VISUAL_ACUITY_VALUES[finalAcuityIndex];
        }

        if (acuityValue === '20/20') {
            diagnosis = 'Visión estimada excelente (20/20)';
            recommendation = 'Tu agudeza visual parece estar en perfectas condiciones. Recuerda realizarte un examen preventivo con un especialista al menos una vez al año.';
            severity = 'success';
        } else if (acuityValue === '20/25' || acuityValue === '20/30') {
            diagnosis = 'Visión estimada buena con posible fatiga leve';
            recommendation = 'Tu visión es bastante aceptable, pero presentas una ligera dificultad en las letras más pequeñas. Podrías tener una leve fatiga visual o un inicio de miopía/astigmatismo. Te sugerimos consultar con un especialista.';
            severity = 'warning';
        } else if (acuityValue === '20/40' || acuityValue === '20/50') {
            diagnosis = 'Probable necesidad de lentes correctoras';
            recommendation = 'Hemos detectado dificultades para leer filas de tamaño medio. Es muy probable que necesites lentes graduados para mejorar tu visión y evitar dolores de cabeza o cansancio ocular. Te recomendamos programar una cita con un optometrista.';
            severity = 'warning';
        } else {
            diagnosis = 'Alta probabilidad de requerir lentes graduados';
            recommendation = 'Tu agudeza visual estimada está por debajo del estándar óptimo. Te recomendamos encarecidamente que acudas a una clínica oftalmológica u óptica para un examen visual completo y profesional.';
            severity = 'error';
        }

        setResults({
            acuity: acuityValue,
            diagnosis,
            recommendation,
            severity,
            rowDetails,
        });

        setStep(6);
    };

    const handleReset = () => {
        setStep(1);
        setPrepCountdown(15);
        setCurrentRowIndex(0);
        setRowCountdown(12); // Reset a 12s para la Fila 1
        setUserInputs(Array(8).fill(''));
        setResults(null);
        generateTestLetters();
    };

    // Renderizar contenidos según la fase actual
    const renderContent = () => {
        switch (step) {
            case 0: // Disclaimer
                return (
                    <Box sx={{ py: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Warning color="error" sx={{ fontSize: 40 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Descargo de Responsabilidad Médica
                            </Typography>
                        </Stack>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                            Este test visual es una herramienta interactiva diseñada únicamente para medir de manera estimativa tu agudeza visual desde casa. 
                            <strong> No es un diagnóstico médico profesional</strong> y no reemplaza de ninguna manera la consulta, refracción o examen clínico realizado por un optometrista u oftalmólogo cualificado.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                            Al realizar este test, aceptas que los resultados son orientativos. Si experimentas visión borrosa, dolores de cabeza frecuentes, fatiga ocular o cualquier molestia visual, debes programar una cita médica formal con un profesional de la salud visual.
                        </Typography>
                        <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                            Esta prueba es ideal para verificar si tu graduación actual ha cambiado o si sospechas que podrías necesitar tus primeras gafas.
                        </Alert>
                    </Box>
                );

            case 1: // Selección de dispositivo
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                            ¿En qué dispositivo realizarás el test?
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
                            Adaptaremos críticamente el tamaño de las letras y la distancia recomendada según la pantalla que elijas.
                        </Typography>
                        
                        <Grid container spacing={2}>
                            {[
                                { id: 'mobile', label: 'Celular / Móvil', icon: <Smartphone sx={{ fontSize: 40 }} />, desc: 'Pantallas de 5" a 6.8"' },
                                { id: 'tablet', label: 'Tablet / iPad', icon: <TabletAndroid sx={{ fontSize: 40 }} />, desc: 'Pantallas de 7" a 12.9"' },
                                { id: 'computer', label: 'Laptop / PC', icon: <Computer sx={{ fontSize: 40 }} />, desc: 'Pantallas de 13" a 27"' },
                                { id: 'tv', label: 'Televisor / Smart TV', icon: <Tv sx={{ fontSize: 40 }} />, desc: 'Pantallas de 32" o más' },
                            ].map((item) => (
                                <Grid item xs={12} sm={3} key={item.id}>
                                    <Card 
                                        sx={{ 
                                            border: device === item.id ? '2px solid #c4a043' : '1px solid #e0e0e0',
                                            bgcolor: device === item.id ? '#fdfbf7' : 'background.paper',
                                            boxShadow: device === item.id ? 3 : 1,
                                            height: '100%',
                                        }}
                                    >
                                        <CardActionArea 
                                            onClick={() => setDevice(item.id)}
                                            sx={{ height: '100%', p: 2, textAlign: 'center' }}
                                        >
                                            <Box sx={{ color: device === item.id ? '#c4a043' : '#666', mb: 1.5 }}>
                                                {item.icon}
                                            </Box>
                                            <CardContent sx={{ p: 0 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {item.desc}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                );

            case 2: // Instrucciones
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Instrucciones de Preparación
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box sx={{ bgcolor: '#c4a043', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>1</Box>
                                <Typography variant="body1">
                                    Colócate exactamente a una distancia de <strong>{getDistanceLabel()}</strong> de la pantalla de tu dispositivo.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box sx={{ bgcolor: '#c4a043', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>2</Box>
                                <Typography variant="body1">
                                    Sube el <strong>brillo de la pantalla al 100%</strong> para garantizar una visibilidad y contraste óptimos de las letras.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box sx={{ bgcolor: '#c4a043', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>3</Box>
                                <Typography variant="body1">
                                    Ten a la mano una <strong>hoja de papel y un lápiz, o cualquier otro dispositivo o elemento para anotar</strong> las letras de cada una de las 8 filas.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box sx={{ bgcolor: '#c4a043', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>4</Box>
                                <Typography variant="body1">
                                    Cúbrete el <strong>ojo izquierdo</strong> con tu mano (sin presionarlo) para evaluar primero tu ojo derecho. Si deseas evaluar ambos ojos juntos para una medición general, puedes realizar el test con ambos ojos abiertos.
                                </Typography>
                            </Box>
                            {(device === 'mobile' || device === 'tablet') && (
                                <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                                    Apoya tu dispositivo en posición vertical sobre una mesa o base estable a la altura de tus ojos. No lo sostengas con la mano durante el test.
                                </Alert>
                            )}
                        </Stack>
                    </Box>
                );

            case 3: // Cuenta regresiva
                return (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                            Aléjate a {getDistanceLabel()} de la pantalla
                        </Typography>
                        <Box 
                            sx={{ 
                                width: 140, 
                                height: 140, 
                                borderRadius: '50%', 
                                border: '6px solid #c4a043', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 40px',
                                background: '#fdfbf7',
                                boxShadow: 3,
                            }}
                        >
                            <Typography variant="h1" sx={{ color: '#000', fontWeight: 800 }}>
                                {prepCountdown}
                            </Typography>
                        </Box>
                        <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                            Prepara tu papel y lápiz, o elemento para anotar...
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={(15 - prepCountdown) * (100 / 15)} 
                            sx={{ maxWidth: 300, mx: 'auto', height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#c4a043' } }}
                        />
                    </Box>
                );

            case 4: // Examen en curso
                const scale = getDeviceScale();
                const fontSize = BASE_FONT_SIZES[currentRowIndex] * scale;
                const currentLetters = testLetters[currentRowIndex] || '';

                return (
                    <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'white', borderRadius: 2, border: '1px solid #eee', position: 'relative' }}>
                        {/* Indicador de progreso de filas */}
                        <Box sx={{ px: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Fila {currentRowIndex + 1} de 8 (Agudeza: {VISUAL_ACUITY_VALUES[currentRowIndex]})
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: rowCountdown <= 3 ? 'error.main' : 'text.primary' }}>
                                Cambia en: {rowCountdown}s
                            </Typography>
                        </Box>

                        <LinearProgress 
                            variant="determinate" 
                            value={getTestProgress()} 
                            sx={{ mb: 6, height: 6, bgcolor: '#f1f1f1', '& .MuiLinearProgress-bar': { bgcolor: '#c4a043' } }}
                        />

                        {/* Contenedor central de los optotipos */}
                        <Box 
                            sx={{ 
                                minHeight: '180px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                userSelect: 'none',
                            }}
                        >
                            <Typography 
                                sx={{ 
                                    fontFamily: 'monospace', 
                                    fontWeight: 'bold', 
                                    fontSize: `${fontSize}rem`,
                                    color: 'black',
                                    transition: 'font-size 0.3s ease',
                                    letterSpacing: '1.2rem',
                                    pl: '1.2rem',
                                }}
                            >
                                {currentLetters}
                            </Typography>
                        </Box>

                        <Typography variant="body2" color="textSecondary" sx={{ mt: 6, fontStyle: 'italic' }}>
                            Anota las letras en tu papel o dispositivo antes de que cambie de fila.
                        </Typography>
                    </Box>
                );

            case 5: // Formulario de Respuestas
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            Ingresa las respuestas anotadas
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Transcribe en cada casilla las letras que lograste anotar en tu papel o dispositivo para cada fila. Déjala vacía si no pudiste verla.
                        </Typography>
                        
                        <Grid container spacing={2}>
                            {VISUAL_ACUITY_VALUES.map((acuity, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                width: 60, 
                                                color: '#666',
                                                fontSize: '0.9rem' 
                                            }}
                                        >
                                            Fila {index + 1}:
                                        </Typography>
                                        <TextField
                                            label={`Letras ({${acuity}})`}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={userInputs[index]}
                                            onChange={(e) => {
                                                const updated = [...userInputs];
                                                updated[index] = e.target.value;
                                                setUserInputs(updated);
                                            }}
                                            inputProps={{ style: { textTransform: 'uppercase', letterSpacing: 2 } }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                );

            case 6: // Resultados
                if (!results) return null;
                return (
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: results.severity === 'success' ? 'success.main' : results.severity === 'warning' ? 'warning.main' : 'error.main' }}>
                            {results.diagnosis}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, mb: 4 }}>
                            Agudeza Visual Estimada: {results.acuity}
                        </Typography>

                        <Alert severity={results.severity} sx={{ mb: 4, borderRadius: 2, '& .MuiAlert-message': { fontSize: '1rem', lineHeight: 1.5 } }}>
                            {results.recommendation}
                        </Alert>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Detalle del Examen
                        </Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Fila</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Agudeza</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Letras Reales</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Tu Respuesta</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">Resultado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.rowDetails.map((row) => (
                                        <TableRow key={row.row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>{row.row}</TableCell>
                                            <TableCell>{row.acuity}</TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', letterSpacing: 1, fontWeight: 600 }}>{row.real}</TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>{row.user || '-'}</TableCell>
                                            <TableCell align="center">
                                                {row.isCorrect ? (
                                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: 'success.main' }}>
                                                        <CheckCircle fontSize="small" />
                                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Correcto ({row.hits}/{row.total})</Typography>
                                                    </Stack>
                                                ) : (
                                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: 'error.main' }}>
                                                        <Cancel fontSize="small" />
                                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Incorrecto</Typography>
                                                    </Stack>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ bgcolor: '#fdfbf7', p: 2, borderRadius: 2, border: '1px solid #e5dcc6', mb: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                                * Nota de salud: Este test mide agudeza visual de lejos en base a la escala angular estándar. Un resultado correcto no descarta otros problemas visuales como astigmatismo periférico, presbicia en visión cercana o afecciones oculares internas. Visita a tu especialista una vez al año.
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    // Botones de control del footer del diálogo
    const renderActions = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Button onClick={onClose} color="inherit">
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => setStep(1)} 
                            variant="contained" 
                            sx={{ bgcolor: '#000000', color: 'white', '&:hover': { bgcolor: '#222' } }}
                        >
                            Aceptar y Continuar
                        </Button>
                    </>
                );

            case 1:
                return (
                    <>
                        <Button onClick={() => setStep(0)} color="inherit">
                            Atrás
                        </Button>
                        <Button 
                            onClick={() => setStep(2)} 
                            variant="contained" 
                            sx={{ bgcolor: '#c4a043', color: 'black', '&:hover': { bgcolor: '#b39036' } }}
                        >
                            Continuar
                        </Button>
                    </>
                );

            case 2:
                return (
                    <>
                        <Button onClick={() => setStep(1)} color="inherit">
                            Atrás
                        </Button>
                        <Button 
                            onClick={() => setStep(3)} 
                            variant="contained" 
                            sx={{ bgcolor: '#000', color: 'white', '&:hover': { bgcolor: '#222' } }}
                        >
                            Comenzar Test
                        </Button>
                    </>
                );

            case 3:
                return (
                    <Button 
                        onClick={() => {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setStep(2);
                        }} 
                        color="inherit"
                    >
                        Cancelar y Volver
                    </Button>
                );

            case 4:
                return (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IconButton 
                            onClick={() => setMuted(!muted)} 
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            {muted ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>
                        <Button 
                            onClick={() => {
                                if (timerRef.current) clearInterval(timerRef.current);
                                setStep(2);
                            }} 
                            color="error"
                        >
                            Detener Examen
                        </Button>
                    </Box>
                );

            case 5:
                return (
                    <>
                        <Button onClick={handleReset} color="inherit">
                            Reiniciar Test
                        </Button>
                        <Button 
                            onClick={handleEvaluateResults} 
                            variant="contained" 
                            sx={{ bgcolor: '#000000', color: 'white', '&:hover': { bgcolor: '#222' } }}
                        >
                            Ver Resultados
                        </Button>
                    </>
                );

            case 6:
                return (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between' }}>
                        <Button 
                            onClick={handleReset} 
                            startIcon={<Replay />} 
                            variant="outlined"
                            sx={{ borderColor: '#c4a043', color: '#c4a043', '&:hover': { borderColor: '#b39036', bgcolor: '#fdfbf7' } }}
                        >
                            Repetir Test
                        </Button>
                        
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button 
                                onClick={onClose} 
                                variant="outlined"
                                color="inherit"
                            >
                                Cerrar
                            </Button>
                            <Button 
                                onClick={() => {
                                    onClose();
                                    navigate('/products');
                                }} 
                                startIcon={<LocalMall />} 
                                variant="contained"
                                sx={{ bgcolor: '#c4a043', color: 'black', '&:hover': { bgcolor: '#b39036' } }}
                            >
                                Ver Catálogo de Gafas
                            </Button>
                        </Stack>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={step === 3 || step === 4 ? undefined : onClose} 
            maxWidth="md" 
            fullWidth
            scroll="paper"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                    bgcolor: '#fafafa',
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility sx={{ color: '#c4a043' }} />
                    Test de Agudeza Visual en Casa
                </Typography>
                {step !== 3 && step !== 4 && (
                    <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: step === 4 ? '#f5f5f5' : '#fafafa', p: 3 }}>
                {renderContent()}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: 'white', borderTop: '1px solid #e0e0e0', justifyContent: 'flex-end' }}>
                {renderActions()}
            </DialogActions>
        </Dialog>
    );
};

export default EyeTestModal;
