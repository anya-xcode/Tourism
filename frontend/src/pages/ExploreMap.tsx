import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { PlaceService } from '../services/PlaceService';
import { Search, Map as MapIcon, ChevronRight, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 28.6139,
  lng: 77.2090 // Delhi
};

const ExploreMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCQ_61fz-hZyPfFGy1CLVm8_31IDhYb-Mo"
  });

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await PlaceService.getPlaces({ limit: 100 });
        setPlaces(res.data.places || []);
      } catch (err) {
        console.error('Map fetch failed:', err);
      }
    };
    fetchPlaces();
  }, []);

  const onSelect = (item: any) => {
    setSelectedPlace(item);
  };

  return (
    <div className="h-[calc(100vh-var(--header-height))] flex overflow-hidden bg-white">
      {/* Search Sidebar - Redesigned */}
      <div className="w-96 bg-white border-r border-[var(--border)] hidden lg:flex flex-col shadow-xl z-10 transition-all">
        <div className="p-8 border-b border-[var(--border-light)] bg-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold flex items-center gap-3">
              <div className="p-2 bg-[var(--primary)] rounded-xl text-white">
                <MapIcon size={20} />
              </div>
              Map <span className="text-[var(--primary)]">Explorer</span>
            </h2>
            <span className="badge badge-primary">{places.length} Spots</span>
          </div>

          <div className="input-group group">
            <Search className="input-icon transition-colors group-focus-within:text-[var(--primary)]" size={20} />
            <input 
              type="text" 
              placeholder="Search by city or name..." 
              className="input-field bg-white shadow-sm !pl-12 !py-3 !text-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-light)] ml-2 mb-2">Destinations Nearby</p>
          {places.map((place: any) => (
            <div 
                key={place._id} 
                onClick={() => {
                    setSelectedPlace(place);
                    map?.panTo({
                      lat: place.location.coordinates[1],
                      lng: place.location.coordinates[0]
                    });
                }}
                className={`p-5 rounded-[20px] cursor-pointer transition-all border group relative overflow-hidden ${
                  selectedPlace?._id === place._id 
                    ? 'bg-[var(--primary-soft)] border-[var(--primary-light)]' 
                    : 'bg-white border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-md'
                }`}
            >
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold text-base transition-colors ${selectedPlace?._id === place._id ? 'text-[var(--primary-dark)]' : 'text-[var(--text)]'}`}>
                    {place.name}
                  </h4>
                  <ChevronRight size={16} className={`transition-transform ${selectedPlace?._id === place._id ? 'translate-x-1 text-[var(--primary)]' : 'text-[var(--text-light)] opacity-0 group-hover:opacity-100'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-muted)] font-600">{place.category} • {place.city}</p>
                  <div className="flex items-center gap-1 text-[var(--accent)]">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold">4.8</span>
                  </div>
                </div>
              </div>
              {selectedPlace?._id === place._id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-subtle">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={m => setMap(m)}
            options={{
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
                controlSize: 24,
            }}
          >
            {places.map((place: any) => (
              <Marker
                key={place._id}
                position={{
                    lat: place.location.coordinates[1],
                    lng: place.location.coordinates[0]
                }}
                onClick={() => onSelect(place)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#2563eb",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff',
                  scale: 8,
                }}
              />
            ))}

            {selectedPlace && (
              <InfoWindow
                position={{
                    lat: selectedPlace.location.coordinates[1],
                    lng: selectedPlace.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="p-3 w-[260px] bg-white rounded-2xl">
                  <div className="relative h-28 w-full mb-3 rounded-xl overflow-hidden group">
                    <img src={selectedPlace.photos?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-[var(--primary)] shadow-sm">
                      {selectedPlace.category}
                    </div>
                  </div>
                  <h4 className="font-poppins font-bold text-base mb-1 text-[var(--text)]">{selectedPlace.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-4 flex items-center gap-1">
                    <MapPin size={12} className="text-[var(--primary)]" /> {selectedPlace.city}
                  </p>
                  <Link 
                    to={`/place/${selectedPlace._id}`} 
                    className="btn btn-primary w-full py-2 !text-xs rounded-xl shadow-[var(--primary-glow)]"
                  >
                    View Experience Details
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin" />
             <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-light)]">Initializing Grid...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStyles = [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

export default ExploreMap;
