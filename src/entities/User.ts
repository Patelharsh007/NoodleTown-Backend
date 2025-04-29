import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { OrderEntity } from "./Order";
import { AddressEntity } from "./Address";
import { CartItemEntity } from "./CartItem";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  user_name: string;

  @Column({ type: "varchar", length: 255, unique: false })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Index()
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.user, {
    cascade: true,
  })
  cart_items: CartItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: AddressEntity[];
}
