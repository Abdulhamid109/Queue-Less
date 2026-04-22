"use client"
import Admin_navbar from '@/components/admin_navbar'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ServiceInfoFormat {
    serviceName: string
    serviceDuration: string
    ServiceCharge: string
}

const ServiceInfo = () => {
    const [data, setData] = useState<ServiceInfoFormat>({
        serviceName: '',
        serviceDuration: '',
        ServiceCharge: '',
    });
    // Make sure that service Time should greater than 10 mins
    const [loading, setLoading] = useState(false)
    const [timeState, setTimeState] = useState(3)
    const [ready, setReady] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)

    const router = useRouter()

    const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const onhandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDialogOpen(true)
    }

    const submitToApi = async (addAnother: boolean) => {
        setLoading(true)
        try {
            const bid = localStorage.getItem("uid")

            const payload = { ...data, bid }

            const response = await fetch('/api/admin/serviceInfo', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!")
            }

            toast.success("Service added successfully!")
            setDialogOpen(false)

            if (addAnother) {
                setData({
                    serviceName: '',
                    serviceDuration: '',
                    ServiceCharge: '',
                })
            } else {
                router.push('/admin/addBusiness/timeInfo')
                toast.success("Final Step")
            }
        } catch (error) {
            console.error("Error:", error)
            if (error instanceof Error) toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setReady(localStorage.getItem("StepOne") === "true")
    }, [])

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
                Step 02 — Service Information
            </p>

            <section className="p-5 flex flex-col justify-center items-center md:w-full">
                <form
                    onSubmit={onhandleSubmit}
                    className="backdrop-blur-2xl shadow-xl shadow-black/25 sm:min-w-[70vw] md:min-w-fit p-4 md:w-fit rounded-md bg-gradient-to-l from-gray-100 to-gray-200"
                >
                    <div className="flex flex-col">
                        <label className="font-thin p-1">Service Name *</label>
                        <input
                            name="serviceName"
                            value={data.serviceName}
                            onChange={onhandleChange}
                            required
                            type="text"
                            className="p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300"
                            placeholder="Enter the service name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-thin p-1">
                            Service Duration <span className="text-xs">(minutes)</span> *
                        </label>
                        <input
                            name="serviceDuration"
                            value={data.serviceDuration}
                            onChange={onhandleChange}
                            required
                            type="number"
                            min={1}
                            className="p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300"
                            placeholder="Duration per customer in minutes"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-thin p-1">Service Charge *</label>
                        <input
                            name="ServiceCharge"
                            value={data.ServiceCharge}
                            onChange={onhandleChange}
                            required
                            type="number"
                            min={0}
                            className="p-2 focus:outline md:w-[40vw] border rounded-md border-blue-300"
                            placeholder="Service charge amount"
                        />
                    </div>



                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 p-2 mt-4 rounded-md text-white w-full transition"
                    >
                        {loading ? "Submitting…" : "Submit"}
                    </button>
                </form>
            </section>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogTitle className="text-center">
                        Do you want to add another service?
                    </DialogTitle>
                    <DialogDescription className="flex justify-between items-center pt-2">
                        <Button
                            onClick={() => submitToApi(true)}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            {loading ? "Saving…" : "Add Another"}
                        </Button>
                        <Button
                            onClick={() => submitToApi(false)}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            No, Final Step
                        </Button>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ServiceInfo