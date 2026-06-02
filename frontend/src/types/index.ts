// ── Auth ───────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'player' | 'analyst' | 'admin';
  avatarUrl: string | null;
  gameProfile: {
    gamesPlayed: number;
    totalPlaytimeMinutes: number;
    favoriteGame: string | null;
    rank: string;
    level: number;
    xp: number;
  };
  churnRisk: {
    score: number | null;
    label: 'low' | 'medium' | 'high' | null;
    predictedAt: string | null;
  };
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ── Events ─────────────────────────────────────────────────────
export interface GameEvent {
  _id: string;
  userId: string;
  sessionId: string;
  eventType: string;
  game: string;
  clientTimestamp: string;
  serverTimestamp: string;
  properties: Record<string, unknown>;
  device: {
    platform?: string;
    os?: string;
    appVersion?: string;
  };
  createdAt: string;
}

export interface EventsResponse {
  events: GameEvent[];
}

export interface EventsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── Stats ──────────────────────────────────────────────────────
export interface EventStats {
  summary: {
    totalEvents: number;
    uniqueGames: number;
    uniqueSessions: number;
    firstEvent: string | null;
    lastEvent: string | null;
  };
  byEventType: { eventType: string; count: number; lastOccurred: string }[];
  byGame: { game: string; count: number; lastPlayed: string }[];
  dailyActivity: { date: string; count: number }[];
}

// ── API Response wrapper ───────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: EventsMeta;
  errors?: { msg: string; param: string }[];
}
