import { useNavigate } from 'react-router-dom';
import { DegradedText } from '../../../../gradedcomponents/degradedtext/DegradedText';
import styles from './PreguntasFrecuentes.module.css';

const PREGUNTAS = [
  "¿Es normal tener dolor de espalda?",
  "¿Cómo controlo la acidez estomacal?",
  "¿Qué alimentos debo evitar?",
  "¿Cuáles son los signos de alarma?"
];

export const PreguntasFrecuentes = () => {
  const navigate = useNavigate();

  const handleQuestionClick = (pregunta: string) => {
    localStorage.setItem('pending_ai_question', pregunta);
    navigate('/ai');
  };

  return (
    <section className={styles.container}>
      <DegradedText text="Preguntas frecuentes" fontSize="20px" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', width: '100%' }}>
        {PREGUNTAS.map((pregunta, index) => (
          <p 
            key={index} 
            onClick={() => handleQuestionClick(pregunta)}
            style={{ margin: 0 }}
          >
            {pregunta}
          </p>
        ))}
      </div>
    </section>
  );
};
