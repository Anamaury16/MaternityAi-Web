import React from 'react';
import styles from './recomendaciones.module.css';
import { useRecommendations } from '../../../../../hooks/clinical/useClinical';

const RECOMENDACIONES_DIARIAS: string[][] = [
  ["Duerma al menos 8 horas para mantener su energía.", "Tome pausas activas y descanse con pies elevados.", "Evite cafeína en exceso, prefiera infusiones permitidas.", "Planifique la semana con su red de apoyo."],
  ["Asista puntualmente a sus controles prenatales.", "Planifique un menú saludable para la semana.", "Realice una caminata ligera de 20 a 30 minutos.", "Registre su peso y verifique el rango recomendado."],
  ["Evite levantar objetos pesados o esfuerzos bruscos.", "Realice ejercicios de respiración para la ansiedad.", "Consuma alimentos ricos en hierro: espinacas, lentejas.", "Mantenga postura adecuada al sentarse y trabajar."],
  ["Asegure consumo adecuado de calcio diario.", "Coma porciones pequeñas 5 o 6 veces al día.", "Use ropa holgada y calzado cómodo.", "Beba al menos 2 litros de agua al día."],
  ["Evite la automedicación; consulte a su médico.", "Realice ejercicios de suelo pélvico (Kegel).", "Consuma fibra: frutas, verduras, cereales integrales.", "Evite permanecer de pie por períodos prolongados."],
  ["Aprenda a identificar los signos de alarma.", "Prepare los documentos médicos en bolso accesible.", "Desconéctese de pantallas antes de dormir.", "Consuma pescados ricos en Omega-3."],
  ["Háblele o cántele a su bebé para conectar.", "Evite comidas grasas o muy condimentadas.", "Tome un baño de agua tibia para relajar músculos.", "Disfrute actividades de bajo impacto en familia."],
];

export const Recomendaciones = React.memo(() => {
  const { data, loading } = useRecommendations();
  const dia = new Date().getDay();
  const lista: string[] = RECOMENDACIONES_DIARIAS[dia] ?? data?.recomendaciones ?? [];

  if (loading && lista.length === 0) return null;

  return (
    <section className={styles.recomendaciones}>
      <p className={styles.sideLabel}>RECOMENDACIÓN DEL DÍA</p>
      {lista.slice(0, 3).map((rec, i) => (
        <div key={i} className={styles.rec}>
          <span className={styles.recDot} />
          {rec}
        </div>
      ))}
    </section>
  );
});
