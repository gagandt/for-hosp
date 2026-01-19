# AI Doctor Consultation App - Testing Plan

This guide will walk you through testing every feature of the app. Follow each step carefully.

---

## 1. Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Clerk Authentication (get from https://dashboard.clerk.com)
CLERK_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Turso Database (get from https://turso.tech)
DATABASE_URL="libsql://your-db.turso.io"
DATABASE_TOKEN="your-token"

# OpenAI API (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-xxxxx"

# Admin Email (use your own email for testing admin features)
ADMIN_EMAIL="your-email@example.com"
```

### Database Setup

Run these commands to set up the database:

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations to Turso
npm run db:migrate
```

### Start the App

```bash
npm run dev
```

The app should now be running at: **http://localhost:4000**

---

## 2. Testing Flow Overview

| Flow | Route | What You're Testing |
|------|-------|---------------------|
| Landing Page | `/` | Auth buttons, redirect |
| Dashboard | `/home` | Feature cards, navigation |
| AI Chatbot | `/chatbot` | Chat with AI, message persistence |
| Hospitals | `/hospitals` | View hospitals, open booking modal |
| Bookings | `/bookings` | View bookings, cancel booking |
| Admin Panel | `/admin` | Manage all bookings (admin only) |

---

## 3. Detailed Test Cases

### Test 1: Landing Page (Unauthenticated)

**Route:** `http://localhost:4000/`

**Steps:**
1. Open the app in a new browser (or incognito window)
2. You should NOT be logged in

**Expected Results:**
- [ ] See "AI Health Assistant" title with blue medical cross icon
- [ ] See "Please login to continue" message
- [ ] See two buttons: "Sign In" (blue) and "Sign Up" (outlined)
- [ ] See three feature preview cards (AI Chatbot, Find Hospitals, Book Appointments)

**Screenshot Reference:**
```
+----------------------------------+
|      [+] AI Health Assistant     |
|                                  |
|   Get health guidance from our   |
|   AI assistant and book...       |
|                                  |
|   Please login to continue       |
|   [Sign In]  [Sign Up]           |
|                                  |
|  [Chatbot] [Hospitals] [Booking] |
+----------------------------------+
```

---

### Test 2: Sign Up / Sign In

**Route:** Click "Sign In" or "Sign Up" button on landing page

**Steps:**
1. Click "Sign Up" button
2. Create a new account using email or social login (Google, etc.)
3. Complete the Clerk authentication flow

**Expected Results:**
- [ ] Clerk modal opens for authentication
- [ ] After successful sign up/in, redirected to `/home`
- [ ] If already signed in and visit `/`, should auto-redirect to `/home`

---

### Test 3: Dashboard Home Page

**Route:** `http://localhost:4000/home`

**Prerequisites:** Must be signed in

**Steps:**
1. Navigate to `/home` (should happen automatically after login)
2. Observe the page layout

**Expected Results:**
- [ ] See navbar at top with links: Home, Chatbot, Near Hospitals, My Bookings
- [ ] See user avatar/button in navbar (Clerk UserButton)
- [ ] See "Welcome to AI Health Assistant" heading
- [ ] See three feature cards:
  - AI Health Chatbot (blue icon)
  - Near Hospitals (green icon)
  - My Bookings (purple icon)
- [ ] See "Quick Health Tips" section at bottom
- [ ] Clicking each card navigates to the respective page

**Test Navigation:**
- [ ] Click "AI Health Chatbot" card -> Goes to `/chatbot`
- [ ] Click "Near Hospitals" card -> Goes to `/hospitals`
- [ ] Click "My Bookings" card -> Goes to `/bookings`

---

### Test 4: Navbar Navigation

**Route:** Any dashboard page

**Steps:**
1. Click each link in the navbar

**Expected Results:**
- [ ] "Home" link -> `/home`
- [ ] "Chatbot" link -> `/chatbot`
- [ ] "Near Hospitals" link -> `/hospitals`
- [ ] "My Bookings" link -> `/bookings`
- [ ] Active page link should be highlighted (blue background)
- [ ] Clicking logo/brand also goes to `/home`

---

### Test 5: AI Chatbot - Empty State

**Route:** `http://localhost:4000/chatbot`

**Prerequisites:** Must be signed in, no previous chat history

**Steps:**
1. Navigate to `/chatbot`
2. Observe the empty state

**Expected Results:**
- [ ] See "AI Health Chatbot" heading
- [ ] See empty chat area with message icon
- [ ] See "Start a conversation" prompt
- [ ] See input field at bottom with placeholder "Type your health question..."
- [ ] See "Send" button (disabled when input is empty)

---

### Test 6: AI Chatbot - Sending Messages

**Route:** `http://localhost:4000/chatbot`

**Prerequisites:** Must be signed in, OPENAI_API_KEY must be valid

**Steps:**
1. Type a message: "What are common symptoms of a cold?"
2. Click "Send" button (or press Enter)
3. Wait for AI response

**Expected Results:**
- [ ] Your message appears on the right side (blue bubble)
- [ ] Loading animation appears (three bouncing dots)
- [ ] AI response streams in character by character on left side (gray bubble)
- [ ] Response mentions common cold symptoms
- [ ] Response includes recommendation to see a doctor if symptoms persist
- [ ] Input field clears after sending
- [ ] Messages auto-scroll to bottom

**Test Follow-up:**
1. Send another message: "What should I do if I have a fever?"

**Expected Results:**
- [ ] New message appears below previous conversation
- [ ] AI responds with fever advice
- [ ] Conversation history is maintained

---

### Test 7: AI Chatbot - Message Persistence

**Route:** `http://localhost:4000/chatbot`

**Steps:**
1. After having a conversation, refresh the page (F5)
2. Or navigate away and come back

**Expected Results:**
- [ ] Previous messages are still visible
- [ ] Chat history is loaded from database
- [ ] Can continue the conversation

---

### Test 8: Hospitals Page - Viewing Hospitals

**Route:** `http://localhost:4000/hospitals`

**Prerequisites:** Must be signed in

**Steps:**
1. Navigate to `/hospitals`
2. Observe the hospital cards

**Expected Results:**
- [ ] See "Near Hospitals" heading
- [ ] See 6 hospital cards in a grid layout
- [ ] Each card shows:
  - Hospital name
  - Star rating (visual stars + number)
  - Phone number with phone icon
  - Address with location icon
  - Operating hours with clock icon
  - "Book Appointment" button

**Verify Hospital Data:**
| Hospital Name | Rating | Hours |
|---------------|--------|-------|
| City General Hospital | 4.5 | 8:00 AM - 8:00 PM |
| St. Mary's Medical Center | 4.8 | 7:00 AM - 10:00 PM |
| Community Health Clinic | 4.2 | 9:00 AM - 6:00 PM |
| Memorial Hospital | 4.6 | Open 24 Hours |
| Sunrise Medical Center | 4.3 | 6:00 AM - 9:00 PM |
| Valley Health Hospital | 4.7 | 8:00 AM - 7:00 PM |

---

### Test 9: Booking Modal - Opening

**Route:** `http://localhost:4000/hospitals`

**Steps:**
1. Click "Book Appointment" on any hospital card (e.g., City General Hospital)

**Expected Results:**
- [ ] Modal overlay appears (dark background)
- [ ] Modal shows "Book Appointment" title
- [ ] Hospital name displayed below title
- [ ] Form has three fields:
  - Preferred Date (date picker)
  - Preferred Time (time picker)
  - Reason for Visit (text area)
- [ ] Two buttons: "Cancel" and "Book Now"

---

### Test 10: Booking Modal - Validation

**Route:** Booking modal on `/hospitals`

**Steps:**
1. Try to submit form without filling any fields
2. Try to select a date in the past

**Expected Results:**
- [ ] Form shows validation errors for required fields
- [ ] Date picker should not allow past dates (min date = today)
- [ ] "Book Now" button is enabled (validation happens on submit)

---

### Test 11: Booking Modal - Successful Booking

**Route:** Booking modal on `/hospitals`

**Steps:**
1. Select a future date (e.g., tomorrow)
2. Select a time (e.g., 10:00 AM)
3. Enter reason: "Annual checkup and general health consultation"
4. Click "Book Now"

**Expected Results:**
- [ ] Button shows "Booking..." while processing
- [ ] After success, automatically redirected to `/bookings`
- [ ] New booking appears in the list

---

### Test 12: Booking Modal - Cancel

**Route:** Booking modal on `/hospitals`

**Steps:**
1. Open booking modal
2. Click "Cancel" button

**Expected Results:**
- [ ] Modal closes
- [ ] No booking created
- [ ] Back to hospitals page

---

### Test 13: My Bookings - Empty State

**Route:** `http://localhost:4000/bookings`

**Prerequisites:** Must be signed in, no bookings yet

**Steps:**
1. Navigate to `/bookings` before creating any bookings

**Expected Results:**
- [ ] See "My Bookings" heading
- [ ] See empty state with calendar icon
- [ ] See "No bookings yet" message
- [ ] See "Browse Hospitals" button
- [ ] Clicking button goes to `/hospitals`

---

### Test 14: My Bookings - Viewing Bookings

**Route:** `http://localhost:4000/bookings`

**Prerequisites:** Must have at least one booking

**Steps:**
1. Navigate to `/bookings` after creating a booking

**Expected Results:**
- [ ] See booking card(s) in a grid
- [ ] Each card shows:
  - Hospital name
  - Hospital address
  - Status badge (yellow "Pending")
  - Date with calendar icon
  - Time with clock icon
  - Reason with note icon
  - "Cancel Booking" button (for pending bookings)

---

### Test 15: My Bookings - Cancel Booking

**Route:** `http://localhost:4000/bookings`

**Prerequisites:** Must have a pending booking

**Steps:**
1. Find a booking with "Pending" status
2. Click "Cancel Booking" button
3. Confirm the cancellation in the browser dialog

**Expected Results:**
- [ ] Browser confirmation dialog appears
- [ ] Button shows "Cancelling..." while processing
- [ ] Status badge changes from yellow "Pending" to red "Cancelled"
- [ ] "Cancel Booking" button disappears
- [ ] Booking remains visible but cannot be cancelled again

---

### Test 16: Admin Panel - Access Denied (Non-Admin)

**Route:** `http://localhost:4000/admin`

**Prerequisites:** Must be signed in with an email that is NOT the ADMIN_EMAIL

**Steps:**
1. Navigate to `/admin`

**Expected Results:**
- [ ] See "Access Denied" message
- [ ] See lock icon
- [ ] See "You don't have permission to access this page"
- [ ] Cannot see any booking data

---

### Test 17: Admin Panel - Admin Access

**Route:** `http://localhost:4000/admin`

**Prerequisites:** Must be signed in with the email set as ADMIN_EMAIL in `.env`

**Steps:**
1. Sign out and sign in with admin email
2. Navigate to `/admin`

**Expected Results:**
- [ ] See "Admin Panel" heading
- [ ] See "Manage all hospital bookings" subheading
- [ ] See stats cards showing counts:
  - Pending Bookings (yellow)
  - Confirmed Bookings (green)
  - Cancelled Bookings (red)
- [ ] See all bookings from all users grouped by status

---

### Test 18: Admin Panel - Viewing Booking Details

**Route:** `http://localhost:4000/admin`

**Prerequisites:** Must be admin, must have bookings in the system

**Steps:**
1. Observe the booking cards

**Expected Results:**
- [ ] Each card shows:
  - Hospital name and address
  - Status badge
  - **User info box** (gray background) showing:
    - User's name
    - User's email
  - Date, time, and reason
  - Action buttons (for pending bookings)

---

### Test 19: Admin Panel - Confirm Booking

**Route:** `http://localhost:4000/admin`

**Prerequisites:** Must be admin, must have a pending booking

**Steps:**
1. Find a "Pending" booking
2. Click the green "Confirm" button

**Expected Results:**
- [ ] Button shows "..." while processing
- [ ] Booking moves from "Pending Bookings" section to "Confirmed Bookings" section
- [ ] Status badge changes to green "Confirmed"
- [ ] Action buttons disappear (can't change confirmed booking)
- [ ] Stats update (Pending count decreases, Confirmed count increases)

**Verify on User Side:**
1. Sign out of admin account
2. Sign in as the user who made the booking
3. Go to `/bookings`

**Expected Results:**
- [ ] User sees their booking with green "Confirmed" status

---

### Test 20: Admin Panel - Cancel Booking (Admin)

**Route:** `http://localhost:4000/admin`

**Prerequisites:** Must be admin, must have a pending booking

**Steps:**
1. Find a "Pending" booking
2. Click the red "Cancel" button
3. Confirm the cancellation

**Expected Results:**
- [ ] Browser confirmation dialog appears
- [ ] Button shows "..." while processing
- [ ] Booking moves to "Cancelled Bookings" section
- [ ] Status badge changes to red "Cancelled"
- [ ] Stats update accordingly

---

### Test 21: Sign Out

**Route:** Any page while signed in

**Steps:**
1. Click on user avatar in navbar
2. Click "Sign Out" in the dropdown

**Expected Results:**
- [ ] Signed out successfully
- [ ] Redirected to landing page (`/`)
- [ ] Trying to access protected routes redirects to sign-in

---

## 4. Error Scenarios to Test

### Test E1: Network Error During Chat

**Steps:**
1. Disable internet connection
2. Try to send a chat message

**Expected Results:**
- [ ] Error message appears in chat: "Sorry, I encountered an error. Please try again."

### Test E2: Invalid OpenAI API Key

**Steps:**
1. Set an invalid OPENAI_API_KEY in `.env`
2. Restart the server
3. Try to send a chat message

**Expected Results:**
- [ ] Error response from API
- [ ] Error message appears in chat

### Test E3: Protected Route Without Auth

**Steps:**
1. Sign out
2. Try to directly access `/home`, `/chatbot`, `/hospitals`, `/bookings`, or `/admin`

**Expected Results:**
- [ ] Redirected to Clerk sign-in page
- [ ] Cannot access protected content

---

## 5. Responsive Design Testing

Test on different screen sizes:

| Screen Size | What to Check |
|-------------|---------------|
| Desktop (1200px+) | 3-column grid for hospitals/bookings |
| Tablet (768px-1199px) | 2-column grid |
| Mobile (<768px) | 1-column grid, navbar stacks properly |

---

## 6. Testing Checklist Summary

### Landing & Auth
- [ ] Landing page displays correctly
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Redirect to `/home` after login

### Dashboard
- [ ] Home page displays feature cards
- [ ] Navigation works
- [ ] Active link highlighting works

### Chatbot
- [ ] Empty state displays
- [ ] Can send messages
- [ ] AI responds with streaming
- [ ] Messages persist after refresh
- [ ] Health-focused responses

### Hospitals
- [ ] 6 hospitals display
- [ ] Star ratings show correctly
- [ ] Hours format correctly (12-hour)
- [ ] "Open 24 Hours" shows for Memorial Hospital

### Booking Flow
- [ ] Modal opens on "Book Appointment"
- [ ] Form validation works
- [ ] Can create booking
- [ ] Redirects to bookings after success

### My Bookings
- [ ] Empty state works
- [ ] Bookings display correctly
- [ ] Can cancel pending bookings
- [ ] Status badges are correct colors

### Admin Panel
- [ ] Non-admin gets "Access Denied"
- [ ] Admin sees all bookings
- [ ] Can confirm bookings
- [ ] Can cancel bookings
- [ ] Stats update correctly

---

## 7. Quick Reference - All Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with sign in/up |
| `/sign-in` | Public | Clerk sign-in page |
| `/sign-up` | Public | Clerk sign-up page |
| `/home` | Protected | Dashboard home |
| `/chatbot` | Protected | AI chat interface |
| `/hospitals` | Protected | Hospital listing |
| `/bookings` | Protected | User's bookings |
| `/admin` | Protected + Admin | Admin booking management |

---

## Need Help?

If something isn't working:

1. **Check the console** (browser DevTools -> Console) for errors
2. **Check terminal** where `npm run dev` is running for server errors
3. **Verify `.env`** has all required variables
4. **Run `npm run typecheck`** to check for TypeScript errors
5. **Run `npm run check`** to check for linting issues
