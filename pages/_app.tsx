import "../styles/common.style.scss";
import type { AppProps } from "next/app";
import { withPasswordProtect } from "next-password-protect";
import Header from "../components/Header";
import { Roboto } from '@next/font/google'
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

function App({ Component, pageProps }: AppProps) {

 
  return (
    <main >
      <div className="bg-gradient"></div>
        <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      {" "}
      <Header></Header>
      <Component  {...pageProps} />
    </main>
  );
}

export default App;
// export default process.env.PASSWORD_PROTECT
//   ? withPasswordProtect(App, {
//       // Options go here (optional)
//       // loginApiUrl: "/login",
//       // checkApiUrl:"/passwordCheck",
//     })
//   : App;
