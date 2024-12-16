import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.js";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  book_id!: string;

  @Column("varchar", { length: 255 })
  title!: string;

  @Column("varchar", { length: 255 })
  author!: string;

  @Column("text")
  description!: string;

  @Column("text", { nullable: true })
  cover_image_url?: string;

  @Column("int")
  nb_pages!: number;

  @Column("varchar", { length: 13, unique: true })
  isbn!: string;

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
