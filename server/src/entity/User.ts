import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column({ unique: true })
    email: string = '';

    @Column()
    name: string = '';

    @Column()
    password: string = '';

    @Column({ default: 'active' })
    status: 'active' | 'blocked' = 'active';

    @CreateDateColumn()
    createdAt: Date = new Date();

    @UpdateDateColumn()
    updatedAt: Date = new Date();

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null = null;
}