"use client"
import React from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

const Cust_navbar = () => {
  const session = getCookie('token');
  const router = useRouter();

  const handleLogout = async()=>{
    try {
      const response = await fetch("/api/customer/auth/logout",{
        method:'GET'
      });
      const result = await response.json();
      if(!response.ok){
        throw new Error(result.error||"Something went wrong");
      }else{
        toast.success("Successfully logged out!");
        router.push("/auth/login");
      }
    } catch (error) {
      console.log("Failed to logout"+JSON.stringify(error));
      if(error instanceof Error){
        console.log(error.message);
      }
    }
  }
  return (
    <nav className=' p-2 flex justify-between  items-center backdrop-blur-2xl shadow-2xl '>
        <div className='text-2xl m-2'>
            Queue-Less
        </div>
        <div className='flex justify-center items-center gap-2 m-2'>
            <li className='list-none  hover:underline'>About us</li>
            <li className='list-none  hover:underline'>Contact</li>
            {/* based on the token update the Navbar */}
            {session?<Link href={"/auth/login"} className='list-none  hover:underline'>Login</Link>:<button className='bg-red-500 rounded-md hover:bg-red-600 p-1' onClick={handleLogout}>Logout</button>}
        </div>
    </nav>
  )
}

export default Cust_navbar