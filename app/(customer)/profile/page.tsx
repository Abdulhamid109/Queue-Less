"use client"
import Cust_navbar from '@/components/cust_navbar'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, RefreshCw, Pencil } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  CustomerAddress: string;
}

const fields = [
  { key: "name", label: "Name", icon: User },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "CustomerAddress", label: "Location", icon: MapPin },
];

const Page = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer/profile", {
        method: 'GET'
      });

      const result = await response.json();
      setData(result.profile);
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong failed to fetch");
      } else {
        toast.success("Successfully fetched!")
      }
    } catch (error) {
      console.log("Failed to Perform the functionality " + JSON.stringify(error));
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchProfileData();
    }
    fetchDetails();
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        <Cust_navbar />
        <div className="flex justify-center items-center h-[80vh] animate-pulse text-sm text-gray-400">
          Fetching your profile...
        </div>
      </div>
    );
  }

  // Error / no data state
  if (!data) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        <Cust_navbar />
        <div className="flex flex-col justify-center items-center h-[80vh] gap-4 text-center px-6">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-red-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Profile not found</h2>
          <p className="text-sm font-light text-gray-500 max-w-xs">
            We couldn&apos;t load your profile data. Please try again.
          </p>
          <button
            onClick={() => fetchProfileData()}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={14} />
            {loading ? "Trying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <Cust_navbar />

      <main className="max-w-xl mx-auto px-6 py-12 space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Account
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Avatar strip */}
          <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">{data.name}</p>
              <p className="text-sm font-light text-gray-400">{data.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-100">
            {fields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-start gap-4 px-6 py-4">
                <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm text-gray-900 font-medium break-words">
                    {data[key as keyof ProfileData] || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit button */}
          <div className="px-6 py-4 border-t border-gray-100">
            <button className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Page;