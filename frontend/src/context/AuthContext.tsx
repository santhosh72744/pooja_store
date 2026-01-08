'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

/* =====================
   TYPES
===================== */
export type User = {
  id: string;
  email: string;
  name: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupPayload) => Promise<void>;
  logout: () => void;
};

/* =====================
   CONTEXT
===================== */
const AuthContext = createContext<AuthContextType | null>(null);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/* =====================
   PROVIDER
===================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     RESTORE SESSION
  ====================== */
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (
        token &&
        storedUser &&
        storedUser !== 'undefined'
      ) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      // corrupted storage → clean up
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================
     LOGIN
  ====================== */
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Invalid email or password');
    }

    const data = await res.json();

    localStorage.setItem('token', data.token);

    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    router.push('/');
  };

  /* =====================
     SIGNUP
  ====================== */
  const signup = async (payload: SignupPayload) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Signup failed');
    }

    const data = await res.json();

    localStorage.setItem('token', data.token);

    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    router.push('/');
  };

  /* =====================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================
   HOOK
===================== */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
