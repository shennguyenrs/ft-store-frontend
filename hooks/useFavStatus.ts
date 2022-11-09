import { debounce } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext, USERCTX } from "../contexts/users";
import { PRODUCT, SHORT_PRODUCT } from "../interfaces/product";
import { DEBOUNCE_TIME } from "../libs/constants";
import * as noti from "../libs/noti";

export default function useFavStatus(product: PRODUCT) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { user, addToFav, removeFromFav } = useContext<USERCTX>(UserContext);

  useEffect(() => {
    if (user && user.favoriteProducts) {
      const checked =
        user.favoriteProducts.filter(
          (item) => item.productId === product.productId
        ).length > 0;
      setIsFavorite(checked);
    }
  }, [user, product.productId]);

  const favoriteDebounce = useMemo(
    () =>
      debounce(() => {
        if (user) {
          const favProduct: SHORT_PRODUCT = {
            productId: product.productId,
            name: product.name,
            imageIds: product.imageIds,
            price: product.price,
          };

          isFavorite && removeFromFav(favProduct) && setIsFavorite(false);
          !isFavorite && addToFav(favProduct) && setIsFavorite(true);
        } else {
          noti.loginRequired();
        }
      }, DEBOUNCE_TIME),
    [user, isFavorite, addToFav, removeFromFav, product]
  );

  return { isFavorite, favoriteDebounce };
}
