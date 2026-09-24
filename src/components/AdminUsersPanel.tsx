import { useEffect, useState } from 'react';
import { useCurrentUser } from '../context/CurrentUserContext';
import { deleteUser, listUsers, type User } from '../services/api';

type Props = {
  onBack: () => void;
};

export function AdminUsersPanel({ onBack }: Props) {
  const { currentUserId, currentUser, refreshUsers, isAdmin } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      const nextUsers = await listUsers();
      setUsers(nextUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleDelete(userId: string) {
    if (userId === currentUserId) {
      setError('Você não pode remover a própria conta de administrador.');
      return;
    }

    const confirmed = window.confirm(
      'Deseja realmente excluir esta conta? Esta ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(userId);
      await refreshUsers(currentUserId);
      setUsers((previous) => previous.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário.');
    }
  }

  if (!isAdmin) {
    return (
      <section className="admin-panel">
        <p className="error">Acesso restrito ao administrador.</p>
        <button className="button secondary" type="button" onClick={onBack}>
          Voltar
        </button>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Painel administrativo</p>
          <h2>Gerenciar contas</h2>
        </div>

        <button className="button secondary" type="button" onClick={onBack}>
          Voltar
        </button>
      </div>

      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <div className="empty">
          <p>Nenhum usuário cadastrado.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="admin-user-list">
          {users.map((user) => (
            <article key={user.id} className="admin-user-card">
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                  {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </span>
              </div>

              <button
                className="button danger small"
                type="button"
                onClick={() => handleDelete(user.id)}
                disabled={user.id === currentUserId || user.role === 'ADMIN'}
              >
                {user.id === currentUserId ? 'Você' : 'Excluir conta'}
              </button>
            </article>
          ))}
        </div>
      )}

      <p className="muted admin-note">
        {currentUser?.role === 'ADMIN'
          ? 'Administrador autenticado: controle total do sistema.'
          : 'Acesso administrativo ativo.'}
      </p>
    </section>
  );
}
