"use client";
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useApp } from "@/context/AppContext";
import { MapPin, Navigation, Info } from 'lucide-react';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function GymsMap({ customGyms = null, className = "h-[400px] md:h-[500px]" }) {
    const { language, gyms: appGyms = [], getText } = useApp();
    const gyms = customGyms || appGyms;
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState(null);

    useEffect(() => {
        setIsMounted(true);
        // Load Leaflet directly for custom Icons
        import('leaflet').then(mod => {
            setL(mod);
        });
    }, []);

    // Filter gyms that have valid coordinates
    const mapGyms = useMemo(() => {
        return gyms.filter(g => {
            const lat = Number(g.latitude);
            const lng = Number(g.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && g.status !== 'inactive';
        });
    }, [gyms]);

    if (!isMounted || !L) return (
        <div className="w-full h-80 bg-gray-100 dark:bg-white/5 animate-pulse rounded-[2.5rem] flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-300 animate-bounce" />
        </div>
    );

    
    // Default center (Riyadh)
    const center = [24.7136, 46.6753];

    // Create custom icon
    const icon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    return (
        <div className={`relative w-full ${className} mb-12 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-premium group`}>
            <MapContainer 
                center={mapGyms.length > 0 ? [parseFloat(mapGyms[0].latitude), parseFloat(mapGyms[0].longitude)] : center} 
                zoom={11} 
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {mapGyms.map((gym) => (
                    <Marker 
                        key={gym.id} 
                        position={[parseFloat(gym.latitude), parseFloat(gym.longitude)]}
                        icon={icon}
                    >
                        <Popup className="captina-popup">
                            <div className="p-1 min-w-[150px]">
                                <h4 className="font-black text-sm mb-1 text-slate-900">{getText(gym.name)}</h4>
                                <p className="text-[10px] text-gray-500 mb-3 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {getText(gym.location)}
                                </p>
                                <a 
                                    href={gym.location_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full py-2 bg-primary text-white text-[10px] font-black text-center rounded-lg shadow-lg shadow-primary/30 transition-transform active:scale-95"
                                >
                                    {language === 'ar' ? 'التوجه للموقع' : 'Get Directions'}
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Info Overlay */}
            <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
                <div className="px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary animate-ping rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        {language === 'ar' ? 'فروع متاح' : 'Available Branches'}
                    </span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">
                        {mapGyms.length}
                    </span>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .leaflet-container {
                    background: #f1f5f9;
                }
                .dark .leaflet-container {
                    background: #0f172a;
                    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1.5rem !important;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
                    padding: 4px !important;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
                .leaflet-v-layer {
                    z-index: 1 !important;
                }
            `}</style>
        </div>
    );
}
