import React, { useEffect, useState } from "react";
import { app } from "../config/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Box, Chip, Grid2, Paper, Typography } from "@mui/material";
import Head from "next/head";
import CardForGameMode from "./CardForGameMode";
import Utils from "../helpers/Utils";
import { useDispatch } from "react-redux";
import { setIsOverlayLoading } from "../reducer/actions";

const db = getFirestore(app);
const auth = getAuth(app);

const HomePage = ({ isauth }) => {
  const [userData, setUserData] = useState({
    CasualGamesPlayed: 0,
    CasualGamesWin: 0,
    CompetitiveGamesPlayed: 0,
    CompetitiveGamesWin: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };
    if (auth.currentUser) {
      getUserData();
    }
    dispatch(setIsOverlayLoading(false));
  }, [auth.currentUser]);

  return (
    <Box>
      <Head>
        <title>Quizee</title>
        <meta name="description" content="Quizee App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography
          variant="h4"
          fontFamily="sans-serif"
          paddingY={3}
          color="primary"
        >
          Good to See You,{" "}
          <strong>{Utils.toTitleCase(auth?.currentUser?.displayName)}!</strong>{" "}
          Let's Play
        </Typography>
        <Grid2
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        >
          <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
            <Paper
              elevation={2}
              sx={{ p: 1, borderRadius: 2, bgcolor: "#1f2833" }}
            >
              <Grid2 container>
                <Grid2 size={{ xs: 11, md: 11, lg: 11 }}>
                  <Typography variant="h6" color="white" ml={1}>
                    Casual Games Played{" "}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 1, md: 1, lg: 1 }}>
                  <Chip
                    color="primary"
                    label={userData ? userData.CasualGamesPlayed : 0}
                  />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
            <Paper
              elevation={2}
              sx={{ p: 1, borderRadius: 2, bgcolor: "#1f2833" }}
            >
              <Grid2 container>
                <Grid2 size={{ xs: 11, md: 11, lg: 11 }}>
                  <Typography variant="h6" color="white" ml={1}>
                    Casual Games Won{" "}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 1, md: 1, lg: 1 }}>
                  <Chip
                    color="primary"
                    label={userData ? userData.CasualamesWin : 0}
                  />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
            <Paper
              elevation={2}
              sx={{ p: 1, borderRadius: 2, bgcolor: "#1f2833" }}
            >
              <Grid2 container>
                <Grid2 size={{ xs: 11, md: 11, lg: 11 }}>
                  <Typography variant="h6" color="white" ml={1}>
                    Competitive Games Played{" "}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 1, md: 1, lg: 1 }}>
                  <Chip
                    color="primary"
                    label={userData ? userData.CompetitiveGamesPlayed : 0}
                  />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
            <Paper
              elevation={2}
              sx={{ p: 1, borderRadius: 2, bgcolor: "#1f2833" }}
            >
              <Grid2 container>
                <Grid2 size={{ xs: 11, md: 11, lg: 11 }}>
                  <Typography variant="h6" color="white" ml={1}>
                    Competitive Games Won{" "}
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 1, md: 1, lg: 1 }}>
                  <Chip
                    color="primary"
                    label={userData ? userData.CompetitiveGamesWin : 0}
                  />
                </Grid2>
              </Grid2>
            </Paper>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
            <CardForGameMode
              key="qa"
              imagePath="/images/casual.png"
              name="Casual"
              RedirectPath={isauth ? "/casual" : "/signup"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
            <CardForGameMode
              key="a"
              imagePath="/images/competitive.png"
              name="Competitive"
              RedirectPath={isauth ? "/competitive" : "/signup"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
            <CardForGameMode
              key="as"
              imagePath="/images/host.png"
              name="Host Game"
              RedirectPath={isauth ? "/host" : "/signup"}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
            <CardForGameMode
              key="aa"
              imagePath="/images/join.png"
              name="Join Game"
              RedirectPath={isauth ? "/join" : "/signup"}
            />
          </Grid2>
        </Grid2>
      </main>
    </Box>
  );
};

export default HomePage;
