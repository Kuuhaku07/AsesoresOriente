import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import EnhancedStatsChart from '../components/EnhancedStatsChart';
import '../styles/Dashboard.css';
import ImageViewerModal from '../components/ImageViewerModal';
import PropertiesGrid from '../components/PropertiesGrid';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  useEffect(() => {
    const fetchEnhancedStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch('/api/inmueble/dashboard/enhanced-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch enhanced dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching enhanced dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchEnhancedStats();
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
    return null;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderOverviewTab = () => {
    if (!stats) return null;

    return (
      <>
        {/* Enhanced Quick Summary Cards */}
        <div className="chart-container">
          <h4 className="chart-title">Resumen Ejecutivo</h4>
          <div className="quick-summary" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="summary-card" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <div className="summary-value" style={{ color: '#4CAF50' }}>{stats.totalProperties}</div>
              <div className="summary-label">Total Propiedades</div>
            </div>
            <div className="summary-card" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
              <div className="summary-value" style={{ color: '#2196F3' }}>
                {formatCurrency(stats.financialOverview?.total_potential_revenue || 0)}
              </div>
              <div className="summary-label">Ingresos Potenciales</div>
            </div>
            <div className="summary-card" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
              <div className="summary-value" style={{ color: '#FF9800' }}>
                {formatCurrency(stats.financialOverview?.avg_price || 0)}
              </div>
              <div className="summary-label">Precio Promedio</div>
            </div>
            <div className="summary-card" style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)' }}>
              <div className="summary-value" style={{ color: '#9C27B0' }}>
                {Math.round(stats.financialOverview?.avg_price || 0)}
              </div>
              <div className="summary-label">Propiedades Activas</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)' }}>
          
          {/* Properties by Type */}
          <EnhancedStatsChart
            type="doughnut"
            data={{
              labels: stats.propertiesByType.map(item => item.type),
              datasets: [{
                data: stats.propertiesByType.map(item => item.count),
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                  '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            }}
            title="Distribución por Tipo"
            height={300}
          />

          {/* Properties by Status */}
          <EnhancedStatsChart
            type="pie"
            data={{
              labels: stats.propertiesByStatus.map(item => item.status),
              datasets: [{
                data: stats.propertiesByStatus.map(item => item.count),
                backgroundColor: stats.propertiesByStatus.map(item => item.color || '#ccc'),
                borderWidth: 2,
                borderColor: '#fff'
              }]
            }}
            title="Estado de Propiedades"
            height={300}
          />

          {/* Monthly Trends */}
          <EnhancedStatsChart
            type="line"
            data={{
              labels: stats.propertiesByMonth?.map(item => {
                const date = new Date(item.month + '-01');
                return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
              }) || [],
              datasets: [{
                label: 'Propiedades Registradas',
                data: stats.propertiesByMonth?.map(item => item.count) || [],
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
              }]
            }}
            title="Tendencia Mensual"
            height={300}
          />

          {/* Price Distribution */}
          <EnhancedStatsChart
            type="bar"
            data={{
              labels: stats.priceDistribution?.map(item => item.price_range) || [],
              datasets: [{
                label: 'Cantidad',
                data: stats.priceDistribution?.map(item => item.count) || [],
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }]
            }}
            title="Distribución de Precios"
            height={300}
          />
        </div>
      </>
    );
  };

  const renderFinancialTab = () => {
    if (!stats) return null;

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
          
          {/* Agent Revenue */}
          <EnhancedStatsChart
            type="bar"
            data={{
              labels: stats.agentRevenue?.slice(0, 5).map(item => item.agent.split(' ')[0]) || [],
              datasets: [{
                label: 'Ingresos Potenciales (USD)',
                data: stats.agentRevenue?.slice(0, 5).map(item => item.potential_revenue) || [],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }]
            }}
            title="Top 5 Agentes por Ingresos"
            height={350}
          />

          {/* Price by Location */}
          <EnhancedStatsChart
            type="scatter"
            data={{
              datasets: [{
                label: 'Precio vs Ubicación',
                data: stats.priceByLocation?.map(item => ({
                  x: item.count,
                  y: item.avg_price,
                  label: `${item.type} - ${item.estado}`
                })) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 8
              }]
            }}
            title="Precio vs Cantidad por Ubicación"
            height={350}
          />

          {/* Average Price by Type */}
          <EnhancedStatsChart
            type="radar"
            data={{
              labels: stats.propertiesByType.map(item => item.type),
              datasets: [{
                label: 'Precio Promedio',
                data: stats.propertiesByType.map(() => 
                  Math.round(stats.financialOverview?.avg_price || 0)
                ),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                pointBackgroundColor: 'rgba(255, 206, 86, 1)'
              }]
            }}
            title="Análisis de Precios por Tipo"
            height={350}
          />
        </div>
      </>
    );
  };

  const renderPerformanceTab = () => {
    if (!stats) return null;

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
          
          {/* Agent Performance */}
          <EnhancedStatsChart
            type="bar"
            data={{
              labels: stats.agentPerformance?.slice(0, 5).map(item => item.agent.split(' ')[0]) || [],
              datasets: [
                {
                  label: 'Total Propiedades',
                  data: stats.agentPerformance?.slice(0, 5).map(item => item.total_properties) || [],
                  backgroundColor: 'rgba(75, 192, 192, 0.8)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                },
                {
                  label: 'Propiedades Vendidas',
                  data: stats.agentPerformance?.slice(0, 5).map(item => item.sold_properties) || [],
                  backgroundColor: 'rgba(255, 99, 132, 0.8)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
                }
              ]
            }}
            title="Desempeño de Agentes"
            height={350}
          />

          {/* Days on Market */}
          <EnhancedStatsChart
            type="polarArea"
            data={{
              labels: stats.daysOnMarket?.map(item => item.status) || [],
              datasets: [{
                data: stats.daysOnMarket?.map(item => item.avg_days_on_market) || [],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)'
                ]
              }]
            }}
            title="Días en Mercado por Estado"
            height={350}
          />
        </div>
      </>
    );
  };

  const renderGeographicTab = () => {
    if (!stats) return null;

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
          
          {/* Properties by State */}
          <EnhancedStatsChart
            type="bar"
            data={{
              labels: stats.propertiesByState?.slice(0, 8).map(item => item.estado) || [],
              datasets: [{
                label: 'Cantidad',
                data: stats.propertiesByState?.slice(0, 8).map(item => item.count) || [],
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }]
            }}
            title="Propiedades por Estado"
            height={350}
          />

          {/* Properties by City */}
          <EnhancedStatsChart
            type="horizontalBar"
            data={{
              labels: stats.propertiesByCity?.slice(0, 8).map(item => item.ciudad) || [],
              datasets: [{
                label: 'Cantidad',
                data: stats.propertiesByCity?.slice(0, 8).map(item => item.count) || [],
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
              }]
            }}
            title="Top 8 Ciudades"
            height={350}
          />
        </div>
      </>
    );
  };

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
          )}
          <h2>Bienvenido, {user.name}</h2>
        </section>

        {/* Tab Navigation */}
        <section className="dashboard-widgets">
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-md)' }}>
              {[
                { key: 'overview', label: 'Resumen' },
                { key: 'financial', label: 'Finanzas' },
                { key: 'performance', label: 'Desempeño' },
                { key: 'geographic', label: 'Geografía' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: 'none',
                    backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.key ? 'white' : 'var(--color-text)',
                    cursor: 'pointer',
                    borderRadius: 'var(--border-radius-sm) var(--border-radius-sm) 0 0',
                    fontWeight: activeTab === tab.key ? 'bold' : 'normal'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {statsLoading ? (
            <p>Cargando estadísticas avanzadas...</p>
          ) : stats ? (
            <>
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'financial' && renderFinancialTab()}
              {activeTab === 'performance' && renderPerformanceTab()}
              {activeTab === 'geographic' && renderGeographicTab()}
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

export default EnhancedDashboard;
