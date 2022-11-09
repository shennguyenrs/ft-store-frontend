import { REVIEWER } from "./user";

export interface REVIEW {
  id: string;
  content: string;
  rating: number;
  reviewer: REVIEWER;
  imgs?: {
    hash: string;
    url: string;
  }[];
  product: number;
  createdAt: number;
}

export interface RAW_REVIEW {
  content: string;
  rating: number;
  reviewer: number;
  imgs: string; // JSON stringigy Base64 image string array
}

export interface BASE64_IMG {
  base64: string;
  ext: string;
}

export interface REVIEW_PAYLOAD {
  data: {
    content: string;
    rating: number;
    product: number;
    reviewer: number;
  };
  imgs: string;
}
