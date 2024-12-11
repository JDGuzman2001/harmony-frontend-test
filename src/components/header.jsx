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

const Header = ({ title, onLogout }) => {
  return (
    <header className="w-full bg-gray-800 text-white px-1 py-3 shadow-md">
      <div className="mx-auto flex justify-between items-center">
      <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-transparent hover:bg-white/10" ><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" >
            <div className="grid gap-4 py-4">
              <Link to="/home"><div className="flex items-center gap-2"><Home /> Home</div></Link>
              <Link to="/maps"><div className="flex items-center gap-2"><Map /> Maps</div></Link>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-semibold">{title}</h1>

        <Button 
          onClick={onLogout}
          className="rounded-md hover:bg-red-600 transition-colors bg-red-500"
        >
          <LogOut />
        </Button>
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
