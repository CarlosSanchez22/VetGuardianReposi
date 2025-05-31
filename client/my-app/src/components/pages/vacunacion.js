// src/pages/VacunacionPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar.js';
import Footer from '../footer.js';
import { getUserSession } from '../../functions/userSession.js'; 
import { FaSyringe, FaCut, FaCalendarAlt, FaUserMd, FaPaw } from 'react-icons/fa';
import { fetchMascotasPendientes, fetchVeterinarios, agendarCita } from '../../api/vacunacion.api.js';
import '../../styles/VacunacionPage.css'; 

const VacunacionPage = () => {
    const navigate = useNavigate();
    const sessionUser = getUserSession(); // Cambiado a sessionUser para evitar confusión con el 'user' en el useEffect

    const [mascotasPendientes, setMascotasPendientes] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [selectedMascota, setSelectedMascota] = useState(null);
    const [citaForm, setCitaForm] = useState({
        tipo_tratamiento: '',
        id_veterinario: '',
        fecha_cita: '',
        hora_cita: '',
        observaciones: ''
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Log para ver el objeto de usuario completo (o el ID si es lo que devuelve)
        console.log("Objeto/ID de usuario de la sesión (frontend):", sessionUser); 

        // Determinar el ID de usuario de forma robusta
        let currentUserId = null;
        if (sessionUser !== null) {
            if (typeof sessionUser === 'object' && sessionUser !== null && 'id_usuario' in sessionUser) {
                currentUserId = sessionUser.id_usuario;
            } else if (typeof sessionUser === 'number' || typeof sessionUser === 'string') {
                currentUserId = sessionUser; // Si getUserSession devuelve directamente el ID
            }
        }
        
        if (currentUserId === null) {
            console.error("Error: No se pudo obtener un ID de usuario válido. Redirigiendo a login.");
            navigate('/login');
            return;
        }
        
        console.log("ID de usuario actual (frontend, después de parsear):", currentUserId); 

        const loadData = async () => {
            try {
                const pets = await fetchMascotasPendientes(currentUserId);
                console.log("Mascotas pendientes recibidas del backend:", pets); 
                setMascotasPendientes(pets);

                const vets = await fetchVeterinarios();
                setVeterinarios(vets);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setMessage("Error al cargar los datos. Inténtalo de nuevo más tarde.");
                setIsSuccess(false);
            }
        };
        loadData();
    }, [sessionUser, navigate]); // La dependencia es 'sessionUser'

    const handleMascotaSelect = (mascota) => {
        setSelectedMascota(mascota);
        setMessage(''); 
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCitaForm({ ...citaForm, [name]: value });
    };

    const handleSubmitCita = async (e) => {
        e.preventDefault();
        if (!selectedMascota) {
            setMessage("Por favor, selecciona una mascota.");
            setIsSuccess(false);
            return;
        }
        
        let userIdForCita = null;
        if (sessionUser !== null) {
            if (typeof sessionUser === 'object' && sessionUser !== null && 'id_usuario' in sessionUser) {
                userIdForCita = sessionUser.id_usuario;
            } else if (typeof sessionUser === 'number' || typeof sessionUser === 'string') {
                userIdForCita = sessionUser;
            }
        }

        if (!userIdForCita) {
             setMessage("Error: No se pudo obtener el ID del usuario para agendar la cita. Por favor, inicia sesión de nuevo.");
             setIsSuccess(false);
             return;
        }

        try {
            const dataToSend = {
                id_mascota: selectedMascota.id_mascota,
                id_usuario: userIdForCita, 
                ...citaForm
            };
            await agendarCita(dataToSend);
            setMessage("¡Cita agendada con éxito! Revisa el estado en tu perfil.");
            setIsSuccess(true);
            setSelectedMascota(null);
            setCitaForm({
                tipo_tratamiento: '',
                id_veterinario: '',
                fecha_cita: '',
                hora_cita: '',
                observaciones: ''
            });
            // Recargar mascotas pendientes después de agendar una cita
            const updatedPets = await fetchMascotasPendientes(userIdForCita); 
            setMascotasPendientes(updatedPets);

        } catch (error) {
            console.error("Error al agendar la cita:", error);
            setMessage("Error al agendar la cita. Por favor, verifica los datos.");
            setIsSuccess(false);
        }
    };

    return (
        <div className="vacunacion-page">
            <Navbar />
            <main className="vacunacion-container">
                <div className="vacunacion-header">
                    <FaPaw className="paw-icon" />
                    <h1>Agendar Cita de Tratamiento</h1>
                    <p className="subtitle">Ayuda a tus mascotas adoptadas a estar sanas y felices.</p>
                </div>

                {message && (
                    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <section className="mascotas-pendientes-section">
                    <h2>Mascotas que necesitan atención</h2>
                    {mascotasPendientes.length > 0 ? (
                        <div className="mascotas-list">
                            {mascotasPendientes.map(mascota => (
                                <div
                                    key={mascota.id_mascota}
                                    className={`mascota-item ${selectedMascota?.id_mascota === mascota.id_mascota ? 'selected' : ''}`}
                                    onClick={() => handleMascotaSelect(mascota)}
                                >
                                    {mascota.foto_mascota ? (
                                        <img src={`data:image/jpeg;base64,${mascota.foto_mascota}`} alt={mascota.nombre} className="mascota-thumb" />
                                    ) : (
                                        <div className="mascota-thumb-placeholder">
                                            <FaPaw />
                                        </div>
                                    )}
                                    <div className="mascota-info">
                                        <h3>{mascota.nombre}</h3>
                                        <p>{mascota.especie} - {mascota.raza}</p>
                                        <div className="treatment-status">
                                            {mascota.esta_vacunado === 'no' && (
                                                <span className="status-tag needs-vaccine"><FaSyringe /> Necesita Vacuna</span>
                                            )}
                                            {mascota.esta_esterilizado === 'no' && (
                                                <span className="status-tag needs-sterilization"><FaCut /> Necesita Esterilización</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-pets-message">Todas tus mascotas adoptadas están al día con vacunas y esterilización. ¡Gracias por cuidarlas!</p>
                    )}
                </section>

                {selectedMascota && (
                    <section className="agendar-cita-section">
                        <h2>Agendar cita para {selectedMascota.nombre}</h2>
                        <form onSubmit={handleSubmitCita} className="cita-form">
                            <div className="form-group">
                                <label htmlFor="tipo_tratamiento"><FaSyringe /> Tipo de Tratamiento</label>
                                <select
                                    id="tipo_tratamiento"
                                    name="tipo_tratamiento"
                                    value={citaForm.tipo_tratamiento}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Vacunación">Vacunación</option>
                                    <option value="Esterilización">Esterilización</option>
                                    <option value="Desparasitación">Desparasitación</option>
                                    <option value="Consulta General">Consulta General</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="id_veterinario"><FaUserMd /> Veterinario</label>
                                <select
                                    id="id_veterinario"
                                    name="id_veterinario"
                                    value={citaForm.id_veterinario}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Selecciona un veterinario</option>
                                    {veterinarios.map(vet => (
                                        <option key={vet.id_veterinario} value={vet.id_veterinario}>
                                            {vet.nombre} {vet.apellidos} ({vet.especialidad})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fecha_cita"><FaCalendarAlt /> Fecha de la Cita</label>
                                <input
                                    type="date"
                                    id="fecha_cita"
                                    name="fecha_cita"
                                    value={citaForm.fecha_cita}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora_cita"><FaCalendarAlt /> Hora de la Cita</label>
                                <input
                                    type="time"
                                    id="hora_cita"
                                    name="hora_cita"
                                    value={citaForm.hora_cita}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="observaciones">Observaciones (opcional)</label>
                                <textarea
                                    id="observaciones"
                                    name="observaciones"
                                    value={citaForm.observaciones}
                                    onChange={handleFormChange}
                                    rows="3"
                                    placeholder="Detalles adicionales para el veterinario..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">Agendar Cita</button>
                        </form>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default VacunacionPage;
