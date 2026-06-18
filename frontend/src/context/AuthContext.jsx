import React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import {loginUser,registerUser,logoutUser,getCurrentUser} from "../api/auth.api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // to avoid the ui flickers 
  
  const login = async (data) => {
    const user = await loginUser(data);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const user = await registerUser(data);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

    useEffect(() => {
    const restoreSession =async()=>{
      try {
        const user  = await getCurrentUser()
        setUser(user)
      } catch (error) {
        setUser(null)
      }
      setLoading(false)
    }
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
   return useContext(AuthContext);
}
