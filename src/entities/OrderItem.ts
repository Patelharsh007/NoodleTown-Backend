import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { OrderEntity } from "./Order";

@Entity({ name: "order_items" })
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  itemName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  itemTotal: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}
