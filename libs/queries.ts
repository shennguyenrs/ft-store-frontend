import axios from "axios";
import qs from "qs";
import { CMS_API, FILTER_LABEL } from "./constants";

// Server-side queries
export const getRandomProducts = (index: number) =>
  axios.get(
    `${CMS_API}/products?` +
      qs.stringify(
        {
          fields: ["product_id", "name", "price", "image_ids"],
          poplate: {
            review: {
              fields: ["rating"],
            },
          },
          pagination: {
            start: index,
            limit: 15,
          },
        },
        {
          encodeValuesOnly: true,
        }
      )
  );

export const getProductById = (id: string) =>
  axios.get(
    `${CMS_API}/products?` +
      qs.stringify(
        {
          filters: {
            product_id: {
              $eq: id,
            },
          },
          populate: {
            reviews: {
              populate: {
                imgs: {
                  fields: ["hash", "url"],
                },
                reviewer: {
                  populate: {
                    avatar: {
                      fields: ["hash", "ext"],
                    },
                  },
                },
              },
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
      )
  );

export const getCategories = () => axios.get(`${CMS_API}/category`);

export const getSliderImgs = () =>
  axios.get(
    `${CMS_API}/slider?` +
      qs.stringify(
        {
          populate: {
            images: {
              fields: ["hash", "url"],
            },
          },
        },
        {
          encodeValuesOnly: true,
        }
      )
  );

// Front-end queries
export function allProducts(index: number, pageSize: number) {
  return qs.stringify(
    {
      pagination: {
        page: index + 1,
        pageSize: pageSize,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
}

export function makeQuery(filter: string[]) {
  const obj: any = {};
  const [cate, prices, rating, sort] = filter;

  if (cate && cate !== "all-cate") {
    obj.filters = {
      category: {
        $startsWith: cate,
      },
    };
  }

  if (prices && prices !== "all-price") {
    const pricesRange = prices.split("|");

    obj.filters = {
      ...obj.filters,
      price: {
        $gte: pricesRange[0],
        $lte: pricesRange[1],
      },
    };
  }

  if (rating && rating !== "all-rating") {
    const ratingRange = rating.split("|");

    obj.filters = {
      ...obj.filters,
      avgRating: {
        $gte: ratingRange[0],
        $lte: ratingRange[1],
      },
    };
  }

  if (sort && sort !== "all-sort") {
    obj.sort = [sort];
  }

  return qs.stringify(obj, {
    encodeValuesOnly: true,
  });
}

export function parseQuery(query: string) {
  const obj = qs.parse(query) as { [key: string]: any };

  return {
    [FILTER_LABEL.CATE]: obj.filters?.category?.$startsWith ?? "all-cate",
    [FILTER_LABEL.PRICE]:
      obj.filters?.price !== undefined
        ? obj.filters?.price?.$gte + "|" + obj.filters?.price?.$lte
        : "all-price",
    [FILTER_LABEL.RATING]:
      obj.filters?.avgRating !== undefined
        ? obj.filters?.price?.$gte + "|" + obj.filters?.price?.$lte
        : "all-rating",
    [FILTER_LABEL.SORT]: obj.sort?.[0] ?? "all-sort",
  };
}

export function itemByName(name: string) {
  return qs.stringify(
    {
      filters: {
        name: {
          $containsi: name,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
}

export function personById(id: string) {
  return qs.stringify(
    {
      filters: {
        userId: {
          $eq: id,
        },
      },
    },
    { encodeValuesOnly: true }
  );
}

export function allReviewsByPerson(id: string) {
  return qs.stringify(
    {
      filters: {
        userId: {
          $eq: id,
        },
      },
      populate: {
        reviews: {
          fields: ["id"],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
}

export function allReviewsImgs() {
  return qs.stringify(
    {
      populate: {
        imgs: {
          fields: ["id"],
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
}
