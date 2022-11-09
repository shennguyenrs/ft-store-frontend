import type { USER } from '../interfaces/user';

export default function sumProducts(products: USER['cart']) {
  if (!products) {
    return 0;
  }

  return (
    Math.round(
      ((products &&
        products.reduce(
          (acc, curr) => acc + curr.product.price * curr.amount,
          0
        )) ??
        0) * 100
    ) / 100
  );
}
