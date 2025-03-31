import { mealRepository } from "../repositories/dataRepositories";

export const getMealById = async (id: string) => {
  const mealDetail = await mealRepository.findOne({
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

//Return unique categories and its count
export const getMenuCategories = async (id: string) => {
  const meals = await mealRepository.find({
    where: {
      restaurantId: id,
    },
    select: ["restaurantId", "category", "isPopular"],
  });

  if (meals.length == 0) {
    return [];
  }

  //all distinct categories
  const uniqueCategories = meals.map((meal) => meal.category);

  //added recommended for popular meals
  const categories = [...new Set(["Recommended"].concat(uniqueCategories))];

  //counts of meal per category
  const categoryCount = categories.map((category) => {
    if (category === "Recommended") {
      return { category, count: meals.filter((meal) => meal.isPopular).length };
    } else {
      return {
        category,
        count: meals?.filter((meal) => meal.category === category).length,
      };
    }
  });

  return categoryCount;
};

//Return unique categories and its count
export const getMenu = async (id: string, categoryFilter: string) => {
  if (categoryFilter === undefined) {
    return await mealRepository.find({
      where: {
        restaurantId: id,
        isPopular: true,
      },
    });
  }

  return await mealRepository.find({
    where: {
      restaurantId: id,
      category: categoryFilter,
    },
  });
};
