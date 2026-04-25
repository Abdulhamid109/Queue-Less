"use client"
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

const Admin_navbar = () => {
  const session = getCookie('admintoken')
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: 'GET'
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      toast.success("Successfully logged out!")
      router.push("/admin/auth/login")
    } catch (error) {
      console.log("Failed to logout", error)
    }
  }

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-gradient-to-l from-green-400 to-gray-300 shadow-md relative">

      {/* Logo */}
      <Link href="/admin/homepage" className="text-xl md:text-2xl font-semibold">
        Queue-Less
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 font-sans">
        <Link href="/admin/addBusiness/businessInfo" className="hover:underline">
          Add Business
        </Link>

        <Link href="/admin/profile" className="hover:underline">
          Profile
        </Link>

        <Link href="/admin/Reports" className="hover:underline">
          Reports
        </Link>

        <Link href="/admin/feedbacks" className="hover:underline">
          Feedbacks
        </Link>

        {session && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>

      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-4 py-4 md:hidden z-50">

          <Link href="/admin/addBusiness/businessInfo" onClick={() => setMenuOpen(false)}>
            Add Business
          </Link>

          <Link href="/admin/profile" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>

          <Link href="/admin/Reports" onClick={() => setMenuOpen(false)}>
            Reports
          </Link>

          <Link href="/admin/feedbacks" onClick={() => setMenuOpen(false)}>
            Feedbacks
          </Link>

          {session && (
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="bg-red-500 text-white px-4 py-1 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Admin_navbar