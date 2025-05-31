import React, { useState, useEffect } from 'react';
import { 
    fetchAllUsers, 
    createUserAdmin, 
    updateUserAdmin, 
    deleteUserAdmin,
    fetchUserPetsAdmin,
    fetchUserReportsAdmin
} from '../../api/admin.api.js'; // Importa las funciones de la API de administración
import { FaEdit, FaTrash, FaPlus, FaEye, FaTimes, FaPaw } from 'react-icons/fa'; // Iconos para las acciones
import './UserManagement.css'; // <-- IMPORTA EL ARCHIVO CSS CREADO

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal de crear/editar
    const [isEditing, setIsEditing] = useState(false); // Si estamos editando o creando
    const [currentUser, setCurrentUser] = useState(null); // Usuario actual para editar/ver
    const [showDetailsModal, setShowDetailsModal] = useState(false); // Modal para ver detalles de usuario
    const [userDetails, setUserDetails] = useState({ pets: [], reports: { lossReports: [], complaintReports: [] } });
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Estado para el formulario del modal (crear/editar)
    const [formValues, setFormValues] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contraseña: '', // Solo para crear o cambiar contraseña
        telefono: '',
        cumpleaños: '',
        tiene_mascotas: '',
        role: 'user' // Por defecto 'user'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (err) {
            setError("Error al cargar usuarios: " + (err.response?.data?.message || err.message));
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentUser(null);
        setFormValues({
            nombre: '',
            apellidos: '',
            correo: '',
            contraseña: '',
            telefono: '',
            cumpleaños: '',
            tiene_mascotas: '',
            role: 'user'
        });
        setShowModal(true);
    };

    const handleEditClick = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setFormValues({
            nombre: user.nombre,
            apellidos: user.apellidos,
            correo: user.correo,
            contraseña: '', // La contraseña no se precarga por seguridad
            telefono: user.telefono,
            cumpleaños: user.cumpleaños ? user.cumpleaños.split('T')[0] : '', // Formato YYYY-MM-DD
            tiene_mascotas: user.tiene_mascotas,
            role: user.role
        });
        setShowModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await updateUserAdmin(currentUser.id_usuario, formValues);
                alert("Usuario actualizado con éxito!");
            } else {
                await createUserAdmin(formValues);
                alert("Usuario creado con éxito!");
            }
            setShowModal(false);
            loadUsers(); // Recargar la lista de usuarios
        } catch (err) {
            setError("Error al guardar usuario: " + (err.response?.data?.message || err.message));
            console.error("Error saving user:", err);
        }
    };

    const handleDeleteUser = async (id_usuario) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esto eliminará también sus adopciones y reportes.")) {
            setError(null);
            try {
                await deleteUserAdmin(id_usuario);
                alert("Usuario eliminado con éxito!");
                loadUsers(); // Recargar la lista de usuarios
            } catch (err) {
                setError("Error al eliminar usuario: " + (err.response?.data?.message || err.message));
                console.error("Error deleting user:", err);
            }
        }
    };

    const handleViewDetails = async (user) => {
        setCurrentUser(user);
        setDetailsLoading(true);
        setError(null);
        try {
            const pets = await fetchUserPetsAdmin(user.id_usuario);
            const reports = await fetchUserReportsAdmin(user.id_usuario);
            setUserDetails({ pets, reports });
            setShowDetailsModal(true);
        } catch (err) {
            setError("Error al cargar detalles del usuario: " + (err.response?.data?.message || err.message));
            console.error("Error fetching user details:", err);
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) return <div className="status-message">Cargando usuarios...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="user-management-container">
            <h2 className="user-management-title">Gestión de Usuarios</h2>
            <button 
                onClick={handleCreateClick} 
                className="btn-create-user"
            >
                <FaPlus className="icon" /> Crear Nuevo Usuario
            </button>

            {/* Tabla de Usuarios */}
            <div className="table-responsive">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id_usuario}>
                                <td>{user.id_usuario}</td>
                                <td>{user.nombre} {user.apellidos}</td>
                                <td>{user.correo}</td>
                                <td>{user.telefono}</td>
                                <td className="capitalize-role">{user.role}</td>
                                <td className="table-actions">
                                    <button 
                                        onClick={() => handleViewDetails(user)}
                                        className="action-btn view-btn"
                                        title="Ver Detalles"
                                    >
                                        <FaEye />
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="action-btn edit-btn"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id_usuario)}
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

            {/* Modal para Crear/Editar Usuario */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="modal-close-btn"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="modal-title">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <form onSubmit={handleSaveUser}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input 
                                        type="text" 
                                        name="nombre"
                                        value={formValues.nombre} 
                                        onChange={(e) => setFormValues({...formValues, nombre: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apellidos:</label>
                                    <input 
                                        type="text" 
                                        name="apellidos"
                                        value={formValues.apellidos} 
                                        onChange={(e) => setFormValues({...formValues, apellidos: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Correo:</label>
                                    <input 
                                        type="email" 
                                        name="correo"
                                        value={formValues.correo} 
                                        onChange={(e) => setFormValues({...formValues, correo: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña (dejar vacío para no cambiar):</label>
                                    <input 
                                        type="password" 
                                        name="contraseña"
                                        value={formValues.contraseña} 
                                        onChange={(e) => setFormValues({...formValues, contraseña: e.target.value})}
                                        required={!isEditing} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Teléfono:</label>
                                    <input 
                                        type="text" 
                                        name="telefono"
                                        value={formValues.telefono} 
                                        onChange={(e) => setFormValues({...formValues, telefono: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cumpleaños:</label>
                                    <input 
                                        type="date" 
                                        name="cumpleaños"
                                        value={formValues.cumpleaños} 
                                        onChange={(e) => setFormValues({...formValues, cumpleaños: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tiene Mascotas:</label>
                                    <select 
                                        name="tiene_mascotas"
                                        value={formValues.tiene_mascotas} 
                                        onChange={(e) => setFormValues({...formValues, tiene_mascotas: e.target.value})}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Rol:</label>
                                    <select 
                                        name="role"
                                        value={formValues.role} 
                                        onChange={(e) => setFormValues({...formValues, role: e.target.value})}
                                        required
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions-bottom">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Detalles de Usuario */}
            {showDetailsModal && currentUser && (
                <div className="modal-overlay">
                    <div className="details-modal-content">
                        <button 
                            onClick={() => setShowDetailsModal(false)}
                            className="modal-close-btn"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="details-title">Detalles del Usuario: {currentUser.nombre} {currentUser.apellidos}</h2>
                        {detailsLoading ? (
                            <div className="details-loading-message">Cargando detalles...</div>
                        ) : (
                            <div>
                                <h3 className="details-subtitle">Mascotas Adoptadas:</h3>
                                {userDetails.pets.length > 0 ? (
                                    <div className="details-pet-grid">
                                        {userDetails.pets.map(pet => (
                                            <div key={pet.id_mascota} className="details-pet-card">
                                                {pet.foto_mascota ? (
                                                    <img src={`data:image/jpeg;base64,${pet.foto_mascota}`} alt={pet.nombre} className="details-pet-img" />
                                                ) : (
                                                    <div className="details-pet-placeholder-img">
                                                        <FaPaw />
                                                    </div>
                                                )}
                                                <div className="details-pet-info">
                                                    <p className="font-bold">{pet.nombre} ({pet.especie})</p>
                                                    <p className="text-sm">Raza: {pet.raza}, Edad: {pet.edad}</p>
                                                    <p className="text-sm">Vacunado: {pet.esta_vacunado}, Esterilizado: {pet.esta_esterilizado}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="details-no-content-message">Este usuario no ha adoptado mascotas.</p>
                                )}

                                <h3 className="details-subtitle">Reportes de Denuncia:</h3>
                                {userDetails.reports.complaintReports.length > 0 ? (
                                    <ul className="report-list">
                                        {userDetails.reports.complaintReports.map(report => (
                                            <li key={report.id_reporte}>
                                                <span className="font-bold">ID Reporte: {report.id_reporte}</span> - Especie: {report.especie_animal} - Fecha: {report.fecha_reporte} - Estado: {report.status}
                                                <p className="text-sm">Descripción: {report.descripcion_hechos}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="details-no-content-message">Este usuario no tiene reportes de denuncia.</p>
                                )}

                                <h3 className="details-subtitle">Reportes de Pérdida:</h3>
                                {userDetails.reports.lossReports.length > 0 ? (
                                    <ul className="report-list">
                                        {userDetails.reports.lossReports.map(report => (
                                            <li key={report.id_reporte}>
                                                <span className="font-bold">ID Reporte: {report.id_reporte}</span> - Mascota: {report.nombre_mascota} ({report.especie_mascota}) - Fecha Perdida: {report.fecha_perdida} - Estado: {report.status}
                                                <p className="text-sm">Ubicación: {report.ubicacion_perdida}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="details-no-content-message">Este usuario no tiene reportes de pérdida.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
