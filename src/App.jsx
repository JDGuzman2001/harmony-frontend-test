import { AuthProvider } from './context/authContext';
import { auth } from './firebase';
import Landing from './pages/landing/landing';
import Login from './pages/auth/logIn';
import Signup from './pages/auth/SignUp';
import Home from './pages/home/home';
import Maps from './pages/maps/Maps';
import ActionPlans from './pages/action-plans/actionPlans';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }) => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/maps" element={
            <ProtectedRoute>
              <Maps />
            </ProtectedRoute>
          } />
          <Route path="/action-plans" element={
            <ProtectedRoute>
              <ActionPlans />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
