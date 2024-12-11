import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { useAuth } from '../../context/authContext';

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
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center">
      {currentUser ? (
        <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-black mb-8">Welcome to Harmony</h1>
              <Link to="/home" className="w-full">
                <Button className="w-full text-white py-2">
                  Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4 flex flex-col items-center justify-center space-y-4">
              <h1 className="text-4xl font-bold text-black mb-8">Welcome to Harmony</h1>
              <Link to="/login" className="w-full">
                <Button className="w-full text-white py-2">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button variant="secondary" className="w-full py-2">
                  Sign Up
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