import { useState, type FormEvent } from "react";
import { registerUser } from "../services/api";
import { useCurrentUser } from "../context/CurrentUserContext";

export function UserSwitcher() {
  const {
    currentUserId,
    setCurrentUserId,
    isAuthenticated,
    loginUser,
    logoutUser,
    users,
    refreshUsers,
  } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const user = await registerUser(form);
      await loginUser(form.email, form.password);
      await refreshUsers(user.id);
      setForm({ name: "", email: "", password: "" });
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cadastrar usuário.",
      );
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await loginUser(loginForm.email, loginForm.password);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar login.");
    }
  }

  return (
    <div className="user-switcher">
      <label htmlFor="current-user">Usuário autenticado</label>
      <select
        id="current-user"
        value={currentUserId}
        onChange={(event) => setCurrentUserId(event.target.value)}
        disabled
      >
        <option value="">Selecione um usuário</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      {isAuthenticated && (
        <button className="button secondary" type="button" onClick={logoutUser}>
          Sair
        </button>
      )}
      {!isAuthenticated && (
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            setMode("login");
            setIsOpen((open) => !open);
          }}
        >
          {isOpen && mode === "login" ? "Fechar login" : "Entrar"}
        </button>
      )}
      {!isAuthenticated && (
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            setMode("register");
            setIsOpen(true);
          }}
        >
          Criar conta
        </button>
      )}
      {isAuthenticated && (
        <button
          className="button secondary"
          type="button"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Fechar cadastro" : "Novo usuário"}
        </button>
      )}
      {!isAuthenticated && isOpen && mode === "login" && (
        <form className="quick-form" onSubmit={handleLogin}>
          <input
            required
            type="email"
            placeholder="E-mail"
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm({ ...loginForm, email: event.target.value })
            }
          />
          <input
            required
            type="password"
            placeholder="Senha"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm({ ...loginForm, password: event.target.value })
            }
          />
          <button className="button" type="submit">
            Entrar
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
      {!isAuthenticated && isOpen && mode === "login" && (
        <button
          className="button secondary"
          type="button"
          onClick={() => setMode("register")}
        >
          Ainda não tenho conta
        </button>
      )}
      {isOpen && (isAuthenticated || mode === "register") && (
        <form className="quick-form" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Nome"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            required
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
          <input
            required
            minLength={6}
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
          <button className="button" type="submit">
            Cadastrar
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
}
