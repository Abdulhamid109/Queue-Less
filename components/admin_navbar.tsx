"use client"
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

const Admin_navbar = () => {
    const session = getCookie('admintoken');
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/admin/auth/logout", {
                method: 'GET'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            } else {
                toast.success("Successfully logged out!");
                router.push("/admin/auth/login");
            }
        } catch (error) {
            console.log("Failed to logout" + JSON.stringify(error));
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    return (
        <nav className='flex justify-between items-center p-3 bg-gradient-to-l from-green-400 to-gray-300'>
            <Link href={"/admin/homepage"} className='text-2xl'>Queue-Less</Link>
            <div className='flex justify-center items-center gap-2 font-sans'>
                <Link href={"/admin/addBusiness/businessInfo"} className='list-none hover:underline'>Add Business</Link>
                <Link href={"/admin/profile"} className='list-none hover:underline'>Profile</Link>
                <Link href={"/admin/Reports"} className='list-none hover:underline'>Report</Link>
                <Link href={"/admin/feedbacks"} className='list-none hover:underline'>FeedBacks</Link>
                {session && <li onClick={handleLogout} className='cursor-pointer list-none hover:underline'>Logout</li>}
            </div>
        </nav>
    )
}

export default Admin_navbar