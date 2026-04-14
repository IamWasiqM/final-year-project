# backend.py
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
import datetime as dt
from pydantic import BaseModel
import uvicorn
import json

from database import init_db, Appointment, get_db

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class AppointmentRequest(BaseModel):
    patient_name: str
    reason: str | None = None
    start_time: dt.datetime

class CancelAppointmentRequest(BaseModel):
    patient_name: str
    date: dt.date

class ListAppointmentRequest(BaseModel):
    date: dt.date

# ✅ SCHEDULE APPOINTMENT - Works with VAPI and Admin Dashboard
@app.post("/schedule_appointment")
@app.post("/schedule_appointment/")
async def schedule_appointment(request: Request, db: Session = Depends(get_db)):
    """Handle both direct API calls and VAPI tool calls"""
    
    body = await request.json()
    print(f"📥 Schedule request: {body}")
    
    # Handle VAPI format (tool call)
    if "toolCall" in body or "functionCall" in body:
        params = body.get("toolCall", {}).get("parameters", {}) or body.get("functionCall", {}).get("parameters", {})
        patient_name = params.get("patient_name", "Unknown")
        reason = params.get("reason", "Voice Appointment")
        start_time_str = params.get("start_time") or params.get("dateTime")
    else:
        # Direct API call format
        patient_name = body.get("patient_name", "Unknown")
        reason = body.get("reason", "General")
        start_time_str = body.get("start_time")
    
    # Parse datetime
    if start_time_str:
        start_time = dt.datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
    else:
        start_time = dt.datetime.now() + dt.timedelta(hours=1)
    
    # Save to database
    new_appointment = Appointment(
        patient_name=patient_name,
        reason=reason,
        start_time=start_time,
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    print(f"✅ Scheduled: {new_appointment.patient_name} at {new_appointment.start_time}")
    
    # Return VAPI-friendly response
    return {
        "success": True,
        "id": new_appointment.id,
        "patient_name": new_appointment.patient_name,
        "start_time": new_appointment.start_time.isoformat(),
        "message": f"Appointment scheduled for {new_appointment.patient_name} at {new_appointment.start_time.strftime('%I:%M %p')}"
    }

# ✅ CANCEL APPOINTMENT - Works with VAPI and Admin Dashboard
# backend.py - CANCEL APPOINTMENT (Improved)
@app.post("/cancel_appointment")
@app.post("/cancel_appointment/")
async def cancel_appointment(request: Request, db: Session = Depends(get_db)):
    """Handle both direct API calls and VAPI tool calls with fuzzy name matching"""
    
    body = await request.json()
    print(f"📥 Cancel request: {body}")
    
    # Handle VAPI format
    if "toolCall" in body or "functionCall" in body:
        params = body.get("toolCall", {}).get("parameters", {}) or body.get("functionCall", {}).get("parameters", {})
        patient_name = params.get("patient_name", "").strip()
        date_str = params.get("date", "")
    else:
        patient_name = body.get("patient_name", "").strip()
        date_str = body.get("date", "")
    
    if not patient_name:
        return {"success": False, "message": "Patient name required", "canceled_count": 0}
    
    # Parse date
    if date_str:
        try:
            date = dt.datetime.fromisoformat(date_str).date()
        except:
            date = dt.date.today()
    else:
        date = dt.date.today()
    
    start_dt = dt.datetime.combine(date, dt.time.min)
    end_dt = start_dt + dt.timedelta(days=1)
    
    # Try exact match first
    result = db.execute(
        select(Appointment)
        .where(Appointment.patient_name == patient_name)
        .where(Appointment.start_time >= start_dt)
        .where(Appointment.start_time < end_dt)
        .where(Appointment.canceled == False)
    )
    appointments = result.scalars().all()
    
    # If no exact match, try case-insensitive partial match
    if not appointments:
        result = db.execute(
            select(Appointment)
            .where(Appointment.patient_name.ilike(f"%{patient_name}%"))
            .where(Appointment.start_time >= start_dt)
            .where(Appointment.start_time < end_dt)
            .where(Appointment.canceled == False)
        )
        appointments = result.scalars().all()
    
    # If still no match, try matching just first name or last name
    if not appointments and " " in patient_name:
        first_name = patient_name.split()[0]
        result = db.execute(
            select(Appointment)
            .where(Appointment.patient_name.ilike(f"%{first_name}%"))
            .where(Appointment.start_time >= start_dt)
            .where(Appointment.start_time < end_dt)
            .where(Appointment.canceled == False)
        )
        appointments = result.scalars().all()
    
    canceled_count = 0
    canceled_names = []
    
    for appointment in appointments:
        appointment.canceled = True
        canceled_count += 1
        canceled_names.append(appointment.patient_name)
    
    db.commit()
    
    print(f"✅ Canceled {canceled_count} appointments: {canceled_names}")
    
    if canceled_count == 0:
        # Get all appointments for the date to help debug
        all_result = db.execute(
            select(Appointment)
            .where(Appointment.start_time >= start_dt)
            .where(Appointment.start_time < end_dt)
            .where(Appointment.canceled == False)
        )
        all_appointments = all_result.scalars().all()
        available_names = [a.patient_name for a in all_appointments]
        
        return {
            "success": False,
            "canceled_count": 0,
            "message": f"No appointment found for '{patient_name}' on {date}. Available patients: {', '.join(available_names) if available_names else 'none'}"
        }
    
    return {
        "success": True,
        "canceled_count": canceled_count,
        "canceled_appointments": canceled_names,
        "message": f"Successfully canceled {canceled_count} appointment(s) for {patient_name}"
    }

# ✅ LIST APPOINTMENTS - Works with VAPI and Admin Dashboard
@app.post("/list_appointments")
@app.post("/list_appointments/")
@app.get("/list_appointments")
@app.get("/list_appointments/")
async def list_appointments(request: Request, db: Session = Depends(get_db)):
    """Handle both GET and POST requests"""
    
    # Handle both GET and POST
    if request.method == "POST":
        body = await request.json()
        
        # Handle VAPI format
        if "toolCall" in body or "functionCall" in body:
            params = body.get("toolCall", {}).get("parameters", {}) or body.get("functionCall", {}).get("parameters", {})
            date_str = params.get("date", "")
        else:
            date_str = body.get("date", "")
    else:
        # GET request
        params = dict(request.query_params)
        date_str = params.get("date", "")
    
    # Parse date
    if date_str:
        date = dt.datetime.fromisoformat(date_str).date()
    else:
        date = dt.date.today()
    
    start_dt = dt.datetime.combine(date, dt.time.min)
    end_dt = start_dt + dt.timedelta(days=1)
    
    result = db.execute(
        select(Appointment)
        .where(Appointment.canceled == False)
        .where(Appointment.start_time >= start_dt)
        .where(Appointment.start_time < end_dt)
        .order_by(Appointment.start_time.asc())
    )
    
    appointments = result.scalars().all()
    
    print(f"📋 Found {len(appointments)} appointments for {date}")
    
    return [
        {
            "id": apt.id,
            "patient_name": apt.patient_name,
            "reason": apt.reason,
            "start_time": apt.start_time.isoformat(),
            "canceled": apt.canceled,
            "created_at": apt.created_at.isoformat() if apt.created_at else None
        }
        for apt in appointments
    ]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run("backend:app", host="127.0.0.1", port=4444, reload=True)