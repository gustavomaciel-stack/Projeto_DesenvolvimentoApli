import { sportIcon } from '../data/sports';
import { useEffect, useState } from 'react';
import {
  deleteMatch,
  getParticipants,
  listMatches,
  type Match,
} from '../services/api';
import { useCurrentUser } from '../context/CurrentUserContext';

type Props = {
  mode: 'all' | 'mine';
  onCreate: () => void;
  onSelect: (id: string) => void;
};

const statusLabels = {
  ABERTA: 'Aberta',
  COMPLETA: 'Completa',
  CANCELADA: 'Cancelada',
  CONCLUIDA: 'Concluída',
};

export function MatchList({ mode, onCreate, onSelect }: Props) {
  const { currentUserId, users, isAdmin } = useCurrentUser();
  const [sportFilter, setSportFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [mineTab, setMineTab] = useState<'organized' | 'joined'>('organized');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function handleDelete(matchId: string) {
    const confirmed = window.confirm(
      'Deseja excluir esta partida e todas as confirmações relacionadas?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMatch(matchId);
      setMatches((previous) => previous.filter((match) => match.id !== matchId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir partida.');
    }
  }

  const currentUser = users.find((user) => user.id === currentUserId);

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      setLoading(true);
      setError('');

      try {
        const allMatches = await listMatches();

        if (mode === 'all') {
          if (active) setMatches(allMatches);
          return;
        }

        if (!currentUser) {
          if (active) setMatches([]);
          return;
        }

        const myMatches = await Promise.all(
          allMatches.map(async (match) => {
            if (match.organizer.id === currentUserId) {
              return match;
            }

            const participants = await getParticipants(match.id);
            const isRegistered = participants.some(
              (participant) => participant.email === currentUser.email
            );

            return isRegistered ? match : null;
          })
        );

        if (active) {
          setMatches(
            myMatches.filter((match): match is Match => match !== null)
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Erro ao carregar partidas.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMatches();

    return () => {
      active = false;
    };
  }, [mode, currentUserId, currentUser?.email]);

  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibleMatches = matches.filter((match) => {
    const organized = match.organizer.id === currentUserId;
    return (mode !== 'mine' || (mineTab === 'organized' ? organized : !organized))
      && normalize(match.sport).includes(normalize(sportFilter.trim()))
      && (!dateFilter || match.date.slice(0, 10) === dateFilter)
      && normalize(`${match.location} ${match.address ?? ''}`).includes(normalize(locationFilter.trim()));
  });

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Agenda esportiva</p>
          <h2>
            {mode === 'mine'
              ? 'Minhas partidas'
              : 'Partidas disponíveis'}
          </h2>
        </div>

        <button className="button" onClick={onCreate}>
          Criar partida
        </button>
      </div>

      {mode === 'mine' && <div className="form-actions" aria-label="Tipo de participação">
        <button type="button" className={`button ${mineTab === 'organized' ? '' : 'secondary'}`} aria-pressed={mineTab === 'organized'} onClick={() => setMineTab('organized')}>Organizadas por mim</button>
        <button type="button" className={`button ${mineTab === 'joined' ? '' : 'secondary'}`} aria-pressed={mineTab === 'joined'} onClick={() => setMineTab('joined')}>Vou participar</button>
      </div>}
      <div className="match-filters">
        <label>Esporte<input placeholder="Ex.: futebol" value={sportFilter} onChange={(event) => setSportFilter(event.target.value)} /></label>
        <label>Data<input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></label>
        <label>Local ou endereço<input placeholder="Quadra, bairro ou cidade" value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} /></label>
        <button type="button" className="button secondary" onClick={() => { setSportFilter(''); setDateFilter(''); setLocationFilter(''); }}>Limpar filtros</button>
      </div>
      {!loading && !error && <p className="muted" aria-live="polite">{visibleMatches.length} partida(s) encontrada(s)</p>}
      {loading && <p>Carregando partidas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && visibleMatches.length === 0 && (
        <div className="empty">
          <p>
            {mode === 'mine'
              ? 'Nenhuma partida nesta categoria com os filtros selecionados.'
              : 'Nenhuma partida encontrada com os filtros selecionados.'}
          </p>
          <button className="button" onClick={onCreate}>
            Criar a primeira partida
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="match-grid">
          {visibleMatches.map((match) => (
            <article className="match-card" key={match.id}>
              <div
                className={`status status-${match.status.toLowerCase()}`}
              >
                {statusLabels[match.status]}
              </div>

              <div className="sport-emblem" aria-hidden="true">{sportIcon(match.sport)}</div><h3>{match.sport}</h3>
              <p>{match.location}</p>
              <p><strong>{match.pricePerPerson ? `${(match.pricePerPerson / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por pessoa` : 'Grátis'}</strong></p>
              {match.address && <p className="muted">{match.address}</p>}
              <p>
                <strong>
                  {new Date(match.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </strong>{' '}
                às {match.time}
              </p>
              <p>
                {match.confirmedParticipants ?? 0}/{match.vacancies}{' '}
                vagas confirmadas
              </p>
              <p className="muted">
                Organizada por {match.organizer.name}
              </p>

              <div className="match-card-actions">
                <button
                  className="button secondary"
                  onClick={() => onSelect(match.id)}
                  type="button"
                >
                  Ver detalhes
                </button>

                {isAdmin && (
                  <button
                    className="button danger small"
                    onClick={() => void handleDelete(match.id)}
                    type="button"
                  >
                    Excluir
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}