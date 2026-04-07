"use client"
import Admin_navbar from '@/components/admin_navbar'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { getLocation } from '@/helpers/getCurrentLocation';

const Page = () => {

    const [locationCheck, setLocationCheck] = useState<boolean>(false);
    const [locationLoading, setLocationLoading] = useState<boolean>(false);
    const [latitudee, setlatitude] = useState<number | null>(null);
    const [longitudee, setlongitude] = useState<number | null>(null);



    const fetchCurrentLocation = async () => {
        setLocationCheck(true);
        try {
            const location = await getLocation();
            if (!location) {
                setLocationCheck(false);
                return;
            }
            setLocationCheck(true);
            const latitude = location.coords.latitude;
            const longitude = location.coords.longitude;
            console.log(latitude, longitude);
            setlatitude(location.coords.latitude);
            setlongitude(location.coords.longitude);
            console.log("From State => " + latitudee)
            console.log("From State => " + longitudee)

        } catch (error: any) {
            console.log("Error=>" + JSON.stringify(error));
            if (error.code === 1) {
                console.log("User denied location access ❌");
                setLocationCheck(false);
            }
        } finally {
            setLocationLoading(false);
        }
    }
    useEffect(() => {


        fetchCurrentLocation();
    }, [])

    useEffect(() => {
        console.log("Updated Latitude:", latitudee);
        console.log("Updated Longitude:", longitudee);
    }, [latitudee, longitudee]);
    return (
        <div className=' font-sans'>
            <Admin_navbar />
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
            {
                locationLoading ? <>Map Loading....</>
                    : <section className='h-[80vh] w-full'>
                        {latitudee && longitudee && (
                            <MapContainer
                                center={[latitudee, longitudee]}
                                zoom={13}
                                className="h-full w-full"
                            >
                                <TileLayer
                                    attribution='Queuless'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker position={[latitudee!, longitudee!]}>
                                    <Popup>
                                        A pretty popup 🚀
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )
                        }
                    </section>
            }
        </div>
    )
}

export default Page