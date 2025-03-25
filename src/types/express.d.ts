import { UserEntity } from "../entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
