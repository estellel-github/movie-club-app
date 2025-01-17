import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity.js";
import { Movie } from "./movie.entity.js";

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

  @ManyToOne(() => Movie)
  @JoinColumn({ name: "movie_id" })
  movie!: Movie;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "host_id" })
  host!: User;

  @Column("int")
  max_attendees!: number;
}
