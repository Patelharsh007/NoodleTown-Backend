import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "coupons" })
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  coupon_code: string;

  @Column({ type: "int", unique: true, default: 0 })
  amount: number;
}
