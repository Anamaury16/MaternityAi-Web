import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/admin/AdminOBA.module.css';

interface ContenidoOBA {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'VIDEO' | 'ARTÍCULO';
  imagen: string;
  categoria: string;
}

const CATEGORIAS = [
  'Trimestre 1',
  'Trimestre 2',
  'Trimestre 3',
  'Postparto',
  'Nutrición',
  'Signos de alarma',
  'Cuidados generales',
];

const CONTENIDO_INIT: ContenidoOBA[] = [
  {
    id: 1,
    titulo: 'Ejercicios de bajo impacto',
    descripcion:
      'Rutina suave recomendada para las primeras 12 semanas de gestación. Ayuda a mantener la movilidad.',
    tipo: 'VIDEO',
    imagen:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=200&fit=crop',
    categoria: 'Trimestre 1',
  },
  {
    id: 2,
    titulo: 'Alimentos a evitar',
    descripcion:
      'Guía completa sobre qué alimentos crudos o procesados debes evitar durante el primer trimestre.',
    tipo: 'ARTÍCULO',
    imagen:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=200&fit=crop',
    categoria: 'Trimestre 1',
  },
  {
    id: 3,
    titulo: 'Primeros síntomas',
    descripcion:
      'Cómo identificar y manejar las náuseas matutinas y el cansancio extremo.',
    tipo: 'ARTÍCULO',
    imagen:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
    categoria: 'Trimestre 1',
  },
  {
    id: 4,
    titulo: 'Yoga prenatal T2',
    descripcion:
      'Sesión de yoga adaptada al segundo trimestre para aliviar el dolor de espalda.',
    tipo: 'VIDEO',
    imagen:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
    categoria: 'Trimestre 2',
  },
  {
    id: 5,
    titulo: 'Nutrición balanceada',
    descripcion:
      'Guía de alimentación saludable para el segundo trimestre con recetas prácticas.',
    tipo: 'ARTÍCULO',
    imagen:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=200&fit=crop',
    categoria: 'Nutrición',
  },
  {
    id: 6,
    titulo: 'Signos de alarma T3',
    descripcion:
      'Aprende a identificar señales de alerta durante el tercer trimestre del embarazo.',
    tipo: 'ARTÍCULO',
    imagen:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
    categoria: 'Signos de alarma',
  },
];

const TABS = ['Usuarias', 'OBA', 'Preguntas', 'Citas'] as const;

export const AdminOBA = () => {
  const navigate = useNavigate();
  const [catActiva, setCatActiva] = useState('Trimestre 1');
  const [contenido, setContenido] = useState<ContenidoOBA[]>(CONTENIDO_INIT);

  const handleTab = (tab: string) => {
    if (tab === 'Usuarias') navigate('/admin');
    if (tab === 'Preguntas') navigate('/admin/preguntas');
    if (tab === 'Citas') navigate('/admin/citas');
  };

  const eliminar = (id: number) => {
    setContenido(contenido.filter((c) => c.id !== id));
  };

  const filtrado = contenido.filter((c) => c.categoria === catActiva);

  return (
    <div className={styles.root}>
      {/* ── TOP NAV ── */}
      <div className={styles.topNav}>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${t === 'OBA' ? styles.tabOn : ''}`}
              onClick={() => handleTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* ── MAIN GRID ── */}
      <div className={styles.grid}>
        {/* ── PANEL IZQUIERDO: Categorías ── */}
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Categorías OBA</p>
          <div className={styles.catList}>
            {CATEGORIAS.map((cat) => (
              <div
                key={cat}
                className={`${styles.catItem} ${catActiva === cat ? styles.catItemSel : ''}`}
                onClick={() => setCatActiva(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO: Contenido ── */}
        <div className={`${styles.panel} ${styles.panelScroll}`}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Contenido: {catActiva}</h2>
            <button className={styles.newBtn}>+ Nuevo Contenido</button>
          </div>

          {filtrado.length === 0 ? (
            <p className={styles.emptyMsg}>
              No hay contenido para esta categoría.
            </p>
          ) : (
            <div className={styles.obaGrid}>
              {filtrado.map((c) => (
                <div key={c.id} className={styles.obaCard}>
                  <div className={styles.imgWrap}>
                    <img src={c.imagen} alt={c.titulo} className={styles.img} />
                    <span className={styles.badge}>{c.tipo}</span>
                    {c.tipo === 'VIDEO' && (
                      <div className={styles.playBtn}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{c.titulo}</h3>
                    <p className={styles.cardDesc}>{c.descripcion}</p>
                    <div className={styles.cardActions}>
                      <button className={styles.iconBtn} title="Editar">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={styles.iconBtn}
                        title="Eliminar"
                        onClick={() => eliminar(c.id)}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
