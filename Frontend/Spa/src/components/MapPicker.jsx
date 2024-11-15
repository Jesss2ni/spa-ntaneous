import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setLatLng }) => {
  const [position, setPosition] = useState(null);

  // Add map click event
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatLng(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapPicker = ({ setLatitude, setLongitude }) => {
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  // Update latitude and longitude when the user clicks on the map
  const handleSaveLocation = () => {
    if (latLng.lat && latLng.lng) {
      setLatitude(latLng.lat);
      setLongitude(latLng.lng);
      alert(`Location selected: Latitude: ${latLng.lat}, Longitude: ${latLng.lng}`);
    } else {
      alert('Please select a location on the map.');
    }
  };

  return (
    <div>
      <h2>Select a Location</h2>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setLatLng={setLatLng} />
      </MapContainer>
      <button onClick={handleSaveLocation}>Save Location</button>
    </div>
  );
};

export default MapPicker;
