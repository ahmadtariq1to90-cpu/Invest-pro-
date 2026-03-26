import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Mock implementation
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    if (!isFirebaseConfigured) {
      localStorage.setItem("mockUser", JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await import("firebase/auth").then(({ signOut }) => signOut(auth));
    }
    setUser(null);
    if (!isFirebaseConfigured) {
      localStorage.removeItem("mockUser");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
