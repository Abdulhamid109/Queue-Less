'use client'

import Cust_navbar from '@/components/cust_navbar'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Page = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [message, setMessage] = useState('');
    const [loading,setLoading] = useState<boolean>(false);

    const handleSubmit = async(e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!title || !description) {
                setMessage('Please fill in all fields.')
                return
            }

            const payload = {title,description}

            const response = await fetch('/api/customer/AddSystemFeedback',{
                headers:{'Content-Type':'application/json'},
                method:'POST',
                body:JSON.stringify(payload)
            });

            const result = await response.json();

            if(!response.ok){
                throw new Error(result.error||"Something went wrong")
            }else{
                toast.success("Successfully recorderd the feedback");
                console.log({ title, description })
            setMessage('Feedback submitted successfully!')

            setTitle('')
            setDescription('')
            }
        } catch (error) {
            console.log("Error => "+error);
            if(error instanceof Error){
                console.log("error => "+error.message)
                toast.error('Somethign went wrong');
            }
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Cust_navbar />

            <div className="flex flex-col items-center justify-center px-4 py-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4">
                    Share Your Feedback
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                    Tell us what issues you&apos;re facing or how we can improve the system.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-lg bg-white p-6 rounded-xl shadow-xl space-y-4"
                >
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter issue title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                            Issue Description
                        </label>
                        <textarea
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            maxLength={300}
                            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            required
                        />
                        <span className="text-xs text-gray-400 mt-1">
                            {description.length}/300 characters
                        </span>
                    </div>

                    {message && (
                        <p className="text-sm text-center text-blue-600">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        {loading?"Submitting...":"Submit Feedback"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Page