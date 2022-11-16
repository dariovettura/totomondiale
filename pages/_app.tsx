import "../styles/common.style.scss";
import type { AppProps } from "next/app";
import { withPasswordProtect } from "next-password-protect";
import Header from "../components/Header";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {" "}
      <Header></Header>
      <Component {...pageProps} />
    </>
  );
}
export default process.env.PASSWORD_PROTECT
  ? withPasswordProtect(App, {
      // Options go here (optional)
      // loginApiUrl: "/login",
      // checkApiUrl:"/passwordCheck",
    })
  : App;
