"use client"

import Link from "next/link"
import React from "react"
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const Footer = () => {
  const primaryGreen = "#159447"
  const secondaryText = "#5C5C5C"
  const darkText = "#171717"

  const socialLinks = [
    {
      icon: FaLinkedin,
      href: "https://linkedin.com/company/queueless",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com/queueless",
      label: "Instagram",
    },
    {
      icon: FaFacebook,
      href: "https://facebook.com/queueless",
      label: "Facebook",
    },
    {
      icon: FaXTwitter,
      href: "https://twitter.com/queueless",
      label: "Twitter / X",
    },
  ]

  return (
    <footer
      className="w-full border-t bg-[#F9FAF9]"
      style={{
        borderColor: "#E5E7EB",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight transition-colors duration-200"
              style={{
                color: darkText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = primaryGreen
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = darkText
              }}
            >
              Queueless<span style={{ color: primaryGreen }}>.</span>
            </Link>

            <p
              className="text-xs"
              style={{
                color: secondaryText,
              }}
            >
              Stop waiting. Start living.
            </p>
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm"
            style={{
              color: secondaryText,
            }}
          >
            <a
              href="/aboutus"
              className="transition-colors duration-200 hover:text-[#159447]"
            >
              About
            </a>

            <a
              href="/contact"
              className="transition-colors duration-200 hover:text-[#159447]"
            >
              Contact
            </a>

            <a
              href="/SFeedback"
              className="transition-colors duration-200 hover:text-[#159447]"
            >
              Feedback
            </a>

            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#159447]"
            >
              Detail Doc
            </a>

            {/* <a
              href="mailto:feedback@qlessa.com"
              className="transition-colors duration-200"
              style={{
                color: primaryGreen,
              }}
            >
              feedback@qlessa.com
            </a> */}
          </nav>

          
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="
                  w-9 h-9
                  flex items-center justify-center
                  rounded-full
                  border
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                "
                style={{
                  color: secondaryText,
                  borderColor: "#E5E7EB",
                  backgroundColor: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryGreen
                  e.currentTarget.style.borderColor = primaryGreen
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = secondaryText
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px my-6"
          style={{
            backgroundColor: "#E5E7EB",
          }}
        />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

          <p
            className="text-xs"
            style={{
              color: secondaryText,
            }}
          >
            © {new Date().getFullYear()} Queueless. All rights reserved.
          </p>

          <p
            className="text-xs"
            style={{
              color: secondaryText,
            }}
          >
            Built to make waiting feel optional.
          </p>

        </div>
      </div>
    </footer>
  )
}

export default Footer