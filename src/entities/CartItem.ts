import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./User";
import { MealEntity } from "./Meal";
@Entity({ name: "cart_items" })
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => MealEntity, (meal) => meal.cartItems)
  @JoinColumn({ name: "mealId", referencedColumnName: "mealId" })
  meal: MealEntity;

  @Column()
  mealId: string;

  @ManyToOne(() => UserEntity, (user) => user.cartItems)
  user: UserEntity;
}
