import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended"
}

export enum UserRole {
  USER = "user",
  HOST = "host",
  ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: "enum",
    enum: UserStatus,
  })
  status!: UserStatus;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role!: UserRole;

  @Column("text")
  intro_msg!: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}