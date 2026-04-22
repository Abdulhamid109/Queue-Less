"use client"
import Admin_navbar from '@/components/admin_navbar'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


// the bg-image should be present
interface Data{
    _id:string
    BusinessName:string;
    BusinessAddress:string;
}

const Page = () => {
    const [data,setData] = useState<Data[]|null>([]);
    const [loading,setLoading] = useState<boolean>(true);

    const fetchData =async()=>{
        setLoading(true);
        try {
            const response = await fetch("/api/admin/allbusiness",{
                headers:{'Content-Type':'application/json'},
                method:'GET'
            });

            const result = await response.json();
            setData(result.Business);
        } catch (error) {
            console.log("Error=>"+error);
            if(error instanceof Error){
                toast.error(error.message)
            }
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchData();
    },[])

    if(loading){
        return (
            <div className='flex animate-pulse justify-center items-center flex-col relative top-[10vh] text-xl p-2'>
                Loading....
                <p className='text-gray-700  text-[15px]'>Setting up Your Admin Panel</p>
            </div>
        );
    }

  return (
    <div className='w-screen h-screen font-sans'>
        <Admin_navbar/>

        <main className='p-4 font-sans'>
            <div className='text-2xl '>Welcome Back, Admin</div>
            <section className='mt-4 '>
                List of all Your businesses
                <div className='grid md:grid-cols-4 grid-cols-1 gap-2 relative m-[5vh]'>
                    
                    {
                        data!.length===0?
                        <></>
                        :data!.map((d:Data)=>(
                            <Link href={`/admin/homepage/${d._id}`} key={d._id} className='text-white font-thin gap-2 flex flex-col justify-center items-start  p-4 rounded-md bg-gradient-to-l from-green-700 to-green-900'>
                                <p className='text-xl'>{d.BusinessName}</p>
                                <p className='text-[15px]'>{d.BusinessAddress}</p>
                            </Link>
                        ))
                    }
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