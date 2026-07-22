# USTAAD G - Complete Feature Breakdown

## Table of Contents

- [Feature 1: User Registration and Login](#feature-1-user-registration-and-login)
- [Feature 2: Service Request Creation](#feature-2-service-request-creation)
- [Feature 3: Nearby Service Provider Matching](#feature-3-nearby-service-provider-matching)
- [Feature 4: Smart Provider Ranking](#feature-4-smart-provider-ranking)
- [Feature 5: Agent-Based Assistance](#feature-5-agent-based-assistance)
- [Feature 6: Communication (User-Provider Chat)](#feature-6-communication-user-provider-chat)
- [Feature 7: Booking and Scheduling](#feature-7-booking-and-scheduling)
- [Feature 8: Real-Time Service Tracking](#feature-8-real-time-service-tracking)
- [Feature 9: Ratings and Reviews](#feature-9-ratings-and-reviews)
- [Feature 10: Service History](#feature-10-service-history)
- [Feature 11: Provider Dashboard](#feature-11-provider-dashboard)
- [Feature 12: Voice-Powered Everything](#feature-12-voice-powered-everything-multi-language)
- [Feature 13: Home Renovation Planning](#feature-13-home-renovation-planning)
- [Feature 14: Predictive Maintenance](#feature-14-predictive-maintenance)
- [Feature 15: Multimodal Damage Assessment](#feature-15-multimodal-damage-assessment)
- [Feature 16: Autonomous Profile Optimization Agent](#feature-16-autonomous-profile-optimization-agent)
- [Feature 17: Proof-of-Work Verification](#feature-17-proof-of-work-verification)
- [Feature 18: Smart Dynamic Pricing Engine](#feature-18-smart-dynamic-pricing-engine)
- [Feature 19: Peak Hours Prediction and Live Heatmap](#feature-19-peak-hours-prediction-and-live-heatmap)
- [Feature 20: Fake Review Detection System](#feature-20-fake-review-detection-system)
- [Feature 21: Anomaly Detection for Fraud Prevention](#feature-21-anomaly-detection-for-fraud-prevention)
- [Feature 22: Smart Rescheduling and Auto-Reminders](#feature-22-smart-rescheduling-and-auto-reminders)
- [Feature 23: Dynamic Scheduling Calendar for Providers](#feature-23-dynamic-scheduling-calendar-for-providers)
- [Feature 24: Badges for User Loyalty and Provider Credibility](#feature-24-badges-for-user-loyalty-and-provider-credibility)
- [Feature 25: Referral Program](#feature-25-referral-program)

---

## Feature 1: User Registration and Login

### Sub-Features

- **Role Selection Screen**
  - User or Provider toggle/selection
  - UI: Two large buttons with icons (User/Provider)

- **Signup Form**
  - Full name input (text field)
  - Email address input (email validation)
  - Phone number input (with country code)
  - Password input (with show/hide toggle)
  - Confirm password input
  - Terms and Conditions checkbox

- **Backend Processing**
  - Password hashing using bcrypt
  - Email/phone uniqueness check in database
  - User record creation in PostgreSQL

- **Verification Flow**
  - OTP generation and sending via SMS/Email
  - OTP input screen (6-digit code)
  - OTP expiry handling (10-15 minutes)
  - Resend OTP functionality

- **Login Flow**
  - Email/phone + password login
  - "Remember me" option
  - Forgot password flow
  - JWT token generation on successful login
  - Refresh token handling

- **Dashboard Access**
  - Token validation middleware
  - Role-based routing (User/Provider dashboards)
  - Session management

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Mobile Frontend | React Native + Expo + TypeScript |
| Forms | React Hook Form + Zod validation |
| Navigation | React Navigation (Stack + Tab) |
| Backend API | NestJS + TypeScript |
| Auth | JWT (access + refresh) + bcrypt |
| Database | PostgreSQL + Prisma ORM |
| Email/SMS | SendGrid / Twilio (free tier) |
| State Management | Zustand |
| Error Tracking | Sentry |

---

## Feature 2: Service Request Creation

### Sub-Features

- **Problem Description Input**
  - Text input with voice-to-text option
  - Auto-suggest categories as user types
  - Character count/limit indicator

- **Category Prediction**
  - ML model predicts category from description
  - Show top 3 predicted categories
  - User confirms or selects correct category
  - Model confidence score display

- **Media Attachment**
  - Photo upload from camera/gallery
  - Video upload (limited duration)
  - Image preview before submission
  - Multiple images support

- **Location Selection**
  - GPS location permission request
  - Manual address entry fallback
  - Map pin placement
  - Saved locations (home, work, etc.)

- **Priority and Urgency**
  - Urgency level selection (Normal/Urgent/Emergency)
  - Preferred service time window
  - Additional notes/comments field

- **Request Submission**
  - Request data validation
  - Save to database (service_requests table)
  - Success confirmation screen
  - Auto-forward to matching engine

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Voice Input | Whisper API (speech-to-text) |
| Text Classifier | scikit-learn (TF-IDF + Logistic Regression) |
| Image Upload | AWS S3 / Cloudflare R2 |
| Map/Geocoding | Leaflet.js + OpenStreetMap + Nominatim |
| Database | PostgreSQL (service_requests table) |
| ML Model Serving | FastAPI / ONNX Runtime |
| Camera Access | Expo Camera / React Native Image Picker |

---

## Feature 3: Nearby Service Provider Matching

### Sub-Features

- **Location Detection**
  - Browser/Device Geolocation API
  - Permission handling (allow/deny)
  - Location accuracy indicator
  - Manual address geocoding fallback

- **Provider Search Query**
  - Category filter matching
  - Radius parameter (start at 5km, expand)
  - Availability filter
  - PostGIS spatial query execution

- **Distance Calculation**
  - Haversine formula implementation
  - Distance display (km/miles)
  - Travel time estimation
  - Sort by distance

- **Results Display**
  - List view with provider cards
  - Map view with pins
  - Provider card details (name, rating, distance, availability)
  - Load more/pagination

- **Filtering Options**
  - Filter by rating (min stars)
  - Filter by price range
  - Filter by languages spoken
  - Filter by verification status

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Location API | Browser Geolocation API |
| Geocoding | Nominatim (OpenStreetMap) |
| Spatial Queries | PostgreSQL + PostGIS |
| Distance Calculation | Haversine formula (self-written) |
| Map Rendering | Leaflet.js |
| UI Components | React Native (FlatList, MapView) |
| State Management | Zustand + TanStack Query |

---

## Feature 4: Smart Provider Ranking

### Sub-Features

- **Score Calculation**
  - Weighted scoring formula (rating, experience, reliability, distance, availability)
  - Bayesian average for cold-start problem
  - Score normalization

- **Ranking Algorithm**
  - Sort providers by final score
  - Tie-breaking logic (distance then availability)
  - Real-time re-ranking on filter change

- **Advanced ML Ranking (Optional)**
  - Learning-to-Rank model (LightGBM Ranker)
  - Training data collection from booking history
  - Model evaluation metrics (NDCG, MAP)

- **Provider Profile Display**
  - Rank position indicator
  - Score breakdown visualization
  - Key strengths highlighted
  - Comparison tool

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Weighted Formula | Python (self-written logic) |
| Bayesian Average | Python (custom implementation) |
| Learning-to-Rank | LightGBM / XGBoost |
| Scoring Service | NestJS microservice |
| Database | PostgreSQL (provider_metrics table) |
| Frontend Display | React Native + Victory/Chart.js |
| ML Pipeline | scikit-learn + pandas |

---

## Feature 5: Agent-Based Assistance

### Sub-Features

- **Intent Detection**
  - NLP model for intent classification (book/ask/complain/cancel)
  - Confidence scoring
  - Fallback to human support

- **Entity Extraction**
  - Named Entity Recognition (spaCy)
  - Extract: service type, urgency, location, time
  - Slot filling validation

- **Dialogue Management**
  - Context-aware conversation flow
  - Missing info detection and questioning
  - Conversation state persistence

- **Multi-turn Conversation**
  - Chat interface with agent
  - Suggested replies/quick actions
  - Message history display
  - Typing indicator

- **Handoff to Booking/Matching**
  - Parameter extraction for booking
  - Seamless transition to feature 3
  - Booking confirmation via agent

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Intent Classifier | Rasa Open Source / spaCy |
| Entity Recognition | spaCy NER (custom trained) |
| Dialogue Management | Rasa Core |
| Chat Interface | React Native Gifted Chat |
| Backend API | NestJS + Rasa integration |
| LLM Fallback | Ollama (Llama 3) / OpenAI API |
| Database | PostgreSQL (conversation_history) |

---

## Feature 6: Communication (User-Provider Chat)

### Sub-Features

- **Chat Interface**
  - Real-time messaging UI
  - Message bubbles with timestamps
  - Read receipts
  - Typing indicator
  - Message status (sent/delivered/read)

- **WebSocket Connection**
  - Persistent connection management
  - Auto-reconnect on network loss
  - Message queuing offline

- **File Sharing**
  - Image sharing in chat
  - Document sharing (PDF, images)
  - File size limits
  - Upload progress indicator

- **Message History**
  - Chat history loading (pagination)
  - Search within conversation
  - Message deletion (for user)

- **Notification System**
  - Push notifications for new messages
  - Email notifications (optional)
  - In-app notification badge
  - Notification preferences

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Real-time | WebSockets (NestJS Gateway) |
| Push Notifications | Firebase Cloud Messaging + APNs |
| Chat UI | React Native Gifted Chat |
| Database | PostgreSQL (messages table) |
| Caching | Redis (recent messages) |
| File Storage | AWS S3 / Cloudflare R2 |
| Background Jobs | BullMQ + Redis |

---

## Feature 7: Booking and Scheduling

### Sub-Features

- **Calendar UI**
  - Date picker (react-datepicker)
  - Time slot grid
  - Provider availability display
  - Duration selection

- **Booking Creation**
  - Service details summary
  - Provider selection confirmation
  - Special instructions field
  - Booking data validation

- **Conflict Prevention**
  - Database transaction/lock on slot
  - Real-time availability check
  - Double-booking prevention
  - Atomic booking operation

- **Confirmation Flow**
  - Booking confirmation screen
  - Email/SMS confirmation to both parties
  - Calendar integration (Google Calendar)
  - Booking reference number

- **Booking Management**
  - View upcoming bookings
  - Cancel booking (with reason)
  - Reschedule request
  - Booking status tracking

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Calendar UI | react-datepicker / FullCalendar.js |
| Database | PostgreSQL (bookings table) |
| Transactions | Prisma transaction API |
| Email | SendGrid (free tier) |
| SMS | Twilio (free tier) |
| Calendar Sync | Google Calendar API (optional) |
| Frontend | React Native DateTimePicker |

---

## Feature 8: Real-Time Service Tracking

### Sub-Features

- **Provider Location Sharing**
  - GPS location permission
  - Periodic location updates (every 5-10s)
  - WebSocket location streaming
  - Battery optimization

- **Status Updates**
  - Status: On the way / Arrived / In progress / Done
  - Manual status update option
  - Status change notifications
  - Estimated arrival time

- **Live Map View**
  - Animated marker movement
  - Route path display
  - ETA countdown timer
  - Zoom to provider automatically

- **Tracking History**
  - Location history log
  - Timeline view of updates
  - Provider location replay

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| GPS | Browser Geolocation API / Expo Location |
| Real-time | WebSockets (reused from chat) |
| Map | Leaflet.js (web) / MapLibre (mobile) |
| Animated Markers | React Native MapView / Leaflet |
| Database | PostgreSQL (location_tracking table) |
| Caching | Redis (last known location) |
| Notifications | FCM (status change alerts) |

---

## Feature 9: Ratings and Reviews

### Sub-Features

- **Review Submission**
  - Star rating (1-5)
  - Text review input
  - Photo attachment option
  - Anonymous toggle

- **Sentiment Analysis**
  - VADER/TextBlob sentiment scoring
  - Sentiment vs rating mismatch detection
  - Flagging inconsistent reviews
  - Review categorization

- **Review Display**
  - Average rating calculation
  - Rating distribution chart
  - Individual review cards
  - Sorting/filtering reviews

- **Review Moderation**
  - Profanity filtering
  - Spam detection
  - Flagged reviews queue
  - Admin review interface

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Rating UI | React Native Star Rating |
| Sentiment Analysis | VADER / TextBlob (Python) |
| Profanity Filter | better-profanity library |
| Database | PostgreSQL (reviews table) |
| ML Service | FastAPI + nltk |
| Moderation Queue | BullMQ + Redis |
| Frontend | React Native + Victory Charts |

---

## Feature 10: Service History

### Sub-Features

- **History List**
  - List of all past bookings
  - Filter by date, category, status
  - Search functionality
  - Pagination (20 per page)

- **Detail View**
  - Booking details page
  - Provider/User info
  - Service description
  - Timeline of events
  - Invoice/Receipt

- **Export Options**
  - PDF export (with free library)
  - CSV download (for analysis)
  - Print functionality
  - Email history option

- **Analytics**
  - Usage statistics
  - Spending summary
  - Service type breakdown
  - Monthly/yearly trends

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| History List | React Native FlatList |
| Filter/Search | PostgreSQL query with indexing |
| PDF Generation | react-native-pdf-lib / pdfkit |
| Analytics Charts | Victory / Chart.js |
| Database | PostgreSQL (service_history view) |
| Export API | NestJS + pdfmake |
| Frontend | React Native with pull-to-refresh |

---

## Feature 11: Provider Dashboard

### Sub-Features

- **Dashboard Overview**
  - Today's bookings summary
  - Weekly/monthly earnings
  - Average rating display
  - Completion rate

- **Booking Management**
  - Upcoming bookings list
  - Booking status update
  - Accept/decline booking
  - Booking calendar view

- **Availability Management**
  - Availability toggle (online/offline)
  - Weekly schedule setting
  - Holiday/Vacation blocking
  - Real-time availability update

- **Performance Charts**
  - Earnings trend (Plotly charts)
  - Rating trend over time
  - Booking volume chart
  - Completion rate graph

- **Profile Management**
  - Edit service offerings
  - Update pricing
  - Profile photo upload
  - Service area management

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Charts | Plotly / Chart.js |
| Calendar | FullCalendar.js |
| Dashboard UI | React Native + NativeWind |
| Analytics | SQL aggregate queries |
| Database | PostgreSQL (provider_analytics) |
| Background Jobs | BullMQ (weekly reports) |
| File Upload | AWS S3 / Cloudflare R2 |

---

## Feature 12: Voice-Powered Everything (Multi-Language)

### Sub-Features

- **Speech-to-Text**
  - Whisper API integration
  - Language detection (Urdu/English/Roman)
  - Real-time transcription
  - Confidence scoring

- **Text-to-Speech**
  - MMS-TTS / Coqui TTS
  - Urdu voice support
  - Voice selection preference
  - Speed control

- **Real-time Translation**
  - NLLB-200 / MarianMT
  - Urdu ↔ English translation
  - Roman Urdu normalization
  - Context-aware translation

- **Voice Commands**
  - "Book a plumber" command
  - Voice search
  - Voice feedback submission
  - Voice appointment scheduling

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Speech-to-Text | Whisper (OpenAI, self-hosted) |
| Text-to-Speech | Meta MMS-TTS / Coqui TTS |
| Translation | NLLB-200 (Hugging Face) |
| Language Detection | fastText / langdetect |
| Roman Urdu Normalizer | Custom dictionary |
| Backend Service | FastAPI (Python) |
| Frontend Integration | Expo Speech / react-native-voice |

---

## Feature 13: Home Renovation Planning

### Sub-Features

- **Project Description**
  - Text/voice description input
  - Room selection dropdown
  - Project type selection
  - Budget range indicator

- **Requirement Extraction**
  - NLP entity extraction (spaCy)
  - Room type, materials, urgency
  - Structured data output

- **Budget Estimation**
  - Regression model (scikit-learn)
  - Location-based cost adjustment
  - Price range generation
  - Cost breakdown display

- **Professional Matching**
  - Required trades identification
  - Multi-provider selection
  - Sequential task planning
  - Timeline generation

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| NLP Extraction | spaCy (custom NER) |
| Budget Model | scikit-learn Regression |
| LLM Planning | Ollama (Llama 3) / OpenAI |
| Database | PostgreSQL (renovation_plans) |
| Frontend | React Native + React Hook Form |
| ML Service | FastAPI + scikit-learn |

---

## Feature 14: Predictive Maintenance

### Sub-Features

- **Service History Analysis**
  - Historical booking data aggregation
  - Feature engineering (time since service)
  - Maintenance pattern identification

- **Prediction Model**
  - Survival analysis (lifelines library)
  - Time-to-event prediction
  - Risk score calculation
  - Model evaluation

- **Reminder System**
  - Predicted service date calculation
  - Automated reminder scheduling
  - Multiple reminder channels (app/email/SMS)
  - User confirmation

- **Asset Management**
  - User asset registration (appliance type, brand, model)
  - Asset service history tracking
  - Asset warranty tracking
  - Asset replacement suggestions

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Survival Analysis | lifelines (Python) |
| Feature Engineering | pandas + numpy |
| Reminder Scheduler | BullMQ + Redis |
| Database | PostgreSQL (assets, maintenance_records) |
| ML Service | FastAPI + lifelines |
| Frontend | React Native + Charts |

---

## Feature 15: Multimodal Damage Assessment

### Sub-Features

- **Photo/Video Upload**
  - Camera access for photo capture
  - Video recording (limited to 15s)
  - Gallery upload option
  - Multiple images support

- **Image Preprocessing**
  - OpenCV image processing
  - Resize, denoise, enhance
  - Keyframe extraction from video
  - Image normalization

- **Vision Analysis**
  - LLaVA/Qwen-VL (vision-language model)
  - Appliance brand/model identification
  - Issue description generation
  - Severity assessment

- **OCR Processing**
  - Tesseract OCR for text detection
  - Serial/model number extraction
  - Brand name recognition
  - Warranty date detection

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Vision Model | LLaVA / Qwen-VL (Hugging Face) |
| Image Processing | OpenCV (Python) |
| OCR | Tesseract (Python) |
| Video Processing | FFmpeg (keyframe extraction) |
| Model Serving | FastAPI + PyTorch |
| Frontend | React Native Expo Camera |
| Storage | AWS S3 / Cloudflare R2 |

---

## Feature 16: Autonomous Profile Optimization Agent

### Sub-Features

- **Performance Data Aggregation**
  - Review data collection
  - Completion rate calculation
  - Response time analysis
  - Service-specific performance

- **Pattern Detection**
  - K-means clustering for specialty identification
  - Performance trend analysis
  - Strength/weakness identification
  - Competitive benchmarking

- **Suggestion Generation**
  - Rule-based suggestion engine
  - Template-based recommendations
  - Personalized suggestions
  - Impact estimation (e.g., "15% more bookings")

- **Provider Interaction**
  - Chat-based suggestion delivery
  - Approval workflow
  - One-click update option
  - Suggestion history

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Clustering | scikit-learn (K-means) |
| Data Aggregation | pandas + PostgreSQL |
| Rule Engine | Custom Python logic |
| Chat Interface | Reused chat system (Feature 6) |
| Background Jobs | APScheduler / BullMQ |
| Database | PostgreSQL (provider_analytics) |
| Frontend | React Native + Gifted Chat |

---

## Feature 17: Proof-of-Work Verification

### Sub-Features

- **Before/After Photo Capture**
  - Before photo at booking start
  - After photo at completion
  - Camera capture with metadata (timestamp, GPS)
  - Photo quality check

- **Object Detection**
  - YOLOv8 object detection
  - Tool/debris identification
  - Missing items detection
  - Spatial relationship analysis

- **Image Comparison**
  - OpenCV SSIM comparison
  - Angle/lighting normalization
  - Structural similarity scoring
  - Tamper detection

- **Verification Decision**
  - Vision-LLM judgement (LLaVA)
  - Pass/fail with explanation
  - Low-confidence to human review
  - Escrow release trigger

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Object Detection | YOLOv8 (Ultralytics) |
| Image Comparison | OpenCV (SSIM) |
| Vision-LLM | LLaVA (Hugging Face) |
| Metadata Extraction | ExifTool / Python PIL |
| Database | PostgreSQL (verification_records) |
| ML Service | FastAPI + PyTorch |
| Frontend | React Native Expo Camera |

---

## Feature 18: Smart Dynamic Pricing Engine

### Sub-Features

- **Provider Voice Note**
  - Voice recording for work description
  - Whisper transcription
  - Duration tracking
  - Audio quality check

- **Feature Extraction**
  - Custom spaCy NER for pricing entities
  - Part names, quantities, time extraction
  - Material cost identification
  - Labor time estimation

- **Missing Info Handling**
  - Information gap detection
  - Automated clarification questions
  - Multi-turn clarification flow
  - Fallback manual entry

- **Price Calculation**
  - Rule-based formula (labor × time + parts)
  - ML regression adjustment
  - Location-based cost adjustment
  - Transparent breakdown

- **User Confirmation**
  - Bill display with breakdown
  - Digital signature capture
  - Payment processing
  - Receipt generation

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Transcription | Whisper (reused) |
| NER | spaCy (custom trained) |
| Pricing Formula | Python (custom logic) |
| ML Adjustment | scikit-learn Regression |
| Signature Capture | react-native-signature-canvas |
| Payment Gateway | Stripe / JazzCash API |
| Database | PostgreSQL (invoices, payments) |

---

## Feature 19: Peak Hours Prediction and Live Heatmap

### Sub-Features

- **Data Collection**
  - Historical booking data aggregation
  - Time-based feature engineering
  - Location-based grouping
  - Demand pattern extraction

- **Forecasting Model**
  - Facebook Prophet time-series model
  - Daily/weekly pattern detection
  - Holiday/event consideration
  - Prediction intervals

- **Geo-Spatial Binning**
  - H3 hexagonal grid generation
  - Booking aggregation per hex
  - Demand intensity calculation
  - Dynamic grid updates

- **Heatmap Visualization**
  - Leaflet.js + Heatmap layer
  - Color-coded intensity
  - Provider heatmap view
  - Time-slider for predictions

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Forecasting | Facebook Prophet (Python) |
| Geo-Binning | H3 (Uber's hexagon library) |
| Map Rendering | Leaflet.js + Heatmap plugin |
| Backend | FastAPI + pandas |
| Database | PostgreSQL + PostGIS |
| Frontend | React Native + react-native-maps |
| Scheduling | APScheduler (daily retraining) |

---

## Feature 20: Fake Review Detection System

### Sub-Features

- **Sentiment Analysis**
  - Pre-trained sentiment model (DistilBERT)
  - Urdu/Roman Urdu sentiment lexicon
  - Sentiment scoring
  - Emotion detection

- **Mismatch Detection**
  - Rating vs sentiment comparison
  - Flag generation logic
  - Confidence scoring
  - Alert queue

- **Pattern Analysis**
  - User review history analysis
  - Temporal pattern detection
  - Bot detection heuristics
  - Review velocity monitoring

- **Verification Queue**
  - Flagged review list
  - Admin review interface
  - Bulk approval/rejection
  - Appeal mechanism

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Sentiment Model | DistilBERT (Hugging Face) |
| Urdu Lexicon | Custom word list (GitHub) |
| Mismatch Logic | Python (rule-based) |
| Admin Interface | React (web panel) |
| Database | PostgreSQL (reviews, flags) |
| ML Service | FastAPI + transformers |
| Frontend | React Native + admin portal |

---

## Feature 21: Anomaly Detection for Fraud Prevention

### Sub-Features

- **Activity Stream**
  - User activity logging
  - Provider activity logging
  - Booking/cancellation events
  - Review events tracking

- **Feature Extraction**
  - Frequency, timing, pattern features
  - Rate calculation (bookings/hour, cancellations)
  - Network features (connections)
  - Statistical features

- **Anomaly Detection**
  - Isolation Forest model
  - Z-score thresholding
  - NetworkX graph analysis
  - Suspicious cluster detection

- **Alert System**
  - Risk score assignment
  - Auto-flagging logic
  - Admin alert generation
  - Account suspension workflow

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Anomaly Model | Isolation Forest (scikit-learn) |
| Graph Analysis | NetworkX (Python) |
| Statistical Baseline | Custom z-score logic |
| Event Streaming | Kafka (optional) / BullMQ |
| Database | PostgreSQL (events, flags) |
| Admin Alerts | Email + in-app notification |
| ML Service | FastAPI + scikit-learn |

---

## Feature 22: Smart Rescheduling and Auto-Reminders

### Sub-Features

- **Cancellation Handling**
  - Cancellation event detection
  - Reason collection
  - Provider availability check
  - Alternative slot calculation

- **Slot Matching**
  - Provider calendar query
  - User preference matching
  - Multiple slot suggestions
  - Real-time availability

- **Rescheduling Flow**
  - Notification to both parties
  - Slot selection interface
  - Booking update atomic operation
  - Confirmation receipt

- **Reminder System**
  - 24h, 1h, 15min reminders
  - Push notification delivery
  - Email/SMS fallback
  - Reminder status tracking

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Slot Matching | Python (rule-based) |
| Task Scheduling | Celery + Redis / BullMQ |
| Notifications | Firebase Cloud Messaging |
| Database | PostgreSQL (bookings, availabilities) |
| Frontend | React Native (calendar views) |
| Email/SMS | SendGrid / Twilio (free tier) |

---

## Feature 23: Dynamic Scheduling Calendar for Providers

### Sub-Features

- **Calendar View**
  - Weekly/Monthly calendar display
  - Drag-and-drop time blocking
  - Color-coded availability
  - Today button navigation

- **Availability Setting**
  - Recurring availability templates
  - One-off exceptions
  - Holiday/Vacation blocking
  - Custom work hours

- **Conflict Management**
  - Real-time availability check
  - Booking conflict prevention
  - Soft-blocking for pending bookings
  - Auto-conflict resolution

- **Calendar Sync**
  - Google Calendar integration
  - Apple Calendar integration
  - Two-way sync option
  - Sync frequency settings

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Calendar UI | FullCalendar.js (web) / React Native Calendar (mobile) |
| Database | PostgreSQL (availability_slots) |
| Transactions | Prisma transactions |
| External Sync | Google Calendar API |
| Frontend | React Native + react-native-calendars |
| Backend API | NestJS + calendar integration |

---

## Feature 24: Badges for User Loyalty and Provider Credibility

### Sub-Features

- **Badge Definitions**
  - Badge criteria configuration
  - Badge categories (loyalty/credibility/skills)
  - Badge icons and descriptions
  - Unlock conditions

- **Rule Engine**
  - Criteria evaluation logic
  - Event-based badge checking
  - Threshold calculations
  - Multi-condition badges

- **Badge Awarding**
  - Automatic badge detection
  - Award notification
  - Badge display on profile
  - Sharing options

- **Badge Display**
  - User profile badges
  - Provider profile badges
  - Badge collection page
  - Badge progress tracking

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Rule Engine | Python (custom logic) |
| Database | PostgreSQL (badges, user_badges) |
| Trigger System | Database triggers / BullMQ |
| Frontend | React Native (badge components) |
| Admin Panel | React (badge management) |
| Notifications | FCM (badge unlocked) |

---

## Feature 25: Referral Program

### Sub-Features

- **Referral Code Generation**
  - Unique code generation (UUID/short-hash)
  - Code distribution (copy link, QR code)
  - Code expiration management
  - Code usage tracking

- **Referral Registration**
  - Referral code entry during signup
  - Code validation
  - Referral relationship tracking
  - Duplicate prevention

- **Reward Management**
  - Reward calculation logic
  - Pending/triggered reward states
  - Reward distribution (points/discount)
  - Reward expiry handling

- **Referral Analytics**
  - Referral success rate
  - Top referrers
  - Geographic distribution
  - Conversion funnel

### Tech Stack Assignment

| Component | Technology |
|-----------|------------|
| Code Generation | Python UUID / custom hash |
| Database | PostgreSQL (referrals table) |
| Reward Logic | Python (business rules) |
| Analytics | SQL + pandas |
| Frontend | React Native (share sheet) |
| Notifications | FCM (reward earned) |
| Background Jobs | BullMQ (reward processing) |

---

## Summary: Complete Feature Breakdown

| Feature | Sub-Features Count | Key Technologies |
|---------|-------------------|------------------|
| 1. User Registration & Login | 6 | NestJS, JWT, bcrypt, PostgreSQL |
| 2. Service Request Creation | 6 | scikit-learn, Whisper, S3 |
| 3. Nearby Provider Matching | 5 | PostGIS, Leaflet, Nominatim |
| 4. Smart Provider Ranking | 4 | LightGBM, Bayesian averaging |
| 5. Agent-Based Assistance | 5 | Rasa, spaCy, Ollama |
| 6. Communication (Chat) | 5 | WebSockets, FCM |
| 7. Booking & Scheduling | 5 | FullCalendar, Prisma |
| 8. Real-Time Service Tracking | 4 | WebSockets, MapLibre |
| 9. Ratings & Reviews | 4 | VADER, TextBlob |
| 10. Service History | 4 | PostgreSQL, PDF generation |
| 11. Provider Dashboard | 5 | Plotly, FullCalendar |
| 12. Voice-Powered Everything | 4 | Whisper, MMS-TTS, NLLB |
| 13. Home Renovation Planning | 4 | spaCy, scikit-learn, Ollama |
| 14. Predictive Maintenance | 4 | lifelines, BullMQ |
| 15. Multimodal Damage Assessment | 4 | LLaVA, YOLOv8, Tesseract |
| 16. Profile Optimization Agent | 4 | K-means, custom rules |
| 17. Proof-of-Work Verification | 4 | YOLOv8, SSIM, LLaVA |
| 18. Smart Dynamic Pricing | 6 | Whisper, spaCy, regression |
| 19. Peak Hours & Heatmap | 4 | Prophet, H3, Leaflet |
| 20. Fake Review Detection | 4 | DistilBERT, rule engine |
| 21. Anomaly Detection | 4 | Isolation Forest, NetworkX |
| 22. Rescheduling & Reminders | 4 | Celery, FCM |
| 23. Dynamic Calendar | 4 | FullCalendar, Google API |
| 24. Badges System | 4 | Rule engine, triggers |
| 25. Referral Program | 4 | UUID, share sheet |

**Total Sub-Features: 112**
