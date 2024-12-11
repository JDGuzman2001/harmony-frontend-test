import { AuthProvider, useAuth } from './context/authContext';
import Landing from './pages/landing/landing';
import Login from './pages/auth/logIn';
import Signup from './pages/auth/SignUp';
import Home from './pages/home/home';
import Maps from './pages/maps/Maps';
import ActionPlans from './pages/action-plans/actionPlans';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"


function ProtectedRoute({ component: Component, allowedPaths }) {
  const { restrictRoute } = useAuth();
  return restrictRoute(<Component />, allowedPaths);
}

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maps" element={<ProtectedRoute component={Maps} allowedPaths={['/maps']} />} />
        <Route path="/action-plans" element={<ProtectedRoute component={ActionPlans} allowedPaths={['/action-plans']} />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
