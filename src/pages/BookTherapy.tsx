import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  MapPin, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  experience: string;
  rating: number;
}

const BookTherapy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCenter, setSelectedCenter] = useState(location.state?.selectedCenter || null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedTherapy, setSelectedTherapy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');

  // --- 1. UPDATED STATE: Added patientName, age, and sex ---
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    age: '',
    sex: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    emergencyContact: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({ title: "Authentication Required", description: "Please sign in to book a therapy.", variant: "destructive" });
        navigate('/signin');
      } else {
        setSession(session);
        setPatientInfo(prev => ({
          ...prev,
          contactEmail: session.user.email || '',
          contactPhone: session.user.phone || ''
        }));
      }
    });
  }, [navigate, toast]);

  useEffect(() => {
    setSelectedDoctor(null);
  }, [selectedCenter]);

  const therapies = [
    { id: 'vamana', name: 'Vamana', description: 'Therapeutic vomiting for kapha conditions', duration: '3-5 days', price: '₹15,000' },
    { id: 'virechana', name: 'Virechana', description: 'Purgation therapy for pitta imbalances', duration: '5-7 days', price: '₹18,000' },
    { id: 'basti', name: 'Basti', description: 'Medicated enemas for vata disorders', duration: '7-15 days', price: '₹25,000' },
    { id: 'nasya', name: 'Nasya', description: 'Nasal therapy for head conditions', duration: '7-14 days', price: '₹12,000' },
    { id: 'raktamokshan', name: 'Raktamokshan', description: 'Blood purification therapy', duration: '5-10 days', price: '₹20,000' }
  ];

  const mockCenters = [
    { id: 1, name: 'Ayurveda Wellness Center', address: 'Connaught Place, New Delhi', doctors: [{ id: 1, name: 'Dr. Rajesh Kumar', speciality: 'Panchakarma Expert', experience: '15 years', rating: 4.9 }, { id: 2, name: 'Dr. Priya Sharma', speciality: 'Ayurveda Physician', experience: '12 years', rating: 4.8 }] as Doctor[], availableSlots: ['09:00', '11:00', '14:00', '16:00', '18:00'] },
    { id: 2, name: 'Traditional Ayurveda Clinic', address: 'Lajpat Nagar, New Delhi', doctors: [{ id: 3, name: 'Dr. Kavita Singh', speciality: 'Ayurveda Consultant', experience: '14 years', rating: 4.8 }, { id: 4, name: 'Dr. Ravi Agarwal', speciality: 'Panchakarma Therapist', experience: '16 years', rating: 4.9 }] as Doctor[], availableSlots: ['10:00', '12:00', '15:00', '17:00'] }
  ];

  const currentCenter = selectedCenter || mockCenters[0];
  const precautions = { pre: ['Avoid heavy meals 24 hours before therapy', 'Stay adequately hydrated', 'Get proper rest the night before', 'Avoid alcohol and smoking 48 hours prior', 'Inform about any current medications', 'Wear comfortable, loose clothing'], post: ['Follow prescribed diet strictly', 'Avoid strenuous physical activities', 'Take medications as prescribed', 'Monitor and report any unusual symptoms', 'Maintain regular follow-up appointments', 'Practice recommended yoga and meditation'] };

  const handleStepForward = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
  const handleStepBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleBooking = async () => {
    if (!session || !selectedDate || !selectedSlot || !selectedTherapy || !selectedDoctor) {
      toast({ title: "Incomplete Information", description: "Please ensure all details are selected.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
    const selectedDoctorData = currentCenter.doctors.find(d => d.id === selectedDoctor);

    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    // --- 3. UPDATED DATABASE INSERT: Added all patient info fields ---
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert({
        user_id: session.user.id,
        therapy_name: selectedTherapyData?.name,
        doctor_name: selectedDoctorData?.name,
        appointment_date: appointmentDateTime.toISOString(),
        centre_location: currentCenter.name,
        status: 'Confirmed',
        // New patient fields
        patient_name: patientInfo.patientName,
        age: patientInfo.age,
        sex: patientInfo.sex,
        symptoms: patientInfo.symptoms,
        medical_history: patientInfo.medicalHistory,
        allergies: patientInfo.allergies,
        current_medications: patientInfo.currentMedications,
        emergency_contact: patientInfo.emergencyContact,
        contact_email: patientInfo.contactEmail,
        contact_phone: patientInfo.contactPhone
      })
      .select().single();

    if (error) {
      toast({ title: "Booking Error", description: error.message, variant: "destructive" });
      setIsLoading(false);
      return;
    }
    
    if (newAppointment) {
      const { error: functionError } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          appointment_details: newAppointment,
          contact_email: patientInfo.contactEmail,
          contact_phone: patientInfo.contactPhone
        },
      });
      
      if (functionError) {
        toast({ title: "Booking Confirmed!", description: "Could not send notifications. Please check your dashboard.", variant: "destructive" });
      } else {
        toast({ title: "Booking Confirmed!", description: "A confirmation SMS and email are on the way." });
      }
    }

    navigate('/dashboard');
    setIsLoading(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Therapy Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {therapies.map((therapy) => (
                  <Card 
                    key={therapy.id} 
                    className={`cursor-pointer hover-lift transition-all ${
                      selectedTherapy === therapy.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                    onClick={() => setSelectedTherapy(therapy.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{therapy.name}</h4>
                        <Badge variant="secondary">{therapy.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{therapy.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {therapy.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Center & Doctor Selection</h3>
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{currentCenter.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {currentCenter.address}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newCenter = currentCenter.id === 1 ? mockCenters[1] : mockCenters[0];
                        setSelectedCenter(newCenter);
                      }}
                    >
                      Change Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                {currentCenter.doctors.map((doctor: Doctor) => (
                  <Card 
                    key={doctor.id}
                    className={`cursor-pointer hover-lift transition-all ${
                      selectedDoctor === doctor.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
                          <p className="text-xs text-muted-foreground">{doctor.experience}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <Card>
                 <CardHeader><CardTitle className="text-base">Choose Date</CardTitle></CardHeader>
                 <CardContent>
                   <Calendar
                     mode="single"
                     selected={selectedDate}
                     onSelect={setSelectedDate}
                     disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) || date.getDay() === 0}
                     className="rounded-md border"
                   />
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader><CardTitle className="text-base">Available Time Slots</CardTitle></CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-2">
                     {currentCenter.availableSlots.map((slot: string) => (
                       <Button
                         key={slot}
                         variant={selectedSlot === slot ? 'default' : 'outline'}
                         size="sm"
                         onClick={() => setSelectedSlot(slot)}
                         className="justify-center"
                       >
                         {new Date(`1970-01-01T${slot}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                       </Button>
                     ))}
                   </div>
                 </CardContent>
               </Card>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-4">Patient & Contact Information</h3>
              {/* --- 2. ADDED NEW FIELDS: JSX for new inputs --- */}
              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Full Name *</Label>
                    <Input id="patientName" placeholder="Enter patient's full name" value={patientInfo.patientName} onChange={(e) => setPatientInfo({...patientInfo, patientName: e.target.value})} required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input id="age" type="number" placeholder="e.g., 35" value={patientInfo.age} onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="sex">Sex *</Label>
                      <Select value={patientInfo.sex} onValueChange={(value) => setPatientInfo({...patientInfo, sex: value})}>
                          <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                    <Input id="contactPhone" type="tel" placeholder="+91 98765 43210" value={patientInfo.contactPhone} onChange={(e) => setPatientInfo({...patientInfo, contactPhone: e.target.value})} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input id="contactEmail" type="email" placeholder="your@email.com" value={patientInfo.contactEmail} onChange={(e) => setPatientInfo({...patientInfo, contactEmail: e.target.value})} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Current Symptoms/Concerns</Label>
                    <Textarea id="symptoms" placeholder="Describe your current health concerns..." value={patientInfo.symptoms} onChange={(e) => setPatientInfo({...patientInfo, symptoms: e.target.value})} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="medical-history">Medical History</Label>
                    <Textarea id="medical-history" placeholder="Previous treatments, surgeries..." value={patientInfo.medicalHistory} onChange={(e) => setPatientInfo({...patientInfo, medicalHistory: e.target.value})} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input id="allergies" placeholder="Food, medicine, etc." value={patientInfo.allergies} onChange={(e) => setPatientInfo({...patientInfo, allergies: e.target.value})} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input id="medications" placeholder="List any medications..." value={patientInfo.currentMedications} onChange={(e) => setPatientInfo({...patientInfo, currentMedications: e.target.value})} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="emergency-contact">Emergency Contact</Label>
                    <Input id="emergency-contact" placeholder="Name and phone number" value={patientInfo.emergencyContact} onChange={(e) => setPatientInfo({...patientInfo, emergencyContact: e.target.value})} className="mt-1" />
                  </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pre & Post Therapy Precautions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500" />Pre-Therapy Precautions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {precautions.pre.map((precaution, idx) => (<li key={idx} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{precaution}</span></li>))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="w-5 h-5 text-green-500" />Post-Therapy Care</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {precautions.post.map((precaution, idx) => (<li key={idx} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{precaution}</span></li>))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className={`cursor-pointer hover-lift transition-all ${paymentMethod === 'online' ? 'ring-2 ring-primary shadow-glow' : ''}`} onClick={() => setPaymentMethod('online')}>
                  <CardContent className="p-4"><div className="flex items-center gap-3"><CreditCard className="w-8 h-8 text-primary" /><div><h4 className="font-semibold">Pay Now</h4><p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p><Badge variant="secondary" className="mt-1">Instant Confirmation</Badge></div></div></CardContent>
                </Card>
                <Card className={`cursor-pointer hover-lift transition-all ${paymentMethod === 'offline' ? 'ring-2 ring-primary shadow-glow' : ''}`} onClick={() => setPaymentMethod('offline')}>
                  <CardContent className="p-4"><div className="flex items-center gap-3"><MapPin className="w-8 h-8 text-primary" /><div><h4 className="font-semibold">Pay at Centre</h4><p className="text-sm text-muted-foreground">Cash, Card at reception</p><Badge variant="outline" className="mt-1">Payment on Visit</Badge></div></div></CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case 4: {
        const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
        const selectedDoctorData = currentCenter.doctors.find((d: Doctor) => d.id === selectedDoctor);
        return (
          <div className="space-y-6">
            <div className="text-center"><CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Review Your Booking</h3><p className="text-muted-foreground">Please review all details before confirming</p></div>
            <Card>
              <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><h4 className="font-semibold mb-2">Therapy Details</h4><div className="space-y-1 text-sm"><p><span className="font-medium">Therapy:</span> {selectedTherapyData?.name}</p><p><span className="font-medium">Duration:</span> {selectedTherapyData?.duration}</p><p><span className="font-medium">Price:</span> {selectedTherapyData?.price}</p></div></div><div><h4 className="font-semibold mb-2">Appointment Details</h4><div className="space-y-1 text-sm"><p><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString('en-IN', { dateStyle: 'long' })}</p><p><span className="font-medium">Time:</span> {selectedSlot ? new Date(`1970-01-01T${selectedSlot}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'Not selected'}</p><p><span className="font-medium">Doctor:</span> {selectedDoctorData?.name}</p></div></div><div><h4 className="font-semibold mb-2">Center Details</h4><div className="space-y-1 text-sm"><p><span className="font-medium">Center:</span> {currentCenter.name}</p><p><span className="font-medium">Address:</span> {currentCenter.address}</p></div></div><div><h4 className="font-semibold mb-2">Payment</h4><div className="space-y-1 text-sm"><p><span className="font-medium">Method:</span> {paymentMethod === 'online' ? 'Pay Now' : 'Pay at Centre'}</p><Badge variant={paymentMethod === 'online' ? 'default' : 'secondary'}>{paymentMethod === 'online' ? 'Instant Confirmation' : 'Payment on Visit'}</Badge></div></div></div></CardContent>
            </Card>
            <Card className="bg-accent/10"><CardContent className="p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><MessageCircle className="w-4 h-4" />Instant Notifications</h4><p className="text-sm text-muted-foreground mb-3">Upon booking confirmation, you will receive immediate notifications via:</p><div className="grid grid-cols-3 gap-4 text-center"><div className="flex flex-col items-center gap-1"><Phone className="w-6 h-6 text-green-600" /><span className="text-xs">WhatsApp</span></div><div className="flex flex-col items-center gap-1"><Mail className="w-6 h-6 text-blue-600" /><span className="text-xs">Email</span></div><div className="flex flex-col items-center gap-1"><MessageCircle className="w-6 h-6 text-purple-600" /><span className="text-xs">SMS</span></div></div></CardContent></Card>
          </div>
        );
      } 
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Book Your Panchakarma Therapy</h1>
          <p className="text-xl text-muted-foreground">Schedule your personalized healing journey with certified practitioners</p>
        </div>
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${ currentStep >= step ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground' }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : <span className="font-medium">{step}</span>}
                </div>
                {step < 4 && <div className={`w-12 h-0.5 transition-all ${ currentStep > step ? 'bg-primary' : 'bg-muted'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8 text-center">
          <div className={`text-sm ${currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Select Therapy</div>
          <div className={`text-sm ${currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Date & Details</div>
          <div className={`text-sm ${currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Precautions & Payment</div>
          <div className={`text-sm ${currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Confirm Booking</div>
        </div>
        <Card className="card-3d mb-8">
          <CardContent className="p-6 md:p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleStepBack} disabled={currentStep === 1}>Previous</Button>
          {currentStep < 4 ? (
            <Button 
              onClick={handleStepForward}
              className="bg-gradient-primary"
              disabled={ (currentStep === 1 && (!selectedTherapy || !selectedDoctor)) || (currentStep === 2 && (!selectedDate || !selectedSlot)) || (currentStep === 3 && !paymentMethod) }
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleBooking} className="bg-gradient-primary hover-glow shadow-medium" disabled={isLoading}>
              {isLoading ? 'Confirming...' : 'Confirm Booking'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTherapy;