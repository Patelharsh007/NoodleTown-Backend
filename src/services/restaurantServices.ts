import { title } from "process";
import { restaurantRepository } from "../repositories/dataRepositories";

export const getBrands = async () => {
  const restaurants = await restaurantRepository.find({
    select: ["restaurantId", "logo", "title"], // Specify the columns to fetch
  });
  return restaurants;
};

export const getRestaurantById = async (id: string) => {
  const restaurantDetail = await restaurantRepository.find({
    where: {
      restaurantId: id,
    },
  });
  return restaurantDetail;
};
export const getRestaurantMeal = async (id: string) => {
  const restaurantDetail = await restaurantRepository.find({
    where: {
      restaurantId: id,
    },
    relations: ["meals"],
    select: ["restaurantId", "meals"],
  });
  return restaurantDetail;
};
