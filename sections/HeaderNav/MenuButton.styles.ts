import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  menuRoot: {
    display: "flex",
  },
  menuBody: {
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    borderWidth: "2px",
    borderColor: theme.black,
  },
  menuItem: {
    padding: theme.spacing.xs,
  },
  menuItemHovered: {
    "&:hover": {
      backgroundColor: theme.fn.rgba(`${theme.colors["pastel-orange"]}`, 0.3),
    },
  },
  avatarRoot: {
    width: "38px",
    height: "38px",

    [theme.fn.largerThan("lg")]: {
      width: "50px",
      height: "50px",
    },
  },
  avatarPlaceholder: {
    color: theme.black,
    backgroundColor: theme.colors["pastel-orange"],
  },
  modalBtn: {
    color: theme.colors["pastel-red"],
    marginTop: "1rem",
  },
}));

export default useStyles;
