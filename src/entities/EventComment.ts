import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Entity()
export class EventComment {
  @PrimaryGeneratedColumn("uuid")
  event_comment_id!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => Event, (event) => event.comments)
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}