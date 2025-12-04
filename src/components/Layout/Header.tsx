import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  MapPin, 
  LogOut,
  Leaf
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/supabaseClient'; // Import supabase client for sign out

// Define the props the Header will receive
interface HeaderProps {
  session: Session | null;
}

export const Header = ({ session }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to home page after sign out
  };

  const handleGetStarted = () => {
    // If there is a session, go to dashboard, otherwise go to sign up
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">Ayusutra</h1>
              <p className="text-xs text-muted-foreground">Panchakarma Wellness</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/locate" className="text-foreground hover:text-primary transition-colors">
              Find Centers
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About Panchakarma
            </Link>
            <a 
              href="https://ayush.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              Ministry of AYUSH
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {/* --- THIS IS THE FIX --- 
                           This is a safer check. It ensures 'session.user.email' is a non-empty
                           string before trying to access its first character. Defaults to 'U' if not.
                        */}
                        {session.user?.email ? session.user.email[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/book')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Therapy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/locate')}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Find Centers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/signin')} className="hover-lift">
                  Sign In
                </Button>
                <Button onClick={handleGetStarted} className="bg-gradient-primary hover-glow shadow-medium">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/locate" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Find Centers
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                About Panchakarma
              </Link>
              <a href="https://ayush.gov.in/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors py-2">
                Ministry of AYUSH
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {session ? (
                  <>
                    <Button variant="ghost" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => { navigate('/signin'); setIsMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button onClick={() => { handleGetStarted(); setIsMenuOpen(false); }} className="bg-gradient-primary">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

