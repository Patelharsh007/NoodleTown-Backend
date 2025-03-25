import { userRepository } from "../repositories/dataRepositories";

export const usersAllList = async () => {
  const users = await userRepository.find();
  console.log(users);
  return users;
};
