"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getToken,
  getTokenUserId,
  listUsers,
  login,
  logout,
  saveToken,
  type User,
} from "../services/api";

type CurrentUserContextValue = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  users: User[];
  refreshUsers: (preferredUserId?: string) => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(
  undefined,
);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getToken()),
  );

  const refreshUsers = async (preferredUserId?: string) => {
    const nextUsers = await listUsers();
    setUsers(nextUsers);
    const authenticatedUserId =
      preferredUserId ?? getTokenUserId(getToken() ?? "");
    setCurrentUserId((selectedId) => {
      if (
        authenticatedUserId &&
        nextUsers.some((user) => user.id === authenticatedUserId)
      )
        return authenticatedUserId;
      if (!getToken()) return "";
      return nextUsers.some((user) => user.id === selectedId)
        ? selectedId
        : (nextUsers[0]?.id ?? "");
    });
  };

  const loginUser = async (email: string, password: string) => {
    const { token } = await login(email, password);
    saveToken(token);
    const userId = getTokenUserId(token);
    setIsAuthenticated(true);
    await refreshUsers(userId);
  };

  const logoutUser = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentUserId("");
  };

  useEffect(() => {
    const token = getToken();
    void refreshUsers(token ? getTokenUserId(token) : undefined);
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        isAuthenticated,
        loginUser,
        logoutUser,
        users,
        refreshUsers,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context)
    throw new Error(
      "useCurrentUser deve ser usado dentro de CurrentUserProvider.",
    );
  return context;
}
