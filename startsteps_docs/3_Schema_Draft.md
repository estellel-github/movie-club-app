# 3. Initial DB Schema Draft

⚠️ **This is just an initial draft for coding the entities in initial version of the MVP. Any next edits to be made directly in the PostgreSQL instance (via DBeaver). If needed later, I can update the [diagram.io](http://diagram.io) version for presentation purposes to match the latest entities**

# Diagram (dbdiagram.io)

[A Free Database Designer for Developers and Analysts](https://dbdiagram.io/d/Movie-Club-Manager-MVP-6788c0236b7fa355c30f7aa8)

```
Table Users {
  user_id UUID [pk]
  email VARCHAR(255) [unique, not null]
  password VARCHAR(255) [not null]
  status ENUM('active', 'suspended') [not null]
  role ENUM('user', 'host', 'admin') [not null]
  intro_msg TEXT [not null]
  created_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
  updated_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
}

Table Events {
  event_id UUID [pk]
  title VARCHAR(255) [not null]
  description TEXT [not null]
  date TIMESTAMP [not null]
  location VARCHAR(255) [not null]
  movie_id UUID [not null]
  host_id UUID
  max_attendees INT [not null]
  created_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
  updated_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
}

Table RSVPs {
  rsvp_id UUID [pk]
  event_id UUID [not null]
  user_id UUID [not null]
  status ENUM('going', 'waitlisted', 'not going') [not null]
  priority INT [not null, default: 0]
  created_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
}

Table Event_Comments {
  event_comment_id UUID [pk]
  event_id UUID [not null]
  user_id UUID [not null]
  content TEXT [not null]
  created_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
}

Table Movies { 
  movie_id UUID [pk]
  title VARCHAR(255) [not null]
  description TEXT [not null]
  director VARCHAR(255) [not null]
  release_year INT [not null]
  cover_image_url TEXT
  added_by UUID [not null]
  created_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
  updated_at TIMESTAMP [not null, default: "CURRENT_TIMESTAMP"]
}

Ref: Users.user_id > Events.host_id
Ref: Events.event_id > RSVPs.event_id
Ref: Users.user_id > RSVPs.user_id
Ref: Events.event_id > Event_Comments.event_id
Ref: Users.user_id > Event_Comments.user_id
Ref: Movies.movie_id > Events.movie_id
Ref: Users.user_id > Movies.added_by

```