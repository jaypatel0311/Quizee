import React, { useEffect, useState } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import MatchQueue from "../../src/app/utils/QueueMatch";
import Quiz from "../../src/app/components/Quiz";
import { auth } from "../../src/app/config/firebaseConfig";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import { useRouter } from "next/router";
import {
  doc,
  onSnapshot,
  increment,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

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
  const playerCount = 5;
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
    <div
      style={{
        width: "100%",
        height: "680px",
        overflowY: "hidden",
      }}
    >
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {gameRoomId ? (
            <Leaderbord
              gameRoomId={gameRoomId}
              timeBased={hasTime}
              key="a"
              onWin={onWin}
              onLoose={onLoose}
            />
          ) : null}
        </div>
        <div>
          {gameRoomId ? (
            <Quiz
              queMultiplier={questionMultiplier}
              gameRoomId={gameRoomId}
              quizState={quizState}
              hasTime={hasTime}
              key="10"
            />
          ) : null}
        </div>
        <div>
          <ChatBox ChatRoomId={chatRoomId} key="1" />
        </div>
      </div>
    </div>
  );
}
