import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingBottom: theme.spacing.md,
    overflow: "hidden",

    "&::after": {
      content: '""',
      display: "block",
      height: "35vw",
      width: "35vw",
      borderRadius: "100%",
      backgroundColor: theme.black,
      position: "absolute",
      top: "-10vw",
      left: "-15vw",
      zIndex: -1,

      [theme.fn.largerThan("lg")]: {
        top: "-20vw",
        left: "-10vw",
      },
    },
  },
  bgColorful: {
    backgroundImage: "url('/header-bg-tiny.png')",
    backgroundSize: "50vw",
    backgroundPosition: "60% 10%",
    backgroundRepeat: "no-repeat",
  },
  bgDark: {
    backgroundColor: theme.black,
  },
  container: {
    width: "100%",
    paddingTop: "3rem",
    alignItems: "center",
  },
  middleCol: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
    height: "100%",
  },
  rightCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.colors["pastel-green"],
    gap: theme.spacing.xs,
    fontSize: theme.fontSizes.sm,

    [theme.fn.largerThan("lg")]: {
      fontSize: theme.fontSizes.md,
    },
  },
  badgeText: {
    fontWeight: 300,
  },
}));

export default useStyles;
