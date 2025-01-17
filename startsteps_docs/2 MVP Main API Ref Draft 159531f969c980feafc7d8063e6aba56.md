# 2. MVP Main API Ref Draft

⚠️ **This is just an initial draft for coding the backend APIs. For up-to-date status, refer to code. For presentation purposes or portfolio, will need to generate API docs based on latest code anyway**

# **Authentication API**

**Base URL**: `/api/users`

| **Endpoint** | **Method** | **Description** | **Auth** |
| --- | --- | --- | --- |
| `/register` | POST | Register a new user | ❌ |
| `/login` | POST | Login and get a JWT token | ❌ |
| `/activate/:token` | GET | Activate a user account | ❌ |

## **POST /register**

Registers a new user.

- **Request**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "intro_msg": "Excited to join!"
}

```

- **Response**

```json
{
  "message": "User registered successfully",
  "userId": "abc123"
}

```

- **Errors**
    - `400`: Validation errors (e.g., invalid email, weak password).
    - `409`: Email already exists.

---

## **POST /login**

Authenticates a user and returns a JWT token.

- **Request**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}

```

- **Response**

```json
{
  "token": "jwt-token-here"
}

```

- **Errors**
    - `401`: Invalid email/password.

---

## **GET /activate/:token**

Activates a user account based on the activation token.

- **Request**
    
    No body required.
    
- **Response**

```json
{
  "message": "Account activated successfully"
}

```

- **Errors**
    - `400`: Invalid or expired token.
    - `404`: User not found.

---

# **Movies API**

**Base URL**: `/api/movies`

## **GET /**

Fetches a list of all movies.

- **Response**:
    
    ```json
    [
        {
            "movieId": "movie123",
            "title": "Inception",
            "description": "A sci-fi thriller directed by Christopher Nolan.",
            "director": "Christopher Nolan",
            "releaseYear": 2010,
            "coverImageUrl": "https://example.com/image.jpg",
            "addedBy": "user123",
            "createdAt": "2024-12-01T10:00:00Z",
            "updatedAt": "2024-12-10T14:00:00Z"
        }
    ]
    
    ```
    
- **Errors**:
    - `500`: Internal server error.

---

## **POST /create**

Allows admins or hosts to add a new movie.

- **Request**:
    
    ```json
    {
        "title": "Inception",
        "description": "A sci-fi thriller directed by Christopher Nolan.",
        "director": "Christopher Nolan",
        "releaseYear": 2010,
        "coverImageUrl": "https://example.com/image.jpg"
    }
    
    ```
    
- **Response**:
    
    ```json
    {
        "message": "Movie added successfully",
        "movieId": "movie123"
    }
    
    ```
    
- **Errors**:
    - `400`: Validation error (e.g., missing required fields, invalid data).
    - `401`: Unauthorized (only admins or hosts can add movies).

---

## **GET /:movieId**

Fetches details of a specific movie by its ID.

- **Response**:
    
    ```json
    {
        "movieId": "movie123",
        "title": "Inception",
        "description": "A sci-fi thriller directed by Christopher Nolan.",
        "director": "Christopher Nolan",
        "releaseYear": 2010,
        "coverImageUrl": "https://example.com/image.jpg",
        "addedBy": "user123",
        "createdAt": "2024-12-01T10:00:00Z",
        "updatedAt": "2024-12-10T14:00:00Z"
    }
    
    ```
    
- **Errors**:
    - `404`: Movie not found.

---

## **PATCH /:movieId/update**

Allows admins or hosts to update an existing movie.

- **Request** (Partial update is allowed):
    
    ```json
    {
        "title": "The Dark Knight",
        "description": "Another masterpiece by Christopher Nolan."
    }
    
    ```
    
- **Response**:
    
    ```json
    {
        "message": "Movie updated successfully",
        "movieId": "movie123"
    }
    
    ```
    
- **Errors**:
    - `400`: Validation error (e.g., invalid field format).
    - `401`: Unauthorized (only admins or hosts can update movies).
    - `404`: Movie not found.

---

## **DELETE /:movieId/delete**

Allows admins or hosts to delete a movie.

- **Response**:
    
    ```json
    {
        "message": "Movie deleted successfully",
        "movieId": "movie123"
    }
    
    ```
    
- **Errors**:
    - `401`: Unauthorized (only admins or hosts can delete movies).
    - `404`: Movie not found.

---

# **Event Management API**

**Base URL**: `/api/events`

| **Endpoint** | **Method** | **Description** | **Auth** |
| --- | --- | --- | --- |
| `/` | GET | Fetch all events | ✔ |
| `/:eventId` | GET | Fetch event details | ✔ |
| `/create` | POST | Create a new event | ✔ |
| `/update/:eventId` | PATCH | Update event details | ✔ |
| `/delete/:eventId` | DELETE | Delete an event | ✔ |
| `/rsvp/:eventId` | POST | RSVP to an event | ✔ |
| `/waitlist/:eventId` | POST | Join the waitlist for a full event | ✔ |

## **GET /**

Fetches all events for the user.

- **Query Parameters**
    - `status` (optional): Filter by event status (e.g., `upcoming`, `past`).
- **Response**

```json
[
  {
    "eventId": "event123",
    "title": "Movie Club Night",
    "date": "2024-12-01T10:00:00Z",
    "description": "Watching and discussing 'Inception'.",
    "location": "Online",
    "host": "Admin User",
    "attendees": 15,
    "maxAttendees": 20
  }
]

```

- **Errors**
    - `500`: Internal server error.

---

## **POST /create**

Creates a new event.

- **Request**

```json
{
  "title": "Movie Club Night",
  "date": "2024-12-01T10:00:00Z",
  "description": "Watching and discussing 'Inception'.",
  "location": "Online",
  "maxAttendees": 20
}

```

- **Response**

```json
{
  "message": "Event created successfully",
  "eventId": "event123"
}

```

- **Errors**
    - `400`: Validation error (e.g., missing required fields).
    - `401`: Unauthorized (only hosts/admins can create events).

---

## **POST /rsvp/:eventId**

RSVPs the authenticated user to an event.

- **Request**
    
    No body required.
    
- **Response**

```json
{
  "message": "RSVP added successfully",
  "status": "confirmed"
}

```

- **Errors**
    - `404`: Event not found.
    - `409`: Event is full.

---

# **User Profile API**

**Base URL**: `/api/profile`

| **Endpoint** | **Method** | **Description** | **Auth** |
| --- | --- | --- | --- |
| `/` | GET | Fetch the user profile | ✔ |
| `/update` | PATCH | Update user profile | ✔ |
| `/delete` | DELETE | Delete user account | ✔ |

## **GET /**

Fetches the authenticated user’s profile.

- **Response**

```json
{
  "userId": "abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "status": "active"
}

```

- **Errors**
    - `401`: Unauthorized (invalid/missing token).

---

## **PATCH /update**

Updates the authenticated user’s profile.

- **Request**

```json
{
  "name": "Jane Doe"
}

```

- **Response**

```json
{
  "message": "Profile updated successfully"
}

```

- **Errors**
    - `400`: Validation errors (e.g., invalid name).

---

## **DELETE /delete**

Deletes the authenticated user’s account.

- **Response**

```json
{
  "message": "Account deleted successfully"
}

```

- **Errors**
    - `401`: Unauthorized.

---

# **Update Feed API**

**Base URL**: `/api/feed`

| **Endpoint** | **Method** | **Description** | **Auth** |
| --- | --- | --- | --- |
| `/` | GET | Fetch update feed for user | ✔ |

## **GET /**

Fetches the update feed for the authenticated user.

- **Response**

```json
[
  {
    "type": "RSVP",
    "message": "User X RSVPed to 'Movie Club Night'",
    "timestamp": "2024-12-01T09:00:00Z"
  },
  {
    "type": "COMMENT",
    "message": "User Y commented on 'Movie Club Night': 'Excited for this!'
  }
]

```

- **Errors**
    - `401`: Unauthorized.

---

# **Admin Account Management API**

**Base URL**: `/api/admin`

| **Endpoint** | **Method** | **Description** | **Auth** |
| --- | --- | --- | --- |
| `/approve/:userId` | PATCH | Approve a user account | ✔ |
| `/reject/:userId` | DELETE | Reject a user account | ✔ |
| `/suspend/:userId` | PATCH | Suspend a user account | ✔ |
| `/roles/:userId` | PATCH | Update user roles | ✔ |

## **PATCH /approve/:userId**

Approves a user account, changing their status from "pending" to "active."

- **Request**
    
    No body required.
    
- **Response**

```json
{
  "message": "User approved successfully",
  "userId": "abc123"
}

```

- **Errors**
    - `404`: User not found.
    - `400`: User already active.

---

## **DELETE /reject/:userId**

Rejects a user account, removing it from the system.

- **Request**
    
    No body required.
    
- **Response**

```json
{
  "message": "User rejected and removed",
  "userId": "abc123"
}

```

- **Errors**
    - `404`: User not found.

---

## **PATCH /suspend/:userId**

Suspends a user account, preventing further interactions while retaining their data.

- **Request**
    
    No body required.
    
- **Response**

```json
{
  "message": "User suspended successfully",
  "userId": "abc123"
}

```

- **Errors**
    - `404`: User not found.
    - `400`: User already suspended.

---

## **PATCH /roles/:userId**

Updates the roles of a user (e.g., assign or revoke admin or host privileges).

- **Request**

```json
{
  "roles": ["admin", "host"]
}

```

- **Response**

```json
{
  "message": "Roles updated successfully",
  "userId": "abc123",
  "roles": ["admin", "host"]
}

```

- **Errors**
    - `404`: User not found.
    - `400`: Invalid roles specified.