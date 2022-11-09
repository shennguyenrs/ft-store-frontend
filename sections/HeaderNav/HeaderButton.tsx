import type { ReactElement } from "react";
import { Tooltip, UnstyledButton, Sx } from "@mantine/core";

import useStyles from "./HeaderNav.styles";

interface HeaderButtonProps {
  label: string;
  clickFn: () => void;
  children: ReactElement[];
  sx?: Sx;
}

export default function HeaderButton({
  label,
  clickFn,
  children,
  sx,
}: HeaderButtonProps): ReactElement {
  const { classes, cx } = useStyles();

  return (
    <Tooltip
      classNames={{
        body: "tooltip-body",
      }}
      label={label}
      position="bottom"
      placement="center"
    >
      <UnstyledButton
        className={cx(classes.button, "base-btn", "button-animation")}
        onClick={clickFn}
        sx={{ ...sx }}
      >
        {children}
      </UnstyledButton>
    </Tooltip>
  );
}
