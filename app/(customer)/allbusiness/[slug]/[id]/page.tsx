"use client"
import Cust_navbar from '@/components/cust_navbar';
import { BriefcaseBusiness, LocateFixed, LucideEarth, PersonStanding, PlusCircle, Timer } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



interface BusinessFormat{
    BusinessName:string;
    BusinessAddress:string;
    BST:string;
    BET:string;
    CustomerLimitPerDay:string;
}
const Page = () => {
    const {id} = useParams();

    const [loading,setLoading] = useState<boolean>(true);
    const [data,setData] = useState<BusinessFormat>({
        BusinessName:"",
        BusinessAddress:"",
        BST:"",
        BET:"",
        CustomerLimitPerDay:""
    })



    const fetchBusinessDetails = async()=>{
        try {
            const response = await fetch(`/api/customer/getBusiness?id=${id}`,{
                headers:{'Content-Type':'application/json'},
                method:'GET'
            });
            const result = await response.json();
            if(!response.ok){
                throw new Error(result.error||"Something went wrong");
            }else{
                setData((prev)=>({...prev!,BusinessName:result.business.BusinessName,BusinessAddress:result.business.BusinessAddress}))
                console.log("Time Details => "+result.business)
                setData((prev)=>({...prev,BST:result.time.BST,BET:result.time.BET,CustomerLimitPerDay:result.time.CustomerLimitPerDay}))
                console.log("Business Details Details => "+result.time)
            }
        } catch (error) {
            console.log("Error=>"+error);
            if(error instanceof Error){
                toast.error(error.message || "Something went wrong!")
            }
        }
    }

    useEffect(()=>{
        fetchBusinessDetails();
    },[])
  return (
    <div>
        <Cust_navbar/>
        <main className='m-2 p-2'>
        <p className='md:text-2xl text-xl mt-3'>Business Details</p>
        <section className='p-5 mt-2 grid md:grid-cols-2 grid-cols-1 justify-center items-center gap-3 backdrop-blur-2xl shadow-2xl shadow-black/20 bg-gray-100'>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <BriefcaseBusiness color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Business Name : {data.BusinessName}</p>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <LocateFixed color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Business Address : {data.BusinessAddress}</p>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <Timer color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Business start Time : {data.BST}</p>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <Timer color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Business End Time : {data.BET}</p>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <PersonStanding color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Customer Limit : {data.CustomerLimitPerDay}</p>
            <p className='p-1 bg-green-300 rounded-md backdrop-blur-2xl shadow-2xl flex justify-start items-center'> <LucideEarth color='white' className='bg-gray-500 backdrop-blur-md m-1 p-1 rounded-md'/> Wesbite</p>
        </section> 

        <p className='md:text-2xl text-xl mt-5 flex justify-between items-center'>
            <p>Queue Details</p>
            <button className='text-[15px] flex justify-center items-center bg-purple-800 p-1 rounded-md gap-1 text-white '><PlusCircle size={16} color='white' /> Join Queue</button>
        </p>
        <section className='flex flex-col justify-center items-center gap-3 backdrop-blur-2xl shadow-2xl shadow-black/20 mt-4'>
<div className='animate-pulse m-2'>
            <p className='bg-red-600 p-1 rounded-full absolute left-0 m-2'></p>
            <p className='absolute left-5 font-thin'>Live</p>
</div>        
            <div className='text-2xl'>
                Total Members in the Queue   
            </div> 
            <div className='flex flex-col justify-center items-center p-4'>
                You Haven&apos;t Joined the Queue
                <p>Wating Time</p> 
            </div>
        </section> 
        </main>
    </div>
  )
}

export default Page