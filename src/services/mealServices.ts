import { mealRepository } from "../repositories/dataRepositories";

export const getMealById = async (id: string) => {
  const mealDetail = await mealRepository.findOne({
    where: {
      id: id,
    },
    relations: ["restaurant"],
    select: {
      restaurant: {
        title: true,
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
    .orderBy("RANDOM()")
    .limit(n as unknown as number)
    .getMany();

  return randomMeals;
};

//Return unique categories and its count
export const getMenuCategories = async (id: string) => {
  const meals = await mealRepository.find({
    where: {
      restaurant: { id: id },
    },
    relations: ["restaurant"],
    select: {
      restaurant: {
        id: true,
      },
      category: true,
      is_popular: true,
    },
  });

  if (meals.length == 0) {
    return [];
  }

  const uniqueCategories = meals.map((meal) => meal.category);

  const categories = [...new Set(["Recommended"].concat(uniqueCategories))];

  const categoryCount = categories.map((category) => {
    if (category === "Recommended") {
      return {
        category,
        count: meals.filter((meal) => meal.is_popular).length,
      };
    } else {
      return {
        category,
        count: meals?.filter((meal) => meal.category === category).length,
      };
    }
  });

  return categoryCount;
};

export const getMenu = async (id: string, categoryFilter: string) => {
  if (categoryFilter === undefined) {
    return await mealRepository.find({
      where: {
        is_popular: true,
        restaurant: { id: id },
      },
    });
  }

  return await mealRepository.find({
    where: {
      restaurant: { id: id },
      category: categoryFilter,
    },
  });
};

export const getCarosuelCategories = async () => {
  const meals = await mealRepository.find();

  if (meals.length == 0) {
    return [];
  }

  const Categories = [...new Set(meals.map((meal) => meal.category))];

  const categoryCount = Categories.map((category) => {
    return {
      category,
      count: meals?.filter((meal) => meal.category === category).length,
    };
  });

  const carouselCategory = categoryCount
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => item.category);

  return carouselCategory;
};

export const getCarosuelItems = async (category: string) => {
  if (category === undefined) {
    return await mealRepository.find();
  } else {
    return await mealRepository.find({
      where: {
        category: category,
      },
      relations: ["restaurant"],
      select: {
        restaurant: {
          title: true,
        },
      },
    });
  }
};
