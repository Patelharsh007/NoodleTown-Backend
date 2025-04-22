import { addressRepository } from "../repositories/dataRepositories";
import { User, Address } from "../types/type";

//get all adress
export const getUserAddresses = async (userId: number) => {
  const addresses = await addressRepository.find({
    where: { user: { id: userId } },
    relations: ["user"],
    order: { id: "ASC" },
  });
  return addresses;
};

//add new address
export const addUserAddress = async (user: User, address: Address) => {
  const existingAddress = await addressRepository.findOne({
    where: {
      user: { id: user.id },
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    },
  });

  if (existingAddress) {
    return null;
  }

  const newAddress = addressRepository.create({ ...address, user });
  return await addressRepository.save(newAddress);
};

// get user by id
export const addressById = async (addressId: string, userId: number) => {
  return await addressRepository.findOne({
    where: { id: addressId, user: { id: userId } },
  });
};

//update address
export const updateUserAddress = async (
  userId: number,
  addressId: string,
  updatedFields: Partial<Address>
) => {
  const address = await addressRepository.findOne({
    where: {
      id: addressId,
      user: { id: userId },
    },
  });

  if (!address) {
    return null;
  }

  const duplicate = await addressRepository.findOne({
    where: {
      user: { id: userId },
      recipientName: updatedFields.recipientName ?? address.recipientName,
      street: updatedFields.street ?? address.street,
      city: updatedFields.city ?? address.city,
      state: updatedFields.state ?? address.state,
      pincode: updatedFields.pincode ?? address.pincode,
      country: updatedFields.country ?? address.country,
    },
  });

  if (duplicate && duplicate.id !== addressId) {
    return "duplicate";
  }

  Object.assign(address, updatedFields);

  return await addressRepository.save(address);
};

//delete address
export const deleteUserAddress = async (userId: number, addressId: string) => {
  const address = await addressRepository.findOne({
    where: {
      id: addressId,
      user: { id: userId },
    },
  });

  if (!address) {
    return null;
  }

  await addressRepository.remove(address);
  return true;
};
