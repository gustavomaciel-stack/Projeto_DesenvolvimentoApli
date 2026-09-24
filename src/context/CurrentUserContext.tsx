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
  currentUser?: User;
  isAdmin: boolean;
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
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getToken()),
  );

  const refreshUsers = async (preferredUserId?: string) => {
    const nextUsers = await listUsers();
    setUsers(nextUsers);
    const authenticatedUserId =
      preferredUserId ?? getTokenUserId(getToken() ?? "");

    let nextCurrentUserId = "";

    setCurrentUserId((selectedId) => {
      if (
        authenticatedUserId &&
        nextUsers.some((user) => user.id === authenticatedUserId)
      ) {
        nextCurrentUserId = authenticatedUserId;
        return authenticatedUserId;
      }

      if (!getToken()) {
        nextCurrentUserId = "";
        return "";
      }

      nextCurrentUserId = nextUsers.some((user) => user.id === selectedId)
        ? selectedId
        : (nextUsers[0]?.id ?? "");
      return nextCurrentUserId;
    });

    setCurrentUser(
      nextUsers.find((user) => user.id === nextCurrentUserId) ?? undefined,
    );
  };

  const loginUser = async (email: string, password: string) => {
    const { token, user } = await login(email, password);
    saveToken(token);
    const userId = getTokenUserId(token) || user?.id || "";
    setIsAuthenticated(true);
    await refreshUsers(userId);
  };

  const logoutUser = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentUserId("");
    setCurrentUser(undefined);
  };

  useEffect(() => {
    const token = getToken();
    void refreshUsers(token ? getTokenUserId(token) : undefined);
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUserId,
        currentUser,
        isAdmin: currentUser?.role === 'ADMIN',
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
