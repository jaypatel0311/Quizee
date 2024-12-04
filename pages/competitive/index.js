import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Typography,
  Divider,
  Grid2,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import ChatBox from "../../src/app/components/ChatBox";
import MatchQueue from "../../src/app/utils/QueueMatch";
import Quiz from "../../src/app/components/Quiz";
import { auth } from "../../src/app/config/firebaseConfig";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  increment,
} from "firebase/firestore";

const db = getFirestore();

export default function Casual() {
  const [gameRoomId, setGameRoomId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [quizState, setQuizState] = useState(false);
  const hasTime = true;
  const overTime = 30;
  const playerCount = 1;
  const questionMultiplier = 4;

  useEffect(() => {
    const Match = async () => {
      const [chatRoomId, gameRoomId] = await MatchQueue(
        "Competitive",
        questionMultiplier,
        playerCount
      );
      setChatRoomId(chatRoomId);
      setGameRoomId(gameRoomId);
    };

    Match();
  }, [questionMultiplier, playerCount]);

  useEffect(() => {
    if (gameRoomId === "") return;

    const gameRoomRef = doc(db, "gameRoom", gameRoomId);
    const unsub = onSnapshot(gameRoomRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data.state === "Running") {
        setQuizState(true);
      }
    });

    return () => unsub();
  }, [gameRoomId]);

  // const updateScore = async () => {
  //   let gameRoomData = await getDoc(doc(db, "gameRoom", gameRoomId));
  //   const playersData = gameRoomData.data().playersData;
  //   const newPlayersData = playersData.map((e) => {
  //     if (e.id === auth.currentUser.uid) {
  //       e.score += 1;
  //       return e;
  //     }
  //     return e;
  //   });

  //   await updateDoc(doc(db, "gameRoom", gameRoomId), {
  //     playersData: newPlayersData,
  //   });
  // };

  const onWin = async () => {
    // Update win stats in user document
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      CompetitiveGamesPlayed: increment(1),
      CompetitiveGamesWin: increment(1),
    });
  };

  const onLoose = async () => {
    // Update game played stats in user document
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      CompetitiveGamesPlayed: increment(1),
    });
  };

  return (
    <Grid2
      sx={{
        height: "80vh",
        padding: 2,
      }}
      container
      display="flex"
      justifyContent="center"
    >
      <Grid2 size={{ xs: 12, md: 12, lg: 12 }} p={3}>
        <Typography
          display="flex"
          justifyContent="center"
          variant="h6"
          style={{ marginLeft: "15px" }}
          color="primary"
        >
          Answer All {questionMultiplier * 5} questions Before Timer Runs Out To
          Win
        </Typography>
      </Grid2>
      <Grid2
        display="flex"
        justifyContent="center"
        size={{ xs: 12, md: 12, lg: 3 }}
        pr={3}
      >
        <Card>
          <CardContent>
            <Leaderbord
              gameRoomId={gameRoomId}
              timeBased={hasTime}
              onWin={onWin}
              onLoose={onLoose}
            />
            {hasTime && (
              <Timer
                key="555"
                gameRoomId={gameRoomId}
                quizState={quizState}
                overTime={overTime}
              />
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }} pr={3}>
        <Card>
          <CardContent>
            <Quiz
              queMultiplier={questionMultiplier}
              gameRoomId={gameRoomId}
              quizState={quizState}
              hasTime={hasTime}
              key="10"
            ></Quiz>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#282c34",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box>
              <Typography color="white" fontWeight={600}>
                Welcome to Your Interactive Chat Room
              </Typography>
              <Divider variant="fullWidth" sx={{ color: "white" }} />
            </Box>
            <ChatBox ChatRoomId={chatRoomId}></ChatBox>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
