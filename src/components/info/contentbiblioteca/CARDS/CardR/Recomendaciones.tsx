import React from 'react';
import styles from './recomendaciones.module.css';
import { useRecommendations } from '../../../../../hooks/clinical/useClinical';

const RECOMENDACIONES_DIARIAS: string[][] = [
  // Domingo (0)
  [
    "Duerma al menos 8 horas para mantener su energía y salud.",
    "Tome pausas activas y descanse con los pies elevados para reducir la hinchazón.",
    "Evite el consumo de cafeína en exceso, prefiera infusiones naturales permitidas.",
    "Comuníquese con su red de apoyo familiar para planificar la semana."
  ],
  // Lunes (1)
  [
    "Asista puntualmente a sus controles prenatales programados.",
    "Planifique un menú saludable y variado para toda la semana.",
    "Realice una caminata ligera de 20 a 30 minutos a paso suave.",
    "Registre su peso corporal y verifique si está dentro del rango recomendado."
  ],
  // Martes (2)
  [
    "Evite levantar objetos pesados o realizar esfuerzos físicos bruscos.",
    "Realice ejercicios de respiración y relajación para disminuir la ansiedad.",
    "Consuma alimentos ricos en hierro, como espinacas, lentejas o carnes magras.",
    "Mantenga una postura adecuada al sentarse y trabajar."
  ],
  // Miércoles (3)
  [
    "Asegure un consumo adecuado de calcio diario (leche, yogur, queso o almendras).",
    "Coma porciones pequeñas de alimentos 5 o 6 veces al día para evitar la acidez.",
    "Use ropa holgada y calzado cómodo con buen soporte.",
    "Manténgase bien hidratada bebiendo al menos 2 litros de agua al día."
  ],
  // Jueves (4)
  [
    "Evite la automedicación; siempre consulte con su médico tratante.",
    "Realice ejercicios suaves para fortalecer el suelo pélvico (ejercicios de Kegel).",
    "Consuma alimentos altos en fibra (frutas, verduras, cereales integrales) para prevenir el estreñimiento.",
    "Evite permanecer de pie o sentada en la misma posición por períodos prolongados."
  ],
  // Viernes (5)
  [
    "Aprenda a identificar los signos de alarma (sangrado, dolor fuerte de cabeza, fiebre).",
    "Prepare con anticipación los documentos médicos importantes en un bolso accesible.",
    "Mantenga una higiene del sueño adecuada, desconectándose de pantallas antes de dormir.",
    "Consuma pescados cocidos ricos en Omega-3 para el desarrollo cerebral del bebé."
  ],
  // Sábado (6)
  [
    "Comparta momentos de tranquilidad y conexión hablándole o cantándole a su bebé.",
    "Evite comidas grasas, muy condimentadas o picantes para prevenir el reflujo.",
    "Tome un baño de agua tibia para relajar los músculos del cuerpo.",
    "Disfrute de actividades recreativas de bajo impacto con su pareja o familia."
  ]
];

export const Recomendaciones = React.memo(() => {
  const { data, loading } = useRecommendations();

  const getRecomendacionesDelDia = () => {
    const dia = new Date().getDay(); // 0 a 6
    // Intentamos cargar del pool del día; si no estuviera disponible, usamos el fallback del backend
    return RECOMENDACIONES_DIARIAS[dia] || data?.recomendaciones || [];
  };

  const listaRecomendaciones = getRecomendacionesDelDia();

  return (
    <section className={styles.recomendaciones}>
      <h3>RECOMENDACIONES PARA HOY</h3>
      {loading && listaRecomendaciones.length === 0 ? (
        <p>Cargando recomendaciones...</p>
      ) : (
        <div className={styles.carousel}>
          {listaRecomendaciones.map((rec, index) => (
            <div key={index} className={styles.articulo}>
              {rec}
            </div>
          ))}
        </div>
      )}
      {!loading && listaRecomendaciones.length === 0 && (
        <p>No hay recomendaciones disponibles hoy.</p>
      )}
    </section>
  );
});
