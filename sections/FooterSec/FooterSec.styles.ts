import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: "100%",
    position: "relative",
    marginTop: "5vh",

    [theme.fn.largerThan("lg")]: {
      marginBlock: "5vh",
      maxWidth: theme.other.safeMargin,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  conOutside: {
    [theme.fn.largerThan("lg")]: {
      background: theme.other.rainbowLG,
      padding: theme.radius.lg,
      borderRadius: `calc(${theme.radius.xl}px + ${theme.radius.lg}px)`,
    },
  },
  conInside: {
    color: theme.white,
    backgroundColor: theme.black,
    padding: "2rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: theme.spacing.xl,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,

    h1: {
      color: theme.colors["pastel-orange"],
    },

    [theme.fn.largerThan("lg")]: {
      borderRadius: theme.radius.xl,
    },
  },
  gridWrapper: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "70% 30%",
  },
  flexCol: {
    display: "flex",
    flexDirection: "row",
  },
  linksList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: theme.spacing.xs,
    fontSize: theme.fontSizes.sm,
    lineHeight: "18px",

    [theme.fn.largerThan("lg")]: {
      fontSize: theme.fontSizes.md,
      lineHeight: "20px",
    },

    a: {
      transition: "transform 0.2s ease-in-out",

      "&:hover": {
        transform: "scale(1.06)",
      },
    },
  },
  aboutCol: {
    textAlign: "right",
    fontSize: theme.fontSizes.sm,

    [theme.fn.largerThan("lg")]: {
      fontSize: theme.fontSizes.md,
    },

    a: {
      textDecoration: "underline",
      color: theme.colors["pastel-green"],
    },
  },
  logoWrapper: {
    position: "absolute",
    bottom: "5vw",
    right: "2vw",
  },
}));

export default useStyles;
