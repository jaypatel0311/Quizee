import "next/head";
import React from "react";
import Head from "next/head";
import AppBar from "@/app/components/AppBar";
function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;
