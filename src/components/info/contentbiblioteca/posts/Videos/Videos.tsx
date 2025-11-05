import styles from './Videos.module.css';
export const Videos = () => {
  return (
    <div className={styles.contenido}>
      <h2>Titulo del video</h2>
      <p>
        adipiscing elit aptent eget eros, dui dictumst vestibulum sociosqu m
        quam duis ligula ultricies sapien. Laoreet, cursus primis metus quis
        augue fermentum egestas urna, hendrerit sociis est facilisi litora
        pharetra etiam.
      </p>
      <p>08-06-2025</p>

      <video className={styles.video} controls />
    </div>
  );
};
