"use client"
import Admin_navbar from '@/components/admin_navbar'
import { PlusCircle, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Data {
  _id: string
  BusinessName: string
  BusinessAddress: string
}

const CARD_ACCENTS = [
  "before:bg-emerald-500",
  "before:bg-violet-500",
  "before:bg-sky-500",
  "before:bg-amber-500",
  "before:bg-rose-500",
  "before:bg-teal-500",
]

const Page = () => {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/allbusiness", {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      })
      const result = await response.json()
      setData(result.Business)
    } catch (error) {
      console.log("Error=>" + error)
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Admin_navbar />
        <div className="max-w-6xl mx-auto px-6 pt-16">
          <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse mb-10" />
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-36 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Admin_navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-1">Dashboard</p>
          <h1 className="text-2xl font-semibold text-slate-800">Welcome back, Admin</h1>
          <p className="text-sm text-slate-400 mt-1">
            {data.length} {data.length === 1 ? "business" : "businesses"} registered
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500">Your businesses</p>
          <Link
            href="/admin/addBusiness/businessInfo"
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <PlusCircle size={14} />
            Add new
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {data.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Building2 size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">No businesses yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-5">Add your first business to get started</p>
              <Link
                href="/admin/addBusiness/businessInfo"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                <PlusCircle size={15} />
                Add business
              </Link>
            </div>
          ) : (
            <>
              {data.map((d: Data, i: number) => (
                <Link
                  href={`/admin/homepage/${d._id}`}
                  key={d._id}
                  className="group relative bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className={`absolute top-0 left-0 right-0 h-0.5 ${CARD_ACCENTS[i % CARD_ACCENTS.length]} before:block before:h-full`} />

                  <div className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                    <Building2 size={16} />
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate leading-tight">{d.BusinessName}</p>
                    <div className="flex items-start gap-1">
                      <MapPin size={11} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{d.BusinessAddress}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <span className="text-xs text-slate-300 group-hover:text-emerald-500 transition-colors self-end">
                    Manage →
                  </span>
                </Link>
              ))}

              <Link
                href="/admin/addBusiness/businessInfo"
                className="group bg-white border border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 bg-slate-50 group-hover:bg-emerald-50 border border-slate-200 group-hover:border-emerald-200 rounded-xl flex items-center justify-center transition-colors">
                  <PlusCircle size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-xs font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">
                  Add business
                </p>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Page