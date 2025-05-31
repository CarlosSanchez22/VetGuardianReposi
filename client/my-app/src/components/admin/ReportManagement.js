import React, { useState, useEffect } from 'react';
import { 
    fetchAllLossReportsAdmin, 
    updateLossReportStatusAdmin,
    fetchAllComplaintReportsAdmin, 
    updateComplaintReportStatusAdmin
} from '../../api/admin.api'; 
import { FaSave } from 'react-icons/fa'; 
import './ReportManagement.css'; // <-- IMPORTA EL ARCHIVO CSS CREADO

const ReportManagement = () => {
    const [lossReports, setLossReports] = useState([]);
    const [complaintReports, setComplaintReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeReportType, setActiveReportType] = useState('loss'); // 'loss' o 'complaint'

    useEffect(() => {
        loadReports();
    }, [activeReportType]); // Recargar reportes cuando cambia el tipo activo

    const loadReports = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeReportType === 'loss') {
                const data = await fetchAllLossReportsAdmin();
                setLossReports(data);
            } else { // activeReportType === 'complaint'
                const data = await fetchAllComplaintReportsAdmin();
                setComplaintReports(data);
            }
        } catch (err) {
            setError("Error al cargar reportes: " + (err.response?.data?.message || err.message));
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (reportId, newStatus, reportType) => {
        if (reportType === 'loss') {
            setLossReports(prevReports => 
                prevReports.map(report => 
                    report.id_reporte === reportId ? { ...report, status: newStatus } : report
                )
            );
        } else { // complaint
            setComplaintReports(prevReports => 
                prevReports.map(report => 
                    report.id_reporte === reportId ? { ...report, status: newStatus } : report
                )
            );
        }
    };

    const handleSaveStatus = async (reportId, currentStatus, reportType) => {
        setError(null);
        try {
            if (reportType === 'loss') {
                await updateLossReportStatusAdmin(reportId, currentStatus);
                alert("Estado de reporte de pérdida actualizado con éxito!");
            } else { // complaint
                await updateComplaintReportStatusAdmin(reportId, currentStatus);
                alert("Estado de reporte de denuncia actualizado con éxito!");
            }
            loadReports(); // Recargar para asegurar la consistencia
        } catch (err) {
            setError("Error al actualizar estado: " + (err.response?.data?.message || err.message));
            console.error("Error saving report status:", err);
        }
    };

    const getStatusOptions = (reportType) => {
        if (reportType === 'loss') {
            return ['pendiente', 'encontrado', 'cerrado'];
        } else { // complaint
            return ['pendiente', 'investigando', 'resuelto'];
        }
    };

    if (loading) return <div className="status-message">Cargando reportes...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="report-management-container">
            <h2 className="report-management-title">Gestión de Reportes</h2>

            <div className="report-type-selector">
                <button 
                    onClick={() => setActiveReportType('loss')}
                    className={`report-type-button ${activeReportType === 'loss' ? 'active' : ''}`}
                >
                    Reportes de Pérdida
                </button>
                <button 
                    onClick={() => setActiveReportType('complaint')}
                    className={`report-type-button ${activeReportType === 'complaint' ? 'active' : ''}`}
                >
                    Reportes de Denuncia
                </button>
            </div>

            {activeReportType === 'loss' && (
                <div>
                    <h3 className="report-management-title text-xl font-semibold mb-4">Reportes de Pérdida</h3>
                    {lossReports.length > 0 ? (
                        <div className="table-responsive">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mascota</th>
                                        <th>Especie</th>
                                        <th>Fecha Pérdida</th>
                                        <th>Ubicación</th>
                                        <th>Reportante</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lossReports.map(report => (
                                        <tr key={report.id_reporte}>
                                            <td>{report.id_reporte}</td>
                                            <td>{report.nombre_mascota}</td>
                                            <td>{report.especie_mascota}</td>
                                            <td>{report.fecha_perdida}</td>
                                            <td>{report.ubicacion_perdida}</td>
                                            <td>{report.usuario_nombre} {report.usuario_apellidos}</td>
                                            <td>
                                                <select 
                                                    value={report.status} 
                                                    onChange={(e) => handleStatusChange(report.id_reporte, e.target.value, 'loss')}
                                                    className={`status-select ${report.status}`}
                                                >
                                                    {getStatusOptions('loss').map(option => (
                                                        <option key={option} value={option}>
                                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleSaveStatus(report.id_reporte, report.status, 'loss')}
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
                        <p className="no-reports-message">No hay reportes de pérdida.</p>
                    )}
                </div>
            )}

            {activeReportType === 'complaint' && (
                <div>
                    <h3 className="report-management-title text-xl font-semibold mb-4">Reportes de Denuncia</h3>
                    {complaintReports.length > 0 ? (
                        <div className="table-responsive">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Especie</th>
                                        <th>Fecha Reporte</th>
                                        <th>Dirección</th>
                                        <th>Reportante</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaintReports.map(report => (
                                        <tr key={report.id_reporte}>
                                            <td>{report.id_reporte}</td>
                                            <td>{report.especie_animal}</td>
                                            <td>{report.fecha_reporte}</td>
                                            <td>{report.direccion}</td>
                                            <td>{report.usuario_nombre} {report.usuario_apellidos}</td>
                                            <td>
                                                <select 
                                                    value={report.status} 
                                                    onChange={(e) => handleStatusChange(report.id_reporte, e.target.value, 'complaint')}
                                                    className={`status-select ${report.status}`}
                                                >
                                                    {getStatusOptions('complaint').map(option => (
                                                        <option key={option} value={option}>
                                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleSaveStatus(report.id_reporte, report.status, 'complaint')}
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
                        <p className="no-reports-message">No hay reportes de denuncia.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
