import { useState, type FormEvent } from 'react';
import { createMatch, updateMatch, type Match } from '../services/api';
import { useCurrentUser } from '../context/CurrentUserContext';

type Props = { mode: 'create' | 'edit'; initialMatch?: Match; onSuccess: (id: string) => void; onCancel: () => void };

export function MatchForm({ mode, initialMatch, onSuccess, onCancel }: Props) {
  const { currentUserId } = useCurrentUser();
  const [form, setForm] = useState({ sport: initialMatch?.sport ?? '', location: initialMatch?.location ?? '', date: initialMatch?.date.slice(0, 10) ?? '', time: initialMatch?.time ?? '', vacancies: String(initialMatch?.vacancies ?? 1) });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentUserId) { setError('Selecione um usuário atual antes de continuar.'); return; }
    setLoading(true); setError('');
    try {
      const data = { ...form, vacancies: Number(form.vacancies), organizerId: currentUserId };
      const match = mode === 'create' ? await createMatch(data) : await updateMatch(initialMatch!.id, data);
      onSuccess(match.id);
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao salvar partida.'); } finally { setLoading(false); }
  }

  return <section className="form-section"><p className="eyebrow">MatchPoint</p><h2>{mode === 'create' ? 'Criar partida' : 'Editar partida'}</h2><form className="match-form" onSubmit={handleSubmit}>
    <label>Esporte<input required value={form.sport} onChange={(event) => setForm({ ...form, sport: event.target.value })} /></label>
    <label>Local<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
    <label>Data<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
    <label>Horário<input required type="text" placeholder="19:00" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></label>
    <label>Vagas<input required min="1" type="number" value={form.vacancies} onChange={(event) => setForm({ ...form, vacancies: event.target.value })} /></label>
    {error && <p className="error">{error}</p>}<div className="form-actions"><button className="button secondary" type="button" onClick={onCancel}>Voltar</button><button className="button" disabled={loading}>{loading ? 'Salvando...' : 'Salvar partida'}</button></div>
  </form></section>;
}
