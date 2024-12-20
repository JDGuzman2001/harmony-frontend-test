import { AuthProvider } from './context/authContext';
import { auth } from './firebase';
import Landing from './pages/landing/landing';
import Login from './pages/auth/logIn';
import Signup from './pages/auth/signUp';
import Home from './pages/home/home';
import Maps from './pages/maps/maps';
import ActionPlans from './pages/action-plans/actionPlans';
import FlowChart from './pages/action-plans/flowChart';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WorkflowChat from './pages/workflow-chat/workflowChat';

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

          <Route path="/action-plans/:id" element={
            <ProtectedRoute>
              <FlowChart />
            </ProtectedRoute>
          } />

          <Route path="/workflow-chat" element={
            <ProtectedRoute>
              <WorkflowChat />
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
