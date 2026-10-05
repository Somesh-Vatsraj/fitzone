import { useMemo, useState } from 'react';
import { useStore } from '../data/StoreContext.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import SectionHead from '../components/SectionHead.jsx';

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio', 'Abs'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function Workouts() {
  const { workouts } = useStore();
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => workouts.filter((w) => {
    const matchCat = category === 'All' || w.category === category;
    const matchDiff = difficulty === 'All' || w.difficulty === difficulty;
    const q = query.trim().toLowerCase();
    const matchQ = !q || w.name.toLowerCase().includes(q)
      || w.description.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
    return matchCat && matchDiff && matchQ;
  }), [workouts, category, difficulty, query]);

  return (
    <section className="section page-top">
      <div className="container">
        <SectionHead eyebrow="Exercise Library" title="WORKOUT CATEGORIES"
          description="Browse by muscle group, difficulty and training goal." />

        <div className="filters">
          <div className="chips">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} className={`chip-btn ${category === c ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="filters__row">
            <input className="input filters__search" placeholder="Search exercises…"
              value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="input filters__select" value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}>
              <option value="All">All Levels</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <p className="results-count">Showing <strong>{filtered.length}</strong> of {workouts.length} workouts</p>

        {filtered.length ? (
          <div className="grid grid--4">
            {filtered.map((w) => <WorkoutCard key={w.id} workout={w} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No workouts found</h3>
            <p>Try a different category, level or search term.</p>
            <button className="btn btn--ghost" onClick={() => {
              setCategory('All'); setDifficulty('All'); setQuery('');
            }}>Reset filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
