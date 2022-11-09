import { Box, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import { UserContext, USERCTX, USER_TYPE } from "../../contexts/users";
import createCateURL from "../../utils/createCateURL";
import randomColors from "../../utils/randomColors";
import useStyles from "./FooterSec.styles";

interface FooterSectionProps {
  categoriesList: [string, number][];
}

export default function FooterSec({
  categoriesList,
}: FooterSectionProps): ReactElement {
  const [colorOne, setColorOne] = useState<string>("");
  const [colorTwo, setColorTwo] = useState<string>("");
  const { userType, user } = useContext<USERCTX>(UserContext);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const router = useRouter();

  useEffect(() => {
    const colorsArr = randomColors();
    setColorOne(colorsArr[0]);
    setColorTwo(colorsArr[1]);
  }, []);

  const AllDepartment = () => (
    <div>
      <h1>All Departments</h1>
      <Box
        className={classes.linksList}
        sx={{
          "a:hover": {
            color: theme.colors[colorOne],
          },
        }}
      >
        {categoriesList.map((item: [string, number]) => (
          <a key={item[0]} onClick={() => router.push(createCateURL(item[0]))}>
            {item[0]}
          </a>
        ))}
      </Box>
    </div>
  );

  const YourAccount = () => {
    if (userType === USER_TYPE.AUTH) {
      return (
        <div>
          <h1>Your Account</h1>
          <Box
            className={classes.linksList}
            sx={{
              "a:hover": {
                color: theme.colors[colorTwo],
              },
            }}
          >
            {[
              {
                label: "Edit Information",
              },
              {
                label: "Orders History",
              },
              {
                label: "Favorite Products",
              },
            ].map((item: any) => (
              <a key={item.label} href={`/users/${user?.id}`}>
                {item.label}
              </a>
            ))}
          </Box>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const AboutCom = () => (
    <div className={classes.aboutCol}>
      <h1>About</h1>
      <p>
        Hi, My name is <a href="https://shennguyen.me">Shen Nguyen</a>. This is
        a project from my thesis. The project uses{" "}
        <a href="https://nextjs.org/">Next Js</a>,{" "}
        <a href="https://strapi.io/">Strapi</a> and{" "}
        <a href="https://mantine.dev/">Mantine</a>. <br /> <br /> You can find
        the project repository at:{" "}
        <a href="https://github.com/shennguyenrs/ft-store-frontend">Github</a>
      </p>
    </div>
  );

  return (
    <div className={cx(classes.wrapper, "sections-margin")}>
      <div className={classes.conOutside}>
        <div className={classes.conInside}>
          <div className={classes.gridWrapper}>
            <div className={classes.flexCol}>
              <AllDepartment />
              <YourAccount />
            </div>
            <AboutCom />
          </div>
          <div className={cx(classes.logoWrapper, "button-animation")}>
            <a href="https://shennguyen.me">
              <Image
                src="/s-logo.svg"
                width={100}
                height={100}
                alt="creator-logo"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
