// AuthContext.jsx
import  { createContext, useState, useContext,useEffect, useCallback } from 'react';
import { getUsers, addUser } from '../../components/users';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate =useNavigate();

  const login = ({username,password}) => {
    const users = getUsers();
    
    const foundUser =users.find(user => user.username === username && user.password === password);
    console.log(foundUser)
    if(foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (newUser) => {
    const users = getUsers();
    const userExists = users.some(user => user.username === newUser.username || user.email === newUser.email);
    if (!userExists) {
        addUser(newUser);
        return true;
    }
    return false;
};

  const logout = () => {
    setUser(null);
    navigate('/');
    localStorage.removeItem('user');
  };

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  
  return (
    <AuthContext.Provider value={{ user, login, logout,register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
