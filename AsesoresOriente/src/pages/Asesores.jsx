
import React, { useState, useEffect } from 'react';
import HorizontalInfoCard from '../components/HorizontalInfoCard';
import { useNavigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import '../styles/Asesores.css';


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
      <MangoTemplate>
        <PageTitle>Asesores</PageTitle>
        <div className="asesores-page">
          <p>Cargando asesores...</p>
        </div>
      </MangoTemplate>
    );
  }

  return (
    <MangoTemplate>
      <PageTitle>Asesores</PageTitle>
      <div className="asesores-page">
        {asesores.length === 0 ? (
          <p>No hay asesores disponibles.</p>
        ) : (
          <div className="asesores-list">
            {asesores.map((asesor) => (
              <div 
                key={asesor.id} 
                className="asesor-card"
                role="button"
                tabIndex={0}
                onClick={() => handleViewProfile(asesor.user_id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleViewProfile(asesor.user_id);
                    e.preventDefault();
                  }
                }}
              >
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
                  fixedImageSize={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </MangoTemplate>
  );
};

export default Asesores;
