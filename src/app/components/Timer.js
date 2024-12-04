import { useEffect } from "react";
import { useTimer } from "use-timer";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Box, Typography } from "@mui/material";

export default function Timer({ overTime, quizState, gameRoomId }) {
  console.log(quizState);

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
    <Box m={3}>
      <CountdownCircleTimer
        isSmoothColorTransition={true}
        size={120}
        strokeWidth={8}
        duration={time}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[12, 9, 5, 0]}
      >
        {({ remainingTime, elapsedTime, color }) => (
          <Box>
            <Typography style={{ color }}>{remainingTime} s</Typography>
          </Box>
        )}
      </CountdownCircleTimer>
    </Box>
  );
}
