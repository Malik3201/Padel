import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Building, Trophy, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import padelbookLogo from "../assets/padelbook.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      setUser(currentUser);
    };

    handleStorageChange(); 
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event("storage"));
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 ml-20">
            <motion.img
              src={padelbookLogo}
              alt="PadelBook Logo"
              whileHover={{ scale: 1.05 }}
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* ✅ Dashboard Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-emerald-400">
                  Dashboard
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-effect border-white/20">
                <DropdownMenuItem onClick={() => navigate("/user-dashboard")} className="text-white hover:bg-white/10">
                  <User className="h-4 w-4 mr-2" /> User Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/owner-dashboard")} className="text-white hover:bg-white/10">
                  <Building className="h-4 w-4 mr-2" /> Owner Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-white hover:bg-white/10">
                  <Shield className="h-4 w-4 mr-2" /> Admin Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/"
              className="text-white hover:text-emerald-400 transition-colors"
            >
              Browse Courts
            </Link>
            <Link
              to="/tournaments"
              className="text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Tournaments
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-600 text-white text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-effect border-white/20" align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#81f564] hover:bg-[#7cfa5c] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-3">
              {/* ✅ Dashboard Dropdown in Mobile */}
              <details className="group">
                <summary className="cursor-pointer text-white hover:text-emerald-400 px-2 py-1">
                  Dashboard
                </summary>
                <div className="ml-4 mt-2 flex flex-col space-y-2">
                  <Link to="/user-dashboard" className="text-white hover:text-emerald-400">User Dashboard</Link>
                  <Link to="/owner-dashboard" className="text-white hover:text-emerald-400">Owner Dashboard</Link>
                  <Link to="/admin-dashboard" className="text-white hover:text-emerald-400">Admin Dashboard</Link>
                </div>
              </details>

              <Link to="/" className="text-white hover:text-emerald-400 px-2 py-1" onClick={() => setIsOpen(false)}>
                Browse Courts
              </Link>
              <Link to="/tournaments" className="text-white hover:text-emerald-400 px-2 py-1 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <Trophy className="h-4 w-4" />
                Tournaments
              </Link>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-white hover:text-emerald-400 px-2 py-1 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-emerald-400 px-2 py-1" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="text-white hover:text-emerald-400 px-2 py-1" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
