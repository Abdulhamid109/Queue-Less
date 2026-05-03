"use client"
import Admin_navbar from '@/components/admin_navbar'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface MemberFormat {
  name: string;
  bookingDate: string;
  JoinedQueue: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-teal-100",   text: "text-teal-700"   },
  { bg: "bg-amber-100",  text: "text-amber-700"  },
  { bg: "bg-rose-100",   text: "text-rose-700"   },
  { bg: "bg-sky-100",    text: "text-sky-700"    },
];

function avatarColor(i: number) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}


const Page = () => {
  const params = useSearchParams();
  const bid = params.get('bid');
  const router = useRouter();

  useEffect(() => {
    if (!bid) router.push('/admin/homepage');
  }, [bid]);

  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [BookingsLoader, setBookingLoader] = useState<boolean>(false);
  const [data, setData] = useState<MemberFormat[]>([]);
  const [search, setSearch] = useState<string>("");

  const FetchBookingDetails = async () => {
    setBookingLoader(true);
    try {
      const response = await fetch(`/api/admin/bookingDetails?id=${bid}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(inputDate),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");
      setData(result.data);
    } catch (error) {
      console.log("Error=>" + error);
    } finally {
      setBookingLoader(false);
    }
  };

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.bookingDate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Admin_navbar />

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Bookings</h1>
        <p className="text-sm text-slate-400 mt-1">
          {inputDate ? `Viewing: ${new Date(inputDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "No date selected"}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
          <button
            disabled={BookingsLoader}
            onClick={()=>{
              setInputDate(new Date().toISOString().split("T")[0])
              FetchBookingDetails()

            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            {BookingsLoader ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Fetching…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Today&apos;s Bookings
              </>
            )}
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Custom Date
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="rounded-2xl max-w-sm"
            >
              <DialogTitle className="text-center text-base font-semibold text-slate-800">
                Select a date
              </DialogTitle>
              <p className="text-xs text-center text-slate-400 -mt-2 mb-1">
                Defaults to today if none selected
              </p>
              <DialogDescription asChild>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  defaultValue={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </DialogDescription>
              <DialogFooter>
                <div className="flex justify-between w-full gap-3 mt-1">
                  <DialogClose asChild>
                    <button
                      onClick={FetchBookingDetails}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 rounded-xl transition-colors"
                    >
                      Fetch
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-xl transition-colors">
                      Cancel
                    </button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 pb-12">

        {BookingsLoader ? (
          /* Loading skeleton */
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>

        ) : data.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No bookings found</p>
            <p className="text-slate-400 text-sm mt-1">Try selecting a different date</p>
          </div>

        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total",    value: data.length   },
                { label: "Showing",  value: filtered.length },
                
              ].map((m) => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 mb-1">{m.label}</p>
                  <p className="text-2xl font-semibold text-slate-800">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or date…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">No results match your search.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((d: MemberFormat, i: number) => {
                  const { bg, text } = avatarColor(i);
                  return (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex items-center gap-4 flex-wrap transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${bg} ${text} flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
                        {getInitials(d.name)}
                      </div>

                      <div className="flex-1 min-w-[100px]">
                        <p className="text-sm font-medium text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{d.bookingDate}</p>
                      </div>

                      <div>
                        {
                          d.JoinedQueue?<div className="rounded-xl p-1 bg-green-300 text-white">Completed</div>:<div className='rounded-md text-xs p-1 bg-red-500 text-white'>Failed</div>
                        }
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import { Suspense } from "react";

function PageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center animate-pulse text-slate-400 text-sm">
        Loading...
      </div>
    }>
      <Page />
    </Suspense>
  );
}

export default PageWrapper;