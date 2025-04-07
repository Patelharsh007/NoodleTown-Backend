import { cartRepository } from "../repositories/dataRepositories";

export const getCartbyUser = async (email: string) => {
  return await cartRepository.find({
    where: { email: email },
    relations: ["meal"],
  });
};

export const getCartMealbyUser = async (mealId: string, email: string) => {
  return await cartRepository.findOne({
    where: { email: email, mealId: mealId },
    relations: ["meal"],
  });
};

export const findCartByMealAndUser = async (mealId: string, email: string) => {
  return await cartRepository.findOne({
    where: { email: email, mealId: mealId },
  });
};

export const addMealToCart = async (mealId: string, email: string) => {
  const cartItemData = {
    mealId,
    email,
  };
  return await cartRepository.save(cartItemData);
};

export const incrementCartItem = async (mealId: string, email: string) => {
  const data = await cartRepository.findOne({
    where: { mealId: mealId, email: email },
  });

  if (data) {
    data.quantity += 1;
    return await cartRepository.save(data);
  }
};

export const decrementCartItem = async (mealId: string, email: string) => {
  const data = await cartRepository.findOne({
    where: { mealId: mealId, email: email },
  });

  if (data) {
    data.quantity -= 1;
    return await cartRepository.save(data);
  }
};

export const removeCartItem = async (mealId: string, email: string) => {
  const data = await cartRepository.findOne({
    where: { mealId: mealId, email: email },
  });

  if (data) {
    return await cartRepository.remove(data);
  }
};
export const emptyCart = async (email: string) => {
  return await cartRepository.delete({ email: email });
};
