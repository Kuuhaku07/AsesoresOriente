import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import EnhancedStatsChart from '../components/EnhancedStatsChart';
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
        // Fallback to basic stats if enhanced fails
        const fallbackResponse = await fetch('/api/inmueble/dashboard/stats');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setStats(fallbackData);
        }
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
        <div className="p-4 bg-background rounded-md shadow-md h-full">
          <h4 className="text-center mb-4 text-text">Resumen Ejecutivo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-2 rounded-sm bg-green-100">
              <div className="text-4xl font-bold text-green-500">{stats.totalProperties}</div>
              <div className="text-text-light">Total Propiedades</div>
            </div>
            <div className="text-center p-2 rounded-sm bg-blue-100">
              <div className="text-4xl font-bold text-blue-500">
                {formatCurrency(stats.financialOverview?.total_potential_revenue || 0)}
              </div>
              <div className="text-text-light">Ingresos Potenciales</div>
            </div>
            <div className="text-center p-2 rounded-sm bg-orange-100">
              <div className="text-4xl font-bold text-orange-500">
                {formatCurrency(stats.financialOverview?.avg_price || 0)}
              </div>
              <div className="text-text-light">Precio Promedio</div>
            </div>
            <div className="text-center p-2 rounded-sm bg-purple-100">
              <div className="text-4xl font-bold text-purple-500">
                {stats.propertiesByStatus?.find(s => s.status === 'DISPONIBLE')?.count || 0}
              </div>
              <div className="text-text-light">Propiedades Activas</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          
          {/* Properties by Type */}
          {stats.propertiesByType && stats.propertiesByType.length > 0 && (
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
          )}

          {/* Properties by Status */}
          {stats.propertiesByStatus && stats.propertiesByStatus.length > 0 && (
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
          )}

          {/* Monthly Trends */}
          {stats.propertiesByMonth && stats.propertiesByMonth.length > 0 && (
            <EnhancedStatsChart
              type="line"
              data={{
                labels: stats.propertiesByMonth.map(item => {
                  const date = new Date(item.month + '-01');
                  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                }),
                datasets: [{
                  label: 'Propiedades Registradas',
                  data: stats.propertiesByMonth.map(item => item.count),
                  borderColor: '#4BC0C0',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.4,
                  fill: true
                }]
              }}
              title="Tendencia Mensual"
              height={300}
            />
          )}

          {/* Price Distribution */}
          {stats.priceDistribution && stats.priceDistribution.length > 0 && (
            <EnhancedStatsChart
              type="bar"
              data={{
                labels: stats.priceDistribution.map(item => item.price_range),
                datasets: [{
                  label: 'Cantidad',
                  data: stats.priceDistribution.map(item => item.count),
                  backgroundColor: 'rgba(153, 102, 255, 0.8)',
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 1
                }]
              }}
              title="Distribución de Precios"
              height={300}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <MangoTemplate>
      <div className="p-6">
        {/* User information section */}
        <section className="flex items-center gap-6 mb-12">
          {user.pfp ? (
            <img
              src={`uploads/profile_pictures/${user.pfp}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
              onClick={openImageViewer}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">{user.name.charAt(0)}</div>
          )}
          <h2>Bienvenido, {user.name}</h2>
        </section>

        {/* Tab Navigation */}
        <section className="bg-background-2 rounded-lg p-6 min-h-[200px] mb-12">
          <div className="mb-6">
            <div className="flex gap-2 border-b border-gray-300 mb-4 overflow-x-auto">
              {[
                { key: 'overview', label: 'Resumen' },
                { key: 'financial', label: 'Finanzas' },
                { key: 'performance', label: 'Desempeño' },
                { key: 'geographic', label: 'Geografía' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 border-none cursor-pointer rounded-t-sm font-normal whitespace-nowrap min-w-fit transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-white font-bold'
                      : 'bg-transparent text-text'
                  }`}
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
        <section className="mt-10 pt-8 border-t border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3>Mis Inmuebles</h3>
            <button
              className="mt-4 px-6 py-2 bg-primary text-white border-none rounded-sm text-base font-bold cursor-pointer transition-colors duration-300 hover:bg-primary-hover"
              onClick={() => navigate('/nuevo')}
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
