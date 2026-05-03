import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

      {/* Icon */}
      <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      </div>

      {/* Badge */}
      <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide">
        Coming soon
      </span>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 text-center tracking-tight">
        Payments are on the way
      </h1>

      {/* Subtext */}
      <p className="text-sm text-slate-400 text-center mt-3 max-w-sm leading-relaxed">
        We&apos;re working on a seamless payments experience. Until then, enjoy everything completely{' '}
        <span className="text-emerald-500 font-medium">free of charge</span> — no credit card, no commitment.
      </p>

      {/* Divider */}
      <div className="w-12 h-px bg-slate-200 my-8" />

      {/* Free perks */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {[
          { icon: "✓", label: "Unlimited bookings" },
          { icon: "✓", label: "Full queue management" },
          { icon: "✓", label: "Business analytics" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center font-semibold flex-shrink-0">
              {item.icon}
            </span>
            <p className="text-sm text-slate-600">{item.label}</p>
            <span className="ml-auto text-xs text-emerald-500 font-medium">Free</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-300 mt-10 text-center max-w-xs">
        You&apos;ll be notified before any pricing changes go live.
      </p>

    </div>
  )
}

export default Page