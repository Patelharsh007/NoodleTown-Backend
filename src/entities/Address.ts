import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./User";

@Entity({ name: "addresses" })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: UserEntity;
}
