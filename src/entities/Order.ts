import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./User";
import { OrderItemEntity } from "./OrderItem";
import { OrderStatus, PaymentStatus } from "../types/type";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: "pending",
  })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  ordered_at: Date;

  @Column()
  sub_total: number;

  @Column()
  discount: number;

  @Column()
  delivery: number;

  @Column()
  total: number;

  @Column("jsonb")
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
  };

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
    onDelete: "CASCADE",
  })
  items: OrderItemEntity[];

  @Column({ type: "varchar", unique: true, nullable: true })
  stripe_payment_id: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: "pending",
  })
  payment_status: string;
}
