import Link from 'next/link'
import React from 'react'

const Herosection = () => {
  return (
    <main className='min-h-screen flex flex-col justify-center items-center gap-6 px-4 md:gap-8 md:px-8'>
        <div className='md:text-5xl text-2xl font-bold bg-gradient-to-t from-gray-500 to-gray-900 text-transparent bg-clip-text'>
            Queue-Less
        </div>
        <p className='text-xl font-thin'>
            A place where your time is respected, not wasted in lines
        </p>
        <div className=' flex justify-center items-center gap-2'>
            <button className='bg-lime-600 p-2 rounded-md'>About us</button>
            <Link href={"/auth/login"} className='bg-blue-600 p-2 rounded-md'>Get Started</Link>
        </div>
    </main>
  )
}

export default Herosection