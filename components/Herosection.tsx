import Link from 'next/link'
import React from 'react'

const Herosection = () => {
  return (
    <main className='min-h-screen flex flex-col justify-center items-center gap-6 px-6 text-center bg-gray-50'>

      {/* Badge */}
      <span className='text-xs font-medium tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full'>
        Smart Queue Management
      </span>

      {/* Heading */}
      <h1 className='text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-gray-900 max-w-3xl'>
        Your time deserves{' '}
        <span className='italic font-normal text-gray-400'>better</span>{' '}
        than a waiting line.
      </h1>

      {/* Subheading */}
      <p className='text-base md:text-lg font-light text-gray-500 max-w-xl leading-relaxed'>
        Queueless lets you join queues digitally, track your position in real time,
        and show up only when it&apos;s your turn — no crowded lobbies, no wasted time.
      </p>

      {/* CTAs */}
      <div className='flex justify-center items-center gap-3 mt-2'>
        <Link
          href='/auth/login'
          className='bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors duration-200'
        >
          Get Started
        </Link>
        <Link
          href='/aboutus'
          className='text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors duration-200'
        >
          About Us
        </Link>
      </div>

      {/* Trust line */}
      <p className='text-xs text-gray-400 mt-4 font-light'>
        Location-aware · Real-time updates · Zero unnecessary waiting
      </p>

    </main>
  )
}

export default Herosection