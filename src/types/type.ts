export interface User {
  id?: number;
  user_name: string;
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

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
  SHIPPED = "shipped",
}
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}
