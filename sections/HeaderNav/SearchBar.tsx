import {
  Autocomplete,
  AutocompleteItem,
  SelectItemProps,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import { Base64 } from "js-base64";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoSearch } from "react-icons/io5";
import { API_ROUTES, CATE_ROUTES } from "../../libs/constants";
import { itemByName } from "../../libs/queries";
import useStyles from "./SearchBar.styles";

const CustomItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, ...others }: SelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Text size="sm" lineClamp={1}>
        {value}
      </Text>
    </div>
  )
);

CustomItem.displayName = "CustomItem";

export default function SearchBar({
  bg,
}: {
  bg: string | undefined;
}): ReactElement {
  const [value, setValue] = useState<string>("");
  const [searchItem, setSearchItem] = useState<AutocompleteItem | null>(null);
  const [searchs, setSearchs] = useState<(AutocompleteItem | string)[]>([
    "No results found",
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const router = useRouter();

  // Handle input change with debouce 800ms
  const handleChange = useMemo(
    () =>
      debounce(async () => {
        const currentValue = inputRef.current?.value as string;

        if (currentValue && currentValue.length) {
          setValue(currentValue);

          const { data } = await axios.get(
            `${API_ROUTES.products}?` + itemByName(currentValue)
          );

          if (data.length) {
            setSearchs([
              ...data.map((item: any) => ({
                value: item.attributes.name,
                id: item.attributes.productId,
              })),
            ]);
          }
        }
      }, 800),
    [inputRef]
  );

  // Handle submit on enter pressed and value is not empty
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchItem) {
        router.push(`/products/${searchItem.id}`);
      } else {
        if (value) {
          const query = itemByName(value);
          router.push(`${CATE_ROUTES.query}${Base64.encodeURI(query)}`);
          setValue("");
          setSearchItem(null);
        }
      }
    }
  };

  // Handle submit search on click
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (searchItem) {
      router.push(`/products/${searchItem.id}`);
    } else {
      if (value) {
        const query = itemByName(value);
        router.push(`${CATE_ROUTES.query}${Base64.encodeURI(query)}`);
      }
    }

    setValue("");
    setSearchItem(null);
  };

  return (
    <Autocomplete
      placeholder="Do you want to find something?"
      type="text"
      ref={inputRef}
      data={searchs}
      classNames={{
        root: classes.root,
        wrapper: classes.wrapper,
        input: cx(
          classes.input,
          bg === "colorful" ? classes.bgYellow : classes.bgWhite
        ),
        rightSection: classes.rgtSec,
        dropdown: classes.dropdown,
        item: classes.item,
        hovered: classes.itemHovered,
      }}
      rightSection={
        <UnstyledButton onClick={handleClick}>
          <IoSearch color={theme.black} />
        </UnstyledButton>
      }
      itemComponent={CustomItem}
      onChange={handleChange}
      onKeyDown={handleEnter}
      onItemSubmit={(item: AutocompleteItem) => setSearchItem(item)}
      dropdownPosition="bottom"
      transition="slide-up"
      transitionDuration={800}
      transitionTimingFunction="ease"
    />
  );
}
