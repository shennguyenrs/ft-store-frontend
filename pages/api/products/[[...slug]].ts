import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";
import { CMS_API, CMS_HEADER, CMS_ROUTES } from "../../../libs/constants";

async function getProducts(res: NextApiResponse, queryStr: string) {
  try {
    const { data } = await axios.get(`${CMS_API}/products?${queryStr}`);
    return res.status(200).json(data.data);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get products from CMS" });
  }
}

async function updateProductRating(
  res: NextApiResponse,
  spId: number,
  newRating: { avgRating: number; ratingAmount: number }
) {
  try {
    const updated = await axios.put(
      `${CMS_API}/${CMS_ROUTES.products}/${spId}`,
      {
        data: newRating,
      },
      CMS_HEADER
    );

    if (updated.data) {
      return res.status(200).json({ message: "Updated" });
    } else {
      return res
        .status(500)
        .json({ message: "Faled to send put request to CMS" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed update product information on CMS" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    const { query } = req;

    if (!query) {
      return res.status(404).json({ message: "Missing filter string" });
    }

    const queryStr = qs.stringify(query, { encodeValuesOnly: true });

    return getProducts(res, queryStr);
  }

  if (method === "PUT") {
    const { query, body } = req;
    const { slug } = query;
    const spId = Number(slug[0]);
    const newRating = body;

    if (spId === 0) {
      return res.status(404).json({ message: "Wrong prodouct id" });
    }

    if (!newRating) {
      return res
        .status(404)
        .json({ message: "Missing new rating information" });
    }

    return updateProductRating(res, spId, newRating);
  }

  return res.status(405).json({ message: "This method not allowed" });
}
