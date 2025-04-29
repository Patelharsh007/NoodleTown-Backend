import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { MealEntity } from "./Meal";

@Entity({ name: "restaurants" })
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  restaurant_id: string;

  @OneToMany(() => MealEntity, (meal) => meal.restaurant, {
    cascade: ["remove"],
  })
  meals: MealEntity[];

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  logo: string;

  @Column("jsonb")
  poster_images: string[];

  @Column("jsonb")
  cuisines: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  avg_cost_per_person: number;

  @Column({ type: "varchar", length: 500 })
  address: string;

  @Column({ type: "boolean" })
  is_open: boolean;

  @Column({ type: "varchar", length: 255 })
  timing: string;

  @Column("jsonb")
  menu_images: string[];

  @Column({ type: "boolean" })
  is_featured: boolean;

  @Column({ type: "decimal", precision: 3, scale: 2 })
  rating: number;
}
