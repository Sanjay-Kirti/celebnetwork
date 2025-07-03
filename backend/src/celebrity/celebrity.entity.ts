import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Celebrity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string; // e.g., Singer, Actor, Speaker

  @Column()
  country: string;

  @Column({ nullable: true })
  instagram: string;

  @Column()
  fanbase: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  setlist: string; // or keynote topics, as a comma-separated string

  @ManyToMany(() => User, user => user.following)
  fans: User[];
} 