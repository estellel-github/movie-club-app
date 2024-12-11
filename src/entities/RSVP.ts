import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Entity()
export class RSVP {
  @PrimaryGeneratedColumn("uuid")
  rsvp_id!: string;

  @Column({ length: 50 })
  status!: string;

  @ManyToOne(() => Event, (event) => event.rsvps)
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => User, (user) => user.rsvps)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}