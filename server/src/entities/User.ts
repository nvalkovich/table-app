import { Entity, Index, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

enum UserStatus {
    active = 'active',
    blocked = 'blocked',
}

@Entity()
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column({ default: UserStatus.active})
    status!: UserStatus;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt!: Date | null;
}