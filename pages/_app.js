import "next/head";
import React from "react";
import Head from "next/head";
import AppBar from "@/app/components/AppBar";
import { Provider } from "react-redux";
import store from "@/app/reducer/store";
import Progress from "@/app/helpers/Progress";
import "../styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#66FCF1", // Set your custom primary color
    },
    secondary: {
      main: "#1f2833", // Set your custom secondary color
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    button: {
      textTransform: "none", // Prevent uppercase styling for buttons
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
