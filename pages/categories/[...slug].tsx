import { createStyles, Drawer, Tooltip, UnstyledButton } from "@mantine/core";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import FilterPannel from "../../components/FilterPannel";
import GoBackBtn from "../../components/GoBackBtn";
import ProductsInfinite from "../../components/ProductsInfinite";
import { getCategories } from "../../libs/queries";
import HeaderNav from "../../sections/HeaderNav";

const useStyles = createStyles((theme) => ({
  yellowDot: {
    ...theme.other.dots,
    ...theme.other.yellowRG,
    top: 0,
    right: "-10%",
  },
  orangeDot: {
    ...theme.other.dots,
    ...theme.other.orangeRG,
    top: "50%",
    left: "5%",
  },
  topBg: {
    backgroundImage: "url(/view-more-bg-tiny.png)",
    backgroundPosition: "center",
    backgroundSize: "95%",
    backgroundRepeat: "no-repeat",
  },
  rootWrapper: {
    paddingBottom: "3vw",
    backgroundImage: "url(/home-line-dash-bg-tiny.png)",
    backgroundSize: "95%",

    [theme.fn.largerThan("lg")]: {
      display: "grid",
      gridTemplateColumns: `30% 70%`,
    },
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors["pastel-orange"],
  },
  topBtnWraper: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawerBody: {
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
    overflowY: "scroll",
  },
  drawerHeader: {
    fontWeight: 700,
  },
  drawerCloseBtn: {
    color: theme.colors["pastel-red"],
  },
  drawerBtn: {
    display: "inline",

    [theme.fn.largerThan("lg")]: {
      display: "none",
    },
  },
  drawerPannel: {
    display: "none",
    [theme.fn.largerThan("lg")]: {
      display: "inline",
    },
  },
}));

interface CategoriesPageProps {
  categoriesList: [string, number][];
  countItems: number;
  param: string[];
}

export default function CategoriesPage({
  categoriesList,
  countItems,
}: CategoriesPageProps) {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { classes, cx } = useStyles();

  return (
    <div className="root-wrapper">
      <span className={classes.yellowDot} />
      <span className={classes.orangeDot} />
      <HeaderNav />
      <div className={"safe-wrapper"}>
        <div
          className={cx("section-padding", classes.topBg, classes.topBtnWraper)}
        >
          <Tooltip label="Go back" classNames={{ body: "tooltip-body" }}>
            <GoBackBtn />
          </Tooltip>
          <div className={classes.drawerBtn}>
            <Drawer
              opened={openFilter}
              onClose={() => setOpenFilter(false)}
              title="Product filter"
              position="right"
              padding="md"
              size="xl"
              aria-labelledby="Filter drawer"
              aria-describedby="filter-body"
              closeButtonLabel="Close drawer"
              transition="slide-left"
              transitionDuration={250}
              transitionTimingFunction="ease"
              overlayOpacity={0.55}
              classNames={{
                drawer: classes.drawerBody,
                header: classes.drawerHeader,
                closeButton: classes.drawerCloseBtn,
              }}
            >
              <FilterPannel list={categoriesList} count={countItems} />
            </Drawer>
            <UnstyledButton
              className={cx(classes.filterBtn, "base-btn", "button-animation")}
              onClick={() => setOpenFilter(true)}
            >
              <IoFilterOutline />
              Filter
            </UnstyledButton>
          </div>
        </div>
        <div className={classes.rootWrapper}>
          <div className={classes.drawerPannel}>
            <FilterPannel list={categoriesList} count={countItems} />
          </div>
          <ProductsInfinite />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [categoriesList] = await axios.all([getCategories()]);

  let countItems = 0;

  categoriesList.data.map((item: [string, number]) => {
    countItems += item[1];
  });

  return {
    props: {
      categoriesList: categoriesList.data,
      countItems,
    },
  };
};
