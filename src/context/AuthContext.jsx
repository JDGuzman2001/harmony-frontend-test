import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo } from '../utils/utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  const { data: userInfo, refetch: refetchUserInfo } = useQuery({
    queryKey: ['userInfo', currentUser?.uid],
    queryFn: () => fetchUserInfo(currentUser?.uid),
    enabled: !!currentUser?.uid,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await refetchUserInfo();
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loadingUser) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ currentUser, userInfo, handleLogout, fetchUserInfo, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 