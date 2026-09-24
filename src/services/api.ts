const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const TOKEN_STORAGE_KEY = "matchpoint_token";

export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type MatchStatus = "ABERTA" | "COMPLETA" | "CONCLUIDA" | "CANCELADA";

export type Match = {
  id: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  vacancies: number;
  status: MatchStatus;
  organizerId: string;
  organizer: User;
  confirmedParticipants?: number;
  participants?: Participant[];
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  name: string;
  email: string;
  createdAt?: string;
};

export type MatchInput = {
  sport: string;
  location: string;
  date: string;
  time: string;
  vacancies: number;
  organizerId: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    throw new Error(
      body?.message ?? "Não foi possível concluir a solicitação.",
    );
  }

  return body as T;
}

export function login(email: string, password: string) {
  return request<{ token: string; user?: User }>('/auth/login', {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getTokenUserId(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    return typeof decoded.userId === "string" ? decoded.userId : "";
  } catch {
    return "";
  }
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listUsers() {
  return request<User[]>("/users");
}

export function getUser(id: string) {
  return request<User>(`/users/${id}`);
}

export function listMatches() {
  return request<Match[]>("/matches");
}

export function getMatch(id: string) {
  return request<Match>(`/matches/${id}`);
}

export function createMatch(data: MatchInput) {
  return request<Match>("/matches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMatch(
  id: string,
  data: Partial<Omit<MatchInput, "organizerId">> & { organizerId: string },
) {
  return request<Match>(`/matches/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function cancelMatch(id: string, organizerId: string) {
  return request<Match>(`/matches/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ organizerId }),
  });
}

export function deleteMatch(id: string) {
  return request<{ deleted: true }>(`/matches/${id}`, {
    method: "DELETE",
  });
}

export function deleteUser(id: string) {
  return request<{ deleted: true }>(`/users/${id}`, {
    method: "DELETE",
  });
}

export function joinMatch(id: string, userId: string) {
  return request(`/matches/${id}/join`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function leaveMatch(id: string, userId: string) {
  return request(`/matches/${id}/leave`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function getParticipants(id: string) {
  return request<Participant[]>(`/matches/${id}/participants`);
}