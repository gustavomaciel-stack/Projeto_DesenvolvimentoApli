import { useState } from 'react';
import {
  CurrentUserProvider,
  useCurrentUser,
} from './context/CurrentUserContext';
import { AuthPage } from './components/AuthPage';
import { MatchList } from './components/MatchList';
import { MatchDetail } from './components/MatchDetail';
import { MatchForm } from './components/MatchForm';
import type { Match } from './services/api';
import './App.css';

type View = 'list' | 'my-matches' | 'detail' | 'create' | 'edit' | 'login';

function AppContent() {
  const { currentUserId, isAuthenticated, logoutUser, users } =
    useCurrentUser();

  const [view, setView] = useState<View>('login');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [editingMatch, setEditingMatch] = useState<Match>();

  const currentUser = users.find((user) => user.id === currentUserId);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Partidas entre amigos</p>
          <h1>MatchPoint</h1>

          {view !== 'login' && isAuthenticated && (
            <p className="topbar-user">
              Olá, {currentUser?.name ?? 'jogador'}
            </p>
          )}
        </div>

        {view !== 'login' && (
          <nav className="topbar-actions" aria-label="Navegação principal">
            <button
              type="button"
              onClick={() => setView('my-matches')}
            >
              Minhas partidas
            </button>

            <button
              type="button"
              onClick={() => setView('list')}
            >
              Explorar partidas
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setView('login');
                }}
              >
                Sair
              </button>
            ) : (
              <button type="button" onClick={() => setView('login')}>
                Entrar
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="content">
        {view === 'login' && (
          <AuthPage onSuccess={() => setView('my-matches')} />
        )}

        {view === 'list' && (
          <MatchList
            mode="all"
            onCreate={() => setView('create')}
            onSelect={(id) => {
              setSelectedMatchId(id);
              setView('detail');
            }}
          />
        )}

        {view === 'my-matches' && (
          <MatchList
            mode="mine"
            onCreate={() => setView('create')}
            onSelect={(id) => {
              setSelectedMatchId(id);
              setView('detail');
            }}
          />
        )}

        {view === 'detail' && (
          <MatchDetail
            id={selectedMatchId}
            onBack={() => setView('my-matches')}
            onEdit={(match) => {
              setEditingMatch(match);
              setView('edit');
            }}
          />
        )}

        {view === 'create' && (
          <MatchForm
            mode="create"
            onCancel={() => setView('my-matches')}
            onSuccess={(id) => {
              setSelectedMatchId(id);
              setView('detail');
            }}
          />
        )}

        {view === 'edit' && editingMatch && (
          <MatchForm
            mode="edit"
            initialMatch={editingMatch}
            onCancel={() => setView('detail')}
            onSuccess={() => setView('detail')}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <CurrentUserProvider>
      <AppContent />
    </CurrentUserProvider>
  );
}

export default App;