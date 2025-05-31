import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserSession } from '../../functions/userSession.js'; 
import { FaUsers, FaPaw, FaClipboardList, FaCalendarAlt, FaSignOutAlt, FaChartBar } from 'react-icons/fa';


// Importar los componentes de gestión
import UserManagement from '../admin/userManagment.js'; 
import PetManagement from '../admin/PetManagement.js'; 
import ReportManagement from '../admin/ReportManagement.js'; 
import AppointmentManagement from '../admin/AppointmentManagement.js'; // <-- NUEVA IMPORTACIÓN

// Importa el archivo CSS para esta página
import '../admin/AdminDashboardPage.css'; 

// Componentes placeholder para las otras secciones (ya no necesitamos uno para citas)


const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const user = getUserSession(); 
    const [activeSection, setActiveSection] = useState('dashboard'); 

    useEffect(() => {
        if (user === null || user.role !== 'admin') {
            navigate('/login'); 
            return;
        }
    }, [user, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userSessionData');
        navigate('/login');
    };

    if (user === null || user.role !== 'admin') {
        return null; 
    }

    return (
        <div className="admin-dashboard-page"> 
            
            <div className="dashboard-content-area"> 
                {/* Sidebar de Navegación */}
                <aside className="admin-sidebar"> 
                    <div className="sidebar-title"> 
                        Admin Panel
                    </div>
                    <nav className="sidebar-nav"> 
                        <ul>
                            <li> 
                                <button 
                                    onClick={() => setActiveSection('dashboard')}
                                    className={`sidebar-button ${activeSection === 'dashboard' ? 'active' : ''}`}
                                >
                                    <FaChartBar className="icon" /> Dashboard
                                </button>
                            </li>
                            <li> 
                                <button 
                                    onClick={() => setActiveSection('users')}
                                    className={`sidebar-button ${activeSection === 'users' ? 'active' : ''}`}
                                >
                                    <FaUsers className="icon" /> Gestión de Usuarios
                                </button>
                            </li>
                            <li> 
                                <button 
                                    onClick={() => setActiveSection('pets')}
                                    className={`sidebar-button ${activeSection === 'pets' ? 'active' : ''}`}
                                >
                                    <FaPaw className="icon" /> Gestión de Mascotas
                                </button>
                            </li>
                            <li> 
                                <button 
                                    onClick={() => setActiveSection('reports')}
                                    className={`sidebar-button ${activeSection === 'reports' ? 'active' : ''}`}
                                >
                                    <FaClipboardList className="icon" /> Gestión de Reportes
                                </button>
                            </li>
                            <li> 
                                <button 
                                    onClick={() => setActiveSection('appointments')}
                                    className={`sidebar-button ${activeSection === 'appointments' ? 'active' : ''}`}
                                >
                                    <FaCalendarAlt className="icon" /> Gestión de Citas
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div className="sidebar-logout-section"> 
                        <button 
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            <FaSignOutAlt className="icon" /> Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Contenido Principal */}
                <main className="admin-main-content"> 
                    <div className="content-card"> 
                        {activeSection === 'dashboard' && (
                            <div>
                                <h2 className="dashboard-title">Dashboard Administrativo</h2> 
                                <p className="dashboard-paragraph">Bienvenido al panel de administración de VetGuardian. Aquí puedes gestionar usuarios, mascotas, reportes y citas.</p> 
                            </div>
                        )}
                        {activeSection === 'users' && <UserManagement />} 
                        {activeSection === 'pets' && <PetManagement />} 
                        {activeSection === 'reports' && <ReportManagement />} 
                        {activeSection === 'appointments' && <AppointmentManagement />} {/* <-- RENDERIZAR COMPONENTE DE GESTIÓN DE CITAS */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
