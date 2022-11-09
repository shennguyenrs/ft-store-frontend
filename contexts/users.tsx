import axios from "axios";
import {
  createContext,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CLEAN_ORDER, ORDER } from "../interfaces/order";
import { IN_CART, SHORT_PRODUCT } from "../interfaces/product";
import { CLEAN_USER, USER_INFO } from "../interfaces/user";
import { API_ROUTES, USER_API_SLUG } from "../libs/constants";
import {
  addNewToCart,
  addToFavoried,
  loginRequired,
  newAvaSaved,
  updateDeliInfo,
} from "../libs/noti";

export enum USER_TYPE {
  AUTH = "Authenticated",
  GUEST = "Guest",
}

export interface USERCTX {
  user: CLEAN_USER | null;
  userType: USER_TYPE;
  addToCart: (obj: IN_CART, fireNoti: boolean) => void;
  removeFromCart: (id: string) => void;
  addToFav: (product: SHORT_PRODUCT) => void;
  removeFromFav: (product: SHORT_PRODUCT) => void;
  updateUserInfo: (info: USER_INFO | CLEAN_ORDER["deliveryInfo"]) => void;
  handleAvatarUpdate: (file: File) => Promise<void>;
  handlePlaceOrder: (newOrder: ORDER) => Promise<boolean>;
  checkUser: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const UserContext = createContext<USERCTX>({
  user: null,
  userType: USER_TYPE.GUEST,
  addToCart: () => {},
  removeFromCart: () => {},
  addToFav: () => {},
  removeFromFav: () => {},
  updateUserInfo: () => {},
  handleAvatarUpdate: async () => {},
  handlePlaceOrder: async () => false,
  checkUser: async () => {},
  logout: async () => {},
  deleteAccount: async () => {},
});

export default function UserProvider({
  children,
}: {
  children: ReactElement[];
}) {
  const [user, setUser] = useState<USERCTX["user"]>(null);
  const [userType, setUserType] = useState<USER_TYPE>(USER_TYPE.GUEST);

  // Get cart, search history from local storage
  const getUserFromLocal = () => {
    let localUser: CLEAN_USER | null = null;

    if (typeof window !== "undefined") {
      localUser = JSON.parse(localStorage.getItem("user") || "{}");
    }

    return localUser;
  };

  const updateLocalStorage = (value: any) => {
    localStorage.setItem("user", JSON.stringify(value));
  };

  // Check if user is logged in
  const checkUser = async () => {
    try {
      const { data } = await axios.get(`${API_ROUTES.authUser}/check`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (data.user) {
        setUserType(USER_TYPE.AUTH);
        setUser(data.user);
      }
    } catch (error) {
      const localUser = getUserFromLocal();
      setUser(localUser ?? null);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await axios.delete(`${API_ROUTES.authUser}/logout`);
      setUser(null);
      localStorage.removeItem("user");
      window.location.reload();
    } catch (error) {
      // TODO: Fires noti for failed logout
      return;
    }
  };

  // Handle delete account
  const deleteAccount = async () => {
    try {
      await axios.delete(`${API_ROUTES.authUser}/delete`);
      logout();
    } catch (error) {
      // TODO: Fires noti for failed delete account
      return;
    }
  };

  // NOTE: Consider that the fucntion can return boolean, so that if failed to update fields, the notification will be sent
  // Handle field change on cloud
  const handleFieldChange = async (newField: {}) => {
    try {
      if (userType === USER_TYPE.AUTH) {
        await axios.put(
          `${API_ROUTES.users}/${user?.id as string}/${USER_API_SLUG.fields}`,
          newField
        );
      }
    } catch (error) {
      // TODO: Fires noti for failed update field
      return;
    }
  };

  // Handle update user avatar
  const handleAvatarUpdate = async (file: File) => {
    try {
      // Check Strapi id of user
      const people = await axios.get(
        `${API_ROUTES.users}/${user?.id as string}`
      );
      let savedImg;

      const sId = people.data[0].id;

      // Upload new avatar image
      const { data } = await axios.post(
        `${API_ROUTES.users}/${user?.id as string}/${USER_API_SLUG.ava}/${sId}`,
        { file: JSON.stringify(file) }
      );

      savedImg = data[0];

      const newUser = {
        ...user,
        avatar: savedImg.hash + savedImg.ext,
      } as CLEAN_USER;

      setUser(newUser);

      await handleFieldChange({
        avatar: newUser.avatar,
      });

      // Fire noti
      newAvaSaved();
    } catch (error) {
      // TODO: Fires noti for failed upload avatar
      return;
    }
  };

  // Handle place new order
  const handlePlaceOrder = async (newOrder: ORDER) => {
    try {
      const userId = user?.id ?? "guest";
      const res = await axios.post(`${API_ROUTES.orders}/${userId}`, newOrder);

      // Handle clear cart and add new orderId
      const newOrders: string[] = [...(user?.orders ?? []), res.data.orderId];

      const newUser = {
        ...user,
        cart: [],
        orders: newOrders,
      } as CLEAN_USER;

      setUser(newUser);

      await handleFieldChange({ cart: [] });

      return true;
    } catch (err) {
      return false;
      // TODO: Fires noti for failed place order
    }
  };

  //  Handle add item to favorite
  const addToFav = (product: SHORT_PRODUCT) => {
    if (userType === USER_TYPE.GUEST) {
      loginRequired();
      return;
    }

    // Create favorite products field if not exists
    let newFav = [...(user?.favoriteProducts ?? []), product];

    const newUser = {
      ...user,
      favoriteProducts: newFav,
    } as CLEAN_USER;

    setUser(newUser);

    handleFieldChange({
      favoriteProducts: newFav,
    });

    // Fire noti
    addToFavoried(product.name);
  };

  // Handle remove item from favorite
  const removeFromFav = (product: SHORT_PRODUCT) => {
    let newFav = user?.favoriteProducts?.filter(
      (fav) => fav.productId !== product.productId
    );

    const newUser = {
      ...user,
      favoriteProducts: newFav,
    } as CLEAN_USER;

    setUser(newUser);

    userType === USER_TYPE.GUEST && updateLocalStorage(newUser);

    handleFieldChange({
      favoriteProducts: newFav,
    });
  };

  // Handle add new item to cart
  const addToCart = (obj: IN_CART, fireNoti: boolean) => {
    let newCart = [...(user?.cart ?? [])];
    const editedIndex = newCart.findIndex(
      (item) => item.product.productId === obj.product.productId
    );

    if (editedIndex !== -1) {
      newCart[editedIndex].amount += 1;
    } else {
      newCart.push(obj);
    }

    const newUser = {
      ...user,
      cart: newCart,
    } as CLEAN_USER;

    setUser(newUser);

    userType === USER_TYPE.GUEST && updateLocalStorage(newUser);

    handleFieldChange({ cart: newCart });

    // Fire noti
    fireNoti && addNewToCart(obj.product.name);
  };

  // Handle remove item from cart
  const removeFromCart = (id: string) => {
    let newCart =
      user?.cart?.filter((item) => item.product.productId !== id) ?? [];

    const newUser = {
      ...user,
      cart: newCart,
    } as CLEAN_USER;

    setUser(newUser);

    userType === USER_TYPE.GUEST && updateLocalStorage(newUser);

    handleFieldChange({ cart: newCart });
  };

  // Handle update user info
  const updateUserInfo = (newInfo: USER_INFO | CLEAN_ORDER["deliveryInfo"]) => {
    const newUser = {
      ...user,
      ...newInfo,
    } as CLEAN_USER;

    setUser(newUser);

    userType === USER_TYPE.GUEST && updateLocalStorage(newUser);

    handleFieldChange(newInfo);

    // Fire noti
    updateDeliInfo();
  };

  const ctxInput = useMemo(() => {
    return {
      user,
      userType,
      addToCart,
      removeFromCart,
      addToFav,
      removeFromFav,
      updateUserInfo,
      handleAvatarUpdate,
      handlePlaceOrder,
      checkUser,
      logout,
      deleteAccount,
    };
  }, [user]);

  // Check user on load page
  useEffect(() => {
    if (!user) {
      checkUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={ctxInput}>{children}</UserContext.Provider>
  );
}
