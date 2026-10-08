Update the existing Ustaad G prototype to add a polished, connected Multimodal AI Booking & Provider Communication flow.
IMPORTANT — EXTEND THE EXISTING PROTOTYPE
Reuse the existing screens, components, navigation, and design system wherever possible.
Do NOT:
redesign unrelated screens
remove existing functionality
rebuild the provider matching system
create duplicate booking flows
create a new booking lifecycle
recreate screens that already exist when they can be updated
Modify and connect the existing screens instead of creating unnecessary replacements.
This is a high-fidelity interactive Figma prototype demonstrating how the proposed finished product would behave.
Use fixed, realistic demo states and sample content.
The prototype does not need real AI/backend implementation. Represent AI behavior, media analysis, translation, and audio playback through predetermined interactive states.
The interactions should be deterministic and presentation-ready.
IMPORTANT:
Demonstrate the multimodal capability as ONE connected customer booking.
The customer may use any combination of:
Text
Photo
Voice
Video
For the main demonstration, use ONE plumbing problem throughout the conversation.

==================================================
1. CUSTOMER — START NEW AI BOOKING
==================================================

Use the existing New Chat / AI booking entry point.

At the beginning of a new booking, show:

“How would you like to communicate?”

Options:
- English
- اردو
- Roman Urdu

Use fixed prototype states for the selected language. Do not implement dynamic translation.

After language selection, show a clean new conversation with no previous history.

Display:

“Hi! What do you need help with?”

“Describe your problem in your own words. You can also send a photo, video, or voice message.”

Show the input controls:

Text
🎤 Voice
📷 Photo
🎥 Video

The customer should be able to use these inputs in the same conversation.

==================================================
2. MAIN MULTIMODAL DEMO — ONE CONNECTED BOOKING
==================================================

Use ONE fixed plumbing scenario throughout this demonstration.

The customer begins with:

Customer:
“There is water leaking under my kitchen sink since this morning.”

AI:
“Got it. Can you show me where the leak is coming from?”

The customer then adds a PHOTO.

==================================================
3. BLURRY PHOTO — ERROR HANDLING
==================================================

When the customer first uploads a photo, show a deliberately blurry/dark sample image.

Display:

📷 Customer Photo

“Analyzing your photo…”

Then:

“I couldn't clearly see the problem in this photo.”

Provide:

“Try Another Photo”

“Continue with Description”

IMPORTANT:
Do not diagnose the blurry image.

“Try Another Photo” should continue the same booking and allow the customer to upload the predetermined clear plumbing photo.

“Continue with Description” should continue the existing conversation without restarting the booking.

This is an error/recovery state inside the same booking, NOT a separate scenario.

==================================================
4. CLEAR PHOTO — AI UNDERSTANDING
==================================================

After selecting “Try Another Photo”, show a clear sample photo of a plumbing leak underneath a kitchen sink.

Display the original uploaded photo in the conversation.

Then show:

“Analyzing your photo…”

Then:

“The image appears to show water leaking from the pipe connection underneath the kitchen sink.”

Follow with:

“Is the leak happening continuously?”

Fixed customer response:

“Yes, it has been leaking continuously.”

Continue the same conversation.

==================================================
5. VOICE INPUT — SAME BOOKING
==================================================

The customer then adds a voice message to provide additional information.

Show:

🎤 Customer Voice Message · 0:18

Sample content:

“Bhai, pani bohat zyada nikal raha hai aur neeche floor bhi geela ho raha hai.”

Show a simulated voice-message player.

Then show the fixed AI response:

“I understand. The leak is significant and water is collecting on the floor.”

Follow with a relevant fixed response/question if needed.

The voice interaction is simulated. Do not implement real speech recognition.

Keep the original voice message visible as part of the conversation.

==================================================
6. VIDEO INPUT — SAME BOOKING
==================================================

The customer then adds a short video showing the leaking pipe underneath the sink.

Display:

🎥 Customer Video · 0:12

Show:
- Video thumbnail
- Play icon
- Duration

Then:

“Analyzing your video…”

Then show the predetermined AI response:

“The video appears to show water continuously dripping from the pipe underneath the sink.”

The video analysis is simulated.

Do not implement real video processing.

==================================================
7. AI STRUCTURED UNDERSTANDING
==================================================

After the AI has received the customer's text, clear photo, voice message, and video, show that the AI combines the information into a structured service request.

Display:

SERVICE REQUEST SUMMARY

Service:
Plumbing

Problem:
Continuous leak underneath kitchen sink

Urgency:
Needs attention soon

Location:
Islamabad

Details:
Continuous water leakage from the pipe connection underneath the kitchen sink.

Customer Inputs:
💬 Text
📷 Photo
🎤 Voice
🎥 Video

Show:

“Does this look right?”

Actions:

✓ Looks Good

✎ Edit Details

For the prototype, “Edit Details” may return to the relevant conversation state. No real editing logic is required.

The customer must confirm before continuing.

After “Looks Good”, show:

“Finding the best Ustaads for your request…”

Then continue into the EXISTING provider matching/results flow.

Do not redesign or rebuild the existing provider matching system.

==================================================
8. CONNECT TO EXISTING BOOKING FLOW
==================================================

After the AI summary is confirmed, continue through the existing booking flow:

Provider Matching / Results
→ Customer selects provider
→ Existing date & time selection
→ Existing booking confirmation
→ Booking request sent

Do not create a duplicate matching or booking flow.

Preserve the existing booking lifecycle.

==================================================
9. PROVIDER RECEIVES THE SAME MULTIMODAL REQUEST
==================================================

Update the existing Provider Job Request / Provider Inbox screen.

When the provider opens the booking request, show information generated from the SAME customer interaction.

Display:

NEW SERVICE REQUEST

Service:
Plumbing

Problem:
Leak underneath kitchen sink

Urgency:
Needs attention soon

Location:
Islamabad

Then clearly separate the AI-generated information:

🤖 AI BOOKING SUMMARY

“Customer reports continuous water leakage from the pipe connection underneath the kitchen sink. The leak is significant and water is collecting on the floor.”

Make it visually obvious that this is the AI's structured understanding of the customer's inputs.

==================================================
10. ORIGINAL CUSTOMER INPUTS
==================================================

The AI summary must NOT replace the customer's original inputs.

Add a clearly separated section:

ORIGINAL CUSTOMER INPUTS

💬 Original Description
“There is water leaking under my kitchen sink since this morning.”

📷 Customer Photo
Show the clear uploaded plumbing photo.

🎤 Original Voice Message
Play Original Voice Message · 0:18

🎥 Customer Video
Show the video preview with play button and duration.

The provider should be able to access the original evidence provided by the customer in addition to the AI-generated summary.

The blurry photo does not need to be shown prominently to the provider because it was rejected as unclear, but the final prototype should preserve the successful clear photo as the usable customer input.

==================================================
11. READ / LISTEN TO AI SUMMARY
==================================================

Under the AI Booking Summary, add:

📄 Read Summary

🎧 Listen to AI Summary · 0:28

“Read Summary” shows the written AI-generated summary.

“Listen to AI Summary” opens a simulated audio-player state containing:

- Play / Pause
- Progress indicator
- Duration

This is a static prototype state.

Do NOT implement real text-to-speech.

IMPORTANT:
Keep these two audio concepts visually separate:

🎤 Play Original Customer Voice Message

This represents what the customer actually said.

🤖 Listen to AI Booking Summary

This represents the AI-generated explanation of what the customer meant.

==================================================
12. PROVIDER PREFERRED LANGUAGE
==================================================

Use the provider's existing preferred booking language from the Provider Onboarding / Preferences flow.

Show an indicator such as:

Booking details · English

Booking details · اردو

Booking details · Roman Urdu

For the prototype, use fixed localized versions of the AI Booking Summary.

For example, if the provider's preferred language is Urdu, display a predetermined Urdu version of the same AI summary.

Do NOT implement real-time translation.

The original customer inputs should remain available separately and should not be replaced by the translation.

==================================================
13. PROVIDER DECISION
==================================================

Preserve or add the existing provider actions:

Accept Booking

Decline Booking

Accept Booking:
→ Continue into the existing Provider Active Job / booking management flow.

Decline Booking:
→ Continue into the existing Provider Inbox / decline flow.

Do not create a new booking lifecycle.

==================================================
DESIGN REQUIREMENTS
==================================================

- Reuse existing Ustaad G screens and components wherever possible.
- Preserve existing navigation.
- Preserve the existing Ustaad G visual identity.
- Preserve navy #161533 branding.
- Use the existing typography, cards, buttons, icons, spacing, and component styles.
- Keep the customer AI interaction conversational and visually clean.
- Make Text, Photo, Voice, and Video inputs clearly distinguishable.
- Make the blurry-photo error state clear but lightweight.
- Make the distinction between AI-generated information and original customer input extremely clear.
- Use realistic, professional sample content.
- Use fixed prototype states rather than real functionality.
- Make every interaction clickable and presentation-ready.
- Do not create unnecessary duplicate screens.
- Do not redesign unrelated features.
- Do not modify the existing provider matching algorithm.
- Do not modify the existing booking lifecycle.
- Do not implement real AI, APIs, backend functionality, or media processing.

==================================================
FINAL DEMONSTRATION FLOW
==================================================

The final prototype should demonstrate ONE connected booking:

Choose Language
→ New Clean AI Chat
→ Customer describes problem using Text
→ Customer uploads blurry Photo
→ AI identifies unclear image
→ Customer selects Try Another Photo
→ Customer uploads Clear Photo
→ AI understands photo
→ Customer adds Voice Message
→ AI understands additional information
→ Customer adds Video
→ AI understands video
→ AI combines all information
→ Structured Service Request Summary
→ Customer confirms
→ Existing Provider Matching
→ Existing Date & Time Selection
→ Existing Booking Confirmation
→ Provider receives the SAME structured booking request
→ Provider sees AI Booking Summary
→ Provider sees Original Text + Photo + Voice + Video
→ Provider can Read AI Summary
→ Provider can Listen to simulated AI Summary
→ Provider sees booking details in preferred language
→ Accept / Decline
→ Existing booking lifecycle continues
