import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { DEBOUNCE_TIME } from "../libs/constants";
import * as noti from "../libs/noti";

export default function useQuantity(amount: number = 1) {
  const [quantity, setQuantity] = useState<number>(amount);

  const handleMinus = useMemo(
    () =>
      debounce(() => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
      }, DEBOUNCE_TIME),
    [quantity]
  );

  const handlePlus = useMemo(
    () =>
      debounce(() => {
        if (quantity < 10) {
          setQuantity(quantity + 1);
        } else {
          noti.limitQuantity();
        }
      }, DEBOUNCE_TIME),
    [quantity]
  );

  return { quantity, handleMinus, handlePlus };
}
