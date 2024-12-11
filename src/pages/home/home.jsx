import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';

function Home() {
  const { handleLogout } = useAuth();

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title="Home" onLogout={handleLogout} />
      <div className="space-x-4 p-4">
        <Link to="/maps">
          <Button>
            Mapas
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home; 