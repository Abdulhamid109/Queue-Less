"use client"
import Admin_navbar from '@/components/admin_navbar'
import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { getLocation } from '@/helpers/getCurrentLocation'
import L from "leaflet"
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface CompanyDataFormat {
    CompanyName: string
    BusinessType: string
    Country: string
    State: string
    City: string
    Pincode: string
    BusinessAddress: string
    Website?: string
    latitude?: number
    longitude?: number
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
    const [data, setData] = useState<CompanyDataFormat>({
        CompanyName: '',
        BusinessType: '',
        Country: '',
        State: '',
        City: '',
        Pincode: '',
        BusinessAddress: '',
        Website: '',
    })
    const [formLoading, setFormLoading] = useState(false)
    const [locationLoading, setLocationLoading] = useState(true) // true = fetching
    const [locationGranted, setLocationGranted] = useState(false)
    const [latitude, setLatitude] = useState<number | null>(null)
    const [longitude, setLongitude] = useState<number | null>(null)
    const [markerPos, setMarkerPos] = useState<[number, number] | null>()
    const [searchQuery, setSearchQuery] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null);
    const [buttonLoadingState, setButtonLoadingState] = useState<boolean>(false);
    const router = useRouter();

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
                setData((prev) => ({ ...prev, BusinessAddress: address, latitude: location.coords.latitude, longitude: location.coords.longitude }))
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
                setData((prev) => ({ ...prev, BusinessAddress: address, latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }))

            } else {
                toast.error("Location not found. Try selecting directly on the map.")
            }
        } catch (error) {
            console.error("Nominatim error:", error)
            toast.error("Search failed. Please try again.")
        }
    }

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setMarkerPos([lat, lng])
        setData((prev) => ({ ...prev, BusinessAddress: address, latitude: lat, longitude: lng }))
    }

    const handleSaveAddress = () => {
        if (!markerPos) {
            toast.error("Please click on the map to select a location first.")
            return
        }
        toast.success("Address saved!")
        setDialogOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.BusinessAddress) {
            toast.error("Please select a business address from the map.")
            return
        }
        setFormLoading(true)
        try {
            const response = await fetch("/api/admin/businessInfo", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data)
            });

            const resilt = await response.json();
            if (!response.ok) {
                console.log("Something went wrong");
                throw new Error(resilt.error || "Failed to Perform the Operation")
            } else {
                if (response.status === 200) {
                    // for now after some time we can store in Reddis
                    localStorage.setItem("StepOne", "true");
                    localStorage.setItem("uid", resilt.Business._id);
                }
                console.log("Submitting:", data)
                toast.success("Business info saved!");
                router.push("/admin/addBusiness/serviceInfo");
            }

        } catch (error) {
            console.error("Submit error:", error)
            if (error instanceof Error) toast.error(error.message)
        } finally {
            setFormLoading(false)
        }
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



    const DeleteBusinessInfoDetails = async () => {
        setButtonLoadingState(true)
        try {
            const uid = localStorage.getItem("uid");
            if (!uid) {
                console.log("UID Not founnd!");
                throw new Error("Something went wrong");
            }
            const response = await fetch(`/api/admin/delBI?uid=${uid}`,
                {
                    method: "DELETE"
                }
            )
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                toast.success("Successfully deleted the stored Form Data");
                localStorage.removeItem("StepOne");
                localStorage.removeItem("uid");
            }
        } catch (error) {
            console.log("Failed to Perform the functionality" + error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setButtonLoadingState(false);
        }
    }

    if (localStorage.getItem("StepOne") === "true") {
        return <div className='relative top-[10vh] flex flex-col min-h-full min-w-full justify-center items-center gap-2 p-2'>
            <p className='text-xl p-1'>Step One has been Completed : <Link className='hover:underline text-blue-500' href={"/admin/addBusiness/serviceInfo"}>Navigate to Step Two</Link></p>
            {
                buttonLoadingState ? <button disabled className='rounded-md bg-gray-500 text-white p-1 hover:bg-gray-600'>Deleting....</button>
                    : <button onClick={DeleteBusinessInfoDetails} className='rounded-md bg-red-500 text-white p-1 hover:bg-red-600'>Clear and Delete the Previous Details</button>

            }
        </div>
    }

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Admin_navbar />
            <p className="text-xl p-4 animate-pulse text-center text-blue-600 font-medium">
                Step 01 — Business Information
            </p>

            <section className="p-5 flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="shadow-lg p-6 w-full max-w-2xl rounded-xl bg-white border border-gray-200 flex flex-col gap-4"
                >
                    <Field label="Company Name *">
                        <input
                            required
                            value={data.CompanyName}
                            onChange={(e) => setData((p) => ({ ...p, CompanyName: e.target.value }))}
                            type="text"
                            className="input-field  flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                            placeholder="Enter your company / business name"
                        />
                    </Field>

                    <Field label="Business Type *">
                        <select
                            required
                            value={data.BusinessType}
                            onChange={(e) => setData((p) => ({ ...p, BusinessType: e.target.value }))}
                            className="input-field  flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                        >
                            <option value="">Select your business type</option>
                            <option value="Clinics">Clinics</option>
                            <option value="HairSaloons">Hair Saloons</option>
                        </select>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Country *">
                            <input
                                required
                                value={data.Country}
                                onChange={(e) => setData((p) => ({ ...p, Country: e.target.value }))}
                                type="text"
                                className=" flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                                placeholder="Country"
                            />
                        </Field>
                        <Field label="State *">
                            <input
                                required
                                value={data.State}
                                onChange={(e) => setData((p) => ({ ...p, State: e.target.value }))}
                                type="text"
                                className="input-field  flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                                placeholder="State"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="City *">
                            <input
                                required
                                value={data.City}
                                onChange={(e) => setData((p) => ({ ...p, City: e.target.value }))}
                                type="text"
                                className="input-field  flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                                placeholder="City"
                            />
                        </Field>
                        <Field label="Pin Code *">
                            <input
                                required
                                value={data.Pincode}
                                onChange={(e) => setData((p) => ({ ...p, Pincode: e.target.value }))}
                                type="text"
                                className="input-field  flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                                placeholder="Pin code"
                            />
                        </Field>
                    </div>

                    <Field label="Business Address *">
                        <div className="flex items-center gap-2 p-2 border border-blue-300 rounded-md bg-white">
                            <p className="flex-1 text-sm text-gray-500 truncate">
                                {data.BusinessAddress || "No address selected yet"}
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
                                                        <Popup>{data.BusinessAddress || "Current Location"}</Popup>
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
                    </Field>

                    <Field label={<>Business Website <span className="text-xs text-gray-400">(optional)</span></>}>
                        <input
                            value={data.Website}
                            onChange={(e) => setData((p) => ({ ...p, Website: e.target.value }))}
                            type="url"
                            className=" flex items-center gap-2 p-2 focus:outline border border-blue-300 rounded-md "
                            placeholder="https://yourwebsite.com"

                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={formLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2 rounded-md transition font-medium mt-2"
                    >
                        {formLoading ? "Submitting…" : "Submit"}
                    </button>
                </form>
            </section>
        </div>
    )
}

const Field = ({
    label,
    children,
}: {
    label: React.ReactNode
    children: React.ReactNode
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">{label}</label>
        {children}
    </div>
)

export default Page