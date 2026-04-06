import Link from 'next/link'
import React from 'react'

const Admin_navbar = () => {
    
    return (
        <nav className='flex justify-between items-center p-3 bg-gradient-to-l from-green-400 to-gray-300'>
            <Link href={"/admin/homepage"} className='text-2xl'>Queue-Less</Link>
            <div className='flex justify-center items-center gap-2 font-sans'>
                <Link href={"/admin/addBusiness/businessInfo"} className='list-none hover:underline'>Add Business</Link>
                <Link href={"/admin/profile"} className='list-none hover:underline'>Profile</Link>
                <Link href={"/admin/Reports"} className='list-none hover:underline'>Report</Link>
                <Link href={"/admin/feedbacks"} className='list-none hover:underline'>FeedBacks</Link>
                <li className='list-none hover:underline'>Logout</li>
            </div>
        </nav>
    )
}

export default Admin_navbar