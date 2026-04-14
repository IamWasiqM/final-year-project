// app/lib/api.ts
const API_BASE_URL = "http://127.0.0.1:4444"

export interface AppointmentRequest {
  patient_name: string
  reason: string
  start_time: string // ISO datetime string
}

export interface AppointmentResponse {
  id: number
  patient_name: string
  reason: string | null
  start_time: string
  canceled: boolean
  created_at: string
}

export interface CancelAppointmentRequest {
  patient_name: string
  date: string // YYYY-MM-DD format
}

export interface CancelAppointmentResponse {
  canceled_count: number
}

export interface ListAppointmentRequest {
  date: string // YYYY-MM-DD format
}

// Book appointment
export async function scheduleAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/schedule_appointment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to schedule appointment")
  }
  
  return response.json()
}

// Cancel appointment(s)
export async function cancelAppointment(data: CancelAppointmentRequest): Promise<CancelAppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/cancel_appointment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to cancel appointment")
  }
  
  return response.json()
}

// List appointments for a date
export async function listAppointments(data: ListAppointmentRequest): Promise<AppointmentResponse[]> {
  const response = await fetch(`${API_BASE_URL}/list_appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Failed to fetch appointments")
  }
  
  return response.json()
}