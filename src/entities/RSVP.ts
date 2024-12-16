import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./Event.js";
import { User } from "./User.js";

export enum RSVPStatus {
  GOING = "going",
  WAITLISTED = "waitlisted",
  NOT_GOING = "not going",
}

@Entity()
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  rsvp_id!: string;

  @ManyToOne(() => Event)
  event!: Event;

  @ManyToOne(() => User)
  user!: User;

  @Column({
    type: "enum",
    enum: RSVPStatus,
  })
  status!: RSVPStatus;

  @Column("int", { default: 0 })
  priority!: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
