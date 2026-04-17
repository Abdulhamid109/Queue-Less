"use client"
import Cust_navbar from '@/components/cust_navbar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BriefcaseBusiness, LocateFixed, LucideEarth, MinusCircle, PersonStanding, PlusCircle, Timer } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


interface BusinessFormat {
    BusinessName: string;
    BusinessAddress: string;
    BST: string;
    BET: string;
    CustomerLimitPerDay: string;
}

interface ServiceDetails {
    _id: string;
    name: string;
    AvgDurationPerCustomer: string;
    ChargesPerService: string;
}

const Page = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<BusinessFormat>({
        BusinessName: "",
        BusinessAddress: "",
        BST: "",
        BET: "",
        CustomerLimitPerDay: ""
    });

    const [serviceData, setServiceData] = useState<ServiceDetails[]>([]);
    const [serviceLoader, setServiceLoader] = useState<boolean>(true);
    const [queueCount, setQueueCount] = useState<number>(0)
    const [isLive, setIsLive] = useState<boolean>(false);

    const date = new Date();
    const localDate = date.toLocaleDateString();

    // Replacing plain array + single boolean with a Set
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
    const [joinedQueue, setJoinedQueue] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams(); // add this
const queueIdFromUrl = searchParams.get("QUEUE_ID");

// Update QueueID initialization
const [QueueID, setQueueID] = useState<string>(queueIdFromUrl || '');



    // fetching the Total members in the queue (making sure the buffer time is of 1/2min) based on the date

    useEffect(() => {
        if (!id) return

        console.log("SSE starts with id:", id)
        const SSEevent = new EventSource(`/api/customer/TotalMembers?bid=${id}`)

        SSEevent.onopen = () => {
            console.log("SSE opened")
            setIsLive(true)
        }

        SSEevent.onmessage = (e) => {
            const data = JSON.parse(e.data)
            setQueueCount(data.count)
            // console.log("Count =>", data)
        }

        SSEevent.onerror = () => {
            setIsLive(false)
            SSEevent.close()
        }

        return () => {
            SSEevent.close()
            setIsLive(false)
        }

    }, [id]);






    const fetchBusinessDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/customer/getBusiness?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }
            setData({
                BusinessName: result.business.BusinessName,
                BusinessAddress: result.business.BusinessAddress,
                BST: result.time.BST,
                BET: result.time.BET,
                CustomerLimitPerDay: result.time.CustomerLimitPerDay
            });
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) {
                toast.error(error.message || "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchingService = async () => {
        setServiceLoader(true);
        try {
            const response = await fetch(`/api/customer/getServices?bid=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }
            setServiceData(result.service);
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) {
                toast.error(error.message || "Something went wrong!");
            }
        } finally {
            setServiceLoader(false);
        }
    }

    const selectService = (serviceId: string) => {
        setSelectedServices((prev) => {
            const updated = new Set(prev);
            if (updated.has(serviceId)) {
                updated.delete(serviceId);
            } else {
                updated.add(serviceId);
            }
            return updated;
        });
    }

    const handleJoinQueue = async () => {
        if (selectedServices.size === 0) {
            toast.error("Please select at least one service.");
            return;
        }
        try {
            const payload = {
                businessId: id,
                services: Array.from(selectedServices)
            };
            console.log("Payload Data => " + JSON.stringify(payload))
            const response = await fetch(`/api/customer/joinQueue`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!");
            } else {
                setJoinedQueue(result.queue.JoinedQueue);
                setQueueID(result.queue._id);
                toast.success("Successfully joined the queue!");
                router.push(`/allbusiness/HairSaloons/${id}?QUEUE_ID=${result.queue._id}`)
            }
        } catch (error) {
            console.error("Join queue error:", error);
            if (error instanceof Error) toast.error(error.message);
        }
    }


    //we need to check if the user is in the Queue(vulnerable)
    const CurrentUserQueueStatus = async () => {
        try {
            
            const response = await fetch(`/api/customer/currentUserQueueStatus?bid=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });
            const result = await response.json();

            if (response.status === 401) {
                setJoinedQueue(false);
            }
            if (!response.ok) {
                setJoinedQueue(false);
            }
            else {
                console.log("Status=>" + result.Joined)
                setJoinedQueue(result.Joined);
            }
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) {
                toast.error(error.message || "Something went wrong!");
            }
        }
    }

// Update the useEffect dependency and guard
useEffect(() => {
    CurrentUserQueueStatus();
}, [id, QueueID]);


    useEffect(() => {
        fetchBusinessDetails();

    }, []);


    const leaveQueue = async () => {
        try {

        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) {
                toast.error(error.message || "Something went wrong!");
            }
        }
    }

    if (loading) {
        return (
            <div className='p-2 flex justify-center items-center h-screen w-screen animate-pulse'>
                Fetching the business data... Kindly wait.
            </div>
        );
    }

    return (
        <div>
            <Cust_navbar />
            <main className='m-2 p-2'>

                <p className='md:text-2xl text-xl mt-3'>Business Details</p>
                <section className='p-5 mt-2 grid md:grid-cols-2 grid-cols-1 justify-center items-center gap-3 backdrop-blur-2xl shadow-2xl shadow-black/20 bg-gray-100'>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <BriefcaseBusiness color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        Business Name: {data.BusinessName}
                    </p>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <LocateFixed color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        <span className='text-xs'>{data.BusinessAddress}</span>
                    </p>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <Timer color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        Business Start Time: {data.BST}
                    </p>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <Timer color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        Business End Time: {data.BET}
                    </p>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <PersonStanding color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        Customer Limit: {data.CustomerLimitPerDay}
                    </p>
                    <p className='p-1 bg-green-300 rounded-md flex justify-start items-center gap-1'>
                        <LucideEarth color='white' className='bg-gray-500 m-1 p-1 rounded-md shrink-0' />
                        Website
                    </p>
                </section>

                <div className='md:text-2xl text-xl mt-5 flex justify-between items-center'>
                    <p>Queue Details</p>

                    {
                        joinedQueue ?
                            <button
                                className='text-[15px] flex justify-center items-center bg-purple-800 p-1 rounded-md gap-1 text-white'
                            >
                                <MinusCircle size={16} color='white' />
                                Leave Queue</button>
                            : <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={fetchingService}
                                        className='text-[15px] flex justify-center items-center bg-purple-800 p-1 rounded-md gap-1 text-white'
                                    >
                                        <PlusCircle size={16} color='white' />
                                        Join Queue
                                    </button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogTitle className='text-center'>Select the Service</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className='flex flex-col gap-2'>

                                            {serviceLoader ? (
                                                <div className='flex justify-center items-center animate-pulse py-4'>
                                                    Loading services...
                                                </div>
                                            ) : serviceData.length === 0 ? (
                                                <div className='text-center text-gray-500 py-4'>
                                                    No associated services available
                                                </div>
                                            ) : (
                                                serviceData.map((d: ServiceDetails) => (
                                                    <div
                                                        key={d._id}
                                                        className={`flex justify-between items-center gap-3 p-2 rounded-md border transition ${selectedServices.has(d._id)
                                                            ? 'bg-green-100 border-green-400'
                                                            : 'bg-green-200 border-transparent'
                                                            }`}
                                                    >
                                                        <div className='flex flex-col items-start justify-center gap-1 text-black'>
                                                            <p className='font-medium'>Service Name: {d.name}</p>
                                                            <p className='text-sm'>Duration: {d.AvgDurationPerCustomer} mins</p>
                                                            <p className='text-sm'>Charge: ₹{d.ChargesPerService}</p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => selectService(d._id)}
                                                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${selectedServices.has(d._id)
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-blue-400 text-black hover:bg-blue-500'
                                                                }`}
                                                        >
                                                            {selectedServices.has(d._id) ? "Selected ✓" : "Select"}
                                                        </button>
                                                    </div>
                                                ))
                                            )}

                                            {selectedServices.size > 0 && (
                                                <div className='flex justify-between items-center mt-2 pt-2 border-t border-gray-200'>
                                                    <DialogClose asChild>
                                                        <button
                                                            type="button"
                                                            onClick={handleJoinQueue}
                                                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition'
                                                        >
                                                            Join Queue ({selectedServices.size})
                                                        </button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <button
                                                            type="button"
                                                            className='border border-gray-300 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition'
                                                        >
                                                            Close
                                                        </button>
                                                    </DialogClose>
                                                </div>
                                            )}

                                        </div>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                    }
                </div>

                <section className='flex flex-col justify-center items-center gap-3 mt-4 p-4 rounded-md shadow-xl'>

                    {/* Live indicator */}
                    <div className='flex items-center gap-2'>
                        <span className={`w-2 h-2 rounded-full inline-block ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                            }`} />
                        <span className='text-sm font-thin'>
                            {isLive ? 'Live' : 'Disconnected'}
                        </span>
                    </div>

                    <div className='text-2xl font-medium'>
                        Total Members in Queue
                    </div>

                    <div className='text-5xl font-bold text-purple-800'>
                        {queueCount}
                    </div>

                    <p className='text-gray-500 text-sm'>
                        {queueCount === 0
                            ? "No one in the queue right now"
                            : `Estimated wait: ${queueCount * 10} mins`}
                    </p>

                </section>

            </main>
        </div>
    )
}

export default Page