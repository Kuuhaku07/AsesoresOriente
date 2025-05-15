import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu';
import HorizontalInfoCard from '../components/HorizontalInfoCard';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import '../styles/Asesores.css';
import '../styles/layout.css';

const Asesores = () => {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsesores = async () => {
      try {
        const response = await fetch('/api/asesor');
        if (!response.ok) {
          throw new Error('Error fetching asesores');
        }
        const data = await response.json();
        setAsesores(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsesores();
  }, []);

  const handleViewProfile = (userId) => {
    navigate(`/perfil/${userId}`);
  };

  if (loading) {
    return (
      <>
        <Menu />
        <div className="menu-offset asesores-layout">
          <PageTitle>Asesores</PageTitle>
          <div className="page-container asesores-content">
            <div className="asesores-page">

              <p>Cargando asesores...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="menu-offset asesores-layout">
        <PageTitle>Asesores</PageTitle>
        <div className="page-container asesores-content">
          <div className="asesores-page">
            
            {asesores.length === 0 ? (
              <p>No hay asesores disponibles.</p>
            ) : (
              <div className="asesores-list">
                {asesores.map((asesor) => (
                  <div key={asesor.id} className="asesor-card">
                    <HorizontalInfoCard
                      icon={
                        asesor.foto_perfil ? (
                          <img
                            src={`/uploads/profile_pictures/${asesor.foto_perfil}`}
                            alt={`${asesor.nombre} ${asesor.apellido}`}
                            className="asesor-avatar"
                          />
                        ) : null
                      }
                      title={`${asesor.nombre} ${asesor.apellido}`}
                      content={asesor.especialidad || 'Especialidad no especificada'}
                    />
                    <button
                      className="view-profile-btn"
                      onClick={() => handleViewProfile(asesor.user_id)}
                    >
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Asesores;
