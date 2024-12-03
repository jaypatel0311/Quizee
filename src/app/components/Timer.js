import { useEffect } from "react";
import { useTimer } from "use-timer";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Box } from "@mui/material";

export default function Timer({ overTime, quizState, gameRoomId }) {
  const { time, start } = useTimer({
    initialTime: overTime,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: async () => {
      const gameRoomRef = doc(db, "gameRoom", gameRoomId);
      await updateDoc(gameRoomRef, {
        state: "Ended",
      });
    },
  });
  //Start Timer
  useEffect(() => {
    if (quizState === true) {
      start();
    }
  }, [quizState]);
  return (
    <Box display="flex" justifyContent="center" m={3}>
      <CountdownCircleTimer
        size={100}
        isPlaying
        duration={time}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </Box>
  );
}
