import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, clearTokens, getAccess, storeTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch `/auth/me/` and store the canonical user shape.
   * Never sets `loading` here — only the initial mount does. Callers that
   * want a loading indicator can use their own local state.
   */
  const refreshMe = useCallback(async () => {
    if (!getAccess()) {
      setUser(null);
      return null;
    }
    try {
      const { data } = await api.get("/auth/me/");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  // Initial bootstrap — load the user once, then release `loading`.
  useEffect(() => {
    let cancelled = false;
    refreshMe().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshMe]);

  /**
   * Password / OTP-based login. Stores the token pair, then always fetches
   * `/auth/me/` so `user` is the canonical UserMeSerializer payload
   * (data.user from /auth/token/ has a reduced shape — same fields, but
   * pulling from /auth/me/ guarantees consistency with every other screen).
   */
  const login = useCallback(async (identifier, password) => {
    const { data } = await api.post("/auth/token/", { identifier, password });
    storeTokens(data.access, data.refresh);

    // Try to hydrate from /auth/me/, falling back to the token user
    // if that call fails for any reason.
    let me = null;
    try {
      const res = await api.get("/auth/me/");
      me = res.data;
    } catch {
      me = data.user || null;
    }
    setUser(me);
    return { ...data, user: me };
  }, []);

  /**
   * Log in with an already-issued token pair (e.g. straight after OTP
   * verification, where the token response is returned by the backend).
   * Avoids a redundant password round-trip.
   */
  const loginWithTokens = useCallback(
    async ({ access, refresh, user: tokenUser }) => {
      storeTokens(access, refresh);

      // Prefer /auth/me/ for a consistent shape; fall back to whatever the
      // OTP flow returned if the fetch fails.
      let me = null;
      try {
        const res = await api.get("/auth/me/");
        me = res.data;
      } catch {
        me = tokenUser || null;
      }
      setUser(me);
      return me;
    },
    []
  );

  /**
   * Clear tokens + user state. Returns a resolved promise so callers can
   * `await logout()` from an onClick without branching on sync/async.
   */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    return Promise.resolve();
  }, []);

  /**
   * Shallow-merge update for the current user. Handy after a PATCH /profile/
   * or when the wizard persists `first_name` / `last_name` — keeps the nav
   * and dashboard in sync without a second `/auth/me/` call.
   */
  const updateUser = useCallback((partial) => {
    if (!partial || typeof partial !== "object") return;
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const isAuthenticated = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      loginWithTokens,
      logout,
      refreshMe,
      refreshUser: refreshMe, // alias for consumers that prefer the name
      updateUser,
      setUser,                // kept for backwards compatibility
    }),
    [user, loading, isAuthenticated, login, loginWithTokens, logout, refreshMe, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// ---------------------------------------------------------------------------
// Role → home route. Must stay in sync with the router in App.jsx.
// ---------------------------------------------------------------------------
export function roleHome(user) {
  if (!user) return "/";
  switch (user.role) {
    case "ADMIN":
      return "/app/admin";
    case "ORG_OFFICER": 
    case "ORG_SUPERVISOR":
      return "/app/org";
    case "TRAINEE":
    default:
      return "/app/trainee/dashboard";
  }
}