"use client"
import Cust_navbar from '@/components/cust_navbar';
import { getLocation } from '@/helpers/getCurrentLocation';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { MapPin, Search, RefreshCw, Navigation } from 'lucide-react';

interface DataFormat {
  _id: string;
  BusinessName: string;
  BusinessAddress: string;
  distance: number;
}

const Page = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [locationGranted, setLocationGranted] = useState(false);
  const [data, setData] = useState<DataFormat[]>([]);
  const [search, setSearch] = useState<string>('');
  const [radius, setRadius] = useState<string>('');
  const [latitude,setLatitude] = useState<number>();
  const [longitude,setLongitude] = useState<number>();
  const [radiusLoader,setRadiusLoader] = useState<boolean>(false);
  const radiusRef = useRef<HTMLInputElement>(null);

  const fetchingCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) {
      setLocationGranted(false);
      setLoading(false);
      return;
    }
    setLocationGranted(true);
    fetchBusiness(location.coords.latitude, location.coords.longitude);
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  }

  const fetchBusiness = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const payload = { latitude, longitude };
      const response = await fetch(`/api/customer/businessBasedOnCat?category=${slug}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      } else {
        setData(result.businessess);
        toast.success("Successfully fetched the data");
      }
    } catch (error) {
      console.log("Error=>" + JSON.stringify(error));
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const fetchBusinessBasedOnRadius =async(latitude: number, longitude: number)=>{
    setRadiusLoader(true);
    try {
      const payload = { radius,latitude, longitude };
      const response = await fetch(`/api/customer/RadiusbasedFetching?slug=${slug}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      } else {
        setData(result.business);
        toast.success("Successfully fetched the data");
        radiusRef.current!.value = ''
      }
    } catch (error) {
      console.log("Error=>" + JSON.stringify(error));
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }finally{
      setRadiusLoader(false);
    }
  }

  useEffect(() => {
    fetchingCurrentLocation();
  }, [])

  const filtered = data.filter((d) =>
    d.BusinessName.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center items-center h-screen gap-3 animate-pulse">
          <Navigation size={24} className="text-gray-300" />
          <p className="text-sm text-gray-400">Finding shops near you...</p>
        </div>
      </div>
    );
  }

  // Location denied state
if (!locationGranted) {
    return (
        <div className="flex justify-center items-center flex-col gap-4 min-h-screen px-6 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-red-400" />
            </div>
            <h2 className="text-base font-medium text-slate-800">Location access blocked</h2>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Your browser has blocked location access. To fix this:
            </p>
            <ol className="text-sm text-slate-500 text-left max-w-xs space-y-1 list-decimal list-inside">
                <li>Click the <strong>lock icon</strong> in your address bar</li>
                <li>Set <strong>Location</strong> to <em>Allow</em></li>
                <li>Refresh the page</li>
            </ol>
            <p>We need location access for fetching the near-by business locations </p>
            <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
                I&apos;ve allowed it — Retry
            </button>
        </div>
    );
}

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Cust_navbar />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Browsing
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 capitalize">
              {slug} near you
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin size={13} className="text-green-500" />
              <p className="text-sm font-light text-gray-500">
                {data.length} {data.length === 1 ? "business" : "businesses"} found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm border border-gray-200 bg-white rounded-lg pl-9 pr-4 py-2.5 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            />
          </div>
        </div>

        <div className="w-full h-px bg-gray-200" />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">No businesses found nearby</p>
              <p className="text-xs font-light text-gray-500 max-w-xs">
                Try increasing the search radius to find more results.{' '}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full max-w-sm">
              <input
                type="number"
                value={radius}
                ref={radiusRef!}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Radius in KM (4 – 10)"
                className="flex-1 text-sm border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
              />
              <button 
              onClick={()=>fetchBusinessBasedOnRadius(latitude!,longitude!)}
              disabled={radiusLoader}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap">
                {radiusLoader?<p className='animate-pulse'>Fetching....</p>:"Search"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((d: DataFormat) => (
              <Link
                href={`/allbusiness/${slug}/${d._id}`}
                key={d._id}
                className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 text-sm font-medium flex-shrink-0">
                  {d.BusinessName.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{d.BusinessName}</p>
                  <p className="text-xs font-light text-gray-500 leading-relaxed line-clamp-2">
                    {d.BusinessAddress}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                  <Navigation size={12} className="text-blue-400" />
                  <p className="text-xs text-blue-500 font-medium">
                    {(d.distance / 1000).toFixed(2)} km away
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default Page;