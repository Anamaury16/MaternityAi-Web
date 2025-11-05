import { Cuestionario } from './cuestionario/Cuestionario';
import { Message } from './DayliReminder/Message';
import { Descubrimiento } from './Descubrimiento/Descubrimiento';
import styles from './Registros.module.css';
import { Reporte } from './reportarsignos/Reporte';

interface Props {
  className: string;
}
export const Registros = ({ className }: Props) => {
  return (
    <section className={` ${styles.container} ${className ?? ''}`}>
      <section className={styles.cuestionarios}>
        <Reporte text="Reportar signos de alarma" />
        <Cuestionario />
        <Message />
        <Descubrimiento />
      </section>
    </section>
  );
};
