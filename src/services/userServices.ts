import {
  addressRepository,
  userRepository,
} from "../repositories/dataRepositories";
import { Address, User } from "../types/type";

export const usersAllList = async () => {
  const users = await userRepository.find();
  console.log(users);
  return users;
};

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  // const user = await userRepository.findOne({ where: { id: userId } });

  // if (user) {
  //   user.password = newPassword;
  // }

  return await userRepository.update(userId, { password: newPassword });
};
