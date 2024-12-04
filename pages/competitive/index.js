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
  const playerCount = 2;
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
    <Grid2 spacing={2} mx={2} container display="flex" justifyContent="center">
      <Grid2
        size={{ xs: 12, md: 12, lg: 12 }}
        pt={2}
        display="flex"
        justifyContent="center"
      >
        <Typography variant="h6" color="primary">
          Answer All {questionMultiplier * 5} questions Before Timer Runs Out To
          Win
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 12, lg: 3 }}>
        <Card
          display="flex"
          justifyContent="center"
          sx={{ backgroundColor: "secondary.main" }}
        >
          <CardContent>
            <Leaderbord
              gameRoomId={gameRoomId}
              timeBased={hasTime}
              onWin={onWin}
              onLoose={onLoose}
            />
            {hasTime && (
              <Box display="flex" justifyContent="center">
                <Timer
                  key="555"
                  gameRoomId={gameRoomId}
                  quizState={quizState}
                  overTime={overTime}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
        <Card sx={{ backgroundColor: "secondary.main" }}>
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
            backgroundColor: "secondary.main",
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
