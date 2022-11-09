const TRANSPORT_TIME = 14;
const TRANSPORT_FEE = 10;
const BASE_FEE = 5;

export default function calculateDelivery() {
  const today = new Date();
  const deliveryDate = new Date();

  if (deliveryDate.getDay() === 0) {
    deliveryDate.setDate(today.getDate() + TRANSPORT_TIME + 1);
  } else if (deliveryDate.getDay() === 6) {
    deliveryDate.setDate(today.getDate() + TRANSPORT_TIME + 2);
  } else {
    deliveryDate.setDate(today.getDate() + TRANSPORT_TIME);
  }

  return {
    date: deliveryDate.valueOf(),
    fee: BASE_FEE + TRANSPORT_FEE,
  };
}
