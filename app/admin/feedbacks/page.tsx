"use client";
import Admin_navbar from '@/components/admin_navbar';
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Admin_navbar />

      <section className="p-6 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-5 transition hover:shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-sm font-semibold text-gray-600">
              U
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                User Name
              </p>
              <p className="text-sm text-gray-500">
                user@email.com
              </p>
            </div>
          </div>

          <div className="border-t my-3"></div>
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              This platform is really helpful. The experience was smooth and easy to use.
              Looking forward to more features!
            </p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>12 Dec 2024</span>
            <span>01:02 PM</span>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Page;