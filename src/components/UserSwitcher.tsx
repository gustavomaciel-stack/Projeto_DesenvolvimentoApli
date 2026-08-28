import { useState, type FormEvent } from 'react';
import { registerUser } from '../services/api';
import { useCurrentUser } from '../context/CurrentUserContext';

export function UserSwitcher() {
  const { currentUserId, setCurrentUserId, users, refreshUsers } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const user = await registerUser(form);
      await refreshUsers(user.id);
      setCurrentUserId(user.id);
      setForm({ name: '', email: '', password: '' });
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar usuário.');
    }
  }

  return (
    <div className="user-switcher">
      <label htmlFor="current-user">Usuário atual</label>
      <select id="current-user" value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)}>
        <option value="">Selecione um usuário</option>
        {users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
      </select>
      <button className="button secondary" type="button" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? 'Fechar cadastro' : 'Novo usuário'}
      </button>
      {isOpen && (
        <form className="quick-form" onSubmit={handleSubmit}>
          <input required placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input required type="email" placeholder="E-mail" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input required minLength={6} type="password" placeholder="Senha (mín. 6 caracteres)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="button" type="submit">Cadastrar</button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
}
