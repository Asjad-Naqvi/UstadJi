Update the existing Ustaad G prototype to improve the Booking, Cancellation & Smart Rescheduling experience.
Reuse the existing booking, scheduling, upcoming booking, provider job request, provider dashboard/inbox, and booking status screens/components.
Do not redesign unrelated screens, create duplicate booking flows, or remove existing functionality.
IMPORTANT — STATIC PROTOTYPE DEMO
This is a Figma prototype demonstration, not a real scheduling system.
Use fixed, predetermined prototype scenarios to simulate the AI-assisted scheduling behavior.
Do NOT implement:
Real AI scheduling
Calendar APIs
Backend availability checking
Real-time synchronization
Dynamic scheduling logic
Automatic booking confirmation
Dynamic/random responses
Instead, create realistic prototype states with predetermined availability and outcomes.
For example, the prototype can simulate:
Customer requests Thursday 2:00 PM → AI finds Friday 4:00 PM as the best overlapping time → Provider receives request → Provider confirms → Booking updates to Friday 4:00 PM.
The same scenario should behave consistently every time.

1. CUSTOMER REQUESTS RESCHEDULE
On the existing Customer Booking Details / Upcoming Booking screen, add a clear:
Reschedule
action.
When selected, show:
Reschedule Booking
“When would you like to reschedule?”
Allow the customer to select a preferred date and time or time range using the existing calendar/scheduling components.
After submission, show a short AI coordination state:
“Finding a time that works for both you and your Ustaad…”
Then transition to a fixed predetermined result showing that Ustaad G has found available overlapping times.

2. PROVIDER REQUESTS RESCHEDULE
On the existing Provider Booking Details / Upcoming Job screen, add the same:
Reschedule
action.
Allow the provider to select a preferred alternative date/time or time range.
Show:
“Finding a time that works for both you and the customer…”
Then show a fixed predetermined result with overlapping time options.
The same rescheduling concept should work whether the customer or provider initiates the request.

3. AI-SUGGESTED OVERLAPPING TIMES
After a reschedule request, show:
“We found times that work for both of you.”
Display 2–3 fixed suggested slots, for example:
Tomorrow · 2:00 PM
Tomorrow · 4:30 PM
Saturday · 11:00 AM
Clearly highlight one as:
Best match
with a short explanation:
“Works with both schedules.”
The person who did not initiate the request should be the one who confirms the new time.
Show:
Confirm New Time
Choose Another Time
After confirmation, update the existing booking with the new date/time.

4. OTHER PERSON RECEIVES THE RESCHEDULE REQUEST
When one person requests a reschedule, show a clear notification/request to the other person.
Example:
Reschedule Request
“Your Ustaad has requested to move your AC Service from Thursday at 2:00 PM.”
Show the fixed suggested time slots.
Actions:
Confirm New Time
Choose Another Time
After confirmation, show:
Booking Rescheduled
AC Service
Friday · 4:00 PM
Confirmed by both customer and Ustaad
Update the existing booking information to reflect the new date and time.

5. NO-MATCH SCENARIO
Create a separate fixed prototype state where no overlapping availability exists.
Show:
“We couldn't find a time that works for both of you.”
Supporting text:
“Try suggesting another time or choosing a different date.”
Actions:
Suggest New Times
Choose Another Date
Cancel Booking
Do not automatically cancel the booking.
Allow the user to continue by proposing another availability window.

6. CANCELLATION FLOW
On the existing booking details screen, add:
Cancel Booking
Before cancellation, show a confirmation state:
“Cancel this booking?”
Display the relevant booking information and a simple cancellation reason selection.
After confirmation, show:
Booking Cancelled
Then show a notification to the other party.
Customer cancellation example
“Your AC Service booking for Thursday at 2:00 PM has been cancelled by the customer.”
Provider cancellation example
“Your AC Service booking for Thursday at 2:00 PM has been cancelled by your Ustaad.”
Update the existing booking status to Cancelled.

7. PROVIDER CANCELLATION → ALTERNATIVE PROVIDERS
Create a fixed prototype scenario where the provider cancels an upcoming booking.
Instead of ending the customer's journey, show:
“Your Ustaad is no longer available.”
Supporting text:
“We can help you find another available Ustaad.”
Then transition to the existing provider matching/results screen.
Show a small set of predetermined alternative providers.
Use the existing customer preferences and matching UI to make the alternatives feel personalized.
Prioritize alternatives that, in the prototype scenario:
Provide the same service
Match the customer's preferences
Are available around the original booking time
Are reasonably close to the customer
Mark one provider:
Recommended Alternative
Allow the customer to select the replacement provider and continue into the existing booking flow.
Do not create a new provider marketplace screen.

8. NOTIFICATIONS & STATUS STATES
Add clear visual states/notifications for:
Reschedule requested
AI coordination in progress
Suggested times available
Awaiting other person's confirmation
Reschedule confirmed
Reschedule declined
No overlapping time found
Booking cancelled
Provider cancelled
Alternative providers available
The booking should visually progress through:
Requested → Finding Time → Suggested → Awaiting Confirmation → Confirmed
or:
Requested → No Matching Time
or:
Booking → Cancelled

DESIGN & IMPLEMENTATION RULES
Reuse the existing Ustaad G booking and scheduling screens.
Reuse the existing calendar/schedule components.
Reuse the existing provider matching/results screen for replacement providers.
Preserve existing navigation and booking functionality.
Preserve the existing Ustaad G design system and #161533 navy branding.
Keep the experience simple and understandable for both customers and providers.
Make it visually obvious who initiated the reschedule and who needs to confirm.
Clearly distinguish AI coordination from the final human confirmation.
Use fixed prototype data and predetermined outcomes.
Do not implement real scheduling, calendar synchronization, AI logic, APIs, or backend functionality.
Do not redesign unrelated features.
Do not create duplicate booking flows.
PRIMARY DEMO SCENARIO
The main prototype should allow us to demonstrate:
Existing booking → Customer selects Reschedule → Selects preferred time → “AI finding a time” → Compatible time slots appear → Other person receives request → Other person confirms → Booking updates → Both parties see the new confirmed time.
A second scenario should demonstrate:
Provider cancels → Customer is notified → Ustaad G offers alternative providers → Customer selects recommended alternative → Existing booking flow continues.
A third scenario should demonstrate:
Reschedule requested → No overlapping availability → No-match message → User can suggest another time/date instead of being stuck.
