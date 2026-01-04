"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    lat: number;
    lng: number;
    title?: string;
}

export default function MapComponent({ lat, lng, title }: MapProps) {
    // Default to Dominican Republic center if coordinates are invalid
    const center: [number, number] = [lat || 18.7357, lng || -70.1627];
    const zoom = lat ? 13 : 8;

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {lat && lng && (
                    <Marker position={[lat, lng]} icon={icon}>
                        <Popup>
                            {title || "Ubicación del Tour"}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
