import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import StatsChart from '../components/StatsChart';
import '../styles/Dashboard.css';
import ImageViewerModal from '../components/ImageViewerModal';
import PropertiesGrid from '../components/PropertiesGrid';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch('/api/inmueble/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user || !user.id) {
        setProperties([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/inmueble/asesor/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  if (user === null) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <MangoTemplate>
      <div className="dashboard-content">
        {/* User information section */}
        <section className="user-info">
          {user.pfp ? (
            <img
              src={`uploads/profile_pictures/${user.pfp}`}
              alt={user.name}
              className="user-avatar"
              onClick={openImageViewer}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div className="user-avatar-fallback">{user.name.charAt(0)}</div>
          )
          }
          <h2>Bienvenido, {user.name}</h2>
        </section>


        {/* Dashboard widgets section */}
        <section className="dashboard-widgets">
          <h3>Estadísticas y Gráficos</h3>
          {statsLoading ? (
            <p>Cargando estadísticas...</p>
          ) : stats ? (
            <>
              {/* Quick Summary */}
              <div className="chart-container">
                <h4 className="chart-title">Resumen Rápido</h4>
                <div className="quick-summary">
                  <div className="summary-card" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                    <div className="summary-value" style={{ color: '#4CAF50' }}>{stats.totalProperties}</div>
                    <div className="summary-label">Total Propiedades</div>
                  </div>
                  <div className="summary-card" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                    <div className="summary-value" style={{ color: '#2196F3' }}>
                      {stats.propertiesByType.length > 0 ? stats.propertiesByType[0].count : '0'}
                    </div>
                    <div className="summary-label">
                      {stats.propertiesByType.length > 0 ? stats.propertiesByType[0].type : 'Tipo Principal'}
                    </div>
                  </div>
                  <div className="summary-card" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                    <div className="summary-value" style={{ color: '#FF9800' }}>
                      {stats.propertiesByStatus.length > 0 ? stats.propertiesByStatus[0].count : '0'}
                    </div>
                    <div className="summary-label">
                      {stats.propertiesByStatus.length > 0 ? stats.propertiesByStatus[0].status : 'Estado Principal'}
                    </div>
                  </div>
                  <div className="summary-card" style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)' }}>
                    <div className="summary-value" style={{ color: '#9C27B0' }}>
                      {stats.propertiesByAgent.length > 0 ? stats.propertiesByAgent[0].count : '0'}
                    </div>
                    <div className="summary-label">
                      {stats.propertiesByAgent.length > 0 ? `Agente: ${stats.propertiesByAgent[0].agent.split(' ')[0]}` : 'Top Agente'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Charts section - 2x2 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)' }}>
                <div className="chart-container">
                  <StatsChart 
                    type="bar" 
                    data={{
                      labels: stats.propertiesByType.map(item => item.type),
                      datasets: [{
                        label: 'Cantidad de Propiedades',
                        data: stats.propertiesByType.map(item => item.count),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)'
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Propiedades por Tipo'
                        }
                      }
                    }}
                    title="Propiedades por Tipo"
                  />
                </div>
                
                <div className="chart-container">
                  <StatsChart 
                    type="pie" 
                    data={{
                      labels: stats.propertiesByStatus.map(item => item.status),
                      datasets: [{
                        label: 'Cantidad de Propiedades',
                        data: stats.propertiesByStatus.map(item => item.count),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)',
                        ],
                        borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Propiedades por Estado'
                        }
                      }
                    }}
                    title="Propiedades por Estado"
                  />
                </div>
                
                <div className="chart-container">
                  {stats.propertiesOverTime.length > 0 && (
                    <StatsChart 
                      type="line" 
                      data={{
                        labels: stats.propertiesOverTime.map(item => item.month),
                        datasets: [{
                          label: 'Propiedades Registradas',
                          data: stats.propertiesOverTime.map(item => item.count),
                          fill: false,
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          tension: 0.1,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Propiedades Registradas por Mes'
                          }
                        }
                      }}
                      title="Propiedades Registradas por Mes"
                    />
                  )}
                </div>
                
                <div className="chart-container">
                  {stats.propertiesByBusinessType.length > 0 && (
                    <StatsChart 
                      type="bar" 
                      data={{
                        labels: stats.propertiesByBusinessType.map(item => item.businessType),
                        datasets: [{
                          label: 'Cantidad de Propiedades',
                          data: stats.propertiesByBusinessType.map(item => item.count),
                          backgroundColor: 'rgba(255, 159, 64, 0.6)',
                          borderColor: 'rgba(255, 159, 64, 1)',
                          borderWidth: 1,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Propiedades por Tipo de Negocio'
                          }
                        }
                      }}
                      title="Propiedades por Tipo de Negocio"
                    />
                  )}
                </div>
              </div>
              
              {/* Additional charts row */}
              {stats.avgPriceByType.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <div className="chart-container">
                    <StatsChart 
                      type="bar" 
                      data={{
                        labels: stats.avgPriceByType.map(item => item.type),
                        datasets: [{
                          label: 'Precio Promedio (USD)',
                          data: stats.avgPriceByType.map(item => item.avgPrice),
                          backgroundColor: 'rgba(153, 102, 255, 0.6)',
                          borderColor: 'rgba(153, 102, 255, 1)',
                          borderWidth: 1,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Precio Promedio por Tipo de Propiedad'
                          }
                        }
                      }}
                      title="Precio Promedio por Tipo de Propiedad"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>No se pudieron cargar las estadísticas</p>
          )}
        </section>
        
        {/* User properties section */}
        <section className="user-properties">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h3>Mis Inmuebles</h3>
            <button 
              className="edit-profile-btn" 
              onClick={() => navigate('/nuevo')}
              style={{ margin: 0 }}
            >
              Crear Inmueble
            </button>
          </div>
          {loading ? (
            <p>Cargando propiedades...</p>
          ) : properties.length === 0 ? (
            <p>No tienes propiedades asignadas.</p>
          ) : (
            <PropertiesGrid properties={properties} />
          )}
        </section>
      </div>
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        imageSrc={user && user.pfp ? `uploads/profile_pictures/${user.pfp}` : ''}
        altText={user ? user.name : 'Imagen de perfil'}
      />
    </MangoTemplate>
  );
};

export default Dashboard;
