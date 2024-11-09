import React, { useEffect, useState } from "react";
import { app } from "../config/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import Head from "next/head";
import CardForGameMode from "./CardForGameMode";
import Utils from "../helpers/Utils";

const db = getFirestore(app);
const auth = getAuth(app);

const HomePage = ({ isauth }) => {
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
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexWrap="wrap">
              <Grid2 container spacing={2}>
                <Grid2 item>
                  <CardForGameMode
                    key="qa"
                    imagePath="/images/casual.svg"
                    name="Casual"
                    RedirectPath={isauth ? "/casual" : "/signup"}
                  />
                </Grid2>
                <Grid2 item>
                  <CardForGameMode
                    key="a"
                    imagePath="/images/competitive.svg"
                    name="Competitive"
                    RedirectPath={isauth ? "/competitive" : "/signup"}
                  />
                </Grid2>
                <Grid2 item>
                  <CardForGameMode
                    key="as"
                    imagePath="/images/host.svg"
                    name="Host Game"
                    RedirectPath={isauth ? "/host" : "/signup"}
                  />
                </Grid2>
                <Grid2 item>
                  <CardForGameMode
                    key="aa"
                    imagePath="/images/join.svg"
                    name="Join Game"
                    RedirectPath={isauth ? "/join" : "/signup"}
                  />
                </Grid2>
              </Grid2>
            </Box>
          </Box>
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
