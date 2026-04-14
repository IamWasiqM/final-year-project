from __future__ import annotations

from sqlalchemy import text

from Schedly_WebApp.backend.database import engine#, init_db


def run_sql(query: str):
	"""Run a raw SQL query on the same DB used by `database.py`.

	Example:
		rows = run_sql("SELECT * FROM appointments")
		print(rows)
	"""
	#init_db()  # ensures the appointments table exists
	with engine.begin() as conn:
		result = conn.execute(text(query))
		return result.fetchall() if result.returns_rows else result.rowcount

#query = """INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_time, reason) VALUES ('Ali Khan', 'Dr. Ahmed', '2026-04-10', '10:30', 'General Checkup')"""
#print(run_sql(query))
# query = "PRAGMA table_info(appointments)"
# print(run_sql(query))
# query = """
# INSERT INTO appointments (patient_name, reason, start_time, canceled, created_at)
# VALUES ('Ali Khan', 'General Checkup', '2026-04-10 10:30:00', 0, '2026-04-05 12:00:00')
# """
# print(run_sql(query))
query = """SELECT * FROM appointments"""
print(run_sql(query))