"use client"
import Admin_navbar from '@/components/admin_navbar'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, Building2, Pencil, User } from 'lucide-react'

interface DataFormat {
  name: string
  email: string
  emailVerificationId: string
}

const Page = () => {
  const [profileData, setProfileData] = useState<DataFormat | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const handleProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/profile", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Something went wrong")
        throw new Error(result.error || "Something went wrong")
      }

      setProfileData(result.profile)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { handleProfile() }, [])

  const initials = profileData?.name
    ? profileData.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD"

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Admin_navbar />
        <div className="max-w-2xl mx-auto px-6 pt-14 space-y-4 animate-pulse">
          <div className="h-5 w-24 bg-slate-200 rounded-lg" />
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-slate-200 rounded-lg" />
                <div className="h-3 w-24 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="space-y-3">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Admin_navbar />

      <main className="max-w-2xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="mb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-1">Account</p>
          <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* Avatar header */}
          <div className="px-6 py-6 flex items-center gap-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-semibold flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-medium text-slate-800">{profileData?.name || "—"}</p>
              <p className="text-sm text-slate-400 mt-0.5">Administrator</p>
            </div>
            <button className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors">
              <Pencil size={13} />
              Edit
            </button>
          </div>

          {/* Fields */}
          <div className="px-6 py-5 space-y-4">

            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <User size={11} />
                Full name
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                {profileData?.name || "—"}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Email address
              </label>
              <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border text-sm ${
                profileData?.emailVerificationId
                  ? "bg-slate-50 border-slate-200"
                  : "bg-rose-50 border-rose-200"
              }`}>
                <span className="text-slate-700">{profileData?.email || "—"}</span>
                {profileData?.emailVerificationId ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium flex-shrink-0">
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-500 text-xs font-medium flex-shrink-0">
                    <XCircle size={13} />
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Associated businesses — placeholder */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 size={11} />
                Associated businesses
              </label>
              <div className="space-y-2">
                {/* Replace these with real data when your API returns it */}
                {["Tommy Hair-Saloon", "Eyehealthcure - Clinic"].map((biz) => (
                  <div
                    key={biz}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  >
                    <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 size={13} className="text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-700">{biz}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer action */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
              <Pencil size={13} />
              Edit profile
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Page