import Admin_navbar from '@/components/admin_navbar'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Admin_navbar/>
      <p className='text-2xl text-center m-2'>Profile</p>
      <section className='p-5 flex flex-col justify-center items-center md:w-full '>
            <form className='backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200'>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Full Name</label>
                    <div className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >Tony Stark</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Verified Email</label>
                    <div className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >Tony@domain.com</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>AssociatedBusiness</label>
                    <div className='p-2 m-1 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >Tommy Hair-Saloon</div>
                    <div className='p-2 m-1 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >Eyehealthcure - clinic</div>
                </div>
                <button className='bg-blue-500 p-2 mt-2 rounded-md text-white min-w-full'>Edit</button>
                
            </form>
        </section>
    </div>
  )
}

export default Page