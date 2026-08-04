"use client"
import Cust_navbar from '@/components/cust_navbar'
import React from 'react'
import { useQRCode } from 'next-qrcode';

const Page = () => {
  const {SVG} = useQRCode();

  return (
    <div className='h-screen'>
      <Cust_navbar/>
      <section className='flex flex-col justify-center items-center gap-3'>
        <div className='p-3 md:text-3xl'>Apk Release : <span className='font-bold'>PROJECT-QUEUELESS</span></div>
        <div className='pt-4'>
        //https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-2.0.1/app-release.apk
    <SVG
      text={'https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-2.0.1/app-release.apk'}
      options={{
        margin: 2,
        width: 300,
        color: {
          dark: '#000000FF',
          light: '#FFBF60FF',
        },
      }}
    />
      </div>
      or
      <a
        href='https://github.com/Abdulhamid109/Queue-Less/releases/download/queueless-apk-2.0.1/app-release.apk'
        download={true}
       className='bg-blue-500 rounded-md p-2'>
        Download from here
      </a>
      </section>
      
    </div>
  )
}

export default Page
