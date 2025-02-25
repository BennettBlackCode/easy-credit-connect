/**
 * @fileoverview Authentication context provider that manages user session state
 * This module provides:
 * - Global authentication state management
 * - Supabase authentication integration
 * - Session persistence and real-time updates
 * - Type-safe authentication context
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Type definition for the authentication context value
 * @typedef {Object} AuthContextType
 * @property {Session | null} session - Current user session or null if not authenticated
 * @property {boolean} isLoading - Loading state while checking authentication
 */
type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

/**
 * Authentication Provider component that manages the global authentication state
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
