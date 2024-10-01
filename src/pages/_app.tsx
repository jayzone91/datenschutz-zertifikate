import "@mdxeditor/editor/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Container } from "react-bootstrap";
import Breadcrumb from "~/Components/Breadcrumb";
import Menubar from "~/Components/Menubar";

import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={GeistSans.className}>
        <Menubar />
        <Container>
          <Breadcrumb />
          <Component {...pageProps} />
        </Container>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
