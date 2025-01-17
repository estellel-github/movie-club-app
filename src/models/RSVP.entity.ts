import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./event.entity.js";
import { User } from "./user.entity.js";

export const rsvpStatuses = ["going", "waitlisted", "not going"] as const;
export type RSVPStatus = (typeof rsvpStatuses)[number];

@Entity()
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  rsvp_id!: string;

  @ManyToOne(() => Event)
  event!: Event;

  @ManyToOne(() => User)
  user!: User;

  @Column({ type: "enum", enum: rsvpStatuses, default: rsvpStatuses[0] })
  status!: RSVPStatus;

  @Column("int", { default: 0 })
  priority!: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
