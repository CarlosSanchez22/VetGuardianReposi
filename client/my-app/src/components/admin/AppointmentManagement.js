import React, { useState, useEffect } from 'react';
import { 
    fetchAllCitasAdmin, 
    updateCitaStatusAdmin 
} from '../../api/admin.api'; 
import { FaSave } from 'react-icons/fa'; 
import './AppointmentManagement.css'; // <-- IMPORTA EL ARCHIVO CSS CREADO

const AppointmentManagement = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCitas();
    }, []);

    const loadCitas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllCitasAdmin();
            setCitas(data);
        } catch (err) {
            setError("Error al cargar citas: " + (err.response?.data?.message || err.message));
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (citaId, newStatus) => {
        setCitas(prevCitas => 
            prevCitas.map(cita => 
                cita.id_cita === citaId ? { ...cita, estado_cita: newStatus } : cita
            )
        );
    };

    const handleSaveStatus = async (citaId, currentStatus) => {
        setError(null);
        try {
            await updateCitaStatusAdmin(citaId, currentStatus);
            alert("Estado de cita actualizado con éxito!");
            loadCitas(); // Recargar para asegurar la consistencia
        } catch (err) {
            setError("Error al actualizar estado de cita: " + (err.response?.data?.message || err.message));
            console.error("Error saving appointment status:", err);
        }
    };

    const getStatusOptions = () => {
        return ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
    };

    if (loading) return <div className="status-message">Cargando citas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="appointment-management-container">
            <h2 className="appointment-management-title">Gestión de Citas</h2>

            {citas.length > 0 ? (
                <div className="table-responsive">
                    <table className="appointment-table">
                        <thead>
                            <tr>
                                <th>ID Cita</th>
                                <th>Mascota</th>
                                <th>Dueño</th>
                                <th>Veterinario</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map(cita => (
                                <tr key={cita.id_cita}>
                                    <td>{cita.id_cita}</td>
                                    <td>{cita.mascota_nombre} ({cita.mascota_especie})</td>
                                    <td>{cita.usuario_nombre} {cita.usuario_apellidos}</td>
                                    <td>Dr. {cita.veterinario_nombre} ({cita.veterinario_especialidad})</td>
                                    <td>{cita.tipo_tratamiento}</td>
                                    <td>{cita.fecha_cita}</td>
                                    <td>{cita.hora_cita}</td>
                                    <td>
                                        <select 
                                            value={cita.estado_cita} 
                                            onChange={(e) => handleStatusChange(cita.id_cita, e.target.value)}
                                            className={`status-select ${cita.estado_cita}`}
                                        >
                                            {getStatusOptions().map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleSaveStatus(cita.id_cita, cita.estado_cita)}
                                            className="action-btn save-btn"
                                            title="Guardar Estado"
                                        >
                                            <FaSave />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-appointments-message">No hay citas registradas.</p>
            )}
        </div>
    );
};

export default AppointmentManagement;