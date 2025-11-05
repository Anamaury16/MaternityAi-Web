import { DegradedText } from '../../../../gradedcomponents/degradedtext/DegradedText';
import styles from './PreguntasFrecuentes.module.css';
export const PreguntasFrecuentes = () => {
  return (
    <section className={styles.container}>
      <DegradedText text="Preguntas frecuentes" fontSize="20px" />
      <p>¿Es normal tener dolor de espalda?</p>
    </section>
  );
};
