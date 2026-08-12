"use client"
import Cust_navbar from '@/components/cust_navbar'
import Footer from '@/components/Footer'
import Herosection from '@/components/Herosection'
import ProjectExplanation from '@/components/ProjectExplanation'
import Waitlistpage from '@/components/Waitlistpage'
import React from 'react'

const Page = () => {
  return (
    <div className=''>
      <Cust_navbar/>
      <Herosection/>
      <ProjectExplanation/>
      <Waitlistpage/>
      <Footer/>
    </div>
  )
}

export default Page