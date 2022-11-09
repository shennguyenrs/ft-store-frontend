// Pages routes
export const CATE_ROUTES = {
  all: "/categories/all",
  query: "/categories/items?query=",
};

// API routes
export const API_ROUTES = {
  authUser: "/api/auth/user",
  callback: "/api/auth/user/callback",
  orders: "/api/orders",
  products: "/api/products",
  users: "/api/users",
  reviews: "/api/reviews"
};

export const USER_API_SLUG = {
  fields: "fields",
  ava: "avatar",
};

// CMS
export const CMS_API = process.env.CMS_API;
export const CMS_TOKEN = process.env.CMS_TOKEN;
export const CMS_HEADER = {
  headers: {
    Authorization: `bearer ${CMS_TOKEN}`,
  },
};
export const CMS_ROUTES = {
  products: "products",
  people: "people",
  person: "person",
  reviews: "reviews",
  review: "review",
  files: "upload/files",
};
export const CMS_REF = {
  person: "api::person.person",
  review: "api::review.review",
};

// AWS S3
export const PRODUCT_BK = process.env.PRODUCT_BUCKET;
export const STRAPI_BK = process.env.STRAPI_BUCKET;

// Env local
export const MONGO_URI = process.env.MONGO_URI as string;
export const MONGO_USER = process.env.MONGO_USER as string;
export const MONGO_PASS = process.env.MONGO_PASS as string;
export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const COOKIE_SECRET = process.env.COOKIE_SECRET as string;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
export const EMAIL_FROM = process.env.EMAIL_FROM as string;
export const AUTH_URL = process.env.AUTH_URL as string;
export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? (process.env.PRODUCTION_DOMAIN as string)
    : (process.env.LOCAL_DOMAIN as string);
export const ORDER_SERVICE_API = process.env.ORDER_SERVICE_API as string;

// Others
export const FALLBACK_SRC = "/no-img-found-tiny.webp";

export enum FILTER_LABEL {
  CATE = "Categories",
  PRICE = "Prices",
  RATING = "Ratings",
  SORT = "Sort by",
}

export enum API_FIELD {
  CART = "cart",
  FAV = "favoriteProducts",
  PORDER = "pendingOrder",
}

export const INITIAL_FILTERS = {
  [FILTER_LABEL.CATE]: "all-cate",
  [FILTER_LABEL.PRICE]: "all-price",
  [FILTER_LABEL.RATING]: "all-rating",
  [FILTER_LABEL.SORT]: "all-sort",
};

export const DEBOUNCE_TIME = 800;
export const CACHE_TOKEN = process.env.CACHE_TOKEN as string;
