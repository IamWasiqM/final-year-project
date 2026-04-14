// app/admin/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Appointment {
  id: number
  patient_name: string
  reason: string | null
  start_time: string
  canceled: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:4444')
  const [activeTab, setActiveTab] = useState<'schedule' | 'cancel' | 'appointments'>('schedule')
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  
  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    patient_name: '',
    reason: '',
    date: '',
    time: '09:00'
  })
  const [scheduleStatus, setScheduleStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  const [scheduleLoading, setScheduleLoading] = useState(false)

  // Cancel form state
  const [cancelForm, setCancelForm] = useState({
    patient_name: '',
    date: ''
  })
  const [cancelStatus, setCancelStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  const [cancelLoading, setCancelLoading] = useState(false)

  // Check appointments state
  const [checkDate, setCheckDate] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [checkLoading, setCheckLoading] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [stats, setStats] = useState({ total: 0, active: 0, canceled: 0 })

  // Initialize dates
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const formattedToday = today.toISOString().split('T')[0]
    const formattedTomorrow = tomorrow.toISOString().split('T')[0]
    
    setScheduleForm(prev => ({ ...prev, date: formattedTomorrow }))
    setCancelForm(prev => ({ ...prev, date: formattedToday }))
    setCheckDate(formattedToday)
    
    // Check backend connection
    checkConnection()
    // Load today's appointments
    loadAppointmentsForDate(formattedToday)
  }, [])

  // Check backend connection
  const checkConnection = async () => {
    try {
      const response = await fetch(`${baseUrl}/list_appointments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] })
      })
      setIsConnected(response.ok)
    } catch {
      setIsConnected(false)
    }
  }

  // Load appointments for a specific date
  const loadAppointmentsForDate = async (date: string) => {
    try {
      const response = await fetch(`${baseUrl}/list_appointments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
      })
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        updateStats(data)
      }
    } catch (error) {
      console.error('Failed to load appointments:', error)
    }
  }

  // Update statistics
  const updateStats = (data: Appointment[]) => {
    const active = data.filter(a => !a.canceled).length
    const canceled = data.filter(a => a.canceled).length
    setStats({ total: data.length, active, canceled })
  }

  // Schedule Appointment
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    setScheduleLoading(true)
    setScheduleStatus({type: null, message: ''})

    try {
      const start_time = `${scheduleForm.date}T${scheduleForm.time}:00`
      
      const response = await fetch(`${baseUrl}/schedule_appointment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: scheduleForm.patient_name.trim(),
          reason: scheduleForm.reason.trim() || 'General Consultation',
          start_time: start_time
        })
      })

      if (response.ok) {
        const data = await response.json()
        setScheduleStatus({type: 'success', message: `Appointment scheduled successfully!`})
        setScheduleForm(prev => ({...prev, patient_name: '', reason: ''}))
        loadAppointmentsForDate(scheduleForm.date)
        setActiveTab('appointments')
      } else {
        const error = await response.text()
        setScheduleStatus({type: 'error', message: `Failed: ${error}`})
      }
    } catch (error: any) {
      setScheduleStatus({type: 'error', message: `Connection error: ${error.message}`})
    } finally {
      setScheduleLoading(false)
    }
  }

  // Cancel Appointment
  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    setCancelLoading(true)
    setCancelStatus({type: null, message: ''})

    try {
      const response = await fetch(`${baseUrl}/cancel_appointment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: cancelForm.patient_name.trim(),
          date: cancelForm.date
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCancelStatus({type: 'success', message: `Canceled ${data.canceled_count} appointment(s)`})
        setCancelForm(prev => ({...prev, patient_name: ''}))
        loadAppointmentsForDate(cancelForm.date)
      } else {
        const error = await response.text()
        setCancelStatus({type: 'error', message: `Failed: ${error}`})
      }
    } catch (error: any) {
      setCancelStatus({type: 'error', message: `Connection error: ${error.message}`})
    } finally {
      setCancelLoading(false)
    }
  }

  // Check Appointments
  const handleCheck = async () => {
    setCheckLoading(true)
    setCheckError('')
    await loadAppointmentsForDate(checkDate)
    setCheckLoading(false)
  }

  // Cancel specific appointment by ID
  const cancelAppointmentById = async (id: number, patientName: string) => {
    if (!confirm(`Cancel appointment for ${patientName}?`)) return
    
    try {
      const response = await fetch(`${baseUrl}/cancel_appointment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          date: checkDate
        })
      })
      
      if (response.ok) {
        loadAppointmentsForDate(checkDate)
      }
    } catch (error) {
      console.error('Failed to cancel:', error)
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const tabs = [
    { id: 'schedule', label: '📅 Schedule', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'cancel', label: '❌ Cancel', icon: 'M6 18L18 6M6 6l12 12' },
    { id: 'appointments', label: '📋 Appointments', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' }
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Premium Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-800">Schedly Admin</h1>
                <p className="text-xs text-slate-500">Appointment Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isConnected === true ? 'bg-green-500 animate-pulse' : isConnected === false ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-slate-500">
                  {isConnected === true ? 'Connected' : isConnected === false ? 'Disconnected' : 'Checking...'}
                </span>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl shadow-blue-500/20"
          >
            <p className="text-sm font-medium text-blue-100">Total Appointments</p>
            <p className="mt-2 text-4xl font-bold">{stats.total}</p>
            <p className="mt-1 text-xs text-blue-100">For {checkDate}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-xl shadow-emerald-500/20"
          >
            <p className="text-sm font-medium text-emerald-100">Active</p>
            <p className="mt-2 text-4xl font-bold">{stats.active}</p>
            <p className="mt-1 text-xs text-emerald-100">Confirmed appointments</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-6 text-white shadow-xl shadow-rose-500/20"
          >
            <p className="text-sm font-medium text-rose-100">Canceled</p>
            <p className="mt-2 text-4xl font-bold">{stats.canceled}</p>
            <p className="mt-1 text-xs text-rose-100">Canceled appointments</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Backend URL Configuration */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Backend URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="http://127.0.0.1:4444"
            />
            <button
              onClick={checkConnection}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
            >
              Test
            </button>
          </div>
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Schedule New Appointment
            </h2>
            
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Patient Name</label>
                  <input
                    type="text"
                    value={scheduleForm.patient_name}
                    onChange={(e) => setScheduleForm({...scheduleForm, patient_name: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Reason</label>
                  <input
                    type="text"
                    value={scheduleForm.reason}
                    onChange={(e) => setScheduleForm({...scheduleForm, reason: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., Checkup, Consultation"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={scheduleLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 sm:w-auto sm:px-8"
              >
                {scheduleLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scheduling...
                  </span>
                ) : (
                  'Schedule Appointment'
                )}
              </button>
            </form>
            
            {scheduleStatus.message && (
              <div className={`mt-4 rounded-xl p-4 ${
                scheduleStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {scheduleStatus.message}
              </div>
            )}
          </motion.div>
        )}

        {/* Cancel Tab */}
        {activeTab === 'cancel' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              Cancel Appointment
            </h2>
            
            <form onSubmit={handleCancel} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Patient Name</label>
                  <input
                    type="text"
                    value={cancelForm.patient_name}
                    onChange={(e) => setCancelForm({...cancelForm, patient_name: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">Date</label>
                  <input
                    type="date"
                    value={cancelForm.date}
                    onChange={(e) => setCancelForm({...cancelForm, date: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={cancelLoading}
                className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 py-3 text-sm font-medium text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 disabled:opacity-50 sm:w-auto sm:px-8"
              >
                {cancelLoading ? 'Canceling...' : 'Cancel Appointment'}
              </button>
            </form>
            
            {cancelStatus.message && (
              <div className={`mt-4 rounded-xl p-4 ${
                cancelStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {cancelStatus.message}
              </div>
            )}
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </span>
                Appointments
              </h2>
              
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleCheck}
                  disabled={checkLoading}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {checkLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {checkError && (
              <div className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">
                {checkError}
              </div>
            )}

            {appointments.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{formatTime(apt.start_time)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{apt.patient_name}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{apt.reason || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            apt.canceled 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {apt.canceled ? 'Canceled' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!apt.canceled && (
                            <button
                              onClick={() => cancelAppointmentById(apt.id, apt.patient_name)}
                              className="text-rose-500 transition-colors hover:text-rose-700"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12">
                <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-3 text-sm font-medium text-slate-500">No appointments found</p>
                <p className="text-xs text-slate-400">Select a date and click refresh</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}