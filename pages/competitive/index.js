import React, { useEffect, useState, useMemo } from "react";
import { Button, Typography, Divider, Grid2 } from "@mui/material";
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
} from "firebase/firestore";

const db = getFirestore();

export default function Casual() {
  const [gameRoomId, setGameRoomId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [quizState, setQuizState] = useState(false);
  const hasTime = true;
  const overTime = 30;
  const playerCount = 3;
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

  const updateScore = async () => {
    let gameRoomData = await getDoc(doc(db, "gameRoom", gameRoomId));
    const playersData = gameRoomData.data().playersData;
    const newPlayersData = playersData.map((e) => {
      if (e.id === auth.currentUser.uid) {
        e.score += 1;
        return e;
      }
      return e;
    });

    await updateDoc(doc(db, "gameRoom", gameRoomId), {
      playersData: newPlayersData,
    });
  };

  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12}>
          <Typography variant="h4">Casual Game</Typography>
        </Grid2>
        <Grid2 item xs={12}>
          <Quiz gameRoomId={gameRoomId} />
        </Grid2>
        <Grid2 item xs={12}>
          <Leaderbord gameRoomId={gameRoomId} />
        </Grid2>
        <Grid2 item xs={12}>
          <Timer hasTime={hasTime} overTime={overTime} />
        </Grid2>
        <Grid2 item xs={12}>
          <Divider />
        </Grid2>
        <Grid2 item xs={12}>
          <ChatBox chatRoomId={chatRoomId} />
        </Grid2>
        <Grid2 item xs={12}>
          <Button variant="contained" color="primary" onClick={updateScore}>
            Update Score
          </Button>
        </Grid2>
      </Grid2>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h6" style={{ marginLeft: "15px" }}>
          Answer All {questionMultiplier * 5} questions Before Timer Runs Out To
          Win
        </Typography>
        <Divider />
        {hasTime && (
          <Timer
            key="555"
            gameRoomId={gameRoomId}
            quizState={quizState}
            overTime={overTime}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Leaderbord gameRoomId={gameRoomId} timeBased={hasTime} />
        </div>
      </div>
    </div>
  );
}
