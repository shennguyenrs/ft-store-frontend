const max = Number(process.env.PRODUCT_AMOUNT);
const limit = Number(process.env.PRODUCT_LIMIT);

// Return index which index + limit < max
// and index > 0
export default function randomProducts() {
  const index = Math.floor(Math.random() * (max - limit));
  return index;
}
