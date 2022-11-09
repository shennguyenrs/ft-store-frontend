import { Grid, Space, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { ResponsiveLogo } from "../../components/ResponsiveLogo";
import CartButton from "./CartButton";
import ChangeAddressButton from "./ChangeAddressButton";
import useStyles from "./HeaderNav.styles";
import MenuButton from "./MenuButton";
import SearchBar from "./SearchBar";

const Header = ({ bg }: { bg?: string }) => {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <div
      className={cx(
        classes.wrapper,
        bg === "colorful" ? classes.bgColorful : classes.bgDark
      )}
    >
      <Grid className={cx(classes.container, "safe-wrapper")}>
        <Grid.Col xs={2} lg={4}>
          <UnstyledButton onClick={() => router.push("/")}>
            <ResponsiveLogo />
          </UnstyledButton>
        </Grid.Col>
        <Grid.Col className={classes.middleCol} xs={5} lg={4}>
          <SearchBar bg={bg} />
        </Grid.Col>
        <Grid.Col className={classes.rightCol} xs={5} lg={4}>
          <ChangeAddressButton />
          <Space w={theme.spacing.xs} />
          <CartButton />
          <Space w={theme.spacing.xs} />
          <MenuButton />
        </Grid.Col>
      </Grid>
    </div>
  );
};
export default Header;
