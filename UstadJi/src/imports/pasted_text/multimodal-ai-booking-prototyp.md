Fix and polish the existing Multimodal AI Booking prototype. Do not redesign, recreate, or modify unrelated screens.
The multimodal AI booking experience has already been implemented. This update is primarily to fix its prototype transitions and interaction flow so the entire demonstration works smoothly from beginning to end.

IMPORTANT — KEEP EXISTING IMPLEMENTATION


Reuse the existing:
AI booking chat
Multimodal input states
Blurry photo state
Clear photo state
Voice message state
Video state
Service Request Summary
Provider Matching / Results
Existing booking flow
Do not create duplicate screens if the required states already exist.
Do not redesign unrelated screens.
Do not modify the existing provider matching system.
Do not modify the existing booking lifecycle.
==================================================
2. AUTOMATIC AI ANALYSIS — REMOVE UNNECESSARY CONTINUE BUTTONS
Currently, after a customer uploads media, the prototype shows an AI analysis state and then requires the presenter to press a generic Continue button before the AI response appears.
This feels unnatural.
Remove the generic Continue interaction after successful AI analysis.
Instead, make the AI response appear automatically after a short, realistic prototype delay.
Use:
Photo analysis: approximately 2–3 seconds
Voice processing: approximately 2–3 seconds
Video analysis: approximately 3–4 seconds
The presenter should simply wait briefly while the prototype shows the analysis/processing state, and then the AI response should automatically appear.
These are fixed prototype transitions, not real AI processing.
==================================================
3. BLURRY PHOTO — KEEP USER DECISION
Do NOT remove the decision buttons from the blurry/unusable photo state.
Flow:
Customer uploads blurry/dark photo
→ “Analyzing your photo…”
→ after approximately 2–3 seconds:
“I couldn't clearly see the problem in this photo.”
Then show:
Try Another Photo
Continue with Description
These buttons are intentional because the customer needs to decide how to recover.
Try Another Photo
→ continues the SAME booking
→ opens the existing clear-photo demo state
Continue with Description
→ continues the SAME booking/conversation
→ does not restart the booking
Do not provide an AI diagnosis for the blurry image.
==================================================
4. CLEAR PHOTO — AUTOMATIC AI RESPONSE
When the customer selects Try Another Photo:
Show the existing clear plumbing photo.
Then:
“Analyzing your photo…”
After approximately 2–3 seconds, automatically show:
“The image appears to show water leaking from the pipe connection underneath the kitchen sink.”
Then show the existing follow-up question:
“Is the leak happening continuously?”
Use the existing fixed customer response:
“Yes, it has been leaking continuously.”
Then continue the same booking conversation.
Do not require a generic Continue button after the AI analysis.
==================================================
5. VOICE — AUTOMATIC AI RESPONSE
Continue the SAME booking.
Show the existing voice message:
🎤 Customer Voice Message · 0:18
Use the existing fixed sample content:
“Bhai, pani bohat zyada nikal raha hai aur neeche floor bhi geela ho raha hai.”
Show the simulated voice player.
After approximately 2–3 seconds of processing, automatically show:
“I understand. The leak is significant and water is collecting on the floor.”
Then continue the conversation.
Do not require a generic Continue button after the AI response.
Keep the original customer voice message visible.
==================================================
6. VIDEO — FIX THE CURRENTLY BROKEN TRANSITION
This is the most important fix.
Currently, the prototype gets stuck on:
“Analyzing your video…”
Fix this.
When the customer adds the existing plumbing video:
Show:
🎥 Customer Video · 0:12
with the existing:
Video thumbnail
Play icon
Duration
Then show:
“Analyzing your video…”
After approximately 3–4 seconds, automatically transition to:
“The video appears to show water continuously dripping from the pipe underneath the sink.”
Do NOT leave the prototype stuck on the analyzing state.
Do NOT require a generic Continue button after the video analysis.
Then continue to the already-existing Service Request Summary.
==================================================
7. ONE CONNECTED MULTIMODAL BOOKING
Keep all four inputs within ONE connected booking conversation.
The final customer demonstration should be:
Text
→ Blurry Photo
→ Try Another Photo
→ Clear Photo
→ AI understands photo
→ Customer confirms leak is continuous
→ Voice Message
→ AI understands additional information
→ Video
→ AI understands video
→ Structured Service Request Summary
The AI should visually demonstrate that it combines information from all four inputs.
Do NOT turn these into four separate bookings.
==================================================
8. SERVICE REQUEST SUMMARY
After the video AI response, show the existing Service Request Summary.
It should contain:
SERVICE REQUEST SUMMARY
Service: Plumbing
Problem: Continuous leak underneath kitchen sink
Urgency: Needs attention soon
Location: Islamabad
Details: Continuous water leakage from the pipe connection underneath the kitchen sink.
Customer Inputs:
💬 Text
📷 Photo
🎤 Voice
🎥 Video
Ask:
“Does this look right?”
Actions:
✓ Looks Good
✎ Edit Details
Keep these actions as they are.
The customer must confirm the summary before proceeding.
After Looks Good, show:
“Finding the best Ustaads for your request…”
Then transition into the EXISTING Provider Matching / Results screen.
==================================================
9. CONNECT TO EXISTING BOOKING FLOW
After the customer confirms the AI summary, preserve the existing booking flow:
Service Request Summary
→ Looks Good
→ Finding the best Ustaads
→ Existing Provider Matching / Results
→ Customer selects provider
→ Existing Date & Time Selection
→ Existing Booking Confirmation
→ Existing booking lifecycle
Do not create a duplicate matching or booking flow.
==================================================
10. VERIFY THE PROVIDER SIDE
Make sure the existing Provider Job Request screen receives the SAME multimodal booking scenario.
The provider should be able to see:
AI BOOKING SUMMARY
“Customer reports continuous water leakage from the pipe connection underneath the kitchen sink. The leak is significant and water is collecting on the floor.”
And separately:
ORIGINAL CUSTOMER INPUTS
💬 Original customer text
📷 Clear customer photo
🎤 Original customer voice message
🎥 Customer video
Keep AI-generated information clearly separate from the customer's original inputs.
Preserve the existing:
Read Summary
and
Listen to AI Summary · 0:28
interactions.
Keep:
🎤 Original Customer Voice Message
separate from:
🤖 AI Booking Summary
==================================================
11. FINAL INTERACTION CHECK
Before finishing, verify that the prototype can actually be demonstrated from beginning to end in Preview/Present mode.
The exact intended flow is:
New AI Booking
→ Language Selection
→ Clean Chat
→ Text Input
→ AI Response
→ Blurry Photo
→ AI Analysis
→ Unclear Photo Message
→ Try Another Photo
→ Clear Photo
→ AI Analysis
→ AI Response
→ Customer Follow-up Response
→ Voice Message
→ AI Processing
→ AI Response
→ Video
→ AI Analysis
→ AI Response
→ Service Request Summary
→ Looks Good
→ Finding the best Ustaads
→ Existing Provider Matching
→ Existing Provider Selection
→ Existing Date & Time
→ Existing Booking Confirmation
IMPORTANT:
The flow must NOT get stuck on any “Analyzing…” or “Processing…” state.
Successful AI analysis states should transition automatically after the specified delay.
Only genuine user decisions should require user interaction, such as:
Try Another Photo
Continue with Description
Customer follow-up response
Looks Good / Edit Details
Provider selection
Date/time selection
Booking confirmation
Do not add unnecessary Continue buttons.

DESIGN PRESERVATION
Preserve the existing Ustaad G design system:
Navy #161533
Existing typography
Existing cards
Existing buttons
Existing icons
Existing spacing
Existing navigation
Existing components
Keep the experience polished, conversational, deterministic, and presentation-ready.
This is a high-fidelity interactive Figma prototype, so the goal is to demonstrate the intended product behavior through fixed prototype states and transitions, not to implement real AI or backend functionality.
