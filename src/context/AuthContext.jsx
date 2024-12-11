import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const fetchUserInfo = async (uid) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get-user-info?user_id=${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const data = await response.json();
      setUserInfo(data.user_info);
      return data.user_info;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.uid) {
        fetchUserInfo(user.uid);
      } else {
        setUserInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserInfo(null);
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
    <AuthContext.Provider value={{ currentUser, userInfo, restrictRoute, handleLogout, fetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 