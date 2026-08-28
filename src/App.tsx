import { useState } from 'react';
import { CurrentUserProvider } from './context/CurrentUserContext';
import { UserSwitcher } from './components/UserSwitcher';
import { MatchList } from './components/MatchList';
import { MatchDetail } from './components/MatchDetail';
import { MatchForm } from './components/MatchForm';
import type { Match } from './services/api';
import './App.css';

type View = 'list' | 'detail' | 'create' | 'edit';

function App() {
  const [view, setView] = useState<View>('list');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [editingMatch, setEditingMatch] = useState<Match>();

  return <CurrentUserProvider>
    <div className="app-shell">
      <header className="topbar"><div><p className="eyebrow">Partidas entre amigos</p><h1>MatchPoint</h1></div><UserSwitcher /></header>
      <main className="content">
        {view === 'list' && <MatchList onCreate={() => setView('create')} onSelect={(id) => { setSelectedMatchId(id); setView('detail'); }} />}
        {view === 'detail' && <MatchDetail id={selectedMatchId} onBack={() => setView('list')} onEdit={(match) => { setEditingMatch(match); setView('edit'); }} />}
        {view === 'create' && <MatchForm mode="create" onCancel={() => setView('list')} onSuccess={(id) => { setSelectedMatchId(id); setView('detail'); }} />}
        {view === 'edit' && editingMatch && <MatchForm mode="edit" initialMatch={editingMatch} onCancel={() => setView('detail')} onSuccess={() => setView('detail')} />}
      </main>
    </div>
  </CurrentUserProvider>;
}

export default App;