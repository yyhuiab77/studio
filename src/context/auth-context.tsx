"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { User } from "@/lib/types";
import { users } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  login: (id: string, accessKey: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserFromCookie = useCallback(() => {
    const userId = Cookies.get("lift-auth-session");
    if (userId) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        Cookies.remove("lift-auth-session");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromCookie();
  }, [loadUserFromCookie]);

  const login = async (id: string, accessKey: string): Promise<boolean> => {
    const foundUser = users.find((u) => u.id === id && u.accessKey === accessKey);
    if (foundUser) {
      setUser(foundUser);
      Cookies.set("lift-auth-session", foundUser.id, { expires: 7 }); // expires in 7 days
      router.push("/dashboard");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("lift-auth-session");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
