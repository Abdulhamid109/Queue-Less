"use client"
import { Button } from '@/components/ui/button'
import Admin_navbar from '@/components/admin_navbar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'


interface WorkerDataFormat {
    _id?: string;
    workerName: string;
    WorkerEmail: string;
}

const Page = () => {
    const [ready, setReady] = useState(false)
    const [loadingNext, setLoadingNext] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [timeState, setTimeState] = useState(3);
    const [data, setData] = useState<WorkerDataFormat>({
        workerName: "",
        WorkerEmail: ""
    });
    const [open, setOpen] = useState(false);
    const [openworker, setOpenworker] = useState(false);
    const [workerLoader, setWorkerLoader] = useState(false);
    const [workerData, setWorkerData] = useState<WorkerDataFormat[]>([])

    const router = useRouter();

    const onhandleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setOpen(true);
    }

    const onhandleWorker = () => {
        setOpenworker(true);
    }

    const getCurrentBusinessWorkers = useCallback(async () => {
        setWorkerLoader(true);
        try {
            const bid = localStorage.getItem("uid")
            const response = await fetch(`/api/admin/getWorkers?bid=${bid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            } else {
                setWorkerData(result.workers);
            }
        } catch (error) {
            console.error("Error:", error)
            if (error instanceof Error) toast.error(error.message)
        } finally {
            setWorkerLoader(false);
        }
    }, []);

    const deleteWorker = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/deleteWorker?id=${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!");
            } else {
                toast.success("Successfully deleted the worker");
                setWorkerData(prev => prev.filter((d: WorkerDataFormat) => d._id !== id));
            }
        } catch (error) {
            console.error("Error:", error)
            if (error instanceof Error) toast.error(error.message)
        }
    }

    const submittingData = async (check: boolean) => {
        check ? setLoadingNext(true) : setLoadingMore(true);
        try {
            const bid = localStorage.getItem("uid")
            const response = await fetch(`/api/admin/addWorker?bid=${bid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            } else {
                if (check) {
                    toast.success("Successfully added the worker details and navigating to third step")
                    router.push("/admin/addBusiness/serviceInfo");
                } else {
                    setOpen(false);
                    toast.success("Successfully added the worker details");
                    setData({ WorkerEmail: "", workerName: "" });
                    getCurrentBusinessWorkers(); 
                }
            }
        } catch (error) {
            console.error("Error:", error)
            if (error instanceof Error) toast.error(error.message)
        } finally {
            check ? setLoadingNext(false) : setLoadingMore(false);
        }
    }

    const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddWorker = () => {
        if (!data.workerName.trim() || !data.WorkerEmail.trim()) {
            toast.error("Please fill in all fields before adding a worker.");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.WorkerEmail)) {
            toast.error("Invalid email format");
            return;
        }
        setOpen(true);
    };

    useEffect(() => {
        if (ready) return
        const interval = setTimeout(() => {
            setTimeState((prev) => prev - 1)
        }, 1000)

        if (timeState === 0) {
            router.push('/admin/addBusiness/businessInfo')
        }

        return () => clearTimeout(interval)
    }, [timeState, router, ready])

    useEffect(() => {
        const Callingfunction = () => { setReady(localStorage.getItem("StepOne") === "true") }
        Callingfunction();
    }, [])

    useEffect(() => {
        getCurrentBusinessWorkers();
    }, [getCurrentBusinessWorkers])

    if (!ready) {
        return (
            <div className="flex gap-2 flex-col justify-center items-center relative top-[10vh] text-center text-xl">
                Step one not completed...
                <p className="text-[15px] text-center text-gray-600">
                    Navigating to step one in {timeState} seconds
                </p>
            </div>
        )
    }

    return (
        <div>
            <Admin_navbar />
            <p className="text-xl p-4 animate-pulse text-center">
                Step 02 — Workers Information
            </p>

            <p className='text-xs font-bold animate-pulse text-center'>
                Note : Based on the email provided workers have to login at the start of the day
            </p>

            <section className="p-5 flex flex-col justify-center items-center md:w-full">
                <form
                    onSubmit={onhandleSubmit}
                    className="backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200"
                >
                    <div className="flex flex-col">
                        <label className="font-thin p-1">Worker Name *</label>
                        <input
                            name="workerName"
                            value={data.workerName}
                            onChange={onhandleChange}
                            required
                            type="text"
                            className="p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300"
                            placeholder="Enter the worker name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-thin p-1">Worker Email *</label>
                        <input
                            name="WorkerEmail"
                            value={data.WorkerEmail}
                            onChange={onhandleChange}
                            required
                            type="email"
                            className="p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300"
                            placeholder="Enter the worker email"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddWorker}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 p-2 mt-4 rounded-md text-white w-full transition"
                    >
                        Add Worker
                    </button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogTitle>Worker Added</DialogTitle>
                            <DialogDescription>
                                What would you like to do next?
                            </DialogDescription>
                            <DialogFooter>
                                <div className='flex justify-around items-center p-2 min-w-full'>
                                    <Button
                                        onClick={() => submittingData(true)}
                                        disabled={loadingNext || loadingMore}
                                    >
                                        {loadingNext ? "Submitting..." : "Navigate to next step"}
                                    </Button>
                                    <Button
                                        onClick={() => submittingData(false)}
                                        disabled={loadingMore || loadingNext}
                                    >
                                        {loadingMore ? "Submitting..." : "Add more workers"}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </section>

            {
                workerData.length >= 1 && (
                    <button
                        onClick={onhandleWorker}
                        className='flex justify-center items-center min-w-full'>
                        See Workers
                    </button>
                )
            }

            {workerData && (
                workerLoader
                    ? <div className="animate-pulse text-center">Loading workers Data</div>
                    : <div className='min-w-full'>
                        <Dialog open={openworker} onOpenChange={setOpenworker}>
                            {/* <DialogTrigger>
                                
                            </DialogTrigger> */}
                            <DialogContent showCloseButton={false}>
                                <DialogTitle className='text-center'>
                                    All Workers associated with the business
                                </DialogTitle>
                                <DialogDescription>
                                    {workerData.map((d: WorkerDataFormat) => (
                                        <div
                                            key={d._id}
                                            className="bg-black/10 p-2 m-2 rounded-md flex justify-around  items-center"
                                        >
                                            <div>
                                                <p>Worker Name : {d.workerName}</p>
                                                <p>Worker Email : {d.WorkerEmail}</p>
                                            </div>
                                            <button className='p-1 rounded-full hover:bg-black/20 cursor-pointer' onClick={() => deleteWorker(d._id!)}>
                                                <Trash2 />
                                            </button>
                                        </div>
                                    ))}
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </div>
            )}
        </div>
    )
}

export default Page