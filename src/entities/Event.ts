import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import { Book } from "./Book.js";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  event_id!: string;

  @Column("varchar", { length: 255 })
  title!: string;

  @Column("text")
  description!: string;

  @Column("timestamp")
  date!: Date;

  @Column("varchar", { length: 255 })
  location!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("timestamp", {
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @ManyToOne(() => Book)
  @JoinColumn({ name: "book_id" })
  book!: Book;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "host_id" })
  host!: User;

  @Column("int")
  max_attendees!: number;
}
