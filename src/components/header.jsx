import PropTypes from 'prop-types';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Map } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


const Header = ({ title, onLogout }) => {
  const { userInfo } = useAuth();
  return (
    <header className="w-full bg-gray-800 text-white px-1 py-3 shadow-md">
      <div className="mx-auto flex justify-between items-center">
      <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-transparent hover:bg-white/10" ><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className='flex flex-col justify-between'>
            <div className="grid gap-4 py-4">
              <Link to="/home"><div className="flex items-center gap-2"><Home /> Home</div></Link>
              <Link to="/maps"><div className="flex items-center gap-2"><Map /> Maps</div></Link>
              <Link to="/action-plans"><div className="flex items-center gap-2"><ClipboardList /> Action Plans</div></Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start justify-start gap-2">
                <p className="text-sm font-semibold">Organization: {userInfo?.organization.name}</p>  
                <p className="text-sm font-semibold">Role: {userInfo?.role.name}</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{userInfo?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p>{userInfo?.name}</p>
                </div>
              </div>
              <Button 
                onClick={onLogout}
                className="rounded-md hover:bg-red-600 transition-colors bg-red-500"
              >
                <LogOut /> Logout
              </Button>
            </div>
            
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-semibold">{title}</h1>
        
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 bg-white text-black">
            <AvatarFallback>{userInfo?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button 
            onClick={onLogout}
            className="rounded-md hover:bg-red-600 transition-colors bg-red-500"
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onLeftButtonClick: PropTypes.func,
  onLogout: PropTypes.func.isRequired
};

export default Header;
