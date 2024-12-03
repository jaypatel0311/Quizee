import React, { useEffect, useState } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import MatchQueue from "../../src/app/utils/QueueMatch";
import Quiz from "../../src/app/components/Quiz";
import { auth } from "../../src/app/config/firebaseConfig";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import {
  doc,
  onSnapshot,
  increment,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { Box, Card, CardContent, Grid2 } from "@mui/material";

const db = getFirestore();

export default function Casual() {
  const [gameRoomId, setGameRoomId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [quizState, setQuizState] = useState(false);

  // For Future Use (without counter Games)
  const hasTime = true;
  // Time Limit
  const overTime = 40;
  // Automatically start when player count matched
  const playerCount = 1;
  // Number Of Questions Asked in Round
  const questionMultiplier = 3;

  useEffect(() => {
    const Match = async () => {
      const [chatRoomId, gameRoomId] = await MatchQueue(
        "all",
        questionMultiplier,
        playerCount
      );
      setGameRoomId(gameRoomId);
      setChatRoomId(chatRoomId);
    };
    Match();
  }, []);

  useEffect(() => {
    if (gameRoomId === "" || gameRoomId === undefined) return;

    const gameRoomRef = doc(db, "gameRoom", gameRoomId);
    const unsub = onSnapshot(gameRoomRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data.state === "Running") {
        setQuizState(true);
      }
    });

    return () => {
      unsub(); // Safely unsubscribe when component unmounts
    };
  }, [gameRoomId]);

  console.log("gameRoomId", gameRoomId);

  const onWin = async () => {
    // Update win stats in user document
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      CasualGamesPlayed: increment(1),
      CasualamesWin: increment(1),
    });
  };

  const onLoose = async () => {
    // Update game played stats in user document
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      CasualGamesPlayed: increment(1),
    });
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: 3 }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginLeft: "15px" }}>
          Answer All {questionMultiplier * 5} questions Before Timer Runs Out To
          Win
        </h2>
        {hasTime && (
          <Timer
            key="555"
            gameRoomId={gameRoomId}
            quizState={quizState}
            overTime={overTime}
          />
        )}
      </div>

      <Grid2
        container
        spacing={3}
        display="flex"
        justifyContent="center"
        alignItems="baseline"
      >
        <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
          <Card sx={{ display: "flex", justifyContent: "center" }}>
            <CardContent>
              {gameRoomId ? (
                <Leaderbord
                  gameRoomId={gameRoomId}
                  timeBased={hasTime}
                  key="a"
                  onWin={onWin}
                  onLoose={onLoose}
                />
              ) : null}
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{ display: "flex", justifyContent: "center" }}>
            <CardContent>
              {gameRoomId ? (
                <Quiz
                  queMultiplier={questionMultiplier}
                  gameRoomId={gameRoomId}
                  quizState={quizState}
                  hasTime={hasTime}
                  key="10"
                  NumQues={15}
                />
              ) : null}
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
          <Card sx={{ display: "flex", justifyContent: "center" }}>
            <CardContent>
              <ChatBox ChatRoomId={chatRoomId} key="1" />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
