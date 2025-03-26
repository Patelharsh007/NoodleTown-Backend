import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { RestaurantEntity } from "./Restaurant";

@Entity({ name: "meals" })
export class MealEntity {
  @PrimaryGeneratedColumn()
  mealId: number;

  @Column({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  restaurantId: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.meals)
  @JoinColumn({ name: "restaurantId", referencedColumnName: "restaurantId" })
  restaurant: RestaurantEntity;

  // @Column()
  // restaurantName: string;

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "varchar" })
  image: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", length: 500 })
  shortDescription: string;

  @Column("simple-array")
  fullDescription: string[];

  @Column({ type: "varchar" })
  price: number;

  @Column({ type: "varchar" })
  isPopular: boolean;
}
