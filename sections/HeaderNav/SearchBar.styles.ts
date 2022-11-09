import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100%',
  },
  wrapper: {
    width: '100%',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    minHeight: '95%',
    borderWidth: '3px',
    borderColor: theme.black,
    borderRadius: theme.radius.md,
  },
  rgtSec: {
    marginRight: theme.spacing.xs,
  },
  bgYellow: {
    backgroundColor: theme.colors['pastel-yellow'],
  },
  bgWhite: {
    backgroundColor: theme.white,
  },
  dropdown: {
    border: `2px solid ${theme.black}`,
  },
  item: {
    padding: theme.spacing.xs,
  },
  itemHovered: {
    backgroundColor: theme.fn.rgba(`${theme.colors['pastel-orange']}`, 0.3),
  },
}));

export default useStyles;
