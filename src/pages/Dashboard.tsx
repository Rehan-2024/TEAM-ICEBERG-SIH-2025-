import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Stethoscope, Leaf, BarChart2, BookOpen, Trash2, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

// Data structure for a user's profile
interface UserProfile {
  id: string;
  full_name: string;
}

// Data structure for an appointment
interface Appointment {
  id: number;
  therapy_name: string;
  doctor_name: string;
  appointment_date: string;
  centre_location: string;
  status: string;
}

// Data structure for the track record (completed sessions)
interface TherapyLog {
    id: number;
    therapy_name: string;
    created_at: string;
    doctor_notes: string;
}

// Data structure for the chart
interface ChartData {
    name: string;
    sessions: number;
}

interface DashboardProps {
  session: Session;
}

const Dashboard = ({ session }: DashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapyLogs, setTherapyLogs] = useState<TherapyLog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isTrackRecordModalOpen, setIsTrackRecordModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // Fetch user profile
      const { data: profileData } = await supabase.from('profiles').select('full_name, id').eq('id', session.user.id).single();
      setProfile(profileData);

      // Fetch all appointments
      const { data: appointmentData } = await supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: false });
      setAppointments(appointmentData || []);

      // Fetch all completed therapy logs for the track record
      const { data: logData, error: logError } = await supabase
        .from('therapy_logs')
        .select('id, therapy_name, created_at, doctor_notes')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (logError) {
        console.error("Error fetching therapy logs:", logError);
      } else if (logData) {
        setTherapyLogs(logData);
        // Process the log data to create the summary for the chart
        const counts = logData.reduce((acc, log) => {
            acc[log.therapy_name] = (acc[log.therapy_name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const processedChartData = Object.keys(counts).map(name => ({
            name: name,
            sessions: counts[name],
        }));
        setChartData(processedChartData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [session]);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };
  
  const handleCancelBooking = async (appointmentId: number) => {
    // A simple confirmation before deleting
    if (window.confirm("Are you sure you want to cancel this booking?")) {
        const { error } = await supabase.from('appointments').delete().match({ id: appointmentId });
        if (error) {
            toast({ title: "Error", description: "Could not cancel booking: " + error.message, variant: "destructive" });
        } else {
            setAppointments(appointments.filter(appt => appt.id !== appointmentId));
            setIsAppointmentModalOpen(false);
            toast({ title: "Success", description: "Your booking has been cancelled." });
        }
    }
  };

  const handleConnectDoctor = (doctorName: string) => {
    toast({
        title: "Connecting...",
        description: `Please wait while we connect you with ${doctorName}.`
    });
    // In a real application, this would trigger a chat or video call feature.
  };

  let isCancellable = false;
  if (selectedAppointment) {
    const appointmentTime = new Date(selectedAppointment.appointment_date).getTime();
    const now = new Date().getTime();
    const eightHoursInMillis = 8 * 60 * 60 * 1000;
    isCancellable = (appointmentTime - now) > eightHoursInMillis;
  }

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading your wellness dashboard...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {profile ? profile.full_name : session.user.email}!
            </h1>
            <p className="text-gray-600">Here is your full appointment history and wellness track record.</p>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link to="/book">Book New Therapy</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* APPOINTMENT HISTORY */}
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Your Appointment History</CardTitle>
                        <CardDescription>Click on any appointment to view more details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((appt) => (
                            <div 
                                key={appt.id} 
                                className="p-4 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleViewDetails(appt)}
                            >
                                <div>
                                <p className="text-lg font-bold text-primary">{appt.therapy_name}</p>
                                <p className="text-sm text-gray-700">with {appt.doctor_name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(appt.appointment_date).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                                </p>
                                </div>
                                <Badge variant={appt.status === 'Completed' ? 'secondary' : 'default'}>
                                    {appt.status}
                                </Badge>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div className="text-center text-gray-500 py-12">
                            <p className="mb-4">You have no appointments booked.</p>
                            <Button asChild>
                            <Link to="/book">Book Your First Therapy</Link>
                            </Button>
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* WELLNESS SUMMARY & TRACK RECORD */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Wellness Summary</CardTitle>
                        <CardDescription>A summary of your completed therapy sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData.length > 0 ? (
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="sessions" fill="#10b981" name="Completed Sessions" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4">Your track record will appear here after you complete therapy sessions.</p>
                            </div>
                        )}
                    </CardContent>
                    {therapyLogs.length > 0 && (
                        <div className="p-4 border-t">
                             <Button className="w-full" onClick={() => setIsTrackRecordModalOpen(true)}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Full Track Record
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedAppointment?.therapy_name}</DialogTitle>
            <DialogDescription>Full details for your appointment.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4"><Calendar className="h-5 w-5 text-gray-500" /><span className="font-medium">{new Date(selectedAppointment.appointment_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                <div className="flex items-center gap-4"><Clock className="h-5 w-5 text-gray-500" /><span className="font-medium">{new Date(selectedAppointment.appointment_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span></div>
                <div className="flex items-center gap-4"><Stethoscope className="h-5 w-5 text-gray-500" /><span className="font-medium">{selectedAppointment.doctor_name}</span></div>
                <div className="flex items-center gap-4"><MapPin className="h-5 w-5 text-gray-500" /><span className="font-medium">{selectedAppointment.centre_location}</span></div>
                <div className="flex items-center gap-4"><Leaf className="h-5 w-5 text-gray-500" /><Badge variant="default">{selectedAppointment.status}</Badge></div>
              </div>
              <DialogFooter className="sm:justify-start gap-2">
                <Button variant="outline" onClick={() => handleConnectDoctor(selectedAppointment.doctor_name)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Connect with Doctor
                </Button>
                {isCancellable && (
                  <Button variant="destructive" onClick={() => handleCancelBooking(selectedAppointment.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Track Record Modal */}
      <Dialog open={isTrackRecordModalOpen} onOpenChange={setIsTrackRecordModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Full Track Record</DialogTitle>
            <DialogDescription>A complete history of all your completed therapy sessions.</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {therapyLogs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">{log.therapy_name}</p>
                    <p className="text-sm text-gray-500">{new Date(log.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  {log.doctor_notes && (
                    <blockquote className="mt-2 pl-4 border-l-2 italic text-gray-600">"{log.doctor_notes}"</blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTrackRecordModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;

