import { useState, useMemo } from 'react';
import { useEducationalContent } from '../../../hooks/m5/usM5';
import { PreguntasFrecuentes } from './CARDS/CardPF/PreguntasFrecuentes';
import { Recomendaciones } from './CARDS/CardR/Recomendaciones';
import { Posts } from './posts/Posts';
import styles from './ContentBiblioteca.module.css';

const TIPOS = [
  { key: 'todos',    label: 'Todos' },
  { key: 'articulo', label: 'Artículos' },
  { key: 'video',    label: 'Videos' },
  { key: 'documento', label: 'Documentos' },
];

export const ContentBiblioteca = () => {
  const { data, loading, error } = useEducationalContent();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const matchType =
        activeFilter === 'todos' ||
        (item.tipo_contenido ?? '').toLowerCase() === activeFilter;
      const matchSearch =
        search.trim() === '' ||
        item.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (item.descripcion ?? '').toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [data, activeFilter, search]);

  const counts = useMemo(() => {
    if (!data) return {};
    return data.reduce<Record<string, number>>((acc, item) => {
      const t = (item.tipo_contenido ?? 'otro').toLowerCase();
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {});
  }, [data]);

  return (
    <div className={styles.libraryRoot}>

      {/* ── SEARCH BAR ─────────────────────────────────── */}
      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar artículos, videos, documentos…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* ── BODY ───────────────────────────────────────── */}
      <div className={styles.body}>

        {/* LEFT SIDEBAR */}
        <aside className={styles.sidebar}>

          <div className={styles.sideSection}>
            <PreguntasFrecuentes />
          </div>

          <div className={styles.sideSection}>
            <Recomendaciones />
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className={styles.filterRow}>
              {TIPOS.map(t => {
                const count = t.key === 'todos'
                  ? (data?.length ?? 0)
                  : (counts[t.key] ?? 0);
                return (
                  <button
                    key={t.key}
                    className={`${styles.filterPill} ${activeFilter === t.key ? styles.filterPillActive : ''}`}
                    onClick={() => setActiveFilter(t.key)}
                  >
                    <span>{t.label}</span>
                    <span className={styles.filterPillCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Posts data={filtered} loading={loading} error={error} />
        </main>

      </div>

      {/* ── MOBILE VIEW ────────────────────────────────── */}
      <div className={styles.mobileTabs}>
        {TIPOS.map(t => (
          <button
            key={t.key}
            className={`${styles.mobileTab} ${activeFilter === t.key ? styles.mobileTabActive : ''}`}
            onClick={() => setActiveFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.mobileBody}>
        <Posts data={filtered} loading={loading} error={error} />
      </div>

      <div className={styles.mobileSide}>
        <PreguntasFrecuentes />
        <Recomendaciones />
      </div>

    </div>
  );
};
