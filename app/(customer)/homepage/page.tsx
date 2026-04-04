"use client"
import Cust_navbar from '@/components/cust_navbar';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [locationCheck,setLocationCheck] = useState<boolean>(false);
    const [locationLoading,setLocationLoading] = useState<boolean>(false);
    
    const getLocation = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by this browser."));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error)
            );
        });
    };


    useEffect(() => {
        const fetchCurrentLocation = async () => {
            setLocationCheck(true);
            try {
                const location = await getLocation();
                if(!location){
                    setLocationCheck(false);
                }
                setLocationCheck(true);
                const latitude = location.coords.latitude;
                const longitude = location.coords.longitude;
                console.log(latitude,longitude);

            } catch (error:any) {
                console.log("Error=>"+JSON.stringify(error));
                if(error.code===1){
                    console.log("User denied location access ❌");
                    setLocationCheck(false);
                }
            }finally{
                setLocationLoading(false);
            }
        }

        fetchCurrentLocation();
    }, [])
    // if permission denied then show different ui for asking of the permission(fallback ui)
    // 
    return (
        locationCheck?
        <div className='font-sans '>
            <Cust_navbar />
            {
                locationLoading?
                <div className='relative top-[10vh] flex justify-center items-center animate-pulse text-xl'>Loading Location</div>
                :<main className='m-[3vh]'>
                <section className='flex flex-wrap md:gap-0 gap-3 justify-between items-center relative  md:m-[5vh] md:text-4xl text-3xl font-bold p-2 bg-gradient-to-l from-green-500 to-blue-500 text-transparent bg-clip-text'>
                    <div>
                        Welcome, Tony Stark!
                        <p className='text-xl font-light '>Your location</p>
                    </div>
                    <div className='flex flex-col text-xl font-thin'>
                        <p className='text-black text-[16px]'>Search Business Categories</p>
                        {/* <input type="text" placeholder='Search here' className='border border-blue-500 p-2 rounded-md focus:outline-blue-600 text-black ' /> */}
                        <select className='border border-blue-500 p-2 rounded-md focus:outline-blue-600  text-black '>
                            Bussiness Categories
                            <option className='text-xs' value="">Select Categories</option>
                            <option value="Hair">Hair</option>
                            <option value="Hair">Clinics</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </section>

                <section className='text-2xl p-2 md:m-[5vh] mt-[2vh]'>
                    Business Categories
                </section>
                <section className='grid md:grid-cols-3 grid-cols-1 relative md:m-[5vh] '>
                    <div className='flex flex-col text-white  bg-gradient-to-r from-gray-400 to-gray-600 rounded-md p-2 m-1 justify-center items-center'>
                        Business - HairSaloons
                        <p className='font-thin'>Find all your hairsaloons near by</p>
                    </div>
                    <div className='flex flex-col text-white  bg-gradient-to-r from-gray-400 to-gray-600 rounded-md p-2 m-1 justify-center items-center'>
                        Business - Clinics
                        <p className='font-thin'>Find all your Clinics near by</p>
                    </div>
                    <div className='flex flex-col text-white  bg-gradient-to-r from-gray-400 to-gray-600 rounded-md p-2 m-1 justify-center items-center'>
                        Explore All Business Categories
                    </div>
                </section>
            </main>
            }
        </div>
        :<div className='font-sans flex flex-col justify-center items-center h-screen w-screen'>
            <p>Something went wrong..</p> 
            <p>Perhaps your location was not found</p>
            <button onClick={()=>{
                window.location.reload();
            }} className='bg-red-500 rounded-md hover:bg-red-600 p-1 text-white'>Try again</button>
        </div>
        
    )
}

export default Page;