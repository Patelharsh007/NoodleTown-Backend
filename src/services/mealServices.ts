import { mealRepository } from "../repositories/dataRepositories";

export const getMealById = async (id: string) => {
  const mealDetail = await mealRepository.find({
    where: {
      mealId: id,
    },
    relations: ["restaurant"],
    select: {
      restaurant: {
        title: true, // Assuming 'name' is the column for the restaurant name
      },
    },
  });
  return mealDetail;
};

export const weatherMeals = async () => {
  const mealsDetail = await mealRepository.find();
  return mealsDetail.sort(() => Math.random() - 0.5).slice(0, 6);
};

export const getRandomNMeals = async (n: string) => {
  const randomMeals = await mealRepository
    .createQueryBuilder("meal")
    .orderBy("RANDOM()") // PostgreSQL function to randomize the order
    .limit(n as unknown as number) // Limit the result to 'n' records
    .getMany();

  return randomMeals;
};
