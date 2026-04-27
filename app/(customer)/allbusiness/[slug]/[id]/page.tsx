"use client"
import Cust_navbar from '@/components/cust_navbar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BriefcaseBusiness, LocateFixed, LucideEarth, MinusCircle, PersonStanding, PlusCircle, Timer, Clock, Users, Wifi, WifiOff } from 'lucide-react';
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

    const [currentPostion, setCurrentPostion] = useState<string>('');
    const [serviceData, setServiceData] = useState<ServiceDetails[]>([]);
    const [serviceLoader, setServiceLoader] = useState<boolean>(true);
    const [queueCount, setQueueCount] = useState<number>(0)
    const [isLive, setIsLive] = useState<boolean>(false);
    const [WT, setWT] = useState<string>('');
    const [leaveLoader, setLeaveLoader] = useState<boolean>(false);

    const date = new Date();
    const localDate = date.toLocaleDateString();

    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
    const [joinedQueue, setJoinedQueue] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queueIdFromUrl = searchParams.get("QUEUE_ID");
    const [QueueID, setQueueID] = useState<string>(queueIdFromUrl || '');

    // Feedback
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [FeedbackLoader, setFeedbackLoader] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackLoader(true);
        try {
            const payload = { title, description }
            const response = await fetch(`/api/customer/AddBusinessFeedback?id=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong")
            } else {
                toast.success("Successfully recorded the feedback");
                setTitle('')
                setDescription('')
            }
        } catch (error) {
            console.log("Error => " + error);
            if (error instanceof Error) {
                toast.error('Something went wrong');
            }
        } finally {
            setFeedbackLoader(false);
        }
    }

    // SSE for live queue count
    useEffect(() => {
        if (!id) return
        const SSEevent = new EventSource(`/api/customer/TotalMembers?bid=${id}`)
        SSEevent.onopen = () => { setIsLive(true) }
        SSEevent.onmessage = (e) => {
            const data = JSON.parse(e.data)
            setQueueCount(data.count)
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
            if (!response.ok) throw new Error(result.error || "Something went wrong");
            setData({
                BusinessName: result.business.BusinessName,
                BusinessAddress: result.business.BusinessAddress,
                BST: result.time.BST,
                BET: result.time.BET,
                CustomerLimitPerDay: result.time.CustomerLimitPerDay
            });
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) toast.error(error.message || "Something went wrong!");
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
            if (!response.ok) throw new Error(result.error || "Something went wrong");
            setServiceData(result.service);
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) toast.error(error.message || "Something went wrong!");
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
            const payload = { businessId: id, services: Array.from(selectedServices) };
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
                setCurrentPostion(result.queue.currentPostion)
                setWT(result.WT)
                toast.success("Successfully joined the queue!");
                router.push(`/allbusiness/HairSaloons/${id}?QUEUE_ID=${result.queue._id}`)
            }
        } catch (error) {
            console.error("Join queue error:", error);
            if (error instanceof Error) toast.error(error.message);
        }
    }

    const CurrentUserQueueStatus = async () => {
        try {
            const response = await fetch(`/api/customer/currentUserQueueStatus?bid=${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });
            const result = await response.json();
            if (response.status === 401) { setJoinedQueue(false); }
            if (!response.ok) { setJoinedQueue(false); }
            else {
                setJoinedQueue(result.Joined);
                if (result.Joined) setCurrentPostion(result.currentPosition ?? '')
            }
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) toast.error(error.message || "Something went wrong!");
        }
    }

    useEffect(() => { CurrentUserQueueStatus(); }, [id, QueueID]);
    useEffect(() => { fetchBusinessDetails(); }, []);

    const leaveQueue = async () => {
        setLeaveLoader(true);
        try {
            const response = await fetch(`/api/customer/leaveQueue?bid=${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!!")
            } else {
                toast.success("Successfully left the Queue");
                setWT('');
                setTimeout(() => { window.location.reload(); }, 500);
            }
        } catch (error) {
            console.error("Error=>", error);
            if (error instanceof Error) toast.error(error.message || "Something went wrong!");
        } finally {
            setLeaveLoader(false)
        }
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen w-screen animate-pulse text-sm text-gray-400'>
                Fetching business details...
            </div>
        );
    }

    return (
        <div className="font-sans min-h-screen bg-gray-50">
            <nav className='min-w-full fixed z-50'>
                <Cust_navbar />
            </nav>

            <main className='max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-6'>

                {/* Business Details */}
                <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">Business</p>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{data.BusinessName}</h1>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400">Details</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { icon: BriefcaseBusiness, label: "Business Name", value: data.BusinessName },
                            { icon: LocateFixed, label: "Address", value: data.BusinessAddress },
                            { icon: Timer, label: "Opening Time", value: data.BST },
                            { icon: Timer, label: "Closing Time", value: data.BET },
                            { icon: PersonStanding, label: "Customer Limit", value: data.CustomerLimitPerDay },
                            { icon: LucideEarth, label: "Website", value: "Visit Website" },
                        ].map(({ icon: Icon, label, value }, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                                <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="text-sm font-medium text-gray-900">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Queue Section */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400">Queue</p>
                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5">
                            {isLive
                                ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-xs text-green-500">Live</span></>
                                : <><span className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-xs text-red-400">Disconnected</span></>
                            }
                        </div>
                    </div>

                    <div className="px-5 py-8 flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Total members in queue</p>
                            <p className="text-5xl font-semibold text-gray-900">{queueCount}</p>
                        </div>

                        {queueCount === 0 && (
                            <p className="text-xs text-gray-400">No one in the queue right now</p>
                        )}

                        {currentPostion && (
                            <div className="flex flex-col items-center gap-1 bg-purple-50 border border-purple-100 rounded-xl px-6 py-4 w-full max-w-xs">
                                <p className="text-xs text-purple-400">Your position</p>
                                <p className="text-3xl font-semibold text-purple-700">#{currentPostion}</p>
                                {WT && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Estimated wait: <span className="font-medium text-gray-700">{WT} mins</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Join / Leave button */}
                        <div className="w-full max-w-xs mt-2">
                            {joinedQueue ? (
                                <button
                                    onClick={leaveQueue}
                                    disabled={leaveLoader}
                                    className="w-full flex justify-center items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-sm font-medium py-2.5 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <MinusCircle size={15} />
                                    {leaveLoader ? "Leaving..." : "Leave Queue"}
                                </button>
                            ) : (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={fetchingService}
                                            className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <PlusCircle size={15} />
                                            Join Queue
                                        </button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogTitle className="text-center">Select Services</DialogTitle>
                                        <DialogDescription asChild>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {serviceLoader ? (
                                                    <div className="flex justify-center items-center animate-pulse py-6 text-sm text-gray-400">
                                                        Loading services...
                                                    </div>
                                                ) : serviceData.length === 0 ? (
                                                    <div className="text-center text-sm text-gray-400 py-6">
                                                        No services available for this business.
                                                    </div>
                                                ) : (
                                                    serviceData.map((d: ServiceDetails) => (
                                                        <div
                                                            key={d._id}
                                                            className={`flex justify-between items-center gap-3 p-3 rounded-xl border transition ${selectedServices.has(d._id)
                                                                ? 'bg-green-50 border-green-200'
                                                                : 'bg-gray-50 border-gray-100'
                                                                }`}
                                                        >
                                                            <div className="flex flex-col gap-0.5 text-gray-900">
                                                                <p className="text-sm font-medium">{d.name}</p>
                                                                <p className="text-xs text-gray-400">{d.AvgDurationPerCustomer} mins · ₹{d.ChargesPerService}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => selectService(d._id)}
                                                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${selectedServices.has(d._id)
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                {selectedServices.has(d._id) ? "Selected ✓" : "Select"}
                                                            </button>
                                                        </div>
                                                    ))
                                                )}

                                                {selectedServices.size > 0 && (
                                                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
                                                        <DialogClose asChild>
                                                            <button
                                                                type="button"
                                                                onClick={handleJoinQueue}
                                                                className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                                            >
                                                                Join Queue ({selectedServices.size})
                                                            </button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-gray-400 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </DialogClose>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogDescription>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400">Feedback</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">Share your experience at {data.BusinessName}</p>
                    </div>

                    <div className="px-5 py-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium tracking-widest uppercase text-gray-400">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="What's the issue about?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium tracking-widest uppercase text-gray-400">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe your experience in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    maxLength={300}
                                    required
                                    className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 transition resize-none"
                                />
                                <p className="text-xs text-gray-400 text-right">{description.length}/300</p>
                            </div>

                            <button
                                type="submit"
                                disabled={FeedbackLoader}
                                className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {FeedbackLoader ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Page;