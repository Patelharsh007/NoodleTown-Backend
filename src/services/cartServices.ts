import { cartRepository } from "../repositories/dataRepositories";

export const getCartbyUser = async (userId: number) => {
  return await cartRepository.find({
    where: { user: { id: userId } },
    relations: ["meal"],
    order: { meal: { title: "ASC" } },
  });
};

export const getCartMealbyUser = async (mealId: string, userId: number) => {
  return await cartRepository.findOne({
    where: { user: { id: userId } },
    relations: ["meal"],
  });
};

export const findCartByMealAndUser = async (mealId: string, userId: number) => {
  return await cartRepository.findOne({
    where: { user: { id: userId }, mealId: mealId },
  });
};

export const addMealToCart = async (mealId: string, userId: number) => {
  const cartItemData = {
    mealId,
    user: { id: userId },
  };
  return await cartRepository.save(cartItemData);
};

// export const incrementCartItem = async (mealId: string, userId: number) => {
//   const data = await cartRepository.findOne({
//     where: { mealId: mealId, user: { id: userId } },
//   });

//   if (data) {
//     data.quantity += 1;
//     return await cartRepository.save(data);
//   }
// };

export const incrementCartItem = async (mealId: string, userId: number) => {
  const cartItem = await cartRepository.findOne({
    where: { mealId, user: { id: userId } },
  });

  if (!cartItem) return null;

  if (cartItem.quantity >= 5) {
    return cartItem.quantity;
  }

  await cartRepository
    .createQueryBuilder()
    .update()
    .set({ quantity: () => "LEAST(quantity + 1, 5)" })
    .where("mealId = :mealId", { mealId })
    .andWhere("userId = :userId", { userId })
    .execute();

  return await cartRepository.findOne({
    where: { mealId, user: { id: userId } },
  });
};

// export const decrementCartItem = async (mealId: string, userId: number) => {
//   const data = await cartRepository.findOne({
//     where: { mealId: mealId, user: { id: userId } },
//   });

//   if (data) {
//     data.quantity -= 1;
//     return await cartRepository.save(data);
//   }
// };

export const decrementCartItem = async (mealId: string, userId: number) => {
  const cartItem = await cartRepository.findOne({
    where: { mealId, user: { id: userId } },
  });

  if (!cartItem) return null;

  if (cartItem.quantity <= 1) {
    // Remove item from cart
    await cartRepository.delete({ mealId, user: { id: userId } });
    return null;
  }

  await cartRepository
    .createQueryBuilder()
    .update()
    .set({ quantity: () => "GREATEST(quantity - 1, 1)" }) // keep minimum 1
    .where("mealId = :mealId", { mealId })
    .andWhere("userId = :userId", { userId })
    .execute();

  return await cartRepository.findOne({
    where: { mealId, user: { id: userId } },
  });
};

export const removeCartItem = async (mealId: string, userId: number) => {
  const data = await cartRepository.findOne({
    where: { mealId: mealId, user: { id: userId } },
  });

  if (data) {
    return await cartRepository.remove(data);
  }
};
export const emptyCart = async (userId: number) => {
  return await cartRepository.delete({ user: { id: userId } });
};
