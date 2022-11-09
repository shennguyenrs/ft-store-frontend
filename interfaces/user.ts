import { IN_CART, SHORT_PRODUCT } from "./product";

export interface USER {
  id: string;
  username: string;
  email: string;
  fullname?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  avatar?: string;
  orders?: string[];
  favoriteProducts?: SHORT_PRODUCT[];
  cart?: IN_CART[];
  sessionCodes:
    | {
        code: string;
        created: number;
      }[]
    | null;
  loginCode: string | null;
}

export type CLEAN_USER = Omit<USER, "sessionCodes" | "loginCode">;

export type REVIEWER = Pick<USER, "id" | "username" | "avatar">;

export type USER_INFO = Pick<
  USER,
  "username" | "fullname" | "email" | "address" | "zipcode" | "city"
>;
