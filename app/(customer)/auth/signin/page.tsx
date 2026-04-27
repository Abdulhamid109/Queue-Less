"use client"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLocation } from "@/helpers/getCurrentLocation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface DataFormat {
    name: string;
    email: string;
    password: string;
    CustomerAddress: string;
    phone:string;
    latitude?:number;
    longitude?:number;
}

function MapClickHandler({
    onLocationSelect,
}: {
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

const Page = () => {
    const [data, setdata] = useState<DataFormat | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [markerPos, setMarkerPos] = useState<[number, number] | null>()
    const [searchQuery, setSearchQuery] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null);
    const [locationLoading, setLocationLoading] = useState(true) // true = fetching
    const [locationGranted, setLocationGranted] = useState(false)
    const [isClicked, setClicked] = useState<boolean>(false);
    


    useEffect(() => {
        const fetchCurrentLocation = async () => {
            setLocationLoading(true)
            try {
                const location = await getLocation()
                if (!location) {
                    setLocationGranted(false)
                    return
                }
                setLatitude(location.coords.latitude)
                setLongitude(location.coords.longitude)
                setLocationGranted(true);
                setMarkerPos([location.coords.latitude, location.coords.longitude]);
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
                )
                const data = await res.json()
                const address = data.display_name ?? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`
                setdata((prev) => ({ ...prev!, CustomerAddress: address!, latitude: location.coords.latitude, longitude: location.coords.longitude }))
            } catch (error: any) {
                console.error("Location error:", error)
                if (error.code === 1) {
                    toast.error("Location permission denied.")
                }
                setLocationGranted(false)
            } finally {
                setLocationLoading(false)
            }
        }
        fetchCurrentLocation()
    }, [])

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {...data!,latitude,longitude}
            const response = await fetch("/api/customer/auth/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!");
            }
            toast.success("Successfully account created");
            router.push("/auth/login");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setMarkerPos([lat, lng])
        setdata((prev) => ({ ...prev!, CustomerAddress: address }))
    }

    const handleSaveAddress = () => {
        if (!markerPos) {
            toast.error("Please click on the map to select a location first.")
            return
        }
        toast.success("Address saved!")
        setDialogOpen(false)
    }

    const handleSearchLocation = async () => {
        if (!searchQuery.trim()) return
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            )
            const results = await res.json()
            if (results.length > 0) {
                setLatitude(parseFloat(results[0].lat))
                setLongitude(parseFloat(results[0].lon))
                setMarkerPos([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${parseFloat(results[0].lat)}&lon=${parseFloat(results[0].lon)}`
                )
                const data = await res.json()
                const address = data.display_name ?? `${parseFloat(results[0].lat).toFixed(5)}, ${parseFloat(results[0].lon).toFixed(5)}`
                setdata((prev) => ({ ...prev!, CustomerAddress: address, latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }))

            } else {
                toast.error("Location not found. Try selecting directly on the map.")
            }
        } catch (error) {
            console.error("Nominatim error:", error)
            toast.error("Search failed. Please try again.")
        }
    }


    const isPasswordValid = (password: string): boolean => {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    }

    if (locationLoading) {
        return (
            <p className="flex justify-center animate-pulse text-xl text-center items-center min-h-screen">
                Fetching your location…
            </p>
        )
    }

    if (!locationGranted) {
        return (
            <div className="flex justify-center items-center flex-col gap-3 min-h-screen">
                <p className="text-lg">Location permission is required to continue.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
                >
                    Retry
                </button>
            </div>
        )
    }




    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 m-10">

                <div className="flex flex-col gap-2 mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            required
                            value={data?.name}
                            onChange={(e) => setdata({ ...data!, name: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={data?.email}
                            onChange={(e) => setdata({ ...data!, email: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                                                <label className="text-sm text-gray-600">Password</label>

                        <input
                            type={isClicked ? "text" : "password"}
                            placeholder="Enter your password"
                            value={data?.password}
                            onChange={(e) => {
                                setdata({ ...data!, password: e.target.value })
                            }}
                            required
                            className={`p-3 rounded-lg border focus:outline-none focus:ring-2 transition
            ${data?.password && data.password.length < 8
                                    ? "border-red-400 focus:ring-red-400"
                                    : data?.password && data.password.length >= 8
                                        ? "border-green-400 focus:ring-green-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                        />

                        {/* Validation messages */}
                        {data?.password && (
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1 text-xs px-1">
                                <p className={`flex items-center gap-1 ${data.password.length >= 8 ? "text-green-500" : "text-red-400"}`}>
                                    {data.password.length >= 8 ? "✓" : "✗"} At least 8 characters
                                </p>
                                <p className={`flex items-center gap-1 ${/[A-Z]/.test(data.password) ? "text-green-500" : "text-red-400"}`}>
                                    {/[A-Z]/.test(data.password) ? "✓" : "✗"} At least one uppercase letter
                                </p>
                                <p className={`flex items-center gap-1 ${/[0-9]/.test(data.password) ? "text-green-500" : "text-red-400"}`}>
                                    {/[0-9]/.test(data.password) ? "✓" : "✗"} At least one number
                                </p>
                                <p className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(data.password) ? "text-green-500" : "text-red-400"}`}>
                                    {/[^A-Za-z0-9]/.test(data.password) ? "✓" : "✗"} At least one special character
                                </p>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                        <div className="flex justify-center items-center gap-1">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={isClicked}
                                onChange={() => setClicked(prev => !prev)}
                                className="p-1 cursor-pointer"

                            />
                            <label htmlFor="showPassword" className="cursor-pointer">
                                Show Password
                            </label>
                        </div>

                    </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Phone no</label>
                        <input
                            type="text"
                            placeholder="Enter your Phone no"
                            required
                            value={data?.phone}
                            onChange={(e) => setdata({ ...data!, phone: e.target.value })}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* adding map */}
                        <label className="text-sm text-gray-600">Current Address</label>
                    <div className="flex items-center gap-2 p-2 border border-blue-300 rounded-md bg-white">
                        <p className="flex-1 text-sm text-gray-500 truncate">
                            {data?.CustomerAddress || "No address selected yet"}
                        </p>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md transition shrink-0"
                                >
                                    Open Map
                                </button>
                            </DialogTrigger>
                            <DialogContent
                                onInteractOutside={(e) => e.preventDefault()}
                                onEscapeKeyDown={(e) => e.preventDefault()}
                                showCloseButton={false}
                                className="max-w-2xl"
                            >
                                <DialogTitle>Select your address from the map</DialogTitle>

                                <div className="flex gap-2 mb-2">
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        placeholder="Search a location…"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchLocation}
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md transition"
                                    >
                                        Search
                                    </button>
                                </div>

                                <section className="h-[60vh] w-full rounded-md overflow-hidden">
                                    {latitude && longitude && (
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
                                            <MapClickHandler onLocationSelect={handleLocationSelect} />
                                            {markerPos && (
                                                <Marker position={markerPos}>
                                                    <Popup>{data?.CustomerAddress || "Current Location"}</Popup>
                                                </Marker>
                                            )}
                                        </MapContainer>
                                    )}
                                </section>

                                <div className="flex justify-between items-center pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSaveAddress}
                                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-md transition"
                                    >
                                        Save Address
                                    </button>
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded-md transition"
                                        >
                                            Close
                                        </button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <button
                                            disabled={!isPasswordValid(data?.password || '') && loading}

                                type="submit"
                                className="mt-2 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                            >
                                {loading?"loading...":"signup"}
                            </button>
                    
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link href={"/auth/login"} className="text-blue-600 cursor-pointer hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;