"use client"
import Cust_navbar from '@/components/cust_navbar'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


interface ProfileData{
  name:string;
  email:string;
  phone:string;
  location:string;
}
const Page = () => {
  const [data,setData] = useState<ProfileData|null>(null);
  const [loading,setLoading] = useState<boolean>(false);

  const fetchProfileData =async()=>{
    setLoading(true);
    try {
      const response = await fetch("/api/customer/profile",{
        method:'GET'
      });

      const result = await response.json();
      setData(result.profile);
      if(!response.ok){
        throw new Error(result.error || "Something went wrong failed to fetch");
      }else{
        toast.success("Successfully fetched!")
      }
    } catch (error) {
      console.log("Failed to Perform the functionality "+JSON.stringify(error));
      if(error instanceof Error){
        toast.error(error.message);
      }
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    const fetchDetails=async()=>{
      await fetchProfileData();
    }

    fetchDetails();
  },[])

  return (
    <div className='font-sans'>
      <Cust_navbar/>
      {
        loading?
        <p className='relative top-[10vh] animate-pulse '>Fetching the data...</p>
        :!data?
        <p className='relative top-[10vh]  justify-center items-center flex flex-col gap-2'>
          <p className='animate-pulse '>No Data Found</p>
          <button className='bg-red-500 p-1 text-white rounded-md hover:bg-red-600' 
          onClick={()=>{
            window.location.reload();
          }}
          >{loading?<>trying...</>:<>Try Again</>}</button>
        </p>
        :<section className='flex flex-col justify-center items-center '>
        <div className='backdrop-blur-md shadow-md shadow-gray-700 p-5 mt-5 md:w-[30vw] relative top-[10vh] rounded-md flex flex-col justify-center items-start'>
          <div className='text-2xl font-bold text-center'>Profile</div>
          <div className='flex justify-start items-start p-1'>Name : <span>{data.name}</span></div>
          <div className='flex justify-start items-start p-1'>Email : <span>{data.email}</span></div>
          <div className='flex justify-start items-start p-1'>Phone : <span>{data.phone}</span> </div>
          <div className='flex justify-start items-start p-1'>Location : <span>{data.location}</span> </div>
          <button className='bg-blue-500 hover:bg-blue-600 flex justify-center items-center p-1 text-white rounded-md min-w-full'>Edit </button>
        </div>
      </section>
      }
    </div>
  )
}

export default Page