import { useEffect } from "react";
import { useTimer } from "use-timer";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

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
    <div style={{ fontWeight: "bolder" }}>Time Remaining:{time} Seconds</div>
  );
}
