"use client"
import Admin_navbar from '@/components/admin_navbar'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';





interface DataFormat{
    name:string;
    email:string;
    emailVerificationId:string;
    // AssociatedBusiness:string;

}

const Page = () => {
    const [profileData,setProfileData] = useState<DataFormat|null>(null);
    const [loading,setLoading] = useState<boolean>(false);

    const handleProfile =async()=>{
        try {
            const response = await fetch("/api/admin/profile",{
                method:'GET',
                headers:{'Content-Type':'application/json'}
            });
            const result = await response.json();
            setProfileData(result.profile);

            if(!response.ok){
                toast.error(result.error||"Something went wrong");
                throw new Error(result.error || "Something went wrong");
            }else{
                toast.success("Fetched profile Data!")
            }

        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message);
            }
        }
    }

    useEffect(()=>{
        handleProfile();
    },[])

  return (
    <div>
      <Admin_navbar/>
      <p className='text-2xl text-center m-2'>Profile</p>
      <section className='p-5 flex flex-col justify-center items-center md:w-full '>
            <form className='backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200'>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Full Name</label>
                    <div className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >{profileData?.name}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="Business" className='font-thin p-1'>Verified Email</label>
                    {
                        profileData?.emailVerificationId
                        ?<div className='p-2 focus:outline md:w-[40vw]  border rounded-md border-blue-300' >Tony@domain.com</div>
                        :<div className='p-2 focus:outline md:w-[40vw]  border rounded-md border-red-300' > unverified Tony@domain.com</div>
                    }
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