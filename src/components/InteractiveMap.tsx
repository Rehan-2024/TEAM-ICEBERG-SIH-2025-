import React, { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

// --- Define the type for a single center ---
interface Center {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

// --- UPDATED: Added userLocation to the props ---
interface InteractiveMapProps {
  centers: Center[];
  onSelectCenter: (center: Center) => void;
  userLocation: { lat: number; lon: number; } | null;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem', // Match your Card's border radius
};

// Default map center (a central point in India)
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

const InteractiveMap = ({ centers, onSelectCenter, userLocation }: InteractiveMapProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  // This effect runs when the user's location is found
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const newCenter = { lat: userLocation.lat, lng: userLocation.lon };
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(12);
    }
  }, [userLocation]);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map; // Save the map instance to the ref
  }, []);

  const onUnmount = React.useCallback(function callback() {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">Error loading maps. Please ensure your Google Maps API key is correct and the 'Maps JavaScript API' is enabled in your Google Cloud project.</div>;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={5}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {centers.map((center) => (
        <MarkerF
          key={center.id}
          position={{ lat: center.latitude, lng: center.longitude }}
          title={center.name}
          onClick={() => onSelectCenter(center)}
        />
      ))}
    </GoogleMap>
  );
};

export default InteractiveMap;

