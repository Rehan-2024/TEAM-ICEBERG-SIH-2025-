import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Calendar, PlusCircle, LogIn } from 'lucide-react';

// --- Define the data structures ---
interface DoctorProfile {
  id: string;
  full_name: string;
  speciality: string;
  experience: number;
}

// --- FIX 1: Updated the 'profiles' property to be an array of objects ---
interface AppointmentWithPatient {
  id: number;
  therapy_name: string;
  appointment_date: string;
  status: string;
  profiles: { 
    id: string;
    full_name: string;
  }[] | null // It can be an array or null
}

const DoctorDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // --- State for the "Log Session" modal ---
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchDoctorData(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchDoctorData(session);
      } else {
        setDoctor(null);
        setAppointments([]);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchDoctorData = async (currentSession: Session) => {
    setLoading(true);
    
    // 1. Fetch the doctor's profile information
    const { data: doctorData, error: doctorError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        doctors ( speciality, experience )
      `)
      .eq('id', currentSession.user.id)
      .single();

    if (doctorError) {
      console.error("Error fetching doctor profile:", doctorError);
    } else if (doctorData && Array.isArray(doctorData.doctors) && doctorData.doctors.length > 0) {
        const formattedDoctor = {
            ...doctorData,
            speciality: doctorData.doctors[0].speciality,
            experience: doctorData.doctors[0].experience,
        };
      setDoctor(formattedDoctor);
    }

    // 2. Fetch all appointments assigned to this doctor
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        therapy_name,
        appointment_date,
        status,
        profiles ( id, full_name )
      `)
      .eq('doctor_id', currentSession.user.id)
      .order('appointment_date', { ascending: true });

    if (appointmentError) {
      console.error("Error fetching appointments:", appointmentError);
    } else {
      setAppointments(appointmentData || []);
    }
    setLoading(false);
  };

  const openLogSessionModal = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment);
    setIsLogModalOpen(true);
  };

  // --- Function to save the completed session log ---
  const handleLogSession = async () => {
    if (!selectedAppointment || !selectedAppointment.profiles || selectedAppointment.profiles.length === 0) return;

    const { error } = await supabase
      .from('therapy_logs')
      .insert({
        user_id: selectedAppointment.profiles[0].id, // The patient's user ID
        appointment_id: selectedAppointment.id,
        therapy_name: selectedAppointment.therapy_name,
        doctor_notes: doctorNotes
      });
      
    if (error) {
      toast({ title: "Error", description: "Could not log session: " + error.message, variant: "destructive" });
    } else {
      // Also update the appointment status to 'Completed'
      await supabase
        .from('appointments')
        .update({ status: 'Completed' })
        .eq('id', selectedAppointment.id);

      toast({ title: "Success", description: "Therapy session has been logged." });
      setIsLogModalOpen(false);
      setDoctorNotes('');
      // Refresh the data to show the status change
      if (session) fetchDoctorData(session);
    }
  };


  if (loading) {
    return <div className="p-8 text-center">Loading Doctor Dashboard...</div>;
  }
  
  if (!session || !doctor) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Doctor Portal</h2>
            <p className="mb-6">Please sign in to access your dashboard.</p>
            <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In as Doctor
            </Button>
        </div>
    )
  }

  const upcomingAppointments = appointments.filter(a => a.status !== 'Completed');

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, Dr. {doctor.full_name.split(' ')[0]}</h1>
          <p className="text-gray-600">{doctor.speciality} • {doctor.experience} years of experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your schedule for today and the near future.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appt => (
                  <div key={appt.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      {/* --- FIX 2: Access the first element of the profiles array --- */}
                      <p className="font-bold">{appt.profiles ? appt.profiles[0]?.full_name : 'Unknown Patient'}</p>
                      <p className="text-sm text-primary">{appt.therapy_name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(appt.appointment_date).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                    </div>
                    <Button onClick={() => openLogSessionModal(appt)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Log Session
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">You have no upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Log Session Modal --- */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Completed Session for {selectedAppointment?.profiles ? selectedAppointment.profiles[0]?.full_name : ''}</DialogTitle>
            <DialogDescription>
              Therapy: {selectedAppointment?.therapy_name} on {selectedAppointment ? new Date(selectedAppointment.appointment_date).toLocaleDateString('en-IN') : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Doctor's Notes</label>
            <Textarea 
              id="notes"
              placeholder="Enter session summary, patient progress, and any observations..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleLogSession}>Save Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorDashboard;

