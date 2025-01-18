import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  comment_id!: string;

  @Column("uuid", { nullable: false })
  event_id!: string;

  @Column("uuid", { nullable: false })
  user_id!: string;

  @Column("text")
  content!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("timestamp", {
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
