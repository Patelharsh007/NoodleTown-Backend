import { title } from "process";
import { restaurantRepository } from "../repositories/dataRepositories";
import { Brackets, ILike } from "typeorm";
import { RestaurantEntity } from "../entities/Restaurant";

//get brands for brand page
export const getBrands = async () => {
  const restaurants = await restaurantRepository.find({
    select: ["id", "logo", "title"], // Specify the columns to fetch
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

  //all distinct categories
  const uniqueCategories = restaurant[0].meals.map((meal) => meal.category);

  //added recommended for popular meals
  const categories = [...new Set(["Recommended"].concat(uniqueCategories))];

  //counts of meal per category
  const categoryCount = categories.map((category) => {
    if (category === "Recommended") {
      return {
        category,
        count: restaurant[0].meals.filter((meal) => meal.isPopular).length,
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

export const getSearchResult = async (city: string, value: string) => {
  const restaurants = await restaurantRepository
    .createQueryBuilder("restaurant")
    .leftJoinAndSelect("restaurant.meals", "meal")
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

  const restaurantData = restaurants.map((resturant) => ({
    ...resturant,
    meals: undefined,
  }));

  const mealsData = restaurants.map((restaurant) => restaurant.meals).flat();

  return { restaurants, restaurantData, mealsData };
};
