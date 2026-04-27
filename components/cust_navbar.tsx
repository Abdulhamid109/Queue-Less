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

  const navLinks = [
    { href: '/aboutus', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/SFeedback', label: 'Feedback' },
  ]

  return (
    <nav className="w-full px-6 py-3.5 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">

      <Link
        href={session ? "/homepage" : "/"}
        className="text-lg font-semibold text-gray-900 tracking-tight"
      >
        Queue<span className="text-blue-600">Less</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        {session && (
          <Link
            href="/profile"
            className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            Profile
          </Link>
        )}

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            {link.label}
          </Link>
        ))}

        <div className="w-px h-4 bg-gray-200 mx-2" />

        {session ? (
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-sm flex flex-col items-start gap-1 px-4 py-3 md:hidden z-50">

          {session && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="w-full text-sm text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Profile
            </Link>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="w-full text-sm text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="w-full h-px bg-gray-100 my-1" />

          {session ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              className="w-full text-left text-sm text-red-500 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-sm font-medium text-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Cust_navbar