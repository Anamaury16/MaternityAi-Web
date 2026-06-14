import type { ContenidoEducativoResponse } from '../../../../../services/m5Service';
import styles from './Videos.module.css';
interface VideosProps {
  post: ContenidoEducativoResponse;
}

export const Videos = ({ post: {url_recurso, descripcion, titulo, duracion_minutos} }: VideosProps) => {
  return (
    <div className={styles.contenido}>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      <video className={styles.video} controls autoPlay>
        {url_recurso && <source src={url_recurso} type="video/mp4" />}
      </video>
      <p>{duracion_minutos} minutos</p>
    </div>
  );
};
