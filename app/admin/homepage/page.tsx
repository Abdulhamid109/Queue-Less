import Admin_navbar from '@/components/admin_navbar'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className='w-screen h-screen'>
        <Admin_navbar/>

        <main className='p-4 font-sans'>
            <div className='text-2xl '>Welcome Back, Admin</div>
            <section className='mt-4 '>
                List of all Your businesses
                <div className='grid md:grid-cols-4 grid-cols-1 gap-2 relative m-[5vh]'>
                    <div className='flex justify-center items-center  p-4 rounded-md bg-gradient-to-l from-green-200 to-green-300'>
                        Hair-Styling
                    </div>
                    <div className='flex justify-center items-center  p-4 rounded-md bg-gradient-to-l from-green-200 to-green-300'>
                        resturants
                    </div>

                    <Link href={"/admin/addBusiness/businessInfo"} className='grid grid-col-1 justify-center item-center  p-4 rounded-md bg-gradient-to-l from-gray-200 to-gray-300'>
                        <p className='grid grid-col-1 justify-center item-center'><PlusCircle/></p>
                        Add more businesses
                    </Link>
                </div>
            </section>
        </main>
    </div>
  )
}

export default Page