"use client"
import Admin_navbar from '@/components/admin_navbar'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface TimeInfoFormat {
    BusinessStartTime: string;
    BusinessEndTime: string;
    CustomerLimitPerDay: number;
    AdditionalInformation: string;

}
const Page = () => {
    // here first we need to check whether the any of the service was submitted or not!
    const [data, setData] = useState<TimeInfoFormat>({
        BusinessStartTime: "",
        BusinessEndTime: "",
        CustomerLimitPerDay: 0,
        AdditionalInformation: ""
    });

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log("Name: " + name + " Value: " + value)
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const onhandleSubmit = async (e: React.SubmitEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
            const bid = localStorage.getItem("uid")

            const payload = { ...data, bid }

            const response = await fetch('/api/admin/TimeInfo', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(payload),
            })

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            } else {
                localStorage.removeItem("uid");
                localStorage.removeItem("StepOne");
                toast.success("Successfully onboarded!")
                router.push("/admin/homepage");
            }
        } catch (error) {
            console.error("Error:", error)
            if (error instanceof Error) toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <Admin_navbar />
            <p className='text-xl p-4 animate-pulse text-center'>Step 03 - Time Information</p>
            <section className='p-5 flex flex-col justify-center items-center md:w-full '>
                <form onSubmit={onhandleSubmit} className='backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200'>
                    <div className='flex flex-col'>
                        <label htmlFor="Business" className='font-thin p-1'>Business starting time</label>
                        <input
                            name='BusinessStartTime'
                            value={data.BusinessStartTime}
                            onChange={onhandleChange}
                            required
                            type="time" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Business start time' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="Business" className='font-thin p-1'>Business ending time</label>
                        <input
                            name='BusinessEndTime'
                            value={data.BusinessEndTime}
                            onChange={onhandleChange}
                            required
                            type="time" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Business end time' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="Business" className='font-thin p-1'>Total Customer Per Day</label>
                        <input
                            name="CustomerLimitPerDay"
                            value={data.CustomerLimitPerDay}
                            onChange={onhandleChange}
                            required
                            type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='Customer Limit Per day' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="Business" className='font-thin p-1'>Additional Information <span className='text-xs text-gray-500'>Optional</span> </label>
                        <input
                            name="AdditionalInformation"
                            value={data.AdditionalInformation}
                            onChange={onhandleChange}
                            type="text" className='p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300' placeholder='service duration per customer' />
                    </div>

                    <button type='submit'
                        disabled={loading}
                        className='bg-blue-500 p-2 mt-2 rounded-md text-white min-w-full'>{loading ? "Submitting..." : "Submit"} </button>

                </form>
            </section>
        </div>
    )
}

export default Page