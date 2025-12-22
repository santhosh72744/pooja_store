import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('float')
  price: number;

  @Column({ nullable: true })
  currency?: string;


  @Column('int', { default: 0 })
  stock: number;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'float', nullable: true })
  diameterInches?: number;

  @Column({ type: 'float', nullable: true })
  heightInches?: number;

  @Column({ type: 'float', nullable: true })
  weightLbs?: number;

  @Column({ nullable: true })
  material?: string;

  @Column({ nullable: true })
  finish?: string;

  @Column({ type: 'text', nullable: true })
  includedItems?: string;

  @Column({ type: 'text', nullable: true })
  thumbnail?: string;

  @Column('text', { array: true, nullable: true })
  images?: string[];
}
