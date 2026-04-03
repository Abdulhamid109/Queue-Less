"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface DataFormat {
    name: string;
    email: string;
    password: string;
}
const Page = () => {
    const [data, setdata] = useState<DataFormat | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("/api/customer/auth/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong!");
            }
            toast.success("Successfully account created");
            router.push("/auth/login");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unexpected error occurred");
            }
    }finally{
        setLoading(false);
    }
}
return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

            <div className="flex flex-col gap-2 mb-6 text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Name</label>
                    <input
                        type="text"
                        placeholder="Enter your Name"
                        required
                        value={data?.name}
                        onChange={(e)=>setdata({...data!,name:e.target.value})}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={data?.email}
                        onChange={(e)=>setdata({...data!,email:e.target.value})}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={data?.password}
                        onChange={(e)=>setdata({...data!,password:e.target.value})}
                        className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {
                        loading?
                        <button disabled className="mt-2 w-full bg-gray-600 text-white py-3 rounded-lg font-medium  transition duration-200">
                            Loading...
                        </button>
                        :<button
                        type="submit"
                        className="mt-2 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                    >
                        signup
                    </button>
                    }
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href={"/auth/login"} className="text-blue-600 cursor-pointer hover:underline">
                    Login
                </Link>
            </p>
        </div>
    </div>
);
};

export default Page;