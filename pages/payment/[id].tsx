import {
  createStyles,
  Grid,
  Group,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useContext, useEffect, useState } from "react";
import DeliveryInfoCom from "../../components/DeliveryInfoCom";
import DiscountApply from "../../components/DiscountApply";
import EpochToDate from "../../components/EpochToDate";
import GoBackBtn from "../../components/GoBackBtn";
import OrderSummary from "../../components/OrderSummary";
import PaymentMethod from "../../components/PaymentMethod";
import ProductListCom from "../../components/ProductListCom";
import { ResponsiveLogo } from "../../components/ResponsiveLogo";
import { UserContext, USERCTX } from "../../contexts/users";
import useDeliInfo from "../../hooks/useDeliInfo";
import { ORDER_STATUS } from "../../interfaces/order";
import calculateDelivery from "../../utils/caculateDelivery";
import { isDeliMissing } from "../../utils/checkMissingInfo";

const useStyles = createStyles((theme) => ({
  yellowDot: {
    ...theme.other.dots,
    ...theme.other.yellowRG,
    top: "-40%",
    left: "30%",
  },
  logoBtn: {
    marginTop: "10vh",
    marginBottom: "5vh",
  },
  estimationText: {
    color: theme.colors["pastel-red"],
  },
}));

const blankOrderStatus = {
  deliveryEstimate: 0,
  deliveryFee: 5,
};

export default function PaymentPage(): ReactElement {
  const { user } = useContext<USERCTX>(UserContext);
  const [isMissingInfo, setIsMissingInfo] = useState<boolean>(true);
  const [orderStatus, setOrderStatus] =
    useState<ORDER_STATUS>(blankOrderStatus);
  const [discount, setDiscount] = useState<number>(0);
  const { classes, cx } = useStyles();
  const router = useRouter();
  const info = useDeliInfo();

  // Update delivery information
  useEffect(() => {
    if (user?.cart && user?.cart.length) {
      if (isDeliMissing(info)) {
        setIsMissingInfo(true);
      } else {
        setIsMissingInfo(false);
        const deliveryEstimate = calculateDelivery();

        setOrderStatus({
          deliveryEstimate: deliveryEstimate.date,
          deliveryFee: deliveryEstimate.fee,
        });
      }
    }
  }, [user, info]);

  return (
    <>
      <div className={classes.yellowDot}></div>
      <div className="safe-wrapper">
        <div className="section-padding">
          <Tooltip label="Go back" classNames={{ body: "tooltip-body" }}>
            <GoBackBtn />
          </Tooltip>
        </div>
        <h1>Review your order</h1>
        <Group direction="row" position="apart" align="start">
          <Group direction="column">
            <p className="responsive-big-p">Delivery to</p>
            <DeliveryInfoCom info={info} />
          </Group>
          <Group direction="column">
            <PaymentMethod />
          </Group>
          <Group direction="column" position="right">
            <DiscountApply />
          </Group>
        </Group>
        <Grid justify="space-between">
          <Grid.Col md={7} xs={12}>
            <Group pt="xl">
              <p className="responsive-big-p">Estimation delivery date:</p>
              <p className={cx("responsive-big-p", classes.estimationText)}>
                {orderStatus.deliveryEstimate !== 0 ? (
                  <EpochToDate time={orderStatus.deliveryEstimate} />
                ) : (
                  "Missing address to get estimation"
                )}
              </p>
            </Group>
            {user?.cart && (
              <Group direction="column" pt="xl">
                <p className="responsive-big-p">Your items</p>
                <ProductListCom list={user?.cart} />
              </Group>
            )}
          </Grid.Col>
          <Grid.Col md={3} xs={12}>
            <OrderSummary
              orderStatus={orderStatus}
              discountPer={discount}
              disabledBtn={isMissingInfo}
            />
          </Grid.Col>
        </Grid>
        <UnstyledButton
          className={classes.logoBtn}
          onClick={() => router.push("/")}
        >
          <ResponsiveLogo />
        </UnstyledButton>
      </div>
    </>
  );
}
