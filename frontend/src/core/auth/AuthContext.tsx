import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type UserRole =
  | "admin"
  | "driver"
  | "buyer"
  | "seller"
  | "warehouse"
  | "guest"
  | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  piUsername: string | null;
  userRole: UserRole;
  loading: boolean;

  user: any;

  setAuth: (data: {
    piUsername: string;
    userRole: UserRole;
    user?: any;
  }) => void;

  clearAuth: () => void;

  login: (userData: any, userRole: UserRole) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);

  const [piUsername, setPiUsername] =
    useState<string | null>(null);

  const [userRole, setUserRole] =
    useState<UserRole>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth =
      localStorage.getItem("ghnpi_auth");

    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);

        setUser(parsed.user || null);

        setPiUsername(
          parsed.piUsername ||
            parsed.user?.username ||
            null
        );

        setUserRole(parsed.userRole || null);
      } catch (error) {
        console.error(
          "Failed to restore auth session",
          error
        );

        localStorage.removeItem("ghnpi_auth");
      }
    }

    setLoading(false);
  }, []);

  const setAuth = ({
    piUsername,
    userRole,
    user,
  }: {
    piUsername: string;
    userRole: UserRole;
    user?: any;
  }) => {
    const authData = {
      piUsername,
      userRole,
      user: user || null,
    };

    setPiUsername(piUsername);

    setUserRole(userRole);

    setUser(user || null);

    localStorage.setItem(
      "ghnpi_auth",
      JSON.stringify(authData)
    );
  };

  const clearAuth = () => {
    setUser(null);

    setPiUsername(null);

    setUserRole(null);

    localStorage.removeItem("ghnpi_auth");
  };

  const login = (
    userData: any,
    role: UserRole
  ) => {
    setAuth({
      piUsername:
        userData?.username ||
        userData?.piUsername ||
        "guest",
      userRole: role,
      user: userData,
    });
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userRole,

        piUsername,

        userRole,

        loading,

        user,

        setAuth,

        clearAuth,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}