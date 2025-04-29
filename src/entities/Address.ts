import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from "typeorm";
import { UserEntity } from "./User";

@Unique(["user", "name", "street", "city", "state", "pincode", "country"])
@Entity({ name: "addresses" })
export class AddressEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  pincode: number;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;
}
