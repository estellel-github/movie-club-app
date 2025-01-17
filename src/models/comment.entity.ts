import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Event } from "./event.entity.js";
import { User } from "./user.entity.js";

@Entity()
export class EventComment {
  @PrimaryGeneratedColumn("uuid")
  event_comment_id!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => Event)
  event!: Event;

  @ManyToOne(() => User)
  user!: User;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
