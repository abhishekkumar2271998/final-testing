// Auth context for the marketplace flows. Holds the current user, exposes
// sign-in / sign-up / sign-out, and hydrates the session from a stored token
// on mount. Backed by the JWT client in `@/lib/api`.
import * as React from 'react';
import { api, tokenStore } from '@/lib/api';

export type Role = 'buyer' | 'seller';

export interface Profile {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone: string;
  location: string;
  updated_at?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: Role;
  profile: Profile;
}

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<AuthUser>;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signOut: () => void;
  refresh: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchMe = React.useCallback(async () => {
    const { data } = await api.get<AuthUser>('/profile/me/');
    setUser(data);
  }, []);

  // Hydrate from a stored token on first mount.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!tokenStore.access) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get<AuthUser>('/profile/me/');
        if (!cancelled) setUser(data);
      } catch {
        tokenStore.clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = React.useCallback(
    async (username: string, password: string) => {
      const { data } = await api.post('/auth/login/', { username, password });
      tokenStore.set(data.access, data.refresh);
      const authedUser = data.user as AuthUser;
      setUser(authedUser);
      return authedUser;
    },
    [],
  );

  const signUp = React.useCallback(
    async (input: SignUpInput) => {
      await api.post('/auth/register/', input);
      // Registration doesn't return tokens — log in immediately after.
      return signIn(input.username, input.password);
    },
    [signIn],
  );

  const signOut = React.useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refresh: fetchMe,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
