import React, { useEffect, useState } from "react";
import { app } from "../config/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Grid2, Paper, Typography } from "@mui/material";
import Head from "next/head";
import Utils from "../helpers/Utils";

const db = getFirestore(app);
const auth = getAuth(app);

const HomePage = () => {
  const [userData, setUserData] = useState({
    CasualGamesPlayed: 0,
    CasualGamesWin: 0,
    CompetitiveGamesPlayed: 0,
    CompetitiveGamesWin: 0,
  });

  useEffect(() => {
    const getUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      console.log("User:", auth.currentUser.displayName);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    if (auth.currentUser) {
      getUserData();
    }
  }, [auth.currentUser]);

  return (
    <div>
      <Head>
        <title>Quizee</title>
        <meta name="description" content="Quizee App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography variant="h4" fontFamily="sans-serif" gutterBottom>
          Good to See You,{" "}
          <strong>{Utils.toTitleCase(auth?.currentUser?.displayName)}!</strong>{" "}
          Let's Play
        </Typography>
        <Grid2 container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid2 size={6}>
            <Paper elevation={1} sx={{ p: 8 }}>
              <Typography variant="h6">Casual Games Played</Typography>
              <Typography>
                {userData ? userData.CasualGamesPlayed : 0}
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 size={6}>
            <Paper elevation={1} sx={{ p: 8 }}>
              <Typography variant="h6">Casual Games Win</Typography>
              <Typography>{userData ? userData.CasualamesWin : 0}</Typography>
            </Paper>
          </Grid2>
          <Grid2 size={6}>
            <Paper elevation={1} sx={{ p: 8 }}>
              <Typography variant="h6">Competitive Games Played</Typography>
              <Typography>
                {userData ? userData.CompetitiveGamesPlayed : 0}
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 size={6}>
            <Paper elevation={1} sx={{ p: 8 }}>
              <Typography variant="h6">Competitive Games Win</Typography>
              <Typography>
                {userData ? userData.CompetitiveGamesWin : 0}
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </main>
    </div>
  );
};

export default HomePage;
