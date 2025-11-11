import React from 'react';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import {
  FaHandshake, FaUserFriends, FaLaughBeam, FaUsers,
  FaAward, FaChartLine, FaGraduationCap
} from 'react-icons/fa';

// Placeholder images (to be replaced later)
const image1 = '/img/about/about1.png'; 
const image2 = '/img/about/about2.png';

const About = () => {
  return (
    <MangoTemplate>
      <PageTitle>Quiénes Somos</PageTitle>
      <div className="flex flex-col gap-12 max-w-4xl mx-auto p-4  text-text font-primary">
        {/* Hero Section: Image on top, centered text below */}
        <section className="flex flex-col items-center text-center gap-8">
          <div className="w-full max-w-3xl mb-4">
            <img src={image1} alt="Nuestra empresa" className="w-full h-auto rounded-lg object-cover shadow-lg" />
          </div>
          <div className="max-w-3xl">
            <h2 className="text-xl mb-4 text-primary">Quiénes Somos</h2>
            <p className="text-normal  leading-relaxed text-text-light text-justify">
              En Asesores de Oriente Bienes Raíces, C.A., somos tu aliado estratégico para potenciar tu éxito como agente inmobiliario. Te brindamos todo el respaldo y la asesoría jurídica que necesitas, junto con herramientas esenciales como nuestra plataforma inmobiliaria, soporte técnico y marketing digital, manteniéndose siempre a la vanguardia tecnológica.
            </p>
            <p className="text-normal leading-relaxed text-text-light text-justify">
              Con nosotros, obtendrás el servicio que necesitas para impulsar tu autonomía, creatividad y capacidad de forjar un futuro exitoso en la intermediación inmobiliaria.
            </p>
          </div>
        </section>

        {/* Second Section: Text left, image right */}
        <section className="flex flex-col md:flex-row-reverse md:justify-between items-center gap-8">
          <div className="w-full md:flex-[1_1_50%] md:max-w-[50%]">
            <h2 className="text-large mb-4 text-primary">Futuro de la Empresa Inmobiliaria</h2>
            <p className="text-normal leading-relaxed text-text-light text-justify">
              Se espera que la empresa se convierta en un referente a nivel nacional en el sector inmobiliario. Esto se logrará atrayendo a emprendedores inmobiliarios y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
            </p>
            <p className="text-normal leading-relaxed text-text-light text-justify">Para conseguirlo, la empresa se compromete a ofrecer a sus agentes:</p>
            <ul className="pl-6 list-disc">
              <li className="mb-2"><strong className="font-bold">Herramientas:</strong> Para optimizar su trabajo diario.</li>
              <li className="mb-2"><strong className="font-bold">Apoyo jurídico:</strong> Para garantizar la legalidad y seguridad de las operaciones.</li>
              <li className="mb-2"><strong className="font-bold">Apoyo gerencial:</strong> Para guiar y potenciar el rendimiento de los agentes, ayudándolos a maximizar sus captaciones y transacciones inmobiliarias.</li>
            </ul>
            <p className="text-normal leading-relaxed text-text-light text-justify">
              En resumen, la visión a futuro es ser una empresa reconocida por su respaldo integral a sus agentes, lo que a su vez impulsará su crecimiento y éxito en el mercado.
            </p>
          </div>
          <div className="w-full md:flex-[1_1_45%] md:max-w-[45%]">
            <img src={image2} alt="Futuro de la empresa" className="w-full h-auto rounded-lg object-cover shadow-lg" />
          </div>
        </section>

        {/* Core Values Section */}
        <section className="flex flex-col text-center">
          <h2 className="text-large mb-4 text-primary">Nuestros Valores Fundamentales</h2>
          <p className="italic mb-6 text-text-light text-large">
            Estos son los principios que guían cada aspecto de nuestro trabajo:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaHandshake /></div>
              <h3 className="text-primary mb-3 text-lg">Confianza</h3>
              <p className="text-left m-0 text-text-light">Fomentamos un ambiente donde la honestidad y la fiabilidad son la base de todas nuestras interacciones.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaUserFriends /></div>
              <h3 className="text-primary mb-3 text-lg">Respeto</h3>
              <p className="text-left m-0 text-text-light">Valoramos la diversidad de ideas y perspectivas, tratando a cada persona con consideración y aprecio.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaLaughBeam /></div>
              <h3 className="text-primary mb-3 text-lg">Diversión</h3>
              <p className="text-left m-0 text-text-light">Creemos que un ambiente de trabajo positivo y alegre impulsa la creatividad y el bienestar.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaUsers /></div>
              <h3 className="text-primary mb-3 text-lg">Unión</h3>
              <p className="text-left m-0 text-text-light">Trabajamos juntos como un equipo cohesionado, apoyándonos mutuamente para alcanzar metas comunes.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaAward /></div>
              <h3 className="text-primary mb-3 text-lg">Excelencia</h3>
              <p className="text-left m-0 text-text-light">Nos esforzamos constantemente por la alta calidad en todo lo que hacemos, buscando superar las expectativas.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaChartLine /></div>
              <h3 className="text-primary mb-3 text-lg">Resultados</h3>
              <p className="text-left m-0 text-text-light">Estamos orientados al logro de objetivos claros y medibles, con un enfoque en la eficiencia y la efectividad.</p>
            </div>
            <div className="bg-background-2 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-start">
              <div className="text-3xl text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4"><FaGraduationCap /></div>
              <h3 className="text-primary mb-3 text-lg">Aprendizaje</h3>
              <p className="text-left m-0 text-text-light">Estamos comprometidos con el crecimiento continuo, buscando siempre nuevas formas de mejorar y adaptarnos.</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-3xl mx-auto px-0 border-t border-gray-300 mt-6 mb-3 pt-6 pb-4">
          <h2 className="text-xl mb-3 text-primary text-center">Nuestra Misión</h2>
          <p className="text-base leading-relaxed text-text-light text-center max-w-2xl mx-auto mb-2">
            En Asesores de Oriente Bienes Raíces, C.A., nuestra misión es ser el aliado estratégico y productivo de cada agente inmobiliario, impulsando su éxito a través de un respaldo integral y colaborativo.
          </p>
          <p className="text-base leading-relaxed text-text-light text-center max-w-2xl mx-auto mb-2">
            Ofrecemos herramientas de vanguardia, asesoría jurídica y gerencial de excelencia, y un ambiente de confianza y respeto que fomenta la autonomía, creatividad y el aprendizaje continuo.
          </p>
        </section>

        {/* Vision Section */}
        <section className="max-w-3xl mx-auto px-0 border-t border-gray-300 mt-3 mb-6 pt-4 pb-6">
          <h2 className="text-xl mb-3 text-primary text-center">Nuestra Visión</h2>
          <p className="text-base leading-relaxed text-text-light text-center max-w-2xl mx-auto mb-2">
            Aspiramos a ser el referente nacional en el sector inmobiliario, atrayendo a los mejores emprendedores y ayudándolos a desarrollar carreras profesionales exitosas dentro de nuestras oficinas.
          </p>
          <p className="text-base leading-relaxed text-text-light text-center max-w-2xl mx-auto mb-2">
            Visualizamos un futuro donde se nos permita ser reconocidos por el respaldo integral que brindamos a nuestros agentes, garantizando su crecimiento y maximizando sus captaciones y transacciones inmobiliarias.
          </p>
        </section>
      </div>
    </MangoTemplate>
  );
};

export default About;