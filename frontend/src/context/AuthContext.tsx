import
{
  createContext,
  useContext,
  useState,
  useEffect,

} from "react";
import type { ReactNode, } from 'react'
import API from "../utils/api";

type Role = "seller" | "customer";

interface User
{
  _id: string;
  name: string;
  role: Role;
}

interface AuthState
{
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
}

interface AuthContextType
{
  auth: AuthState;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) =>
{
  const [auth, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    loading: true,
  });

  const setUser = (user: User | null) =>
  {
    setAuthState({
      user,
      isLoggedIn: !!user,
      loading: false,
    });
  };

  // 🔥 Restore session on app load
  useEffect(() =>
  {
    let active = true;

    const loadUser = async () =>
    {
      try
      {
        const res = await API.get("/auth/me");

        if (!active) return;

        setAuthState({
          user: res.data.user,
          isLoggedIn: true,
          loading: false,
        });
      } catch
      {
        if (!active) return;

        setAuthState({
          user: null,
          isLoggedIn: false,
          loading: false,
        });
      }
    };

    loadUser();

    // 🔥 CRITICAL cleanup
    return () =>
    {
      active = false;
    };
  }, []);




  // 🔥 Logout
  const logout = async () =>
  {
    try
    {
      await API.post("/auth/logout");
    } finally
    {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
{
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

console.log("AUTH PROVIDER MOUNTED");
