import { REVIEW } from "./review";

export interface PRODUCT {
  productId: string;
  name: string;
  category: string;
  price: number;
  remains: number;
  about?: string;
  specification?: string;
  technicalDetails?: string;
  weight?: number;
  imageIds?: string;
  reviews: REVIEW[];
  avgRating?: number;
  ratingAmount?: number;
}

export type SHORT_PRODUCT = Pick<
  PRODUCT,
  "productId" | "name" | "imageIds" | "price"
>;

export interface IN_CART {
  product: SHORT_PRODUCT;
  amount: number;
}
