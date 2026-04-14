// app/availability/page.tsx
"use client"

import Link from "next/link"
import React, { useState } from "react"
import { listAppointments, AppointmentResponse } from "@/app/lib/api"

export default function AvailabilityPage() {
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAppointments([])
    setHasSearched(false)

    try {
      console.log("Checking date:", date)
      
      const result = await listAppointments({ date })
      console.log("API Response:", result)
      
      // Ensure result is an array
      const appointmentsArray = Array.isArray(result) ? result : []
      setAppointments(appointmentsArray)
      setHasSearched(true)
      
      console.log("Set appointments:", appointmentsArray)
    } catch (err: any) {
      console.error("Fetch error:", err)
      setError(err.message || "Failed to fetch appointments")
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    } catch {
      return isoString
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Check Availability
          </h1>
          <p className="mt-2 text-slate-500">
            Select a date to view booked appointment slots.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <form onSubmit={handleCheck} className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Loading..." : "Check"}
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
              ✗ {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-slate-500">Loading appointments...</p>
            </div>
          )}

          {!loading && hasSearched && appointments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-slate-700">
                📅 Booked Appointments for {date}:
              </h3>
              <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{apt.patient_name}</p>
                      <p className="text-sm text-slate-500">{apt.reason || "No reason provided"}</p>
                      <p className="text-xs text-slate-400 mt-1">ID: {apt.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium text-blue-600">
                        {formatTime(apt.start_time)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {apt.canceled ? "Canceled" : "Confirmed"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && hasSearched && appointments.length === 0 && (
            <div className="rounded-lg bg-green-50 p-6 text-center border border-green-200">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-green-700 font-medium">No appointments booked for {date}!</p>
              <p className="text-sm text-green-600 mt-1">All slots are available.</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div className="rounded-lg bg-slate-50 p-6 text-center border border-slate-200">
              <p className="text-slate-500">Select a date and click "Check" to view appointments</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600">
          Schedly
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link href="/book" className="transition-colors hover:text-blue-600">Book</Link>
          <Link href="/availability" className="text-blue-600 transition-colors">Availability</Link>
          <Link href="/cancel" className="transition-colors hover:text-blue-600">Cancel</Link>
        </nav>
        <button className="block text-slate-600 md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  )
}