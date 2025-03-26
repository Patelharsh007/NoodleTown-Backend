import { UserReq } from "./type";

declare module "express" {
  interface Request {
    user?: UserReq;
  }
}
console.log("Custom Express types loaded");
