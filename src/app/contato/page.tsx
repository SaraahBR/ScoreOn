"use client";

import { Box, Typography, Paper, TextField, Button, Stack } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';
import styles from "./FaleConosco.module.css";

export default function ContatoPage() {
    // Coordenadas do endereço fornecido
    const mapCenter = useMemo(() => ({ lat: -23.004166, lng: -51.20138 }), []);
    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '220px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        marginTop: 12,
        marginBottom: 8,
    }), []);
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    return (
        <Box sx={{ mt: { xs: 4, md: 8 }, mb: 8, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Lateral: Endereço, contatos e mapa */}
                <Box sx={{ minWidth: 260, maxWidth: 320, flex: '0 0 260px', bgcolor: '#f9fafb', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', mb: { xs: 2, md: 0 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>Contato</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <RoomIcon color="action" />
                        <Typography variant="body2">
                            Calle de la Paz, 42<br />
                            Ciutat Vella, Valencia, Espanha
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon color="action" />
                        <Typography variant="body2">GirlsOfCode@gmail.com</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon color="action" />
                        <Typography variant="body2">+34 612 345 678</Typography>
                    </Stack>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5, fontWeight: 600 }}>Nos Encontre Aqui:</Typography>
                    <div style={mapContainerStyle}>
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '10px' }}
                                center={mapCenter}
                                zoom={16}
                                options={{
                                    disableDefaultUI: true,
                                    zoomControl: true,
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                }}
                            >
                                <Marker position={mapCenter} />
                            </GoogleMap>
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 10 }}>
                                Carregando mapa...
                            </div>
                        )}
                    </div>
                </Box>
                {/* Formulário */}
                <Box sx={{ flex: 1, minWidth: 260 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Fale conosco</Typography>
                    <form className={styles.formulario}>
                        <Stack spacing={2}>
                            <TextField label="Nome" name="nome" required fullWidth />
                            <TextField label="E-mail" name="email" type="email" required fullWidth />
                            <TextField label="Mensagem" name="mensagem" required fullWidth multiline minRows={4} />
                            <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-end', minWidth: 140 }}>
                                Enviar
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
}
