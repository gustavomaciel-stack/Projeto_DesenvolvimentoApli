'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { listUsers, type User } from '../services/api';

type CurrentUserContextValue = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  users: User[];
  refreshUsers: (preferredUserId?: string) => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');

  const refreshUsers = async (preferredUserId?: string) => {
    const nextUsers = await listUsers();
    setUsers(nextUsers);
    setCurrentUserId((selectedId) => {
      if (preferredUserId && nextUsers.some((user) => user.id === preferredUserId)) return preferredUserId;
      return nextUsers.some((user) => user.id === selectedId) ? selectedId : nextUsers[0]?.id ?? '';
    });
  };

  useEffect(() => {
    void refreshUsers();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUserId, setCurrentUserId, users, refreshUsers }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) throw new Error('useCurrentUser deve ser usado dentro de CurrentUserProvider.');
  return context;
}