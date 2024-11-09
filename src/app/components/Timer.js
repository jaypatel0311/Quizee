import { useEffect } from "react";
import { useTimer } from "use-timer";
import { auth, db } from "../config/firebaseConfig";

export default function Timer({ overTime, quizState, gameRoomId }) {
  const { time, start } = useTimer({
    initialTime: overTime,
    timerType: "DECREMENTAL",
    endTime: 0,
    onTimeOver: async () => {
      await db.collection("gameRoom").doc(gameRoomId).update({
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
