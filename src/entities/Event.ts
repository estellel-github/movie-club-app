import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Book } from "./Book";
import { RSVP } from "./RSVP";
import { EventComment } from "./EventComment";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  event_id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column("text")
  description!: string;

  @Column("timestamp")
  date!: Date;

  @Column({ length: 255 })
  location!: string;

  @ManyToOne(() => Book, (book) => book.events)
  @JoinColumn({ name: "book_id" })
  book!: Book;

  @ManyToOne(() => User, (user) => user.hostedEvents, { nullable: true })
  @JoinColumn({ name: "host_id" })
  host!: User;

  @Column("int")
  max_attendees!: number;

  @OneToMany(() => RSVP, (rsvp) => rsvp.event)
  rsvps!: RSVP[];

  @OneToMany(() => EventComment, (comment) => comment.event)
  comments!: EventComment[];
}