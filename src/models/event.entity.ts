import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  @Column("uuid", { nullable: false })
  movie_id!: string;

  @Column("uuid", { nullable: true })
  host_id!: string | null;

  @Column("int")
  max_attendees!: number;
}
