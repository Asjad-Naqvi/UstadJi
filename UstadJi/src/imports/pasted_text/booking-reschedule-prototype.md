Fix the existing Booking Rescheduling prototype flow. Do not redesign, recreate, or modify unrelated screens.
The rescheduling screens and states have already been implemented. The problem is that the existing customer Reschedule button is still connected to the old immediate-success behavior.
Currently:
Customer Job Status
→ Reschedule
→ Select Date & Time
→ “Booking rescheduled successfully”
This is incorrect.
The new rescheduling experience is intended to demonstrate a two-sided reschedule request, where the new time is only confirmed after the other party agrees.

CUSTOMER — RESCHEDULE REQUEST


Reconnect the existing customer Reschedule button on the existing Job Status / Booking Details screen to the already-created:
hz-reschedule-flow-screen.tsx
Do NOT create another rescheduling screen.
The correct flow should be:
Job Status
→ Reschedule
→ Select preferred new date/time or time range
→ Submit Reschedule Request
→ “Finding a time that works for both you and your Ustaad…”
→ Show the existing 2–3 suggested overlapping time slots
→ Highlight one as “Best match”
→ Customer selects/sends the reschedule request
→ Navigate to the existing hz-reschedule-received-screen.tsx for the other party
IMPORTANT:
Selecting a new preferred time must NOT immediately reschedule the booking.
Do NOT show:
“Booking rescheduled successfully”
at this stage.
The first person is only requesting a new time.
==================================================
2. OTHER PARTY — RECEIVE REQUEST
Use the already-created:
hz-reschedule-received-screen.tsx
The other party should see:
Reschedule Request
Show:
Who requested the change
Original booking date/time
Requested alternative
AI-suggested overlapping time slots
Example:
“Your Ustaad has requested to move your AC Service from Thursday at 2:00 PM.”
Then show the suggested slots.
The receiving person should be able to:
Confirm New Time
or
Choose Another Time
Only after the receiving person confirms should the booking become rescheduled.
==================================================
3. FINAL CONFIRMATION
After the receiving party selects Confirm New Time, show the existing:
Booking Rescheduled
confirmation state.
Clearly show:
New Date
New Time
And indicate that the new appointment has been confirmed by both parties.
Example:
Booking Rescheduled
Tomorrow · 4:30 PM
Confirmed by you and your Ustaad
The original booking date/time should no longer be presented as the active appointment.
==================================================
4. NO-MATCH SCENARIO
Preserve the already-created no-match scenario.
From the suggested time slots screen, the existing:
Simulate no-match scenario
button should still work.
It should lead to:
“We couldn't find a time that works for both of you.”
with:
Suggest New Times
Choose Another Date
Cancel Booking
Do not remove or redesign this scenario.
==================================================
5. PROVIDER-INITIATED RESCHEDULE
Preserve the provider-side rescheduling flow already implemented.
The existing Provider Active Job / Booking Details → Reschedule action should use the same two-sided process:
Provider
→ Reschedule
→ Select preferred time
→ AI coordination
→ Suggested overlapping times
→ Customer receives request
→ Customer confirms
→ Booking Rescheduled
The flow should work regardless of who initiates the reschedule.
Do not create a separate booking lifecycle.
==================================================
6. UPDATE EXISTING BOOKING INFORMATION
After a reschedule is confirmed:
Update the existing booking's displayed date/time wherever the prototype already shows that booking.
This includes, where applicable:
Job Status
My Schedule
Upcoming Booking
Booking Details
Provider Active Job
The new confirmed date/time should be shown consistently.
Do not redesign these screens. Only connect the existing states/data necessary for the prototype demonstration.
==================================================
7. PRESERVE EXISTING CANCELLATION FLOWS
Do NOT break or remove the existing:
Customer cancellation
Provider cancellation
Provider cancellation → Find Alternative Ustaad
Existing provider results flow
These should remain unchanged.
==================================================
8. CRITICAL PROTOTYPE CHECK
After making the changes, verify the actual clickable flow in Preview/Present mode.
The customer-side flow MUST be:
Job Status
→ Reschedule
→ Select Date/Time
→ Submit Request
→ Finding a time that works for both you and your Ustaad…
→ Suggested Time Slots
→ Send Request
→ Reschedule Received
→ Other Party Confirms
→ Booking Rescheduled
→ Updated Date/Time
It MUST NOT be:
Job Status
→ Reschedule
→ Select Time
→ Booking Rescheduled Successfully
The existing Reschedule button must no longer bypass the newly-created rescheduling screens.
==================================================
IMPORTANT
This is primarily a prototype wiring/transition fix.
Reuse the existing screens that have already been created:
hz-reschedule-flow-screen.tsx
hz-reschedule-received-screen.tsx
hz-cancel-booking-screen.tsx
hz-provider-cancelled-notice.tsx
Do not create duplicate versions.
Do not redesign unrelated screens.
Do not modify the existing navigation architecture.
Do not implement real scheduling algorithms, backend logic, calendars, notifications, or AI coordination.
Use the existing fixed prototype states and make sure they are actually reachable and clickable in the intended sequence.

