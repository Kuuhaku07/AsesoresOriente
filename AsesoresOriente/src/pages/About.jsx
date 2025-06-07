import React from 'react';
import PageTemplate from '../components/PageTemplate';
import '../styles/About.css';
import {
  FaHandshake, FaUserFriends, FaLaughBeam, FaUsers,
  FaAward, FaChartLine, FaGraduationCap
} from 'react-icons/fa';

// Placeholder images (to be replaced later)
const image1 = '/img/about/about1.png'; 
const image2 = '/img/about/about2.png';

const About = () => {
  return (
    <PageTemplate pageClass="about-layout" contentClass="about-content" title="Quiénes Somos">
      <div className="about-page-container">
        {/* Hero Section: Image on top, centered text below */}
        <section className="about-section about-hero-section">
          <div className="about-image-container">
            <img src={image1} alt="Nuestra empresa" className="about-image" />
          </div>
          <div className="about-text-container">
            <h2>Quiénes Somos</h2>
            <p>
              En Asesores de Oriente Bienes Raíces, C.A., somos tu aliado estratégico para potenciar tu éxito como agente inmobiliario. Te brindamos todo el respaldo y la asesoría jurídica que necesitas, junto con herramientas esenciales como nuestra plataforma inmobiliaria, soporte técnico y marketing digital, manteniéndose siempre a la vanguardia tecnológica.
            </p>
            <p>
              Con nosotros, obtendrás el servicio que necesitas para impulsar tu autonomía, creatividad y capacidad de forjar un futuro exitoso en la intermediación inmobiliaria.
            </p>
          </div>
        </section>

        {/* Second Section: Text left, image right */}
        <section className="about-section about-section-2">
          <div className="about-text-container">
            <h2>Futuro de la Empresa Inmobiliaria</h2>
            <p>
              Se espera que la empresa se convierta en un referente a nivel nacional en el sector inmobiliario. Esto se logrará atrayendo a emprendedores inmobiliarios y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
            </p>
            <p>Para conseguirlo, la empresa se compromete a ofrecer a sus agentes:</p>
            <ul>
              <li><strong>Herramientas:</strong> Para optimizar su trabajo diario.</li>
              <li><strong>Apoyo jurídico:</strong> Para garantizar la legalidad y seguridad de las operaciones.</li>
              <li><strong>Apoyo gerencial:</strong> Para guiar y potenciar el rendimiento de los agentes, ayudándolos a maximizar sus captaciones y transacciones inmobiliarias.</li>
            </ul>
            <p>
              En resumen, la visión a futuro es ser una empresa reconocida por su respaldo integral a sus agentes, lo que a su vez impulsará su crecimiento y éxito en el mercado.
            </p>
          </div>
          <div className="about-image-container">
            <img src={image2} alt="Futuro de la empresa" className="about-image" />
          </div>
        </section>

        {/* Core Values Section */}
        <section className="about-section core-values-section">
          <h2>Nuestros Valores Fundamentales</h2>
          <p className="core-values-intro">
            Estos son los principios que guían cada aspecto de nuestro trabajo:
          </p>
          <div className="core-values-grid">
            <div className="core-value-item">
              <div className="core-value-icon"><FaHandshake /></div>
              <h3>Confianza</h3>
              <p>Fomentamos un ambiente donde la honestidad y la fiabilidad son la base de todas nuestras interacciones.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaUserFriends /></div>
              <h3>Respeto</h3>
              <p>Valoramos la diversidad de ideas y perspectivas, tratando a cada persona con consideración y aprecio.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaLaughBeam /></div>
              <h3>Diversión</h3>
              <p>Creemos que un ambiente de trabajo positivo y alegre impulsa la creatividad y el bienestar.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaUsers /></div>
              <h3>Unión</h3>
              <p>Trabajamos juntos como un equipo cohesionado, apoyándonos mutuamente para alcanzar metas comunes.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaAward /></div>
              <h3>Excelencia</h3>
              <p>Nos esforzamos constantemente por la alta calidad en todo lo que hacemos, buscando superar las expectativas.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaChartLine /></div>
              <h3>Resultados</h3>
              <p>Estamos orientados al logro de objetivos claros y medibles, con un enfoque en la eficiencia y la efectividad.</p>
            </div>
            <div className="core-value-item">
              <div className="core-value-icon"><FaGraduationCap /></div>
              <h3>Aprendizaje</h3>
              <p>Estamos comprometidos con el crecimiento continuo, buscando siempre nuevas formas de mejorar y adaptarnos.</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          <h2>Nuestra Misión</h2>
          <p>
            En Asesores de Oriente Bienes Raíces, C.A., nuestra misión es ser el aliado estratégico y productivo de cada agente inmobiliario, impulsando su éxito a través de un respaldo integral y colaborativo.
          </p>
          <p>
            Ofrecemos herramientas de vanguardia, asesoría jurídica y gerencial de excelencia, y un ambiente de confianza y respeto que fomenta la autonomía, creatividad y el aprendizaje continuo.
          </p>
        </section>

        {/* Vision Section */}
        <section className="about-section vision-section">
          <h2>Nuestra Visión</h2>
          <p>
            Aspiramos a ser el referente nacional en el sector inmobiliario, atrayendo a los mejores emprendedores y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
          </p>
          <p>
            Visualizamos un futuro donde se nos permita ser reconocidos por el respaldo integral que brindamos a nuestros agentes, garantizando su crecimiento y maximizando sus captaciones y transacciones inmobiliarias.
          </p>
        </section>
      </div>
    </PageTemplate>
  );
};

export default About;