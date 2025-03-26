import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { MealEntity } from "./Meal";

@Entity({ name: "restaurants" })
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  restaurantId: string;

  @OneToMany(() => MealEntity, (meal) => meal.restaurant)
  meals: MealEntity[];

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  logo: string;

  @Column("simple-array")
  posterImages: string[];

  @Column("simple-array")
  cuisines: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  avgCostPerPerson: number;

  @Column({ type: "varchar", length: 500 })
  address: string;

  @Column({ type: "boolean" })
  isOpen: boolean;

  @Column({ type: "varchar", length: 255 })
  timing: string;

  @Column("simple-array")
  menuImages: string[];

  @Column("simple-array")
  categories: string[];

  @Column({ type: "boolean" })
  isFeatured: boolean;

  @Column({ type: "decimal", precision: 3, scale: 2 })
  rating: number;
}
