import { createStyles, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useModals } from "@mantine/modals";
import axios from "axios";
import { GetServerSideProps } from "next";
import { ReactElement, useContext } from "react";
import { IoTrash } from "react-icons/io5";
import FavProductsList from "../../components/FavProductsList";
import GoBackBtn from "../../components/GoBackBtn";
import OrdersList from "../../components/OrdersList";
import UploadAvatar from "../../components/UploadAvatar";
import UserInfoCom from "../../components/UserInfoCom";
import { UserContext, USERCTX } from "../../contexts/users";
import { ORDER } from "../../interfaces/order";
import { SHORT_PRODUCT } from "../../interfaces/product";
import { CLEAN_USER } from "../../interfaces/user";
import { checkUser } from "../../libs/authTools";
import { getCategories } from "../../libs/queries";
import orderModel from "../../models/order";
import FooterSec from "../../sections/FooterSec";
import HeaderNav from "../../sections/HeaderNav";

const MAXIMUM_LIST = 3;

interface UserPageProps {
  categoriesList: [string, number][];
  userInfo: CLEAN_USER;
  prevOrders: string;
  favProducts: string;
}

const useStyles = createStyles((theme) => ({
  yellowDot: {
    ...theme.other.dots,
    ...theme.other.yellowRG,
    top: "20%",
    right: "-10%",
  },
  greenDot: {
    ...theme.other.dots,
    ...theme.other.greenRG,
    top: "30%",
    left: "-18%",
  },
  topBg: {
    backgroundImage: "url(/userpage-bg-tiny.png)",
    backgroundPosition: "center",
    backgroundSize: "90%",
    backgroundRepeat: "no-repeat",
  },
  infoWrapper: {
    display: "grid",
    gridTemplateColumns: "350px auto",
    gridColumnGap: theme.spacing.xl,
  },
  dashBG: {
    display: "relative",

    "::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      backgroundImage: "url(/userspage--dash-tiny.png)",
      backgroundPosition: "0 60%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "80%",
      zIndex: -1,
    },
  },
  orderFavWrapper: {
    display: "flex",
    flexDirection: "column",

    [theme.fn.largerThan("lg")]: {
      display: "grid",
      gridColumnGap: theme.spacing.xl,
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  btn: {
    textAlign: "center",
    padding: `${theme.spacing.xs} ${theme.spacing.xl}`,
    borderRadius: theme.radius.md,
  },
  logout: {
    backgroundColor: theme.fn.rgba(`${theme.colors["pastel-red"]}`, 0.3),
  },
  delete: {
    fontWeight: 700,
    backgroundColor: theme.colors["pastel-red"],
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  cancel: {
    border: `2px solid ${theme.black}`,
  },
}));

export default function UserPage({
  categoriesList,
  userInfo,
  prevOrders,
  favProducts,
}: UserPageProps): ReactElement {
  const { classes, cx } = useStyles();
  const { logout, deleteAccount } = useContext<USERCTX>(UserContext);
  const modals = useModals();
  const orders = JSON.parse(prevOrders) as ORDER[];
  const fav = JSON.parse(favProducts) as SHORT_PRODUCT[];

  const openDeleteModal = () => {
    const id = modals.openModal({
      title: "😭 Do you really want to delete your account?",
      centered: true,
      children: (
        <div>
          <Text>
            All your information will be deleted including delivery information,
            avatar, reviews.
          </Text>
          <div className={classes.btnWrapper}>
            <UnstyledButton
              className={cx(classes.btn, classes.cancel, "button-animation")}
              onClick={() => modals.closeModal(id)}
            >
              Cancel
            </UnstyledButton>
            <UnstyledButton
              className={cx(classes.btn, classes.delete, "button-animation")}
              onClick={deleteAccount}
            >
              Delete
            </UnstyledButton>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="root-wrapper">
      <span className={classes.yellowDot}></span>
      <span className={classes.greenDot}></span>
      <HeaderNav />
      <div className={"safe-wrapper"}>
        <div className={cx("section-padding", classes.topBg)}>
          <Tooltip label="Go back" classNames={{ body: "tooltip-body" }}>
            <GoBackBtn />
          </Tooltip>
        </div>
        <div>
          <h1>Account Management</h1>
          <div className={classes.infoWrapper}>
            <UploadAvatar ava={userInfo.avatar as string} />
            <UserInfoCom info={userInfo} />
          </div>
        </div>
        <div className={classes.dashBG}>
          <div className={classes.orderFavWrapper}>
            <div>
              <h1>Previous orders</h1>
              <OrdersList list={orders.slice(0, MAXIMUM_LIST)} />
            </div>
            <div>
              <h1>Favorite products</h1>
              <FavProductsList list={fav} />
            </div>
          </div>
          <div className={cx("section-padding", classes.btnWrapper)}>
            <UnstyledButton
              className={cx("button-animation", classes.btn, classes.logout)}
              onClick={logout}
            >
              Log out
            </UnstyledButton>
            <UnstyledButton
              className={cx("button-animation", classes.btn, classes.delete)}
              onClick={openDeleteModal}
            >
              <IoTrash />
              Delete Account
            </UnstyledButton>
          </div>
        </div>
      </div>
      <FooterSec categoriesList={categoriesList} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const id = params?.id as string;
  const { sessionCookie } = req.cookies;

  if (!sessionCookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const returnUser = await checkUser(sessionCookie);

  if (!returnUser || returnUser.id !== id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const [categories] = await axios.all([getCategories()]);

  const orders = await orderModel.find({ orderUser: id }).exec();
  const prevOrders = JSON.stringify(orders);

  const userInfo = {
    username: returnUser.username ?? "",
    fullname: returnUser.fullname ?? "",
    email: returnUser.email ?? "",
    address: returnUser.address ?? "",
    city: returnUser.city ?? "",
    zipcode: returnUser.zipcode ?? "",
    avatar: returnUser.avatar ?? "",
  };

  return {
    props: {
      categoriesList: categories.data,
      userInfo,
      prevOrders,
      favProducts: JSON.stringify(returnUser.favoriteProducts),
    },
  };
};
