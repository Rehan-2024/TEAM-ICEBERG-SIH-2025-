import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin, Search, Phone, Clock, Star, LocateFixed, ExternalLink, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '@/components/InteractiveMap';
import { supabase } from '../supabaseClient';

// Helper functions for distance calculation
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number) { return deg * (Math.PI / 180); }

// --- THIS IS THE FIX: Added 'doctors' and 'availableSlots' to the interface ---
interface Center {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviews: number;
  distance?: number;
  specialties: string[];
  timings: string;
  certified: boolean;
  latitude: number;
  longitude: number;
  doctors: { name: string; speciality: string; experience: string; }[];
  availableSlots: string[];
}

const LocateCentre = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCenters, setAllCenters] = useState<Center[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState('All');
  const navigate = useNavigate();
  
  const cities = ["All", "Hyderabad", "Delhi", "Mumbai", "Bengaluru"];

  useEffect(() => {
    // Using mock data for now. Replace with a real Supabase fetch if you have a 'centers' table.
    const mockData: Center[] = [
        { id: 1, name: 'Ayurveda Wellness Center', address: '123 Wellness Lane, Connaught Place, New Delhi', city: 'Delhi', phone: '+91 98765 43210', rating: 4.8, reviews: 120, specialties: ['Panchakarma', 'Detox'], timings: '9 AM - 7 PM', certified: true, latitude: 28.6324, longitude: 77.2187, doctors: [], availableSlots: [] },
        { id: 2, name: 'Traditional Ayurveda Clinic', address: '45 Lotus Rd, Lajpat Nagar, New Delhi', city: 'Delhi', phone: '+91 91234 56789', rating: 4.7, reviews: 95, specialties: ['Herbal Medicine'], timings: '10 AM - 8 PM', certified: true, latitude: 28.5677, longitude: 77.2421, doctors: [], availableSlots: [] },
        { id: 3, name: 'Panchakarma Healing Sanctuary', address: '78 Serenity Blvd, Bandra, Mumbai', city: 'Mumbai', phone: '+91 88877 66554', rating: 4.9, reviews: 150, specialties: ['Rejuvenation', 'Stress Relief'], timings: '8 AM - 6 PM', certified: true, latitude: 19.0596, longitude: 72.8407, doctors: [], availableSlots: [] },
        { id: 4, name: 'Vedic Wellness Hyderabad', address: 'Banjara Hills, Road No. 1, Hyderabad', city: 'Hyderabad', phone: '+91 77766 55443', rating: 4.9, reviews: 210, specialties: ['Panchakarma', 'Yoga'], timings: '7 AM - 5 PM', certified: true, latitude: 17.4124, longitude: 78.4485, doctors: [], availableSlots: [] },
    ];
    setAllCenters(mockData);
    setFilteredCenters(mockData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let centersToProcess = allCenters;
    if (selectedCity !== 'All') { centersToProcess = centersToProcess.filter(c => c.city === selectedCity); }
    if (userLocation) {
      centersToProcess = centersToProcess.map(center => ({
        ...center,
        distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, center.latitude, center.longitude)
      })).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    if (searchQuery) {
        centersToProcess = centersToProcess.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.address.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredCenters(centersToProcess);
  }, [userLocation, selectedCity, searchQuery, allCenters]);

  const handleFindNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
        () => alert("Could not get your location. Please enable location services.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  const handleSelectCenter = (center: Center) => { setSelectedCenterId(center.id); };
  const handleBookAppointment = (center: Center) => { navigate('/book', { state: { selectedCenter: center } }); };
  
  const currentlySelectedCenter = useMemo(() => allCenters.find(c => c.id === selectedCenterId), [selectedCenterId, allCenters]);
  
  const getDirectionsLink = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gradient-primary mb-4">Find Panchakarma Centers</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Locate certified Ayurveda centers near you</p>
            </div>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input placeholder="Search by center name or area..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 text-lg" />
                </div>
                <Button onClick={handleFindNearby} className="h-12 text-md">
                    <LocateFixed className="w-5 h-5 mr-2" /> Find Near Me
                </Button>
            </div>
            <div className="max-w-xs mx-auto mt-4">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select a City" /></SelectTrigger>
                    <SelectContent>
                        {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="card-3d h-96 lg:h-[calc(100vh-250px)]">
                <CardContent className="p-0 h-full">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">Loading Data...</div>
                ) : (
                    <InteractiveMap
                    centers={filteredCenters}
                    onSelectCenter={handleSelectCenter}
                    userLocation={userLocation}
                    />
                )}
                </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {currentlySelectedCenter ? (
                 <Card className="card-3d sticky top-24 animate-fade-in">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{currentlySelectedCenter.name}</CardTitle>
                            <Badge className="flex items-center gap-1 text-md"><Star className="w-4 h-4" /> {currentlySelectedCenter.rating}</Badge>
                        </div>
                        <CardDescription>{currentlySelectedCenter.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-1 flex-shrink-0"/><span>{currentlySelectedCenter.address}</span></p>
                            <p className="flex items-center gap-3"><Phone className="w-4 h-4"/><span>{currentlySelectedCenter.phone}</span></p>
                            <p className="flex items-center gap-3"><Clock className="w-4 h-4"/><span>{currentlySelectedCenter.timings}</span></p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentlySelectedCenter.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                        </div>
                         <Button asChild className="w-full">
                            <a href={getDirectionsLink(currentlySelectedCenter.address)} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2"/> Get Directions
                            </a>
                        </Button>
                        <Button className="w-full bg-gradient-primary" onClick={() => handleBookAppointment(currentlySelectedCenter)}>
                            <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                        </Button>
                    </CardContent>
                 </Card>
            ) : (
                <div className="text-center text-muted-foreground pt-24 sticky top-24">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold">Select a Center</h3>
                    <p>Click a pin on the map to see details here.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocateCentre;

