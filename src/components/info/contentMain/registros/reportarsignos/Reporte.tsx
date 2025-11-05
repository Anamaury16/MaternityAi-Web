import styles from './Reporte.module.css';
interface Props {
  text: string;
}
export const Reporte = ({ text }: Props) => {
  return <div className={styles.reporte}>{text}</div>;
};
