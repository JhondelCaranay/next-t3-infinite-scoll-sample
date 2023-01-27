import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import LogoutBanner from "../components/LogoutBanner";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <LogoutBanner />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
