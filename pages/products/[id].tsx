import { createStyles, Grid, Tooltip } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { useContext, useEffect } from "react";
import DisplayInfo from "../../components/DisplayInfo";
import GoBackBtn from "../../components/GoBackBtn";
import ImagesViewer from "../../components/ImagesViewer";
import ProductInfo from "../../components/ProductInfo";
import UserReviewsList from "../../components/UserReviewsList";
import { ReviewContext, REVIEWCTX } from "../../contexts/reviews";
import { PRODUCT } from "../../interfaces/product";
import { getCategories, getProductById } from "../../libs/queries";
import ordererModel from "../../models/orderer";
import FooterSec from "../../sections/FooterSec";
import HeaderNav from "../../sections/HeaderNav";
import Header from "../../SEO/Header";
import reviewsTranform from "../../utils/reviewsTranform";

interface ProductPageProps {
  categoriesList: [string, number][];
  product: {
    id: string;
    attributes: PRODUCT;
  };
  orderers: string[];
}

const useStyles = createStyles((theme) => ({
  purpleDot: {
    ...theme.other.dots,
    ...theme.other.purpleRG,
    top: 0,
    right: 0,
  },
  greenDot: {
    ...theme.other.dots,
    ...theme.other.greenRG,
    top: "30%",
    left: "-18%",
  },
  blueDot: {
    ...theme.other.dots,
    ...theme.other.blueRG,
    bottom: "18%",
    right: "0",
  },
  middleBg: {
    backgroundImage: "url(/products-bg-tiny.png)",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "70%",
    minHeight: "20vh",
  },
  reviewWrapper: {
    marginTop: "-10vh",
    marginBottom: "20vh"
  },
}));

export default function ProductPage({
  categoriesList,
  product,
  orderers,
}: ProductPageProps) {
  const { productId, name, imageIds, specification, weight, technicalDetails } =
    product.attributes;
  const { handleSetStates } = useContext<REVIEWCTX>(ReviewContext);
  const { classes, cx } = useStyles();

  useEffect(() => {
    if (product && orderers) {
      handleSetStates({
        reviews: product.attributes.reviews,
        spId: Number(product.id),
        currAvgRating: Number(product.attributes.avgRating),
        currRatingAmount: Number(product.attributes.ratingAmount),
        orderers,
      });
    }
  }, [product, orderers]);

  return (
    <>
      <Header title={name} />
      <div className="root-wrapper">
        <span className={classes.purpleDot}></span>
        <span className={classes.greenDot}></span>
        <span className={classes.blueDot}></span>
        <HeaderNav />
        <div className="safe-wrapper">
          <div className="section-padding">
            <Tooltip label="Go back" classNames={{ body: "tooltip-body" }}>
              <GoBackBtn />
            </Tooltip>
          </div>
          <Grid className="safe-wrapper">
            <Grid.Col lg={6} xs={12}>
              <ImagesViewer id={productId} images={imageIds || ""} />
            </Grid.Col>
            <Grid.Col lg={6} xs={12}>
              <ProductInfo product={product.attributes} />
            </Grid.Col>
          </Grid>
          <Grid
            grow
            sx={{
              marginTop: "3rem",
            }}
          >
            <Grid.Col span={6}>
              <DisplayInfo label="Product Specification" info={specification} />
            </Grid.Col>
            <Grid.Col span={6}>
              <h3>Shipping Weight</h3>
              <ul>
                <li>{weight}</li>
              </ul>
            </Grid.Col>
            <Grid.Col span={4} sx={{ marginTop: "3rem" }}>
              <DisplayInfo label="Technical Details" info={technicalDetails} />
            </Grid.Col>
          </Grid>
        </div>
        <div className={classes.middleBg} />
        <div className={cx("safe-wrapper", classes.reviewWrapper)}>
          <h1>Customers Reviews</h1>
          <UserReviewsList />
        </div>
        <FooterSec categoriesList={categoriesList} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const id = params?.id as string;
  const { sessionCookie } = req.cookies;
  let orderers: string[] = [];

  // Search for orderers of the product
  if (sessionCookie) {
    let raw = await ordererModel.find({ productId: id }).exec();

    if (raw.length) {
      orderers = raw[0].orderers.map((i: string) => {
        return i.toString();
      });
    }
  }

  const [categoriesList, product] = await axios.all([
    getCategories(),
    getProductById(id),
  ]);

  // Goes to 404 if product not found
  if (!product.data.data.length) {
    return {
      notFound: true,
    };
  }

  let rawProduct = product.data.data[0];
  let rawReviews = rawProduct.attributes.reviews.data;

  if (rawReviews.length) {
    let reviews = reviewsTranform(rawReviews, rawProduct.id);
    rawProduct.attributes.reviews = reviews;
  } else {
    rawProduct.attributes.reviews = [];
  }

  return {
    props: {
      product: rawProduct,
      categoriesList: categoriesList.data,
      orderers,
    },
  };
};
