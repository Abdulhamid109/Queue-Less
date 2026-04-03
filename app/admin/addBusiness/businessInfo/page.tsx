import Admin_navbar from '@/components/admin_navbar'
import React from 'react'

const Page = () => {
  return (
    <div className=' font-sans'>
        <Admin_navbar/>
        <p className='text-xl p-4 animate-pulse text-center'>Step 01 - Business Information</p>
        <section className='p-5 flex flex-col justify-center items-center md:w-full '>
            <form className='backdrop-blur-2xl  shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200'>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Company Name*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' placeholder='Enter your Company/business name' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Business Type*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your business type eg:hairsaloon ,clinic' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Country*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your Country' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>State*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your State' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>City*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your City ' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Pin-Code*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your city pincode' />
                </div>
                
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Business Address*</label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your business Address' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Business Website <span className='text-xs'>optional</span></label>
                    <input type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Enter your business website' />
                </div>

                <button className='bg-blue-500 p-2 mt-2 rounded-md text-white min-w-full'>Submit </button>
                
            </form>
        </section>
    </div>
  )
}

export default Page