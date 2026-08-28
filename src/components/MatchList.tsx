import { useEffect, useState } from 'react';
import { listMatches, type Match } from '../services/api';

type Props = { onCreate: () => void; onSelect: (id: string) => void };

const statusLabels = { ABERTA: 'Aberta', COMPLETA: 'Completa', CANCELADA: 'Cancelada', CONCLUIDA: 'Concluída' };

export function MatchList({ onCreate, onSelect }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadMatches() {
    setLoading(true);
    try { setMatches(await listMatches()); setError(''); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao carregar partidas.'); } finally { setLoading(false); }
  }

  useEffect(() => { void loadMatches(); }, []);

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">Agenda esportiva</p><h2>Partidas disponíveis</h2></div><button className="button" onClick={onCreate}>Criar partida</button></div>
      {loading && <p>Carregando partidas...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && matches.length === 0 && <div className="empty"><p>Nenhuma partida cadastrada.</p><button className="button" onClick={onCreate}>Criar a primeira partida</button></div>}
      <div className="match-grid">
        {matches.map((match) => <article className="match-card" key={match.id}>
          <div className={`status status-${match.status.toLowerCase()}`}>{statusLabels[match.status]}</div>
          <h3>{match.sport}</h3><p>{match.location}</p>
          <p><strong>{new Date(match.date).toLocaleDateString('pt-BR')}</strong> às {match.time}</p>
          <p>{match.confirmedParticipants ?? 0}/{match.vacancies} vagas confirmadas</p>
          <p className="muted">Organizada por {match.organizer.name}</p>
          <button className="button secondary" onClick={() => onSelect(match.id)}>Ver detalhes</button>
        </article>)}
      </div>
    </section>
  );
}
