import { Repository } from "typeorm";
import { AppDataSource } from "../db/db.config";
import { UserEntity } from "../entities/User";
import { RestaurantEntity } from "../entities/Restaurant";
import { MealEntity } from "../entities/Meal";
import { CartItemEntity } from "../entities/CartItem";

export const userRepository: Repository<UserEntity> =
  AppDataSource.getRepository(UserEntity);

export const restaurantRepository: Repository<RestaurantEntity> =
  AppDataSource.getRepository(RestaurantEntity);

export const mealRepository: Repository<MealEntity> =
  AppDataSource.getRepository(MealEntity);

export const cartRepository: Repository<CartItemEntity> =
  AppDataSource.getRepository(CartItemEntity);
