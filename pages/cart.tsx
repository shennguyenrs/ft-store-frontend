import {
  createStyles,
  Group,
  LoadingOverlay,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import DefaultLoader from "../components/DefaultLoader";
import GoBackBtn from "../components/GoBackBtn";
import InCartProduct from "../components/InCartProduct";
import { UserContext, USERCTX } from "../contexts/users";
import { getCategories } from "../libs/queries";
import FooterSec from "../sections/FooterSec";
import HeaderNav from "../sections/HeaderNav";
import Header from "../SEO/Header";
import sumProducts from "../utils/sumProducts";

interface CartPageProps {
  categoriesList: [string, number][];
}
 
const useStyles = createStyles ((theme) => ({
  orangeDot: {
    ...theme.other.dots,
    ...theme.other.orangeRG,
    top: 0,
    right: 0,
  },
  pinkDot: {
    ...theme.other.dots,
    ...theme.other.pinkRG,
    bottom: "-50%",
    left: 0,
  },
  breakline: {
    content: '""',
    display: "block",
    height: "2px",
    width: "100%",
    backgroundColor: theme.black,
    borderRadius: theme.radius.xs,
    margin: "4rem 0",
  },
  coWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    margin: "4rem 0",
  },
  nothingWrapper: {
    height: "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/404-bg-tiny.png)",
    backgroundSize: "60%",
    backgroundPosition: "center",
  },
  totalAmount: {
    fontWeight: 700,
  },
}));

export default function CartPage({ categoriesList }: CartPageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sum, setSum] = useState<number>(0);
  const { user } = useContext<USERCTX>(UserContext);
  const { classes, cx } = useStyles();
  const router = useRouter();

  useEffect(() => {
    const total: number = sumProducts(user?.cart);
    setSum(total);
  }, [user]);

  const handleCheckout = () => {
    setLoading(true);
    router.push(user?.id ? `/payment/${user?.id}` : "/payment/guest");
    setLoading(false);
  };

  return (
    <>
      <Header title="FT Store - Your basket" />
      <LoadingOverlay visible={loading} loader={<DefaultLoader />} />
      <span className={classes.orangeDot}></span>
      <span className={classes.pinkDot}></span>
      <HeaderNav />
      <div className="safe-wrapper">
        <div className="section-padding">
          <Tooltip label="Go back" classNames={{ body: "tooltip-body" }}>
            <GoBackBtn />
          </Tooltip>
        </div>
        <div>
          <h1>Shopping Basket</h1>
          <Group position="right">
            <h3>Price</h3>
          </Group>
          {(user?.cart && user?.cart.length && (
            <>
              <Group spacing="xl">
                {user.cart.map((item) => (
                  <InCartProduct key={item.product.productId} item={item} />
                ))}
              </Group>
              <div className={classes.breakline}></div>
              <Group position="right">
                <p className="responsive-big-p">
                  Total ({user.cart.length} items):{" "}
                </p>
                <p className={cx(classes.totalAmount, "responsive-big-p")}>
                  € {sum}
                </p>
              </Group>
              <div className={classes.coWrapper}>
                <UnstyledButton
                  className="rainbow-btn"
                  onClick={handleCheckout}
                >
                  Proceed to check out
                </UnstyledButton>
              </div>
            </>
          )) || (
            <div className={classes.nothingWrapper}>
              <p className="small-noti-p">
                You have nothing in your cart (╥_╥)
              </p>
            </div>
          )}
        </div>
      </div>
      <FooterSec categoriesList={categoriesList} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [categoriesList] = await axios.all([getCategories()]);

  return {
    props: {
      categoriesList: categoriesList.data,
    },
  };
};
