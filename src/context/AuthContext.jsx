import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('currentUser', user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const restrictRoute = (Component, allowedPaths) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }
    const restrictedPaths = ['/signup', '/login', '/'];
    if (restrictedPaths.includes(window.location.pathname)) {
      return <Navigate to="/home" />;
    }
    if (allowedPaths.includes(window.location.pathname)) {
      return Component;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, restrictRoute, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 