import Admin_navbar from '@/components/admin_navbar'
import React from 'react'

const Page = () => {
  return (
    <div>
        <Admin_navbar/>
        <p className='text-xl p-4 animate-pulse text-center'>Step 03 - Time Information</p>
        <section className='p-5 flex flex-col justify-center items-center md:w-full '>
            <form className='backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200'>
            <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Business starting time</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Business start time' />
                </div>
            <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Business ending time</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Business end time' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Total Customer per Day*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' placeholder='Enter the service name' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Additional Information</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='service duration per customer' />
                </div>
                
                

                <button className='bg-blue-500 p-2 mt-2 rounded-md text-white min-w-full'>Submit </button>
                
            </form>
        </section>
    </div>
  )
}

export default Page