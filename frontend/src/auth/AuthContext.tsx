
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import type { Role } from "../data/mockUsers";

export interface TaxMateUser {
  user_id: number;
  email: string;
  roles: Role[];
  taxpayer_profile: {
    full_name: string;
  } | null;
  advisor_profile: {
    qualifications: string | null;
    experience_years: number | null;
  } | null;
}

interface AuthContextType {
  user: TaxMateUser | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    error: auth0Error,
  } = useAuth0();

  const [user, setUser] = useState<TaxMateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Auth0 authentication state:", {
    isAuthenticated,
    isAuth0Loading,
    auth0Error,
  });

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to retrieve your TaxMate account."
        );
      }

      setUser(result.data as TaxMateUser);
    } catch (err) {
      setUser(null);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your account."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuth0Loading) return;

    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        void refreshUser();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAuth0Loading, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isAuth0Loading || isLoading,
        error: error || auth0Error?.message || null,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
