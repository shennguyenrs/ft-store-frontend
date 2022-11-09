import { CLEAN_ORDER } from '../interfaces/order';
import { USER_INFO } from '../interfaces/user';

export const isDeliMissing = (info: CLEAN_ORDER['deliveryInfo']) => {
  const { fullname, address, zipcode, city } = info;
  return fullname === '' || address === '' || zipcode === '' || city === '';
};

export const isUserInfoMissing = (info: USER_INFO) => {
  const { username, fullname, email, address, zipcode, city } = info;
  return (
    fullname === '' ||
    address === '' ||
    zipcode === '' ||
    city === '' ||
    username === '' ||
    email === ''
  );
};
