export interface User {
  id?: number;
  userName: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface UserReq {
  id: number;
  email: string;
  userName: string;
}
