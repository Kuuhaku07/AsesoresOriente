import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import '../styles/Perfil.css';
import '../styles/layout.css';
import HorizontalInfoCard from '../components/HorizontalInfoCard';
import iconMap from '../utils/iconMap';
import SocialNetworksModal from '../components/SocialNetworksModal';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ImageViewerModal from '../components/ImageViewerModal';

// Import icons from react-icons
import { FaPhone, FaEnvelope } from 'react-icons/fa';

// Import the new relative time formatter
import { formatRelativeTime } from '../utils/timeUtils';

const Perfil = () => {
  const { user: loggedUser, token } = useAuth();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Image viewer modal state
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const fetchRedesAsesor = async () => {
    try {
      let response;
      if (id && loggedUser && id === String(loggedUser.id)) {
        response = await fetch('/api/redesasesor', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (id) {
        response = await fetch(`/api/redesasesor/user/${id}`);
      } else {
        response = await fetch('/api/redesasesor', {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (!response.ok) {
        throw new Error('Error al cargar las redes del asesor');
      }
      const redesData = await response.json();
      setUser((prevUser) => ({ ...prevUser, redes: redesData }));
    } catch (error) {
      // ignore redes fetch errors
    }
  };

  useEffect(() => {
    const fetchUserDataFunc = async () => {
      try {
        setLoading(true);
        let response;
        if (id && loggedUser && id === String(loggedUser.id)) {
          response = await fetch('/api/usuario/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (id) {
          response = await fetch(`/api/usuario/public-profile/${id}`);
        } else if (loggedUser && loggedUser.id) {
          response = await fetch('/api/usuario/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          setUser(null);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          setUser(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setUser(data);
        setLoading(false);
        // Fetch redes after user data is set
        await fetchRedesAsesor();
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUserDataFunc();
  }, [id, loggedUser, token]);

  if (loading) return null;
  if (!user) return <Navigate to="/" />;

  const isOwnProfile = loggedUser && user && loggedUser.id === user.id;

  // Handler to refresh user data and redes after updates
  const handleUserUpdate = async () => {
    if (!user) return;
    try {
      // Fetch user profile data
      const response = await fetch('/api/usuario/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();

      // Fetch redes data
      const redesResponse = await fetch('/api/redesasesor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      let redesData = [];
      if (redesResponse.ok) {
        redesData = await redesResponse.json();
      }

      // Merge redes into user data
      setUser({ ...data, redes: redesData });
    } catch {
      // ignore errors here
    }
  };

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  return (
    <MangoTemplate>
      <div>
        <div className="">
          <section className="profile-header">
            {user.Pfp ? (
              <img
                src={`/uploads/profile_pictures/${user.Pfp}`}
                alt={user.Nombre}
                className="user-avatar"
                onClick={openImageViewer}
                style={{ cursor: 'pointer' }}
              />
            ) : null}
            <div className="profile-header-info">
              <h2>{user.Nombre} {user.Apellido ? user.Apellido : ''}</h2>
              <p className="profile-role">Rol: {user.Rol}</p>
            </div>
            {isOwnProfile && (
              <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                Editar Perfil
              </button>
            )}
          </section>
          <section className="profile-sections">
            <div style={{ height: '400px', width: '100%', display: 'flex', gap: '20px' }}>
              <div className="profile-card personal-info" style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
                <h3>Datos Personales</h3>
                <ul className="profile-info-list">
                  {user.Cedula && <li><strong>Cédula:</strong> {user.Cedula}</li>}
                  {user.FechaNacimiento && <li><strong>Fecha de Nacimiento:</strong> {new Date(user.FechaNacimiento).toLocaleDateString()}</li>}
                  <li><strong>Especialidad:</strong> {user.Especialidad ? user.Especialidad : 'No especificado'}</li>
                  {user.Direccion && <li><strong>Dirección:</strong> {user.Direccion}</li>}
                  <li><strong>Estado:</strong> {user.Activo ? 'Activo' : 'Inactivo'}</li>
                  <li><strong>Nombre de Usuario:</strong> {user.NombreUsuario}</li>
                  <li><strong>Último Login:</strong> {formatRelativeTime(user.UltimoLogin)}</li>
                  <li><strong>Fecha de Creación:</strong> {user.FechaCreacion ? new Date(user.FechaCreacion).toLocaleDateString() : 'No especificado'}</li>
                </ul>
              </div>

              <div className="profile-card social-networks" style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
                <h3>Redes y Contactos</h3>
                <HorizontalInfoCard
                  icon={<FaPhone />}
                  title="Teléfono"
                  content={user.Telefono}
                  color="#007bff"
                />
                <HorizontalInfoCard
                  icon={<FaEnvelope />}
                  title="Correo Electrónico"
                  content={user.Correo}
                  color="#28a745"
                />
                {user.redes && user.redes.length > 0 ? (
                  user.redes.map((red) => {
                    const IconComponent = iconMap[red.icono];
                    return (
                      <HorizontalInfoCard
                        key={red.id}
                        icon={IconComponent ? <IconComponent style={{ color: red.color || '#000' }} /> : null}
                        title={red.nombre}
                        content={`${red.contenido || ''} ${red.url || ''}`.trim()}
                        link={red.url || null}
                        color={red.color || '#000'}
                      />
                    );
                  })
                ) : (
                  <p>No hay redes sociales asociadas.</p>
                )}
                {isOwnProfile && (
                  <button onClick={() => setIsSocialModalOpen(true)} className="edit-profile-btn" style={{ marginTop: '10px' }}>
                    Gestionar Redes Sociales
                  </button>
                )}
              </div>
            </div>

            <div className="profile-card properties-in-charge" style={{ width: '100%' }}>
              <h3>Inmuebles a cargo</h3>
              <p>Esta sección será implementada próximamente.</p>
            </div>
          </section>

          {/* Modals */}
          {isOwnProfile && (
            <>
              <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                token={token}
                onUpdate={handleUserUpdate}
              />
              <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
                user={user}
                token={token}
              />
              <SocialNetworksModal
                isOpen={isSocialModalOpen}
                onClose={() => setIsSocialModalOpen(false)}
                redes={user.redes}
                token={token}
                onUpdate={handleUserUpdate}
              />
            </>
          )}
        </div>
      </div>
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        imageSrc={user && user.Pfp ? `/uploads/profile_pictures/${user.Pfp}` : ''}
        altText={user ? user.Nombre : 'Imagen de perfil'}
      />

  </MangoTemplate>
  );
};

export default Perfil;
