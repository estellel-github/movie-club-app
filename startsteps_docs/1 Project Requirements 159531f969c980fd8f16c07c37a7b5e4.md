# 1. Project Requirements

## MVP - Core Functionalities and User Stories

### Limited Pre-registration Content

**User Story:**
As a user, I want to view public information about the movie club, such as an About page, a contact page, and a list of previous events, so I can explore the platform before registering or joining.

**Features:**

- Public landing page ("About" page) detailing the club’s purpose and activities.
- Public contact page with a basic form for inquiries, protected with CAPTCHA or rate limiting to prevent spam.
- Public event page displaying past events with details like the movie title, description, and date.
- Implement lazy loading or pagination for efficient handling of large event lists.

**Acceptance Criteria:**

- Users can view the About page and past event details without logging in.
- Contact form submissions are validated and logged, with spam protection in place.
- Event page supports pagination or lazy loading for smooth navigation.

**Backend Dependency:**
Yes (Store and fetch event details; validate and log contact form submissions).

### User Authentication

**User Story:**
As a potential club member, I want to sign up with an email and password and provide some details about myself, so the admin can review my request and approve or reject my membership.

**Features:**

- User registration with email and password.
- Additional intro_msg field to explain the user’s reason for joining or connection to the club.
- Passwords are securely hashed using bcrypt and stored in the database.
- Accounts remain suspended until approved by an admin.
- Admin sends a manual email with an activation link for approved accounts.
- Clicking the activation link activates the account, allowing the user to log in.
- Use JWT for session persistence.
- Implement CAPTCHA or rate limiting during login and registration to prevent brute force attacks.

**Acceptance Criteria:**

- Users can sign up with a valid email, password, and intro_msg.
- Admins receive notifications of new user sign-ups.
- Users cannot log in until they click the admin-provided activation link.
- Failed login attempts are limited per session/IP.

**Backend Dependency:**
Yes (User account management, secure password storage, JWT-based session handling, activation link generation and validation).

### Registered User Actions

**User Story:**
As a registered user, I want to RSVP to events, view updates, and interact with event threads, so I can actively participate in the movie club.

**Features:**

- Display a full event list for registered users, including movie title, description, date, and RSVP status.
- Home/update feed with posts for actions like:
    - New user joining
    - Event created/updated
    - Host assigned
    - RSVPs and comments added
- RSVP to events and add/remove attendance.
- Comment on event threads.
- View and edit personal profile information.
- Delete account (anonymizes associated data).

**Acceptance Criteria:**

- Users can RSVP to events and see their attendance status.
- Users can comment on event threads.
- Profile changes reflect immediately in the database.
- Deleted profiles anonymize associated data while retaining event history.

**Backend Dependency:**
Yes (RSVP and comment tracking, profile management, audit logs for user actions).

### Movie Entry

**User Story:**

As a host or admin, I want to add, update, and manage movie in the database, so they can be associated with events or displayed to users.

**Features:**

- View a list of all movie in the database.
- Hosts or admins can:
    - Add new movies with details such as title, director, year, runtime, description, image URL.
    - Update movie details if needed.
    - Delete movies that are no longer relevant or duplicated.

**Acceptance Criteria:**

- Hosts/admins can perform CRUD operations on movies.
- Movies are correctly linked to events when specified.
- Users can view the movie list without editing permissions.

**Backend Dependency:**

Yes (CRUD operations for movies in the database).

Yes (CRUD operations for movies in the database).

### Event Management

**User Story:**
As an event host or admin, I want to create and manage events, assign hosts, and oversee attendance, so I can organize and facilitate club activities.

**Features:**

- Create and manage events with details like movie title, description, date/time, location, host, and maximum attendees.
- Assign or unassign event hosts.
- Waitlist system for events that are full:
    - Users are auto-promoted to the attendee list when spots open.
    - Notify users when promoted from the waitlist.

**Acceptance Criteria:**

- Hosts/admins can create, update, and delete events.
- RSVP and waitlist functionalities work as expected, with automatic waitlist promotion.
- Notifications are sent for waitlist promotions.

**Backend Dependency:**
Yes (Event creation, host assignment, waitlist management, notifications).

### Admin Account Management

**User Story:**
As an admin, I want to approve or reject new user accounts, manage roles, and reset passwords, so I can ensure the club remains secure and organized.

**Features:**

- Approve or reject user accounts (accounts remain suspended until approved).
- Generate and send activation links for approved accounts.
- Grant roles to users (e.g., normal user, host, or admin).
- Suspend or delete accounts (anonymizes associated data).
- Reset passwords for users (manual email in MVP; automated in later versions).

**Acceptance Criteria:**

- Admins can view pending user requests and approve/reject them with a reason.
- Activation links allow users to activate and access their accounts.
- Role changes reflect immediately in the system.
- Suspended users cannot interact with the platform.

**Backend Dependency:**
Yes (User role management, account approval, suspension, and activation link handling).

---

## v2

### Movie Info API Integration

**User Story:**
As a user, I want to view detailed movie information for events or nominations, so I can learn more about the movies discussed.

**Features:**

- Integrate with e.g. IMDB API to fetch movie info.
- Cache API responses to reduce rate limits and improve performance.

**Acceptance Criteria:**

- Movie details are displayed alongside events or nominations.
- Fallback message shown if API fails.

**Backend Dependency:**
Yes (Fetch and cache movie details).

**API Dependency:**
Yes (e.g. IMDB API).

### Nomination/Voting Feature

**User Story:**
As a user, I want to nominate and vote on movies for future events, so I can help decide what the club reads next.

**Features:**

- Users can nominate one movie per round.
- Voting system with secret ballots; results revealed after voting ends.
- Handle ties with a random selection process.

**Acceptance Criteria:**

- Users can submit nominations if the movie is not already in the database.
- Admins can manage nominations (approve, edit, or delete).
- Users can cast and edit votes during voting periods.

**Backend Dependency:**
Yes (Nomination and voting management).

**API Dependency:** Yes, to fech movie info for Nomination (e.g. IMDB API).

---

## v3

### Notifications

**User Story:**
As a user, I want to receive real-time notifications about important updates, so I can stay informed.

**Features:**

- In-app notifications for updates like event changes, RSVP promotions, or voting deadlines.
- Implement long-polling or WebSocket readiness for real-time updates.

**Acceptance Criteria:**

- Notifications are grouped and displayed in-app.
- System supports future WebSocket integration.

**Backend Dependency:**
Yes (Notification system, WebSocket readiness).

### Email Notifications

**User Story:**
As a user, I want to receive email notifications about major updates, so I can stay informed even when offline.

**Features:**

- Email notifications for key updates (RSVP confirmations, account approvals, etc.).
- Users can opt in/out via profile settings.

**Acceptance Criteria:**

- Emails are sent for specific trigger events.
- Users can manage email preferences.

**Backend Dependency:**
Yes (Email triggers and preferences management).

---

## Summary of Dependencies

| **Feature** | **Backend Dependency** | **API Dependency** | **Notes** |
| --- | --- | --- | --- |
| Public Content | ✅ | ❌ | Fetch events, validate/log contact forms. |
| User Authentication | ✅ | ❌ | Secure user management and session handling. |
| Registered User Actions | ✅ | ❌ | Profile, RSVP, and comment tracking. |
| Event Management | ✅ | ❌ | Waitlist and host assignment logic. |
| Admin Account Management | ✅ | ❌ | Account approval, roles, and suspension. |
| Movie Entry | ✅ | ❌ | CRUD operations for managing movie records. |
| Movie Info API | ✅ | ✅ | Fetch and cache movie data (e.g. IMDB API) |
| Nomination/Voting | ✅ | ✅ | Manage nominations and votes. |
| Notifications | ✅ | ❌ | Group and display notifications. |
| Email Notifications | ✅ | ❌ | Send email updates for RSVPs, activations. |