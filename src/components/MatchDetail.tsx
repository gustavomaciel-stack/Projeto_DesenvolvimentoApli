import { useEffect, useState } from 'react';
import {
  cancelMatch,
  getMatch,
  joinMatch,
  leaveMatch,
  type Match,
} from '../services/api';
import { useCurrentUser } from '../context/CurrentUserContext';

type Props = {
  id: string;
  onBack: () => void;
  onEdit: (match: Match) => void;
};

const labels = {
  ABERTA: 'Aberta',
  COMPLETA: 'Completa',
  CANCELADA: 'Cancelada',
  CONCLUIDA: 'Concluída',
};

export function MatchDetail({ id, onBack, onEdit }: Props) {
  const { currentUserId, users } = useCurrentUser();
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      setMatch(await getMatch(id));
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar detalhes.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  async function action(callback: () => Promise<unknown>) {
    try {
      await callback();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na operação.');
    }
  }

  if (loading) {
    return (
      <section>
        <p>Carregando detalhes...</p>
      </section>
    );
  }

  if (!match) {
    return (
      <section>
        <p className="error">{error || 'Partida não encontrada.'}</p>
        <button className="button secondary" onClick={onBack}>
          Voltar
        </button>
      </section>
    );
  }

  const participants = match.participants ?? [];
  const isOrganizer = currentUserId === match.organizerId;
  const currentUser = users.find((user) => user.id === currentUserId);
  const isParticipant = Boolean(
    currentUser &&
      participants.some(
        (participant) => participant.email === currentUser.email
      )
  );

  return (
    <section>
      <div className="detail-header">
        <div>
          <p className="eyebrow">Detalhes da partida</p>
          <h2>{match.sport}</h2>
          <p>
            {match.location} ·{' '}
            {new Date(match.date).toLocaleDateString('pt-BR')} às {match.time}
          </p>
        </div>

        <span className={`status status-${match.status.toLowerCase()}`}>
          {labels[match.status]}
        </span>
      </div>

      <div className="detail-panel">
        <p>
          <strong>Organizador:</strong> {match.organizer.name} (
          {match.organizer.email})
        </p>
        <p>
          <strong>Vagas:</strong> {participants.length}/{match.vacancies}
        </p>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button className="button secondary" onClick={onBack}>
          Voltar
        </button>

        {isOrganizer &&
          match.status !== 'CANCELADA' &&
          match.status !== 'CONCLUIDA' && (
            <>
              <button
                className="button secondary"
                onClick={() => onEdit(match)}
              >
                Editar
              </button>
              <button
                className="button danger"
                onClick={() =>
                  void action(() => cancelMatch(id, currentUserId))
                }
              >
                Cancelar partida
              </button>
            </>
          )}

        {!isOrganizer && isParticipant && (
          <button
            className="button secondary"
            onClick={() => void action(() => leaveMatch(id, currentUserId))}
          >
            Sair da partida
          </button>
        )}

        {!isOrganizer &&
          !isParticipant &&
          match.status === 'ABERTA' && (
            <button
              className="button"
              onClick={() =>
                void action(() => joinMatch(id, currentUserId))
              }
              disabled={!currentUserId}
            >
              Entrar na partida
            </button>
          )}
      </div>

      <h3>Participantes confirmados</h3>

      {participants.length === 0 ? (
        <p>Nenhum participante confirmado.</p>
      ) : (
        <ul className="participant-list">
          {participants.map((participant) => (
            <li key={participant.email}>
              <strong>{participant.name}</strong>
              <span>{participant.email}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}