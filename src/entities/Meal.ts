import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { RestaurantEntity } from "./Restaurant";
import { CartItemEntity } from "./CartItem";
@Entity({ name: "meals" })
export class MealEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryColumn({ type: "varchar", unique: true })
  id: string;

  // @Column({ type: "varchar" })
  // restaurantId: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.meals)
  // @JoinColumn({ name: "restaurant_id", referencedColumnName: "restaurant_id" })
  restaurant: RestaurantEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.meal)
  cart_items: CartItemEntity[];

  @Column({ type: "varchar" })
  category: string;

  @Column({ type: "varchar" })
  image: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", length: 500 })
  short_description: string;

  @Column("jsonb")
  full_description: string[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "boolean" })
  is_popular: boolean;
}
