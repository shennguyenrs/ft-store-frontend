import { useState, useContext, useEffect } from 'react';
import { CLEAN_ORDER } from '../interfaces/order';
import { UserContext, USERCTX } from '../contexts/users';

const blankDeliveryInfo: CLEAN_ORDER['deliveryInfo'] = {
  fullname: '',
  email: '',
  address: '',
  zipcode: '',
  city: '',
};

export default function useDeliInfo() {
  const [info, setInfo] =
    useState<CLEAN_ORDER['deliveryInfo']>(blankDeliveryInfo);
  const { user } = useContext<USERCTX>(UserContext);

  // Update delivery information
  useEffect(() => {
    if (user) {
      const info = {
        fullname: (user.fullname as string) || '',
        email: (user.email as string) || '',
        address: (user.address as string) || '',
        zipcode: (user.zipcode as string) || '',
        city: (user.city as string) || '',
      };

      setInfo(info);
    }
  }, [user]);

  return info;
}
