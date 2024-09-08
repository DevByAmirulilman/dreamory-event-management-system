import React, { createContext, useContext, useState } from 'react';


interface userProps {
    name:string,
    token:string
    userId:string
}


// Define the shape of the context
interface AuthContextType {
  user: userProps;
  login: (username: string,token:string,userId:string) => void;
  logout: () => void;
}

// Create the context with an initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that provides the context value
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<userProps>({name:"",token:'',userId:''});

  const login = (username: string,token:string,id:string) => {
    setUser({name:username,token:token,userId:id});
  };

  const logout = () => {
    setUser({name:'',token:'',userId:''});
  };

  // The value that will be passed to the children
  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
