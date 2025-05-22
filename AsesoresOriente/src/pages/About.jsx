import React from 'react';
import PageTemplate from '../components/PageTemplate';
import InfoBox from '../components/InfoBox';
import '../styles/About.css';
import '../styles/InfoBox.css';

const About = () => {
  // Configuración compartida para todos los InfoBox
  const sharedBoxProps = {
    titleColor: "#000000",
    textColor: "#333333",
    titleFontSize: "1.5rem",
    className: "about-infobox",
    underlineWidth: "60px",
    underlineColor: "#2a5c99",
    style: {
      borderLeft: '4px solid var(--color-primary)',
      background: 'linear-gradient(to right, var(--color-white) 0%, var(--color-primary-light) 100%)'
    }
  };

  return (
    <PageTemplate pageClass="about-layout" contentClass="about-content" title="Sobre Nosotros">
      <div className="about-container">
        {/* Sección Quiénes Somos */}
        <InfoBox 
          {...sharedBoxProps}
          title="Quiénes Somos"
        >
          <p>
            En Asesores de Oriente Bienes Raíces, C.A., somos tu aliado estratégico para potenciar tu éxito como agente inmobiliario. Te brindamos todo el respaldo y la asesoría jurídica que necesitas, junto con herramientas esenciales como nuestra plataforma inmobiliaria, soporte técnico y marketing digital, manteniéndose siempre a la vanguardia tecnológica.
          </p>
          <p>
            Con nosotros, obtendrás el servicio que necesitas para impulsar tu autonomía, creatividad y capacidad de forjar un futuro exitoso en la intermediación inmobiliaria.
          </p>
        </InfoBox>

        {/* Sección Futuro de la Empresa */}
        <InfoBox 
          {...sharedBoxProps}
          title="Futuro de la Empresa Inmobiliaria"
        >
          <p>
            Se espera que la empresa se convierta en un referente a nivel nacional en el sector inmobiliario. Esto se logrará atrayendo a emprendedores inmobiliarios y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
          </p>
          <p>
            Para conseguirlo, la empresa se compromete a ofrecer a sus agentes:
          </p>
          <ul>
            <li><strong>Herramientas:</strong> Para optimizar su trabajo diario.</li>
            <li><strong>Apoyo jurídico:</strong> Para garantizar la legalidad y seguridad de las operaciones.</li>
            <li><strong>Apoyo gerencial:</strong> Para guiar y potenciar el rendimiento de los agentes.</li>
          </ul>
          <p>
            En resumen, la visión a futuro es ser una empresa reconocida por su respaldo integral a sus agentes, lo que a su vez impulsará su crecimiento y éxito en el mercado.
          </p>
        </InfoBox>

        
        {/* Sección ¿Cómo somos? */}
        <InfoBox 
          title="¿Cómo somos?"
          {...sharedBoxProps}
        >
          <p className="highlight-text">
            ¡Somos un equipo productivo, colaborativo, entusiasta y comprometido!
          </p>
        </InfoBox>

        {/* Sección Valores */}
        <InfoBox 
          title="¿En qué creemos?"
          {...sharedBoxProps}
        >
          <p>Creemos en los siguientes valores fundamentales:</p>
          <ul className="values-list">
            <li><strong>Confianza:</strong> Fomentamos un ambiente donde la honestidad y la fiabilidad son la base.</li>
            <li><strong>Respeto:</strong> Valoramos la diversidad de ideas y perspectivas.</li>
            <li><strong>Diversión:</strong> Ambiente positivo que impulsa creatividad y bienestar.</li>
            <li><strong>Unión:</strong> Trabajamos juntos como equipo cohesionado.</li>
            <li><strong>Excelencia:</strong> Buscamos superar expectativas constantemente.</li>
            <li><strong>Resultados:</strong> Enfoque en eficiencia y efectividad.</li>
            <li><strong>Aprendizaje:</strong> Compromiso con crecimiento continuo.</li>
          </ul>
        </InfoBox>

        {/* Sección Misión */}
        <InfoBox 
          title="Nuestra Misión"
          {...sharedBoxProps}
        >
          <p>
            En Asesores de Oriente Bienes Raíces, C.A., nuestra misión es ser el aliado estratégico y productivo de cada agente inmobiliario, impulsando su éxito a través de un respaldo integral y colaborativo.
          </p>
          <p>
            Ofrecemos herramientas de vanguardia, asesoría jurídica y gerencial de excelencia, y un ambiente de confianza y respeto que fomenta la autonomía, creatividad y el aprendizaje continuo.
          </p>
          <p>
            Nos comprometemos con los resultados para que cada emprendedor forje un futuro exitoso y disfrute su camino al éxito.
          </p>
        </InfoBox>

        {/* Sección Visión */}
        <InfoBox 
          title="Nuestra Visión"
          {...sharedBoxProps}
        >
          <p>
            Aspiramos a ser el referente nacional en el sector inmobiliario, atrayendo a los mejores emprendedores y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
          </p>
          <p>
            Visualizamos un futuro donde se nos permita ser reconocidos por el respaldo integral que brindamos a nuestros agentes, garantizando su crecimiento y maximizando sus captaciones y transacciones inmobiliarias.
          </p>
          <p>
            Creemos que el profesionalismo y la excelencia en nuestro trabajo nos permitirán construir una comunidad vibrante y altamente productiva.
          </p>
        </InfoBox>
      </div>
    </PageTemplate>
  );
};

export default About;