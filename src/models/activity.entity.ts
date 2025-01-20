import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

export const activityTypes = [
  "User joined",
  "Event created",
  "Event updated",
  "Comment added",
  "RSVP updated",
  "Movie added",
] as const;
export type ActivityType = (typeof activityTypes)[number];

@Entity()
@Index("idx_activity_type", ["type"]) // Index on type
@Index("idx_activity_user", ["user_id"]) // Index on user_id
@Index("idx_activity_created_at", ["created_at"]) // Index on created_at
export class ActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: activityTypes,
  })
  type!: ActivityType;

  @Column("text")
  details!: string; // e.g., "User 'John Doe' has joined the club."

  @Column("uuid", { nullable: true })
  user_id!: string | null; // Reference to the user, nullable because not all activities involve users

  @Column("uuid", { nullable: true })
  event_id!: string | null; // Reference to the event, nullable for activities not tied to events

  @Column("timestamp")
  created_at!: Date; // Timestamp of when the activity occurred
}
