import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const StoreContext = createContext(null);
const EMPTY = { home: null, contact: null, site: null, plans: [], trainers: [], workouts: [], members: [], messages: [] };

export function StoreProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(() => localStorage.getItem('fitzone:auth') === 'true');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.bootstrap();
      setData({
        home: res.home || null, contact: res.contact || null, site: res.site || null,
        plans: res.plans || [], trainers: res.trainers || [],
        workouts: res.workouts || [], members: res.members || [], messages: res.messages || [],
      });
      setError(null);
    } catch (e) {
      console.error('Bootstrap failed:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { localStorage.setItem('fitzone:auth', String(auth)); }, [auth]);

  const updateSettings = useCallback(async (key, payload) => {
    const saved = await api.updateSettings(key, payload);
    setData((d) => ({ ...d, [key]: saved }));
    return saved;
  }, []);

  const createPlan = useCallback(async (b) => {
    const c = await api.plans.create(b);
    setData((d) => ({ ...d, plans: [...d.plans, c] }));
    return c;
  }, []);
  const updatePlan = useCallback(async (id, b) => {
    const u = await api.plans.update(id, b);
    setData((d) => ({ ...d, plans: d.plans.map((p) => (p.id === id ? u : p)) }));
    return u;
  }, []);
  const deletePlan = useCallback(async (id) => {
    await api.plans.remove(id);
    setData((d) => ({ ...d, plans: d.plans.filter((p) => p.id !== id) }));
  }, []);

  const createTrainer = useCallback(async (b) => {
    const c = await api.trainers.create(b);
    setData((d) => ({ ...d, trainers: [...d.trainers, c] }));
    return c;
  }, []);
  const updateTrainer = useCallback(async (id, b) => {
    const u = await api.trainers.update(id, b);
    setData((d) => ({ ...d, trainers: d.trainers.map((t) => (t.id === id ? u : t)) }));
    return u;
  }, []);
  const deleteTrainer = useCallback(async (id) => {
    await api.trainers.remove(id);
    setData((d) => ({ ...d, trainers: d.trainers.filter((t) => t.id !== id) }));
  }, []);

  const createWorkout = useCallback(async (b) => {
    const c = await api.workouts.create(b);
    setData((d) => ({ ...d, workouts: [...d.workouts, c] }));
    return c;
  }, []);
  const updateWorkout = useCallback(async (id, b) => {
    const u = await api.workouts.update(id, b);
    setData((d) => ({ ...d, workouts: d.workouts.map((w) => (w.id === id ? u : w)) }));
    return u;
  }, []);
  const deleteWorkout = useCallback(async (id) => {
    await api.workouts.remove(id);
    setData((d) => ({ ...d, workouts: d.workouts.filter((w) => w.id !== id) }));
  }, []);

  const clearMembers = useCallback(async () => {
    await api.members.clear();
    setData((d) => ({ ...d, members: [] }));
  }, []);

  const createMessage = useCallback(async (b) => {
    const c = await api.messages.create(b);
    setData((d) => ({ ...d, messages: [c, ...d.messages] }));
    return c;
  }, []);
  const deleteMessage = useCallback(async (id) => {
    await api.messages.remove(id);
    setData((d) => ({ ...d, messages: d.messages.filter((m) => m.id !== id) }));
  }, []);
  const clearMessages = useCallback(async () => {
    await api.messages.clear();
    setData((d) => ({ ...d, messages: [] }));
  }, []);

  const resetAll = useCallback(async () => { await load(); }, [load]);

  const value = useMemo(() => ({
    ...data, loading, error, refresh: load, auth, setAuth,
    updateSettings,
    createPlan, updatePlan, deletePlan,
    createTrainer, updateTrainer, deleteTrainer,
    createWorkout, updateWorkout, deleteWorkout,
    clearMembers, createMessage, deleteMessage, clearMessages, resetAll,
  }), [data, loading, error, load, auth, updateSettings,
    createPlan, updatePlan, deletePlan, createTrainer, updateTrainer, deleteTrainer,
    createWorkout, updateWorkout, deleteWorkout, clearMembers,
    createMessage, deleteMessage, clearMessages, resetAll]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
