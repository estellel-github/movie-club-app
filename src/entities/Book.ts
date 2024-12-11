import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  book_id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  author!: string;

  @Column("text")
  description!: string;

  @Column("text")
  cover_image_url!: string;

  @Column("int")
  nb_pages!: number;

  @Column({ length: 13, unique: true })
  isbn!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "added_by" })
  added_by!: User;

  @OneToMany(() => Event, (event) => event.book)
  events!: Event[];

}