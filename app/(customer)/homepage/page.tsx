"use client"
import Cust_navbar from '@/components/cust_navbar';
import { getLocation } from '@/helpers/getCurrentLocation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { MapPin, Scissors, Stethoscope, LayoutGrid, RefreshCw } from 'lucide-react';

const categories = [
    {
        label: "Hair Saloons",
        sub: "Find all hair saloons near you",
        href: "/allbusiness/HairSaloons",
        icon: Scissors,
        bg: "bg-blue-50",
        iconColor: "text-blue-500",
        border: "border-blue-100",
    },
    {
        label: "Clinics",
        sub: "Find all clinics near you",
        href: "/allbusiness/Clinics",
        icon: Stethoscope,
        bg: "bg-green-50",
        iconColor: "text-green-500",
        border: "border-green-100",
    },
    {
        label: "Explore All",
        sub: "Browse all business categories",
        href: "/allbusiness",
        icon: LayoutGrid,
        bg: "bg-gray-50",
        iconColor: "text-gray-500",
        border: "border-gray-200",
    },
];

const Page = () => {
    const [locationCheck, setLocationCheck] = useState<boolean>(false);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCurrentLocation = async () => {
            setLocationCheck(true);
            try {
                const location = await getLocation();
                if (!location) {
                    setLocationCheck(false);
                }
                setLocationCheck(true);
                const latitude = location.coords.latitude;
                const longitude = location.coords.longitude;
                console.log(latitude, longitude);

            } catch (error: any) {
                console.log("Error=>" + JSON.stringify(error));
                if (error.code === 1) {
                    console.log("User denied location access ❌");
                    setLocationCheck(false);
                }
            } finally {
                setLocationLoading(false);
            }
        }

        fetchCurrentLocation();
    }, [])

    // Location denied fallback
    if (!locationCheck) {
        return (
            <div className="font-sans flex flex-col justify-center items-center h-screen w-screen bg-gray-50 gap-4 text-center px-6">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-2">
                    <MapPin size={20} className="text-red-400" />
                </div>
                <h2 className="text-lg font-medium text-gray-900">Location access required</h2>
                <p className="text-sm font-light text-gray-500 max-w-xs leading-relaxed">
                    Queueless uses your location to find nearby businesses and confirm your arrival at a queue slot.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors mt-2"
                >
                    <RefreshCw size={14} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <Cust_navbar />

            {locationLoading ? (
                <div className="flex justify-center items-center h-[60vh] animate-pulse text-sm text-gray-400">
                    Fetching your location...
                </div>
            ) : (
                <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

                    {/* Welcome Header */}
                    <section className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">
                        <div>
                            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                                Welcome back
                            </p>
                            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                                Tony Stark
                            </h1>
                            <div className="flex items-center gap-1.5 mt-2">
                                <MapPin size={13} className="text-green-500" />
                                <p className="text-sm font-light text-gray-500">Location detected</p>
                            </div>
                        </div>

                        {/* Search / Filter */}
                        <div className="flex flex-col gap-1.5 md:w-64">
                            <label className="text-xs font-medium tracking-widest uppercase text-gray-400">
                                Browse Category
                            </label>
                            <select
                                onChange={(e) => {
                                    if (e.target.value) router.push(`/allbusiness/${e.target.value}`)
                                }}
                                className="text-sm border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                            >
                                <option value="">Select a category</option>
                                <option value="HairSaloons">Hair Saloons</option>
                                <option value="Clinics">Clinics</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </section>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200" />

                    {/* Business Categories */}
                    <section className="space-y-4">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                            Business Categories
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {categories.map((cat, i) => {
                                const Icon = cat.icon;
                                return (
                                    <Link
                                        key={i}
                                        href={cat.href}
                                        className={`flex flex-col gap-3 p-5 rounded-xl border ${cat.bg} ${cat.border} hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg bg-white border ${cat.border} flex items-center justify-center`}>
                                            <Icon size={16} className={cat.iconColor} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                                            <p className="text-xs font-light text-gray-500 mt-0.5">{cat.sub}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                </main>
            )}
        </div>
    );
}

export default Page;