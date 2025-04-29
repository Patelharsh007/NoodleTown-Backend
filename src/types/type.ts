export interface User {
  id?: number;
  userName: string;
  email: string;
  password: string;
  profile_image?: string;
}

export interface UserReq {
  id: number;
  email: string;
  userName: string;
}

export interface Address {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
}
