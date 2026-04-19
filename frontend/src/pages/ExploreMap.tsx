import { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { PlaceService } from '../services/PlaceService';
import { Search, Map as MapIcon, Star, MapPin, ChevronRight, Layers, Navigation, LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { IPlace } from '../types';

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

const ExploreMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [places, setPlaces] = useState<IPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [locatingUser, setLocatingUser] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await PlaceService.getPlaces({ limit: 100 });
        setPlaces(res.places || []);
      } catch (err) {
        console.error('Map fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [places, searchTerm]);

  const handlePlaceSelect = useCallback((place: any) => {
    setSelectedPlace(place);
    map?.panTo({
      lat: place.location.coordinates[1],
      lng: place.location.coordinates[0]
    });
    map?.setZoom(15);
  }, [map]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(userPos);
        map?.panTo(userPos);
        map?.setZoom(13);
        setCurrentLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocatingUser(false);
      },
      () => {
        setLocatingUser(false);
        setCurrentLocation('Location access denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [map]);

  return (
    <div style={{ height: 'calc(100vh - var(--header-height))', display: 'flex', overflow: 'hidden', background: '#fff' }}>
      {/* ─── Sidebar ─── */}
      <div className="hidden lg:flex" style={{
        width: 370, background: '#fff', borderRight: '1px solid #f1f5f9',
        flexDirection: 'column', zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: '#0f172a',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <MapIcon size={16} />
              </div>
              <div>
                <h2 className="font-poppins" style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>Explorer</h2>
                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Interactive map</p>
              </div>
            </div>
            <span style={{
              padding: '4px 10px', background: '#eef2ff', color: '#6366f1',
              borderRadius: 8, fontSize: 11, fontWeight: 700,
            }}>
              {filteredPlaces.length} spots
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search city or place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', background: '#f8fafc', border: '1.5px solid #f1f5f9',
                borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 13, fontWeight: 500,
                outline: 'none', color: '#0f172a', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.background = '#fff'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc'; }}
            />
          </div>

          {/* Current Location Input */}
          <div style={{ position: 'relative' }}>
            <LocateFixed size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#14b8a6', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Your current location"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              readOnly
              style={{
                width: '100%', background: '#f0fdfa', border: '1.5px solid #ccfbf1',
                borderRadius: 10, padding: '10px 90px 10px 38px', fontSize: 12, fontWeight: 600,
                outline: 'none', color: '#0f172a', transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif', cursor: 'default',
              }}
            />
            <button
              onClick={handleUseMyLocation}
              disabled={locatingUser}
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', background: '#14b8a6', color: '#fff',
                border: 'none', borderRadius: 7, fontSize: 10, fontWeight: 700,
                cursor: locatingUser ? 'wait' : 'pointer', transition: 'all 0.2s',
                opacity: locatingUser ? 0.6 : 1,
              }}
            >
              <Navigation size={11} />
              {locatingUser ? 'Finding...' : 'Locate Me'}
            </button>
          </div>
        </div>

        {/* Place List */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse" style={{ display: 'flex', gap: 12, padding: 10 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: '#f1f5f9', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, width: '75%' }} />
                    <div style={{ height: 8, background: '#f8fafc', borderRadius: 99, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, background: '#f8fafc', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>
                <MapPin size={20} style={{ color: '#cbd5e1' }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>No places found</p>
            </div>
          ) : (
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredPlaces.map((place: any) => {
                const isActive = selectedPlace?._id === place._id;
                return (
                  <div
                    key={place._id}
                    onClick={() => handlePlaceSelect(place)}
                    style={{
                      display: 'flex', gap: 12, padding: 10, borderRadius: 14,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: isActive ? '#eef2ff' : 'transparent',
                      border: isActive ? '1px solid #e0e7ff' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
                      flexShrink: 0, background: '#f1f5f9',
                    }}>
                      <img
                        src={place.photos?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=120'}
                        alt=""
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <h4 style={{
                          fontSize: 13, fontWeight: 700, margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          color: isActive ? '#4338ca' : '#1e293b',
                        }}>
                          {place.name}
                        </h4>
                        <ChevronRight size={13} style={{
                          flexShrink: 0, color: isActive ? '#6366f1' : '#e2e8f0',
                          transition: 'all 0.2s',
                        }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {place.category} · {place.city}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                          <Star size={10} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>4.8</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Map Area ─── */}
      <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
        {isLoaded ? (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={m => setMap(m)}
              options={{
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: false,
              }}
            >
              {filteredPlaces.map((place: any) => (
                <Marker
                  key={place._id}
                  position={{
                    lat: place.location.coordinates[1],
                    lng: place.location.coordinates[0]
                  }}
                  onClick={() => handlePlaceSelect(place)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: selectedPlace?._id === place._id ? '#4f46e5' : '#1e293b',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: '#ffffff',
                    scale: selectedPlace?._id === place._id ? 10 : 7,
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
                  <div style={{ padding: 4, width: 240 }}>
                    <div style={{ position: 'relative', height: 120, width: '100%', marginBottom: 10, borderRadius: 12, overflow: 'hidden' }}>
                      <img
                        src={selectedPlace.photos?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt=""
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
                      <span style={{
                        position: 'absolute', top: 8, right: 8, padding: '2px 8px',
                        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                        borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#374151',
                      }}>
                        {selectedPlace.category}
                      </span>
                    </div>
                    <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#1e293b' }}>
                      {selectedPlace.name}
                    </h4>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} style={{ color: '#6366f1' }} /> {selectedPlace.city}
                    </p>
                    <Link
                      to={`/place/${selectedPlace._id}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', padding: '8px 16px', background: '#0f172a',
                        color: '#fff', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Map overlay controls */}
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
              <button
                onClick={() => map?.setZoom((map?.getZoom() || 12) + 1)}
                style={{
                  width: 40, height: 40, background: '#fff', borderRadius: 12,
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#475569', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                }}
              >
                +
              </button>
              <button
                onClick={() => map?.setZoom((map?.getZoom() || 12) - 1)}
                style={{
                  width: 40, height: 40, background: '#fff', borderRadius: 12,
                  boxShadow: '0 2px 8px -2px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#475569', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                }}
              >
                −
              </button>
            </div>

            {/* Bottom controls */}
            <div style={{ position: 'absolute', bottom: 20, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
              {/* Mobile: Locate Me button (visible only on small screens) */}
              <button
                onClick={handleUseMyLocation}
                className="lg:hidden"
                style={{
                  padding: '10px 16px', background: '#14b8a6', borderRadius: 12, color: '#fff',
                  boxShadow: '0 2px 8px -2px rgba(20,184,166,0.3)', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>
                <LocateFixed size={14} /> My Location
              </button>
              <button style={{
                padding: '10px 16px', background: '#fff', borderRadius: 12,
                boxShadow: '0 2px 8px -2px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer',
              }}>
                <Layers size={14} /> Layers
              </button>
            </div>
          </>
        ) : (
          <div style={{
            height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14, background: '#f8fafc',
          }}>
            <div style={{
              width: 40, height: 40, border: '3px solid #e2e8f0',
              borderTopColor: '#6366f1', borderRadius: '50%',
            }} className="animate-spin" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.03em' }}>Loading map...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f8fafc" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f8fafc" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f1f5f9" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#e0f2fe" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#e2e8f0" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#dbeafe" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#93c5fd" }] },
];

export default ExploreMap;
