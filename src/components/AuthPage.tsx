import { useState, type FormEvent } from 'react';
import { useCurrentUser } from '../context/CurrentUserContext';
import { registerUser } from '../services/api';

type Props = {
  onSuccess: () => void;
};

export function AuthPage({ onSuccess }: Props) {
  const { loginUser } = useCurrentUser();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerUser({ name, email, password });
      }

      await loginUser(email, password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível acessar a conta.'
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode);
    setError('');
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Bem-vindo ao MatchPoint</p>
        <h2>{mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}</h2>
        <p className="muted">
          {mode === 'login'
            ? 'Entre para criar partidas e participar dos jogos.'
            : 'Cadastre-se para começar a participar.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Nome
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}

          <label>
            E-mail
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Senha
            <input
              required
              type="password"
              minLength={mode === 'register' ? 6 : undefined}
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="error" role="alert">{error}</p>}

          <button className="button" type="submit" disabled={loading}>
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() =>
            changeMode(mode === 'login' ? 'register' : 'login')
          }
        >
          {mode === 'login'
            ? 'Ainda não tenho conta'
            : 'Já tenho uma conta'}
        </button>
      </div>
    </section>
  );
}