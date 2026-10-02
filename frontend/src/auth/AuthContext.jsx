import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "wanka-session";

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const value = useMemo(
    () => ({
      session,
      async login(credentials) {
        const nextSession = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        setSession(nextSession);
      },
      logout() {
        sessionStorage.removeItem(STORAGE_KEY);
        setSession(null);
      },
    }),
    [session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
