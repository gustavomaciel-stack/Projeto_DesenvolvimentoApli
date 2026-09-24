import { useEffect, useState } from 'react';
import {
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
  const { currentUserId, users } = useCurrentUser();
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

      {loading && <p>Carregando partidas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && matches.length === 0 && (
        <div className="empty">
          <p>
            {mode === 'mine'
              ? 'Você ainda não criou nem entrou em uma partida.'
              : 'Nenhuma partida cadastrada.'}
          </p>
          <button className="button" onClick={onCreate}>
            Criar a primeira partida
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="match-grid">
          {matches.map((match) => (
            <article className="match-card" key={match.id}>
              <div
                className={`status status-${match.status.toLowerCase()}`}
              >
                {statusLabels[match.status]}
              </div>

              <h3>{match.sport}</h3>
              <p>{match.location}</p>
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

              <button
                className="button secondary"
                onClick={() => onSelect(match.id)}
              >
                Ver detalhes
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}