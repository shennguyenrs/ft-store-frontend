import { IN_CART } from "./product";

export interface ORDER {
  _id: number;
  list: IN_CART[];
  total: number;
  orderUser?: string;
  orderDate: number;
  deliveryInfo: {
    fullname: string;
    email: string;
    address: string;
    zipcode: string;
    city: string;
  };
  deliveryEstimate: number;
  deliveryFee: number;
  discount?: number;
}

export type CLEAN_ORDER = Omit<ORDER, "orderUser">;

export type ORDER_STATUS = Pick<
  CLEAN_ORDER,
  "deliveryEstimate" | "deliveryFee"
>;

export interface ORDERERS_PRODUCT {
  _id: string;
  productId: string;
  orderers: string[];
}
