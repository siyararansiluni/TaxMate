import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Role } from "../data/mockUsers";
import { clearSession, getAccessToken, saveSession } from "./session";

export interface TaxMateUser {
  user_id: string;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TaxMateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearSession();
        }
        throw new Error(
          result.message || "Unable to retrieve the authenticated user."
        );
      }

      const authenticatedUser = result.data as TaxMateUser;
      const role = authenticatedUser.roles[0];

      if (role) {
        saveSession(
          {
            email: authenticatedUser.email,
            name:
              authenticatedUser.taxpayer_profile?.full_name ||
              authenticatedUser.advisor_profile?.qualifications ||
              "TaxMate User",
            role,
          },
          false
        );
      }

      setUser(authenticatedUser);
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve the authenticated user."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        void refreshUser();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
