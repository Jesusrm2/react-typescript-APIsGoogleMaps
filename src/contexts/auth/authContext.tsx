import { createContext, useState } from 'react';

type AuthContextType = {
  token: string | null;
  decodedToken: any | null;
  setToken: (token: string | null) => void;
  setDecodedToken:( decodedToken: any |null)=> void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  decodedToken: undefined,
  setToken: () => {},
  setDecodedToken:()=>{}
});

type AuthProviderProps = {
  children: React.ReactNode;
};



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  
  return (
    <AuthContext.Provider value={{ token, setToken, decodedToken, setDecodedToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
