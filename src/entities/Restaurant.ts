import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { MealEntity } from "./Meal";

@Entity({ name: "restaurants" })
export class RestaurantEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => MealEntity, (meal) => meal.restaurant, {
    cascade: ["remove"],
  })
  meals: MealEntity[];

  @Column({ type: "varchar", length: 255, unique: true })
  title: string;

  @Column({ type: "varchar", length: 255 })
  logo: string;

  @Column("jsonb")
  posterImages: string[];

  @Column("jsonb")
  cuisines: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  avgCostPerPerson: number;

  @Column({ type: "varchar", length: 500 })
  address: string;

  @Column({ type: "boolean" })
  isOpen: boolean;

  @Column({ type: "varchar", length: 255 })
  timing: string;

  @Column("jsonb")
  menuImages: string[];

  @Column({ type: "boolean" })
  isFeatured: boolean;

  @Column({ type: "decimal", precision: 3, scale: 2 })
  rating: number;
}
