# Movie Club Manager

**REF NEWS APP:**

[https://github.com/StartSteps-Digital-Education-GmbH/Course-Navigator/tree/56ab70f120431650478cde85e25ebef994e54846/Curriculum/05. Full-Stack TypeScript Development/NEWS_APP](https://github.com/StartSteps-Digital-Education-GmbH/Course-Navigator/tree/56ab70f120431650478cde85e25ebef994e54846/Curriculum/05.%20Full-Stack%20TypeScript%20Development/NEWS_APP)

# Tech Stack

- [x]  **Version Control/ Repo:**
    - [x]  Git
    - [x]  GitHub
- [ ]  **Backend:**
    - [x]  NodeJS
    - [x]  Express
    - [x]  TypeScript
    - [x]  Zod
    - [x]  Jest
    - [x]  JWT / Argon2
- [ ]  **Database:**
    - [x]  PostgreSQL
    - [ ]  Supabase
    - [x]  TypeORM
- [ ]  **Containerization:**
    - [x]  Docker Compose
- [ ]  **Frontend:**
    - [ ]  React (Vite)
    - [ ]  TypeScript
    - [ ]  Astro for public pages
- [ ]  **UI:**
    - [ ]  Tailwind
    - [ ]  Shadcn
- [ ]  **Deployment:**
    - [ ]  DigitalOcean
    - [ ]  (Coolify?)

# MVP

## Core Functionalities

### Limited Pre-registration Content

- Public landing page (”About” page) - Astro
- Public contact page - Astro
- Public Event page (Pre-registration) (Title, Description, Date only) - Astro
    - Functions as a list of movies watched previously
- Consider lazy loading or pagination for the public event list to handle long lists efficiently.
- Add a contact form with basic spam protection (e.g., CAPTCHA, rate limiting).

### User authentication

- Users sign up with an email and password. Should also write a comment to explain who they are (if known to the admin) and/or some reasons that they would like to join the club.
    - Passwords are securely hashed and stored in the database.
    - Use a secure hashing algorithm - Argon2.
    - Use JWT for session persistence, storage in HTTP-only cookies.
    - Enforce strong passwords (e.g., at least 8 characters, a mix of letters, numbers, and symbols).
    - Implement rate limiting or CAPTCHA to prevent brute force attacks.
- By default, user account is created as suspended and needs to be activated by admin.
- **Auth Flow Details**
    
    **Sign-Up Flow**
    
    1. **Frontend**: Provide a simple registration form for email and password.
    2. **Backend**:
        - Validate email format and password strength.
        - Hash the password using bcrypt before storing it in the database:
            
            ```tsx
            import bcrypt from 'bcrypt';
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
            ```
            
        - Store the hashed password and email in the database (recheck for TypeORM)
    3. **Security Tips**:
        - Enforce strong passwords (e.g., at least 8 characters, a mix of letters, numbers, and symbols).
        - Implement rate limiting or CAPTCHA to prevent brute force attacks.
    
    **Login Flow**
    
    1. **Frontend**: Provide a login form for email and password.
    2. **Backend**:
        - Verify the user's email exists in the database.
        - Compare the submitted password with the hashed password using bcrypt:
            
            ```tsx
            const isMatch = await bcrypt.compare(plainTextPassword, storedHashedPassword);
            if (!isMatch) {
              return res.status(401).json({ message: 'Invalid email or password' });
            }
            ```
            
        - If valid, issue a **JWT** for session persistence:
            
            ```tsx
            import jwt from 'jsonwebtoken';
            
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
              expiresIn: '1h',
            });
            res.json({ token });
            ```
            
    3. **Session Options**:
        - **HTTP-only cookies**:
            - Store the token in a secure, HTTP-only cookie.
            - Provides built-in protection against XSS attacks.
    
    **Logout Flow**
    
    1. **Frontend**: Provide a "Logout" button that clears the token (from cookies or storage).
    2. **Backend** (Optional): Implement a blacklist for invalidated tokens if required for immediate logout.
    
    **Password Reset Flow (Optional for MVP)**
    
    1. Allow users to request a password reset.
    2. Generate a time-limited one-time token (JWT) for resetting the password.
    3. Provide a password reset form linked to the token.
- **Security Enhancements**
    1. **Rate Limiting**:
        - Prevent brute force attacks using libraries like **express-rate-limit**:
            
            ```tsx
            typescript
            Copier le code
            import rateLimit from 'express-rate-limit';
            
            const loginLimiter = rateLimit({
              windowMs: 15 * 60 * 1000, // 15 minutes
              max: 5, // Limit each IP to 5 login attempts per window
              message: 'Too many login attempts. Please try again later.',
            });
            
            app.post('/login', loginLimiter, loginHandler);
            
            ```
            

### Registered User Actions

- Display registered Event list (Full view, for registered users)
- Display Registered Home/ Update feed, including posts when:
    - New user joined
    - Event created
    - Event updated
    - Main host assigned
    - User adds RSVP
    - Comment is added on event thread
- RSVP to an event
- Comment on an event thread
- Display user profile (own or others)
- Edit own profile info
- Request password reset (in MVP: admin sends a manual email)
- Delete own profile (anonymizes associated data)

### Movie Entry

- All users can:
    - Display the list of movies in the database
- Hosts or admin can:
    - Perform CRUD operations on movie entries in the database

### Event Management

- All users can:
    - RSVP to an event’s attendance list (add attendance, remove attendance)
    - OR add themselves to event waitlist if attendance list is full
    - Users are auto-promoted to the attendee list when someone cancels. (Consider notifying users when they are promoted from the waitlist.)
    - Either way, the list is defined based on time of action (and updated if users remove their wish to attend)
- Hosts or admin can:
    - Assign / unassign a responsible host (all hosts if left empty)
    - Create/manage events
        - Set movie, date/time, host, location, additional event details
        - Set max number of attendees possible

### **Admin Account Management**

- Admin can perform account management for other users:
    - Accept or reject new user account (keep suspended or activate and send manual email with activation link (temporary token) to confirm)
        - Implementation Details
            
            The admin activation process can effectively double as an email verification step. Here's how it could work:
            
            1. **Admin Approval and Email Creation**:
                - The admin approves the user's account in the admin dashboard and generates an activation link.
                - This activation link contains a unique, time-limited token tied to the user's account.
            2. **Email Content**:
                - The admin sends a manual email (via a preferred email service) with the activation link.
                - The email explains the purpose of the link and provides a call-to-action (e.g., "Click here to activate your account and start exploring the club!").
            3. **Activation Process**:
                - When the user clicks the link, the backend verifies the token and activates the account.
                - After activation, the user can log in and access the platform.
            4. **Security Considerations**:
                - The activation token should expire after a set time (e.g., 24–48 hours).
                - Log token usage in the audit trail to track activation attempts.
    - Grant roles to users (typically normal user or event host. Can assign other admin role manually for backup)
    - Suspend account (account suspension prevents user from interacting, their data is not deleted. They need to contact admin to request reactivation or deletion)
    - Delete account (anonymizes associated data)
    - Reset password for others (in MVP: send a manual email. Later: implement proper email-based features (like reset passwords) if/when mailer is operational).

## Permissions by role

|  | Unregistered User | Suspended User | Registered User | Event Host | Admin |
| --- | --- | --- | --- | --- | --- |
| Display public landing page | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| Display Public Event list | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| Display Home/Update feed  | No | No | **Yes** | **Yes** | **Yes** |
| Display Registered Event list | No | No | **Yes** | **Yes** | **Yes** |
| RSVP to an event (or be added to waiting list) | No | No | **Yes** | **Yes** | **Yes** |
| Add a comment to an event | No | No | **Yes** | **Yes** | **Yes** |
| V2 Nominate a movie for future voting rounds | No | No | **Yes** | **Yes** | **Yes** |
| V2 Vote for movie in current voting round | No | No | **Yes** | **Yes** | **Yes** |
| Display other users' profiles | No | No | **Yes** | **Yes** | **Yes** |
| Display own user profile | No | **Yes** | **Yes** | **Yes** | **Yes** |
| Edit own profile info | No | **Yes** | **Yes** | **Yes** | **Yes** |
| Reset own password | No | **Yes** | **Yes** | **Yes** | **Yes** |
| Choose new password | No | **Yes** | **Yes** | **Yes** | **Yes** |
| Create events | No | No | No | **Yes** | **Yes** |
| Manage events | No | No | No | **Yes** | **Yes** |
| Create account for others (email invitation) | No | No | No | No | **Yes** |
| Suspend account for others (ban) | No | No | No | No | **Yes** |
| Reset password for others | No | No | No | No | **Yes** |

# v2

## Movie Info API

- Connect to an API to retrieve movie details (title, description, cover image)…  = e.g. IMDB API

## Nomination/Voting Feature

- Users
    - Nominate a movie for future voting rounds (limited to one submission per user per round. If movie doesn’t exist in DB yet, user can add a movie to DB. Submission is approved automatically on a trust basis)
    - Vote for movie in current voting round (single choice, possible to edit before voting round gets closed, results secret until voting round closes. In case of tie, random selection of winning movie by the system)
    - Comment in a voting round thread
- Hosts/admins:
    - Assign / unassign a responsible host (all hosts if left empty)
    - Manage voting round (open, close, check/edit movie details, delete movie (e.g. duplicate))
- Automatic approval based on trust but:
    - Allow admins to review nominations (e.g., for inappropriate submissions).
    - Notify users if their movie nomination is rejected (optional).

# v3

## (v2 or v3) Password Reset

- Add email-based features (like reset passwords) once mailer is operational.
- **Email Verification** (Optional):
    - Require users to verify their email before accessing the app (e.g., by sending a verification link). You can defer this until you set up a mailer.
1. **Two-Factor Authentication (Optional)**:
    - Add 2FA with a time-based one-time password (TOTP) library like **speakeasy** if you need extra security later.

## In-App Notifications

- Implement in-app notifications
    - *“Long-polling is fine for simplicity, but it consumes more resources than WebSockets. WebSockets could be introduced in a future iteration if performance becomes an issue.”*
- Use **Redis Pub/Sub** or a similar system to broadcast events to WebSocket connections.
- Ensure notifications are grouped (e.g., one per event update instead of multiple).

- More details:
    
    "Introduce WebSocket readiness" means designing your application in a way that it can easily integrate WebSockets later if you decide to switch from polling (or long-polling) to real-time communication for notifications, updates, or other features.
    
    ### Why Consider WebSocket Readiness?
    
    - **Polling Limitations**: Polling sends repeated requests to the server at set intervals, which can be inefficient and cause unnecessary load on both client and server.
    - **WebSockets for Real-Time Updates**: WebSockets establish a persistent connection between the client and server, enabling instant, two-way communication. They're ideal for notifications, chat, or real-time data updates.
    
    ### What It Means Practically
    
    1. **Design Backend for Flexible Communication**:
        - **Polling First**:
            - Implement long-polling or regular polling for notifications as your MVP.
        - **WebSocket-Ready**:
            - Use an abstraction layer (like a service or utility function) for notification handling so you can easily switch to WebSockets later.
            - Plan the backend architecture to support WebSocket endpoints (e.g., with Socket.IO or WebSocket libraries).
    2. **Prepare Frontend for WebSocket Usage**:
        - Ensure the frontend can handle event-driven notifications in the future:
            - Use a centralized state management library (e.g., React Context, Redux) to handle notification updates.
            - Mock WebSocket behavior during development using polling to emulate receiving real-time updates.
    3. **Decouple Notification Logic**:
        - Design the notification system to work independently of how the updates are delivered. For example:
            - Use a single endpoint for fetching notifications (`/api/notifications`), whether via polling or WebSockets.

## Email notifications

- Let user opt in (when filling their profile initially? at any rate in profile settings)
- Clearly define trigger events
- Define frequency/ies (hourly or daily digest?)
- Research: React Email / Resend, SendGrid, PostMark

# Additional Features (dev)

- Set up GitHub Actions for CI/CD
    - Code quality checks (e.g., ESLint, Prettier).
    - Automated builds and tests for Docker containers.
    - + Security scans with Dependabot or Snyk.
    - + Container vulnerability scanning.
- Accessibility Audit (e.g. Lighthouse)
- Security Check & Fix
- Set up logging and monitoring
    - Log application events with Winston or Pino.
    - Monitor errors and performance using Sentry (frontend) and APM tools (backend).
- Set up audit trail
    - Create DB table to store audit logs (user actions, admin actions).
    - Define retention policy (e.g., archive logs after a year).
    - Ensure sensitive data is excluded from logs (e.g., avoid logging passwords, JWTs).
- Set up maintenance plan to regularly update dependencies and security patches
- Set up testing plan (Jest)
    - Unit tests for core logic (e.g., user authentication).
    - Integration tests for critical flows (e.g., event creation + RSVP).
    - Integration tests for API routes.
    - E2E tests with tools like Cypress for user journeys.
- Set up analytics for admins / stats for all users (?)
    - User engagement stats (e.g., RSVP rates, voting participation).
    - Event participation history.
- Write documentation for admins
    - Admin manual: Role management, event creation.
    - Developer setup guide: Local development, Docker setup.
    - Add API documentation (e.g., Swagger or Postman collections).
    - Gather in GitHub Repo, GitHub Books (?)

[1. Project Requirements](1%20Project%20Requirements%20159531f969c980fd8f16c07c37a7b5e4.md)

[2. MVP Main API Ref Draft](2%20MVP%20Main%20API%20Ref%20Draft%20159531f969c980feafc7d8063e6aba56.md)

[3. Initial DB Schema Draft](3%20Initial%20DB%20Schema%20Draft%20159531f969c98023af7bfa63d9431a43.md)

[4. Project Setup](4%20Project%20Setup%2015b531f969c980e98675c1b49f042218.md)

[Backend](Backend%2017e531f969c980c48bedd48bb7189422.md)