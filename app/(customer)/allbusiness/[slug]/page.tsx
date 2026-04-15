"use client"
import Cust_navbar from '@/components/cust_navbar';
import { getLocation } from '@/helpers/getCurrentLocation';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface DataFormat {
  _id: string;
  BusinessName: string;
  BusinessAddress: string;
  distance:number;
}
const Page = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [locationGranted, setLocationGranted] = useState(false);
  const [data, setData] = useState<DataFormat[]>([]);




  const fetchingCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) {
      setLocationGranted(false);
      return;
    }
    setLocationGranted(true)
    console.log("Latitude" + location.coords.latitude)
    fetchBusiness(location.coords.latitude, location.coords.longitude)
  }


  const fetchBusiness = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const payload = { latitude, longitude }
      console.log("Payload=>" + JSON.stringify(payload))
      const response = await fetch(`/api/customer/businessBasedOnCat?category=${slug}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      } else {
        console.log("Success");
        setData(result.businessess);
        toast.success("Successfully fetched the data");
      }
    } catch (error) {
      console.log("Error=>" + JSON.stringify(error));
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchingCurrentLocation();

  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen w-screen animate-pulse text-xl'>
        Fetching the Shops near you...Kindly wait
      </div>
    );
  }

  if (!locationGranted) {
    return (
      <div className="flex justify-center items-center flex-col gap-3 min-h-screen">
        <p className="text-lg">Location permission is required to continue.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className=''>
      <Cust_navbar />
      <main className='flex flex-col justify-center items-center min-w-full '>
        <div className='flex justify-between flex-wrap gap-2 items-center  p-3 min-w-full'>
          <p className='text-xl '>Hair Saloons near you!</p>
          <input className='p-2 rounded-md focus:outline border-blue-500 border' type="text" placeholder='Search Your shop Name' />
        </div>
        {
          data.length === 0 ?
            <div className='flex flex-col justify-center items-center gap-2 relative top-[10vh]'>
              <p>No shop near your location..Kindly increase the area radius <span className='text-xs text-blue-500'>(Learn more)</span></p>
              <div className=' flex justify-center items-center gap-2'>
                <input type="number" className='focus:outline border border-blue-500 p-2 rounded-md w-[25vw]' placeholder='Enter the radius value minimum 4KM maximum 10 KM' />
                <button className='bg-blue-500 text-white hover:bg-blue-700 rounded-md p-2'>Search</button>
              </div>
            </div>
            : <div className='grid md:grid-cols-3 grid-cols-1 gap-3 relative md:m-[5vh] '>
              {
                data.map((d:DataFormat)=>(
                  <Link href={`/allbusiness/${slug}/${d._id}`} key={d._id} className='text-white font-thin gap-2 flex flex-col justify-center items-start  p-4 rounded-md bg-gradient-to-l from-green-700 to-green-900'>
                <p className='text-xl'>{d.BusinessName}</p>
                <p className='text-[15px]'>{d.BusinessAddress}</p>
<p className='text-[15px]'>
  {(d.distance / 1000).toFixed(2)} KM away from You!
</p>              </Link>
                ))
              }
            </div>
        }

      </main>
    </div>
  )
}

export default Page