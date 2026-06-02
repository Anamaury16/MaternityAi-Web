import styles from './Consejos.module.css';
interface Props {
  className?: string;
}
export const Consejos = ({ className }: Props) => {
  return (
    <section className={` ${styles.container} ${className ?? ''}`}>
      <h3>Preparación Para el parto </h3>

      <article>
        <div>
          <h4>Aliementación</h4>
          <p>Dieta balanceada y nutritiva</p>
        </div>
      </article>

      <article>
        <div>
          <h4>Preparación fisica</h4>
          <p>Acitivdad fisica estimulante para el parto</p>
        </div>
      </article>

      <article>
        <div>
          <h4>Organización previa</h4>
          <p>Kit basico previo al trabajo de parto</p>
        </div>
      </article>

      <article>
        <div>
          <h4>Preparación al entorno</h4>
          <p>Espacio seguro y listo para el bebe</p>
        </div>
      </article>
    </section>
  );
};
