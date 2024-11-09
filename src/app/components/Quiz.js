import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { GenrateQuestions } from "../utils/GenrateQuestions";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
export default function Quiz({
  gameRoomId,
  quizState = false,
  hasTime = false,
  queMultiplier = 3,
}) {
  const router = useRouter();
  const [quizData, setQuizData] = useState(false);
  const [currentQue, setCurrentQue] = useState();
  const [currentOptions, setCurrentOptions] = useState([0, 0, 0, 0]);
  const [currentAnswer, setCurrentAnswer] = useState();
  const [currentQueNumber, setCurrentQueNumber] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

  //checks ending state
  useEffect(() => {
    if (!hasTime) {
      return;
    }
    if (gameRoomId === "") {
      return;
    }

    const unsub = db
      .collection("gameRoom")
      .doc(gameRoomId)
      .onSnapshot(async (e) => {
        console.log(e.state);
        if ((await e.data().state) === "Ended") {
          setQuizOver(true);
        }
      });
    return () => {
      unsub();
    };
  }, [gameRoomId, hasTime]);

  //Load All Questions from dbs
  useEffect(() => {
    if (gameRoomId === "") {
      return;
    }
    const LoadQuestions = async () => {
      let gameRoomData = await db.collection("gameRoom").doc(gameRoomId).get();
      gameRoomData = await gameRoomData.data();
      const GenratedQues = await GenrateQuestions(gameRoomData.queNums);
      setQuizData(GenratedQues);
    };
    LoadQuestions();
  }, [gameRoomId]);

  useEffect(() => {
    if (quizData) {
      console.warn(quizData);
      const currentData = quizData[currentQueNumber];
      console.log(currentData.o);
      setCurrentOptions(currentData.o);
      setCurrentAnswer(currentData.a);
      setCurrentQue(currentData.q);
      setCurrentQueNumber(currentQueNumber + 1);
    }
  }, [quizData]);

  const NextQuestion = async (optionValue) => {
    if (optionValue === currentAnswer) {
      //Add +1 to score
      let gameRoomData = await db.collection("gameRoom").doc(gameRoomId).get();
      const playersData = await gameRoomData.data().playersData;
      const newPlayersData = playersData.map((e) => {
        if (e.id === auth.currentUser.uid) {
          e.score += 1;
          return e;
        }
        return e;
      });

      await db.collection("gameRoom").doc(gameRoomId).update({
        playersData: newPlayersData,
      });
    }

    console.log(currentQueNumber);
    //check if it's last number
    if (currentQueNumber === queMultiplier * 5 - 1) {
      setQuizOver(true);
      if (!hasTime) {
        console.log(hasTime);

        await db.collection("gameRoom").doc(gameRoomId).update({
          state: "Ended",
        });
      }
      return;
    }
    //change all values to next questions values
    const currentData = quizData[currentQueNumber];
    setCurrentOptions(currentData.o);
    setCurrentAnswer(currentData.a);
    setCurrentQue(currentData.q);
    setCurrentQueNumber(currentQueNumber + 1);
  };
  return (
    <div>
      {!quizState ? (
        <div>Waiting For OtherPlayers To Join</div>
      ) : !quizOver ? (
        <div>
          <div style={{ justifyContent: "center" }}>
            <div
              style={{
                fontWeight: "bolder",
                textAlign: "center",
                fontSize: "27px",
              }}
            >
              {currentQue}
            </div>
            <div
              style={{
                justifyContent: "center",
                display: "grid",
                gridTemplateRows: "auto auto",
                gridTemplateColumns: "28vw 28vw",
                gap: "3px",
              }}
            >
              <div
                className={styles.quizOptionx}
                style={{
                  padding: "20px",

                  width: "100%",
                  display: "inline-grid",
                  backgroundColor: "wheat",
                  textOverflow: "ellipsis",
                  border: "1px black",
                  cursor: "pointer",
                }}
                key="1"
                onClick={(e) => {
                  NextQuestion(currentOptions[0]);
                }}
              >
                <span>{currentOptions[0]}</span>
              </div>
              <div
                className={styles.quizOptionx}
                style={{
                  padding: "20px",

                  width: "100%",
                  display: "inline-grid",
                  backgroundColor: "wheat",
                  textOverflow: "ellipsis",
                  border: "1px black",
                  cursor: "pointer",
                }}
                key="2"
                onClick={(e) => {
                  NextQuestion(currentOptions[1]);
                }}
              >
                {currentOptions[1]}
              </div>

              <div
                className={styles.quizOptionx}
                style={{
                  padding: "20px",
                  width: "100%",
                  display: "inline-grid",
                  backgroundColor: "wheat",
                  textOverflow: "ellipsis",
                  border: "1px black",
                  cursor: "pointer",
                }}
                key="3"
                onClick={(e) => {
                  NextQuestion(currentOptions[2]);
                }}
              >
                {currentOptions[2]}
              </div>
              <div
                className={styles.quizOptionx}
                style={{
                  padding: "20px",

                  width: "100%",
                  display: "inline-grid",
                  backgroundColor: "wheat",
                  textOverflow: "ellipsis",
                  border: "1px black",
                  cursor: "pointer",
                }}
                key="4"
                onClick={(e) => {
                  NextQuestion(currentOptions[3]);
                }}
              >
                {currentOptions[3]}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{ position: "relative", top: "13vw" }}
            onClick={(e) => {
              router.push("/");
            }}
          >
            GO TO HOME
          </Button>
        </div>
      )}
    </div>
  );
}
