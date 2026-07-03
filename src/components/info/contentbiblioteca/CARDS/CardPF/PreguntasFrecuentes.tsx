import { useState } from 'react';
import styles from './PreguntasFrecuentes.module.css';

interface Pregunta {
  pregunta: string;
  respuesta: string;
}

const PREGUNTAS: Pregunta[] = [
  {
    pregunta: "¿Es normal tener dolor de espalda?",
    respuesta:
      "Sí, el dolor de espalda es muy común durante el embarazo. Ocurre porque el centro de gravedad del cuerpo cambia a medida que el útero crece, lo que genera tensión en los músculos lumbares. Para aliviarlo se recomienda mantener buena postura, usar calzado cómodo con buen soporte, aplicar calor local y realizar ejercicios suaves de estiramiento. Si el dolor es intenso, persistente o va acompañado de otros síntomas como fiebre o sangrado, consulte a su médico.",
  },
  {
    pregunta: "¿Cómo controlo la acidez estomacal?",
    respuesta:
      "La acidez estomacal (pirosis) es frecuente en el embarazo porque las hormonas relajan el esfínter esofágico y el útero ejerce presión sobre el estómago. Para controlarla: coma porciones pequeñas varias veces al día, evite alimentos grasos, picantes, cafeína y jugos cítricos, no se acueste inmediatamente después de comer, y eleve ligeramente la cabecera al dormir. Si los síntomas son muy molestos, consulte a su médico antes de tomar antiácidos.",
  },
  {
    pregunta: "¿Qué alimentos debo evitar?",
    respuesta:
      "Durante el embarazo debe evitar: carnes y mariscos crudos o poco cocidos (riesgo de listeria y salmonela), pescados con alto contenido de mercurio como el tiburón y el pez espada, quesos blandos no pasteurizados, embutidos sin calentar, huevos crudos, alcohol en cualquier cantidad, cafeína en exceso (máximo 200 mg/día) y bebidas energizantes. Prefiera alimentos bien cocidos, lavados y de origen seguro.",
  },
  {
    pregunta: "¿Cuáles son los signos de alarma?",
    respuesta:
      "Consulte a urgencias de inmediato si presenta alguno de estos signos: sangrado vaginal en cualquier trimestre, dolor abdominal intenso o cólicos fuertes, fiebre mayor a 38 °C, visión borrosa o puntos de luz, dolor de cabeza intenso y persistente, hinchazón repentina de manos, cara o pies, disminución o ausencia de movimientos fetales después de la semana 28, pérdida de líquido amniótico o rotura de membranas. Ante la duda, siempre es mejor consultar.",
  },
];

const FAQ_MODAL_ID = 'faq-modal';

export const PreguntasFrecuentes = () => {
  const [selected, setSelected] = useState<Pregunta | null>(null);

  return (
    <section className={styles.container}>
      <p className={styles.sideLabel}>PREGUNTAS FRECUENTES</p>

      {PREGUNTAS.map((item, index) => (
        <button
          key={index}
          className={styles.questionBtn}
          onClick={() => setSelected(item)}
          aria-haspopup="dialog"
        >
          <span className={styles.questionIcon}>?</span>
          {item.pregunta}
        </button>
      ))}

      {selected && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby={FAQ_MODAL_ID}
          onClick={() => setSelected(null)}
        >
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>💬</span>
              <h3 id={FAQ_MODAL_ID} className={styles.modalQuestion}>
                {selected.pregunta}
              </h3>
            </div>
            <p className={styles.modalAnswer}>{selected.respuesta}</p>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
