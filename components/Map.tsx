"use client"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function MapClickHandler({ onLocationSelect }: {
    onLocationSelect: (lat: number, lng: number, address: string) => void
}) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                )
                const data = await res.json()
                const address = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                onLocationSelect(lat, lng, address)
            } catch {
                onLocationSelect(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            }
        },
    })
    return null
}

interface MapProps {
    latitude: number
    longitude: number
    markerPos: [number, number] | null
    address: string
    onLocationSelect: (lat: number, lng: number, address: string) => void
}

export default function Map({ latitude, longitude, markerPos, address, onLocationSelect }: MapProps) {
    return (
        <MapContainer
            key={`${latitude}-${longitude}`}
            center={[latitude, longitude]}
            zoom={15}
            className="h-full w-full"
        >
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={onLocationSelect} />
            {markerPos && (
                <Marker position={markerPos}>
                    <Popup>{address || "Current Location"}</Popup>
                </Marker>
            )}
        </MapContainer>
    )
}