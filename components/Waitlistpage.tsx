"use client"
import React, { useState } from 'react'

const Waitlistpage = () => {
  const primaryGreen = '#159447'
  const lightGreen = '#EAF7EF'
  const darkText = '#171717'
  const secondaryText = '#5C5C5C'

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setErrorMsg('Enter your email to join the waitlist')
      return
    }

    if (!isValidEmail(email)) {
      setStatus('error')
      setErrorMsg('Enter a valid email address')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      // TODO: replace with your actual waitlist endpoint
      // const res = await fetch(`${BaseUrl}/waitlist/join`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // })
      // if (!res.ok) throw new Error('Failed to join waitlist')

      await new Promise((resolve) => setTimeout(resolve, 800)) // placeholder delay

      setStatus('success')
      setEmail('')
    } catch (err) {
        console.log("error => "+err)
      setStatus('error')
      setErrorMsg('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#F9FAF9] text-center">
      <span
        className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
        style={{ backgroundColor: lightGreen, color: primaryGreen }}
      >
        Coming Soon
      </span>

      <h1
        className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl"
        style={{ color: darkText, letterSpacing: '-0.02em' }}
      >
        Stop waiting. Start living.
      </h1>

      <p
        className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
        style={{ color: secondaryText }}
      >
        Queueless is launching soon. Be the first to know when you can skip
        the line — for real.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col sm:flex-row gap-3"
        noValidate
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
          style={{
            borderColor: status === 'error' ? '#DC2626' : '#E5E7EB',
            color: darkText,
          }}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
          style={{ backgroundColor: primaryGreen }}
        >
          {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
        </button>
      </form>

      <div className="mt-4 h-5">
        {status === 'error' && (
          <p className="text-sm" style={{ color: '#DC2626' }}>
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p className="text-sm font-medium" style={{ color: primaryGreen }}>
            You&apos;re on the list. We&apos;ll email you at launch.
          </p>
        )}
      </div>
    </div>
  )
}

export default Waitlistpage