import PropTypes from 'prop-types';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader,
  } from "@/components/ui/sheet"
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Map } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


const Header = ({ title, onLogout }) => {
  const { userInfo } = useAuth();
  const location = useLocation();

  const isActionPlans = location.pathname === '/action-plans';

  return (
    <header className="w-full bg-gray-800 text-white px-1 py-3 shadow-md">
      <div className="mx-auto flex justify-between items-center">
      <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-transparent hover:bg-white/10" ><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className='flex flex-col justify-between'>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {isActionPlans ? (
                <>
                  <div onClick={() => window.location.href = '/home'} className="flex items-center gap-2 cursor-pointer"><Home /> Home</div>
                  <div onClick={() => window.location.href = '/maps'} className="flex items-center gap-2 cursor-pointer"><Map /> Maps</div>
                  <div onClick={() => window.location.href = '/action-plans'} className="flex items-center gap-2 cursor-pointer"><ClipboardList /> Action Plans</div>
                </>
              ) : (
                <>
                  <Link to="/home" className="flex items-center gap-2"><Home /> Home</Link>
                  <Link to="/maps" className="flex items-center gap-2"><Map /> Maps</Link>
                  <Link to="/action-plans" className="flex items-center gap-2"><ClipboardList /> Action Plans</Link>
                </>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start justify-start gap-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Avatar>
                          <AvatarFallback>{userInfo?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start justify-start gap-2">
                          <p className="font-semibold w-[180px] break-words">{userInfo?.name}</p>
                          <p className="text-sm w-[180px] break-words">{userInfo?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="flex items-center justify-start gap-2"><p className="text-sm font-semibold">Organization:</p> <p className="text-sm font-normal"> {userInfo?.organization.name}</p> </DropdownMenuLabel>
                      <DropdownMenuLabel className="flex items-center justify-start gap-2"><p className="text-sm font-semibold">Role:</p> <p className="text-sm font-normal"> {userInfo?.role.name}</p> </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    onClick={onLogout}
                    className="rounded-md hover:bg-red-600 transition-colors bg-red-500"
                  >
                    <LogOut /> Logout
                  </Button>
                </div>
              </div>
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
