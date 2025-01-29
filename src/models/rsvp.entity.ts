import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

export const rsvpStatuses = ["going", "waitlisted", "not going"] as const;
export type RSVPStatus = (typeof rsvpStatuses)[number];

@Entity()
@Index(["event_id", "user_id"], { unique: true })
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  rsvp_id!: string;

  @Column("uuid", { nullable: false })
  event_id!: string;

  @Column("uuid", { nullable: false })
  user_id!: string;

  @Column({ type: "enum", enum: rsvpStatuses, default: rsvpStatuses[0] })
  status!: RSVPStatus;

  @Column("int", { default: 0 })
  priority!: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
