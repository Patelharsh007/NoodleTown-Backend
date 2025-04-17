import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./User";
import { OrderItemEntity } from "./OrderItem";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["pending", "completed", "cancelled", "processing", "shipped"],
    default: "pending",
  })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  orderedAt: Date;

  @Column()
  subTotal: number;

  @Column()
  discount: number;

  @Column()
  delivery: number;

  @Column()
  total: number;

  @Column("jsonb")
  address: {
    recipientName: string;
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

  @Column({ type: "varchar", unique: true })
  stripePaymentId: string;

  @Column({
    type: "enum",
    enum: ["pending", "completed", "failed"],
    default: "pending",
  })
  paymentStatus: string;
}
