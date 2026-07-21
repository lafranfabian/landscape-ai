import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issues by loading directly from CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Region coordinate mapping for auto-pan
const REGION_COORDINATES = {
  'dki jakarta': [-6.2088, 106.8456, 12],
  'jakarta selatan': [-6.2701, 106.8077, 13],
  'jakarta barat': [-6.1683, 106.7583, 13],
  'jawa barat': [-6.9175, 107.6191, 8],
  'bekasi': [-6.2383, 106.9756, 13],
  'bogor': [-6.5971, 106.8060, 13],
  'depok': [-6.4025, 106.7942, 13],
  'banten': [-6.4058, 106.0640, 9],
  'tangerang': [-6.2886, 106.6753, 13],
  'jawa tengah': [-7.1510, 110.1403, 8],
  'semarang': [-7.0051, 110.4381, 12],
  'solo': [-7.5755, 110.8243, 13],
  'surakarta': [-7.5755, 110.8243, 13],
  'diy': [-7.8753, 110.4262, 10],
  'di yogyakarta': [-7.8753, 110.4262, 10],
  'yogyakarta': [-7.7956, 110.3695, 13],
  'sleman': [-7.7212, 110.3644, 12],
  'bantul': [-7.8938, 110.3308, 12],
  'jawa timur': [-7.5360, 112.2384, 8],
  'surabaya': [-7.2575, 112.7521, 12],
  'sumatera utara': [-3.5952, 98.6722, 8],
  'medan': [-3.5952, 98.6722, 12],
};

// Map click controller component
function MapClickEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map pan controller component
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPicker({ latitude, longitude, onChange, province, city, district }) {
  const defaultCenter = [-6.2088, 106.8456]; // Jakarta
  const defaultZoom = 11;
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  // Monitor location changes to fly the map to the selected city/province
  useEffect(() => {
    let key = '';
    if (district) {
      const cleanDist = district.toLowerCase();
      if (cleanDist.includes('senopati') || cleanDist.includes('kebayoran')) key = 'jakarta selatan';
      else if (cleanDist.includes('puri') || cleanDist.includes('kebon')) key = 'jakarta barat';
      else if (cleanDist.includes('bsd') || cleanDist.includes('serpong')) key = 'tangerang';
      else if (cleanDist.includes('summarecon')) key = 'bekasi';
      else if (cleanDist.includes('sentul')) key = 'bogor';
      else if (cleanDist.includes('margonda')) key = 'depok';
      else if (cleanDist.includes('semarang')) key = 'semarang';
      else if (cleanDist.includes('solo') || cleanDist.includes('grogol') || cleanDist.includes('jebres') || cleanDist.includes('laweyan')) key = 'solo';
      else if (cleanDist.includes('depok sleman') || cleanDist.includes('ugm') || cleanDist.includes('ngaglik')) key = 'sleman';
      else if (cleanDist.includes('kasihan') || cleanDist.includes('umy')) key = 'bantul';
      else if (cleanDist.includes('malioboro') || cleanDist.includes('kotagede') || cleanDist.includes('umbulharjo') || cleanDist.includes('gedongtengen')) key = 'yogyakarta';
      else if (cleanDist.includes('medan')) key = 'medan';
    }
    
    if (!key && city) {
      const cleanCity = city.toLowerCase();
      if (REGION_COORDINATES[cleanCity]) key = cleanCity;
    }
    
    if (!key && province) {
      const cleanProv = province.toLowerCase();
      if (REGION_COORDINATES[cleanProv]) key = cleanProv;
    }

    if (key && REGION_COORDINATES[key]) {
      const [lat, lng, z] = REGION_COORDINATES[key];
      setMapCenter([lat, lng]);
      setMapZoom(z);
      
      // If latitude and longitude aren't set yet, auto-fill them with region center
      if (!latitude && !longitude) {
        onChange(lat, lng);
      }
    }
  }, [province, city, district]);

  // Handle map click
  const handleMapClick = (lat, lng) => {
    onChange(lat, lng);
  };

  const markerPosition = (latitude && longitude) ? [latitude, longitude] : null;

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-800/80 bg-gray-100 dark:bg-dark-900">
      <MapContainer
        center={markerPosition || mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark:opacity-85 dark:contrast-120 dark:hue-rotate-[200deg]" // Subtle filter for Dark mode maps
        />
        <MapClickEvents onMapClick={handleMapClick} />
        <ChangeMapView center={markerPosition || mapCenter} zoom={mapZoom} />
        
        {markerPosition && (
          <Marker 
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onChange(position.lat, position.lng);
              }
            }}
          />
        )}
      </MapContainer>

      {/* Floating Coordinate Display */}
      <div className="absolute bottom-2 left-2 z-[40] bg-white/95 dark:bg-dark-900/95 backdrop-blur shadow-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-800 flex flex-col">
        {latitude && longitude ? (
          <>
            <span className="text-gray-500 dark:text-gray-400">Koordinat Terpilih:</span>
            <span className="text-primary-600 dark:text-accent-400 font-mono">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
          </>
        ) : (
          <span className="text-gray-500 dark:text-gray-400 animate-pulse">Klik peta untuk memilih lokasi</span>
        )}
      </div>
    </div>
  );
}
