import { restaurantRepository } from "../repositories/dataRepositories";

export const getBrands = async () => {
  const restaurants = await restaurantRepository.find({
    select: ["restaurantId", "logo", "title"], // Specify the columns to fetch
  });
  return restaurants;
};
