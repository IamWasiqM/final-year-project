// app/cancel/page.tsx
"use client"

import Link from "next/link"
import React, { useState } from "react"
import { cancelAppointment, CancelAppointmentResponse } from "@/app/lib/api"

export default function CancelPage() {
  const [formData, setFormData] = useState({
    patient_name: "",
    date: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CancelAppointmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await cancelAppointment({
        patient_name: formData.patient_name,
        date: formData.date,
      })
      setResult(response)
      setFormData({ patient_name: "", date: "" })
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment")
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Cancel Appointment
          </h1>
          <p className="mt-2 text-slate-500">
            Enter your details to cancel an existing appointment.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                Appointment Date
              </label>
              <input
                type="date"
                id="date"
                required
                max={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {result && (
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
                {result.canceled_count > 0 
                  ? `✅ Successfully canceled ${result.canceled_count} appointment(s).`
                  : "No appointments found to cancel."}
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                ✗ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Canceling..." : "Cancel Appointment"}
            </button>
          </form>
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
          <Link href="/availability" className="transition-colors hover:text-blue-600">Availability</Link>
          <Link href="/cancel" className="text-red-600 transition-colors">Cancel</Link>
        </nav>
      </div>
    </header>
  )
}