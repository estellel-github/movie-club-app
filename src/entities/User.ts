import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Event } from "./Event";
import { RSVP } from "./RSVP";
import { EventComment } from "./EventComment";
import { Book } from "./Book";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 50 })
  status!: string;

  @Column("jsonb")
  roles!: string[];

  @Column("text")
  intro_msg!: string;

  @OneToMany(() => Event, (event) => event.host)
  hostedEvents!: Event[];

  @OneToMany(() => RSVP, (rsvp) => rsvp.user)
  rsvps!: RSVP[];

  @OneToMany(() => EventComment, (comment) => comment.user)
  comments!: EventComment[];

  @OneToMany(() => Book, (book) => book.added_by)
  addedBooks!: Book[];

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}