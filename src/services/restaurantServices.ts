import { restaurantRepository } from "../repositories/dataRepositories";
import { Brackets } from "typeorm";

//get brands for brand page
export const getBrands = async () => {
  const restaurants = await restaurantRepository.find({
    select: ["id", "logo", "title"],
  });
  return restaurants;
};

//get unique restaurant by id
export const getRestaurantById = async (id: string) => {
  const restaurantDetail = await restaurantRepository.findOne({
    where: {
      id: id,
    },
  });
  return restaurantDetail;
};

//get restaurant and its emals
export const getRestaurantMeal = async (id: string) => {
  const restaurantDetail = await restaurantRepository.find({
    where: {
      id: id,
    },
    relations: ["meals"],
    select: ["id", "meals"],
  });
  return restaurantDetail;
};

//get categories of food available in restaurant
export const getMenuCategories = async (id: string) => {
  const restaurant = await restaurantRepository.find({
    where: {
      id: id,
    },
    relations: ["meals"],
    select: ["id", "meals"],
  });

  if (restaurant.length === 0) {
    return [];
  }

  const uniqueCategories = restaurant[0].meals.map((meal) => meal.category);

  const categories = [...new Set(["Recommended"].concat(uniqueCategories))];

  const categoryCount = categories.map((category) => {
    if (category === "Recommended") {
      return {
        category,
        count: restaurant[0].meals.filter((meal) => meal.is_popular).length,
      };
    } else {
      return {
        category,
        count: restaurant[0].meals?.filter((meal) => meal.category === category)
          .length,
      };
    }
  });

  return categoryCount;
};

const searchRestaurant = async (city: string, value: string) => {
  const restaurants = await restaurantRepository
    .createQueryBuilder("restaurant")
    .select(["restaurant"])
    .leftJoin("restaurant.meals", "meal")
    .where("LOWER(restaurant.address) LIKE LOWER(:addresspattern)", {
      addresspattern: `%${city}%`,
    })
    .andWhere(
      new Brackets((qb) => {
        qb.where("LOWER(restaurant.address) LIKE LOWER(:value)", {
          value: `%${value}%`,
        })
          .orWhere("LOWER(meal.title) LIKE LOWER(:value)", {
            value: `%${value}%`,
          })
          .orWhere("LOWER(meal.category) LIKE LOWER(:value)", {
            value: `%${value}%`,
          });
      })
    )
    .getMany();
  return restaurants;
};

export const getSearchRestaurantResult = async (
  city: string,
  value: string
) => {
  const restaurants = await searchRestaurant(city, value);
  return restaurants;
};

const searchMeal = async (city: string, value: string) => {
  const meals = await restaurantRepository
    .createQueryBuilder("restaurant")
    .leftJoin("restaurant.meals", "meal")
    .select([
      "restaurant.id",
      "meal.id",
      "meal.title",
      "meal.category",
      "meal.image",
      "meal.short_description",
      "meal.price",
    ])
    .where("LOWER(restaurant.address) LIKE LOWER(:addresspattern)", {
      addresspattern: `%${city}%`,
    })
    .andWhere(
      new Brackets((qb) => {
        qb.where("LOWER(restaurant.address) LIKE LOWER(:value)", {
          value: `%${value}%`,
        })
          .orWhere("LOWER(meal.title) LIKE LOWER(:value)", {
            value: `%${value}%`,
          })
          .orWhere("LOWER(meal.category) LIKE LOWER(:value)", {
            value: `%${value}%`,
          });
      })
    )
    .getMany();
  return meals;
};

export const getSearchMealResult = async (city: string, value: string) => {
  const meals = await searchMeal(city, value);
  const mealsData = meals.map((restaurant) => restaurant.meals).flat();
  return mealsData;
};
