"use client"
import React, { useState } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Cust_navbar = () => {
  const session = getCookie('token')
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/customer/auth/logout", {
        method: 'GET'
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      toast.success("Successfully logged out!")
      router.push("/auth/login")
    } catch (error) {
      console.log("Failed to logout", error)
    }
  }

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center backdrop-blur-2xl shadow-xl bg-white/70">
      
      <Link href={session ? "/homepage" : "/"} className="text-xl md:text-2xl font-semibold">
        Queue-Less
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {session && (
          <Link href="/profile" className="hover:text-blue-600 transition">
            Profile
          </Link>
        )}

        <Link href="#" className="hover:text-blue-600 transition">
          About
        </Link>

        <Link href="#" className="hover:text-blue-600 transition">
          Contact
        </Link>

        <Link href="/SFeedback" className="hover:text-blue-600 transition">
          Feedback
        </Link>

        {session ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className="hover:text-blue-600">
            Login
          </Link>
        )}
      </div>

      <button
        className="md:hidden flex flex-col gap-1"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen?<><X/></>:<><Menu/></>}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50">
          
          {session && (
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          )}

          <Link href="#" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link href="#" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link href="/SFeedback" onClick={() => setMenuOpen(false)}>
            Feedback
          </Link>

          {session ? (
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="bg-red-500 text-white px-4 py-1 rounded-md"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Cust_navbar