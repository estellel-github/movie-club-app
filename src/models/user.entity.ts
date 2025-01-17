import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export const userStatuses = ["active", "suspended"] as const;
export type UserStatus = (typeof userStatuses)[number];

export const userRoles = ["user", "host", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column("text")
  intro_msg!: string;

  @Column({
    type: "enum",
    enum: userRoles,
    default: userRoles[0],
  })
  role!: UserRole;

  @Column({
    type: "enum",
    enum: userStatuses,
    default: userStatuses[0],
  })
  status!: UserStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;
}
