import { Repository } from "typeorm";
import { AppDataSource } from "../db/db.config";
import { UserEntity } from "../entities/User";

export const userRepository: Repository<UserEntity> =
  AppDataSource.getRepository(UserEntity);
