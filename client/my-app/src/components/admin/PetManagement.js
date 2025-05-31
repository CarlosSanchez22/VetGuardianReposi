import React, { useState, useEffect } from 'react';
import { 
    fetchAllMascotasAdmin, 
    createMascotaAdmin, 
    updateMascotaAdmin, 
    deleteMascotaAdmin 
} from '../../api/admin.api'; 
import { FaEdit, FaTrash, FaPlus, FaTimes, FaPaw } from 'react-icons/fa'; 
import './PetManagement.css'; // <-- IMPORTA EL ARCHIVO CSS CREADO

const PetManagement = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [currentMascota, setCurrentMascota] = useState(null); 

    // Estado para el formulario del modal (crear/editar)
    const [formValues, setFormValues] = useState({
        nombre: '',
        edad: '',
        especie: '',
        raza: '',
        esta_esterilizado: 'si', // Default
        esta_vacunado: 'si',     // Default
        descripcion: '',
        peso: '',
        nombre_usuario: '', // Nombre del usuario si ya está adoptada o asociada
        id_carnet_medico: '',
        is_adopted: 0 // Default 0 (false)
    });

    useEffect(() => {
        loadMascotas();
    }, []);

    const loadMascotas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllMascotasAdmin();
            setMascotas(data);
        } catch (err) {
            setError("Error al cargar mascotas: " + (err.response?.data?.message || err.message));
            console.error("Error fetching pets:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentMascota(null);
        setFormValues({
            nombre: '',
            edad: '',
            especie: '',
            raza: '',
            esta_esterilizado: 'si',
            esta_vacunado: 'si',
            descripcion: '',
            peso: '',
            nombre_usuario: '',
            id_carnet_medico: '',
            is_adopted: 0
        });
        setShowModal(true);
    };

    const handleEditClick = (mascota) => {
        setIsEditing(true);
        setCurrentMascota(mascota);
        setFormValues({
            nombre: mascota.nombre,
            edad: mascota.edad,
            especie: mascota.especie,
            raza: mascota.raza,
            esta_esterilizado: mascota.esta_esterilizado,
            esta_vacunado: mascota.esta_vacunado,
            descripcion: mascota.descripcion || '',
            peso: mascota.peso || '',
            nombre_usuario: mascota.nombre_usuario || '',
            id_carnet_medico: mascota.id_carnet_medico || '',
            is_adopted: mascota.is_adopted
        });
        setShowModal(true);
    };

    const handleSaveMascota = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await updateMascotaAdmin(currentMascota.id_mascota, formValues);
                alert("Mascota actualizada con éxito!");
            } else {
                await createMascotaAdmin(formValues);
                alert("Mascota creada con éxito!");
            }
            setShowModal(false);
            loadMascotas(); // Recargar la lista de mascotas
        } catch (err) {
            setError("Error al guardar mascota: " + (err.response?.data?.message || err.message));
            console.error("Error saving pet:", err);
        }
    };

    const handleDeleteMascota = async (id_mascota) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota? Esto eliminará también sus adopciones y citas relacionadas.")) {
            setError(null);
            try {
                await deleteMascotaAdmin(id_mascota);
                alert("Mascota eliminada con éxito!");
                loadMascotas(); // Recargar la lista de mascotas
            } catch (err) {
                setError("Error al eliminar mascota: " + (err.response?.data?.message || err.message));
                console.error("Error deleting pet:", err);
            }
        }
    };

    if (loading) return <div className="status-message">Cargando mascotas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="pet-management-container">
            <h2 className="pet-management-title">Gestión de Mascotas</h2>
            <button 
                onClick={handleCreateClick} 
                className="btn-create-pet"
            >
                <FaPlus className="icon" /> Crear Nueva Mascota
            </button>

            {/* Tabla de Mascotas */}
            <div className="table-responsive">
                <table className="pet-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Especie</th>
                            <th>Raza</th>
                            <th>Edad</th>
                            <th>Vacunado</th>
                            <th>Esterilizado</th>
                            <th>Adoptada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mascotas.map(mascota => (
                            <tr key={mascota.id_mascota}>
                                <td>{mascota.id_mascota}</td>
                                <td>
                                    {mascota.foto_mascota ? (
                                        <img src={`data:image/jpeg;base64,${mascota.foto_mascota}`} alt={mascota.nombre} className="pet-photo" />
                                    ) : (
                                        <div className="pet-photo-placeholder">
                                            <FaPaw />
                                        </div>
                                    )}
                                </td>
                                <td>{mascota.nombre}</td>
                                <td>{mascota.especie}</td>
                                <td>{mascota.raza}</td>
                                <td>{mascota.edad}</td>
                                <td className="capitalize-status">{mascota.esta_vacunado}</td>
                                <td className="capitalize-status">{mascota.esta_esterilizado}</td>
                                <td>{mascota.is_adopted ? 'Sí' : 'No'}</td>
                                <td className="table-actions">
                                    <button 
                                        onClick={() => handleEditClick(mascota)}
                                        className="action-btn edit-btn"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMascota(mascota.id_mascota)}
                                        className="action-btn delete-btn"
                                        title="Eliminar"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para Crear/Editar Mascota */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="modal-close-btn"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="modal-title">{isEditing ? 'Editar Mascota' : 'Crear Nueva Mascota'}</h2>
                        <form onSubmit={handleSaveMascota}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input type="text" name="nombre" value={formValues.nombre} onChange={(e) => setFormValues({...formValues, nombre: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Edad:</label>
                                    <input type="number" name="edad" value={formValues.edad} onChange={(e) => setFormValues({...formValues, edad: parseInt(e.target.value) || ''})} required />
                                </div>
                                <div className="form-group">
                                    <label>Especie:</label>
                                    <input type="text" name="especie" value={formValues.especie} onChange={(e) => setFormValues({...formValues, especie: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Raza:</label>
                                    <input type="text" name="raza" value={formValues.raza} onChange={(e) => setFormValues({...formValues, raza: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Esterilizado:</label>
                                    <select name="esta_esterilizado" value={formValues.esta_esterilizado} onChange={(e) => setFormValues({...formValues, esta_esterilizado: e.target.value})} required>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Vacunado:</label>
                                    <select name="esta_vacunado" value={formValues.esta_vacunado} onChange={(e) => setFormValues({...formValues, esta_vacunado: e.target.value})} required>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Peso (kg):</label>
                                    <input type="number" step="0.01" name="peso" value={formValues.peso} onChange={(e) => setFormValues({...formValues, peso: parseFloat(e.target.value) || ''})} />
                                </div>
                                <div className="form-group">
                                    <label>Adoptada:</label>
                                    <select name="is_adopted" value={formValues.is_adopted} onChange={(e) => setFormValues({...formValues, is_adopted: parseInt(e.target.value)})} required>
                                        <option value={0}>No</option>
                                        <option value={1}>Sí</option>
                                    </select>
                                </div>
                                <div className="form-group full-width"> {/* Ocupa todo el ancho en el grid */}
                                    <label>Descripción:</label>
                                    <textarea name="descripcion" value={formValues.descripcion} onChange={(e) => setFormValues({...formValues, descripcion: e.target.value})} rows="3"></textarea>
                                </div>
                                {/* Estos campos son opcionales y pueden ser problemáticos si no se manejan bien las FK o si 'nombre_usuario' no es un FK real */}
                                <div className="form-group">
                                    <label>Nombre de Usuario (si adoptada):</label>
                                    <input type="text" name="nombre_usuario" value={formValues.nombre_usuario} onChange={(e) => setFormValues({...formValues, nombre_usuario: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>ID Carnet Médico:</label>
                                    <input type="number" name="id_carnet_medico" value={formValues.id_carnet_medico} onChange={(e) => setFormValues({...formValues, id_carnet_medico: parseInt(e.target.value) || ''})} />
                                </div>
                            </div>
                            <div className="form-actions-bottom">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary">{isEditing ? 'Guardar Cambios' : 'Crear Mascota'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetManagement;
