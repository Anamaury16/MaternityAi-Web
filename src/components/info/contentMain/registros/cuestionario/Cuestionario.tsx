import styles from './Cuestionario.module.css';
export const Cuestionario = () => {
  return (
    <section className={styles.cuestionario}>
      <h4>Comportamientos del bebe</h4>
      <p>
        Queremos estar contigo en cada etapa de tu embarazo y posparto. Comparte
        cómo te sientes y así podremos acompañarte mejor y cuidar de tu
        bienestar.
      </p>
      <button className={styles.boton}>Realizar cuestionario</button>
    </section>
  );
};
