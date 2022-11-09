import { createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import LinkBtn from "../components/LinkBtn";
import HeaderNav from "../sections/HeaderNav";

const useStyles = createStyles((theme) => ({
  purpleDot: {
    ...theme.other.dots,
    ...theme.other.purpleRG,
    top: "10%",
    left: "5%",
  },
  pinkDot: {
    ...theme.other.dots,
    ...theme.other.pinkRG,
    bottom: "-10%",
    right: 0,
  },
  mainCon: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/404-bg-tiny.png)",
    backgroundSize: "35%",
  },
  mainText: {
    fontFamily: theme.headings.fontFamily,
    fontSize: "30vh",
    lineHeight: "35vh",
    fontWeight: 700,
    backgroundImage: theme.other.rainbowLG,
    backgroundClip: "text",
    color: "transparent",
    position: "relative",
    textAlign: "center",

    ":after": {
      content: '"404"',
      position: "absolute",
      textShadow: `15px 0 0 ${theme.black}`,
      color: "transparent",
      top: 0,
      left: 0,
      zIndex: -1,
    },
  },
  otherTexts: {
    color: theme.colors["pastel-orange"],
    fontSize: "5vh",
  },
  goBackWrapper: {
    marginTop: "5vh",
  },
}));

export default function FourOFour(): ReactElement {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <div className="root-wrapper">
      <span className={classes.purpleDot}></span>
      <span className={classes.pinkDot}></span>
      <HeaderNav />
      <div className={classes.mainCon}>
        <p className={classes.otherTexts}>ooops...</p>
        <p className={classes.mainText}>404</p>
        <p className={classes.otherTexts}>This page was not found</p>
        <div className={classes.goBackWrapper}>
          <LinkBtn content="Back to home" onClick={() => router.push("/")} />
        </div>
      </div>
    </div>
  );
}
