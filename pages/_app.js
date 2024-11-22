import "next/head";
import React from "react";
import Head from "next/head";
import AppBar from "@/app/components/AppBar";
import { Provider } from "react-redux";
import store from "@/app/reducer/store";
import Progress from "@/app/helpers/Progress";
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Progress.OverlayProgress />
      <React.Fragment>
        <Head>
          <title>Quizee</title>
          <link rel="icon"></link>
        </Head>
        <div>
          <AppBar></AppBar>
          <Component {...pageProps} />
        </div>
      </React.Fragment>
    </Provider>
  );
}

export default MyApp;
