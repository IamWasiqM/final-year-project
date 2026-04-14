// app/book/page.tsx
"use client"

import Link from "next/link"
import React, { useState } from "react"
import { scheduleAppointment, AppointmentRequest } from "@/app/lib/api"

export default function BookPage() {
  const [formData, setFormData] = useState({
    patient_name: "",
    reason: "",
    date: "",
    time: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Create datetime string
      const dateTimeString = `${formData.date}T${formData.time}:00`
      
      console.log("Booking appointment:", {
        patient_name: formData.patient_name,
        reason: formData.reason,
        start_time: dateTimeString
      })
      
      const request: AppointmentRequest = {
        patient_name: formData.patient_name,
        reason: formData.reason,
        start_time: dateTimeString,
      }

      const result = await scheduleAppointment(request)
      console.log("Booking result:", result)
      
      setSuccess(`✅ Appointment booked successfully! Your appointment ID is ${result.id}`)
      setFormData({ patient_name: "", reason: "", date: "", time: "" })
    } catch (err: any) {
      console.error("Booking error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600">
            Schedly
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
            <Link href="/book" className="text-blue-600 transition-colors">Book</Link>
            <Link href="/availability" className="transition-colors hover:text-blue-600">Availability</Link>
            <Link href="/cancel" className="transition-colors hover:text-blue-600">Cancel</Link>
          </nav>
          <button className="block text-slate-600 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Book an Appointment
          </h1>
          <p className="mt-2 text-slate-500">
            Fill in the details below to schedule your appointment.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Name */}
            <div>
              <label htmlFor="patient_name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                id="patient_name"
                required
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="John Doe"
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                Reason for Visit
              </label>
              <input
                type="text"
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Consultation / Check-up / Follow-up"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                Appointment Date
              </label>
              <input
                type="date"
                id="date"
                required
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-slate-700">
                Appointment Time
              </label>
              <input
                type="time"
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                {success}
              </div>
            )}
            
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                ✗ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}