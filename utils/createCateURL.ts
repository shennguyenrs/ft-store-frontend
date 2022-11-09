import { Base64 } from "js-base64";
import { FILTER_LABEL, CATE_ROUTES } from "../libs/constants";
import { makeQuery } from "../libs/queries";

export default function createCateURL(cate: string) {
  const obj = {
    [FILTER_LABEL.CATE]: cate,
  };
  const query = makeQuery(Object.values(obj));
  return CATE_ROUTES.query + Base64.encodeURI(query);
}
