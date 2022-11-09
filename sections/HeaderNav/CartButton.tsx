import { useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { useContext } from "react";
import { IoCart } from "react-icons/io5";
import { UserContext, USERCTX } from "../../contexts/users";
import HeaderButton from "./HeaderButton";
import useStyles from "./HeaderNav.styles";

export default function CartButton(): ReactElement {
  const { classes } = useStyles();
  const { user } = useContext<USERCTX>(UserContext);
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <HeaderButton
      label="View items"
      aria-label="view-cart-button"
      clickFn={() => router.push("/cart")}
      sx={{
        backgroundColor: theme.colors["pastel-orange"],
      }}
    >
      <IoCart />
      <p className={classes.badgeText}>{user?.cart?.length ?? 0}</p>
    </HeaderButton>
  );
}
