import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { auth, db } from "../src/config/firebaseConfig";
import { Container, Typography, Paper, Grid2 } from "@mui/material";

export default function Home() {
  //   const [isauth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({
    CasualGamesPlayed: 0,
    CasualGamesWin: 0,
    CompetitiveGamesPlayed: 0,
    CompetitiveGamesWin: 0,
  });

  //   useEffect(() => {
  //     const getUserData = async () => {
  //       const user = await (
  //         await db.collection("users").doc(auth.currentUser.uid).get()
  //       ).data();
  //       setUserData(user);
  //     };

  //     if (auth.currentUser) {
  //       setIsAuth(true);
  //       getUserData();
  //     }
  //   }, []);

  return (
    <Container>
      <Head>
        <title>Quizee</title>
        <meta name="description" content="Quizee App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to Quizee
        </Typography>
        <Paper elevation={3} style={{ padding: "16px" }}>
          <Typography variant="h2" component="h2" gutterBottom>
            User Data
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={6}>
              <Paper elevation={1} style={{ padding: "16px" }}>
                <Typography variant="h6">Casual Games Played</Typography>
                <Typography>{userData.CasualGamesPlayed}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <Paper elevation={1} style={{ padding: "16px" }}>
                <Typography variant="h6">Casual Games Win</Typography>
                <Typography>{userData.CasualGamesWin}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <Paper elevation={1} style={{ padding: "16px" }}>
                <Typography variant="h6">Competitive Games Played</Typography>
                <Typography>{userData.CompetitiveGamesPlayed}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <Paper elevation={1} style={{ padding: "16px" }}>
                <Typography variant="h6">Competitive Games Win</Typography>
                <Typography>{userData.CompetitiveGamesWin}</Typography>
              </Paper>
            </Grid2>
          </Grid2>
        </Paper>
      </main>
    </Container>
  );
}
