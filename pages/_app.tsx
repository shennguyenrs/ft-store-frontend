import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import GlobalCom from "../components/GlobalStylesCom";
import UserProvider from "../contexts/users";
import Header from "../SEO/Header";
import override from "../styles/globals";
import ReviewProvider from "../contexts/reviews";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header title="Welcome to FT Store" />
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        theme={override}
        styles={{
          Notification: (theme) => ({
            root: {
              fontSize: theme.fontSizes.sm,

              [theme.fn.largerThan("lg")]: {
                fontSize: theme.fontSizes.md,
              },

              "::before": {
                display: "none",
              },
            },
            title: {
              fontWeight: "bold",
            },
            closeButton: {
              color: theme.colors["pastel-red"],
            },
          }),
        }}
      >
        <ModalsProvider>
          <NotificationsProvider>
            <ReviewProvider>
              <UserProvider>
                <GlobalCom />
                <Component {...pageProps} />
              </UserProvider>
            </ReviewProvider>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
