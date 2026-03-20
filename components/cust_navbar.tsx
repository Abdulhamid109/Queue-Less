import React from 'react'

const Cust_navbar = () => {
  return (
    <nav className=' p-2 flex justify-between  items-center backdrop-blur-2xl shadow-2xl shadow-black rounded-b-2xl'>
        <div className='text-2xl m-2'>
            Queue-Less
        </div>
        <div className='flex justify-center items-center gap-2 m-2'>
            <li className='list-none font-thin hover:underline'>About us</li>
            <li className='list-none font-thin hover:underline'>Contact</li>
            <li className='list-none font-thin hover:underline'>Login</li>
            {/* <li className='list-none bg-red-400 rounded-xl p-1 text-gray-600'>Business Login</li> */}
        </div>
    </nav>
  )
}

export default Cust_navbar