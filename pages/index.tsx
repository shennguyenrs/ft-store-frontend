import { createStyles, Text } from "@mantine/core";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import CategoriesNav from "../components/CategoriesNav";
import LinkBtn from "../components/LinkBtn";
import OrdersList from "../components/OrdersList";
import ProductCard from "../components/ProductCard";
import Slider from "../components/Slider";
import { UserContext, USERCTX, USER_TYPE } from "../contexts/users";
import { PRODUCT } from "../interfaces/product";
import { checkUser } from "../libs/authTools";
import { CATE_ROUTES } from "../libs/constants";
import {
  getCategories,
  getRandomProducts,
  getSliderImgs,
} from "../libs/queries";
import orderModel from "../models/order";
import FooterSec from "../sections/FooterSec";
import HeaderNav from "../sections/HeaderNav";
import randomProducts from "../utils/randomProducts";

interface HomeProps {
  products: {
    id: number;
    attributes: PRODUCT;
  }[];
  slider: {
    id: string;
    attributes: {
      url: string;
      hash: string;
    };
  }[];
  categoriesList: [string, number][];
  prevOrders: string;
}

const useStyles = createStyles((theme) => ({
  yellowDot: {
    ...theme.other.dots,
    ...theme.other.yellowRG,
    top: "20%",
    right: "-10%",
  },
  pinkDot: {
    ...theme.other.dots,
    ...theme.other.pinkRG,
    bottom: "40%",
    left: 0,
  },
  purpleDot: {
    ...theme.other.dots,
    ...theme.other.purpleRG,
    bottom: "12%",
    right: "8%",
  },
  exploreCon: {
    position: "relative",

    "&::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "5vw",
      left: 0,
      backgroundImage: "url(/home-line-dash-bg-tiny.png)",
      backgroundPosition: "0 60%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "80%",
      transform: "rotate(-8deg)",
    },

    h1: {
      textAlign: "center",
      marginTop: "6vh",
      marginBottom: "6vh",
    },
  },
  productsCon: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyItems: "center",
    rowGap: theme.spacing.xl,

    [theme.fn.largerThan("lg")]: {
      gridTemplateColumns: `repeat(5, 1fr)`,
    },
  },
  vmCon: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "5vw",
    paddingBottom: "5vw",
    backgroundImage: "url(/view-more-bg-tiny.png)",
    backgroundSize: "50%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

export default function Home({
  products,
  slider,
  categoriesList,
  prevOrders,
}: HomeProps) {
  const { classes, cx } = useStyles();
  const { userType } = useContext<USERCTX>(UserContext);
  const router = useRouter();
  const orders = JSON.parse(prevOrders);

  return (
    <div className="root-wrapper">
      <span className={classes.yellowDot}></span>
      <span className={classes.pinkDot}></span>
      <span className={classes.purpleDot}></span>
      <HeaderNav bg="colorful" />
      <Slider imgs={slider} />
      <CategoriesNav list={categoriesList} />
      <div className={classes.exploreCon}>
        <h1>Expolore products</h1>
        <div className={cx(classes.productsCon, "safe-wrapper")}>
          {products.map((product) => (
            <ProductCard key={product.attributes.productId} product={product} />
          ))}
        </div>
      </div>
      <div className={classes.vmCon}>
        <LinkBtn
          content="View more"
          onClick={() => router.push(CATE_ROUTES.all)}
        />
      </div>
      <div className={cx("safe-wrapper", "section-padding")}>
        <h1>Your previous orders</h1>
        {userType === USER_TYPE.AUTH ? (
          <OrdersList list={orders} />
        ) : (
          <Text className="small-noti-p">Login to save your orders (╥_╥)</Text>
        )}
      </div>
      <FooterSec categoriesList={categoriesList} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const index: number = randomProducts() || 0;
  const { sessionCookie } = ctx.req.cookies;
  let prevOrders = "[]";

  if (sessionCookie) {
    const returnUser = await checkUser(sessionCookie);

    if (returnUser) {
      const orders = await orderModel
        .find({
          orderUser: returnUser.id,
        })
        .exec();

      prevOrders = JSON.stringify(orders);
    }
  }

  const [products, categories, slider] = await axios.all([
    getRandomProducts(index),
    getCategories(),
    getSliderImgs(),
  ]);

  return {
    props: {
      products: products.data.data,
      slider: slider.data.data.attributes.images.data,
      categoriesList: categories.data,
      prevOrders,
    },
  };
};
