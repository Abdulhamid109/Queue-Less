import Cust_navbar from '@/components/cust_navbar';
import React from 'react'

const Page = () => {
  return (
    <div>
        <Cust_navbar/>
        <section className='relative m-[5vh] md:text-4xl text-3xl font-bold p-2 bg-gradient-to-l from-green-500 to-blue-500 text-transparent bg-clip-text'>
            Welcome, Tony Stark!
        </section>
        <section className='grid md:grid-cols-3 grid-cols-1 relative m-[5vh] '>
            
            
            <div className='bg-amber-200 rounded-md p-2 m-1'>
                Business - HairStyle
            </div>
            <div className='bg-amber-200 rounded-md p-2 m-1'>
                Business - Clinics
            </div>
            <div className=' rounded-md p-2 m-1'>
                Business - more business soon
            </div>
        </section>
    </div>
  )
}

export default Page;