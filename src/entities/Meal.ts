import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { RestaurantEntity } from "./Restaurant";
import { CartItemEntity } from "./CartItem";
@Entity({ name: "meals" })
export class MealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  mealId: string;

  @Column({ type: "varchar" })
  restaurantId: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.meals)
  @JoinColumn({ name: "restaurantId", referencedColumnName: "restaurantId" })
  restaurant: RestaurantEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.meal)
  cartItems: CartItemEntity[];

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "varchar" })
  image: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", length: 500 })
  shortDescription: string;

  @Column("jsonb")
  fullDescription: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "boolean" })
  isPopular: boolean;
}
