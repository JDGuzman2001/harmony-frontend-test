import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { useAuth } from '../../context/AuthContext';

function Landing() {
  const { currentUser } = useAuth();
  return (
    <div className='flex h-screen'>
      <div className='w-1/2'>
        <img 
        src="https://images.pexels.com/photos/5302811/pexels-photo-5302811.jpeg"
        alt="Side image" 
        className="w-full h-full object-cover"
      />
      </div>
      <div className='w-1/2'>
      <div className="bg-cyan-300 min-h-screen flex flex-col items-center justify-center">
      {currentUser ? (
        <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-white mb-8">Bienvenido a Harmony</h1>
              <Link to="/home">
                <Button>
                  Inicio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4 flex flex-col items-center justify-center space-y-4">
              <h1 className="text-4xl font-bold text-white mb-8">Bienvenido a Harmony</h1>
              <Link to="/login">
                <Button>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Landing; 