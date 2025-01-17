import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  movie_id!: string;

  @Column("varchar", { length: 255 })
  title!: string;

  @Column("text")
  description!: string;

  @Column("varchar", { length: 255 })
  director!: string;

  @Column("int")
  release_year!: number;

  @Column("varchar", { length: 255 })
  genre!: string;

  @Column("varchar", { length: 255 })
  language!: string;

  @Column("int")
  runtime_minutes!: number;

  @Column("text", { nullable: true })
  cover_image_url?: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("timestamp", {
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @ManyToOne(() => User)
  added_by!: User;
}
