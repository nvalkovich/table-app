import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { UserStatus } from "../types/types";

@Entity()
@Index("IDX_USER_EMAIL", ["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.active })
  status!: UserStatus;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
