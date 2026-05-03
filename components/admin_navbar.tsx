"use client"
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Menu, X, LogOut, Building2 } from 'lucide-react'

const NAV_LINKS = [
  { label: "Add business", href: "/admin/addBusiness/businessInfo" },
  { label: "Profile",      href: "/admin/profile"                  },
  { label: "Pricing",      href: "/admin/payment"                  },
]

const Admin_navbar = () => {
  const session  = getCookie('admintoken')
  const router   = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", { method: 'GET' })
      const result   = await response.json()
      if (!response.ok) throw new Error(result.error || "Something went wrong")
      toast.success("Logged out successfully")
      router.push("/admin/auth/login")
    } catch (error) {
      console.log("Failed to logout", error)
      toast.error("Logout failed")
    }
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-0 flex justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <Link href="/admin/homepage" className="flex items-center gap-2 py-3.5">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Building2 size={14} className="text-white" />
        </div>
        <span className="text-base font-semibold text-slate-800 tracking-tight">Queue-Less</span>
        <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md ml-1">Admin</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isActive(link.href)
                ? "bg-slate-100 text-slate-800 font-medium"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {session && (
          <button
            onClick={handleLogout}
            className="ml-3 flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-sm flex flex-col py-2 md:hidden">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm px-6 py-3 transition-colors ${
                isActive(link.href)
                  ? "bg-slate-50 text-slate-800 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              className="flex items-center gap-2 text-sm text-rose-500 px-6 py-3 hover:bg-rose-50 transition-colors w-full text-left mt-1 border-t border-slate-100"
            >
              <LogOut size={14} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Admin_navbar