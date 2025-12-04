import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { AIChat } from "./components/AIAssistant/AIChat";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { MessageCircle } from "lucide-react";
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import LocateCentre from "./pages/LocateCentre";
import BookTherapy from "./pages/BookTherapy";
import About from "./pages/About";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- Define a type for our user profile ---
interface UserProfile {
  id: string;
  role: 'patient' | 'doctor' | 'admin';
  // Add other profile fields if needed
}

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  // --- NEW: State to hold the user's profile and loading status ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      // 1. Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      // 2. If a session exists, fetch the user's profile to get their role
      if (session) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile as UserProfile);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    // 3. Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile as UserProfile);
      } else {
        setProfile(null); // Clear profile on sign out
      }
    });

    return () => subscription?.unsubscribe();
  }, []);
  
  // Show a loading indicator while we check the user's role
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background flex flex-col">
            <Header session={session} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/locate" element={<LocateCentre />} />
                <Route path="/book" element={<BookTherapy />} />
                <Route path="/about" element={<About />} />
                
                {/* --- UPDATED: Protected Routes based on User Role --- */}
                
                {/* Patient Dashboard: Only accessible if logged in AND role is 'patient' */}
                <Route 
                  path="/dashboard" 
                  element={session && profile?.role === 'patient' ? <Dashboard session={session} /> : <Navigate to="/signin" replace />} 
                />
                
                {/* Doctor Dashboard: Only accessible if logged in AND role is 'doctor' */}
                <Route 
                  path="/doctor-dashboard" 
                  element={session && profile?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/signin" replace />} 
                />
                
                {/* Admin Panel: Only accessible if logged in AND role is 'admin' */}
                <Route 
                  path="/admin" 
                  element={session && profile?.role === 'admin' ? <AdminPanel /> : <Navigate to="/signin" replace />} 
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            
            <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            
            {!isChatOpen && (
              <Button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover-glow pulse-glow z-40"
                size="icon"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

