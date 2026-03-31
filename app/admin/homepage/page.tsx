import { PlusCircle } from 'lucide-react'
import React from 'react'

const Page = () => {
  return (
    <div className='w-screen h-screen'>
        <nav className='flex justify-between items-center p-3 bg-gradient-to-l from-green-400 to-gray-300'>
            <div className='text-2xl'>Queue-Less</div>
            <div className='flex justify-center items-center gap-2 font-sans'>
                <li className='list-none hover:underline'>Add Business</li>
                <li className='list-none hover:underline'>Profile</li>
                <li className='list-none hover:underline'>Report</li>
                <li className='list-none hover:underline'>Your Business</li>
                <li className='list-none hover:underline'>FeedBacks</li>
                <li className='list-none hover:underline'>Logout</li>
            </div>
        </nav>

        <main className='p-4 font-sans'>
            <div className='text-2xl '>Welcome Back, Admin</div>
            <section className='mt-4 '>
                List of all Your businesses
                <div className='grid md:grid-cols-4 grid-cols-1 gap-2 relative m-[5vh]'>
                    <div className='flex justify-center items-center border p-4 rounded-md'>
                        Hair-Styling
                    </div>
                    <div className='flex justify-center items-center border p-4 rounded-md'>
                        resturants
                    </div>

                    <div className='grid grid-col-1 justify-center item-center border p-4 rounded-md'>
                        <p className='grid grid-col-1 justify-center item-center'><PlusCircle/></p>
                        Add more businesses
                    </div>
                </div>
            </section>
        </main>
    </div>
  )
}

export default Page