import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Celebrity } from './celebrity.entity';

export enum UserRole {
  FAN = 'fan',
  CELEBRITY = 'celebrity',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Celebrity, { cascade: true })
  @JoinTable({ name: 'fan_following' })
  following: Celebrity[];
} 