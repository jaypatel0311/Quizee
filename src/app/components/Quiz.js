import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { GenrateQuestions } from "../utils/GenrateQuestions";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setOverlayLoading } from "../reducer/slices/storeDataSlice";

export default function Quiz({
  gameRoomId,
  quizState = false,
  hasTime = false,
  queMultiplier = 3,
  NumQues,
}) {
  const dispatch = useDispatch();
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

    const unsub = onSnapshot(doc(db, "gameRoom", gameRoomId), async (e) => {
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
      const gameRoomDoc = doc(db, "gameRoom", gameRoomId);
      const gameRoomData = await (await getDoc(gameRoomDoc)).data();
      const GenratedQues = await GenrateQuestions(gameRoomData.queNums);
      setQuizData(GenratedQues);
    };
    LoadQuestions();
  }, [gameRoomId]);

  useEffect(() => {
    if (quizData) {
      dispatch(setOverlayLoading(true));
      console.warn(quizData);
      const currentData = quizData[currentQueNumber];

      setCurrentOptions(currentData.o);
      setCurrentAnswer(currentData.a);
      setCurrentQue(currentData.q);
      setCurrentQueNumber(currentQueNumber + 1);
      dispatch(setOverlayLoading(false));
    }
  }, [quizData]);

  const NextQuestion = async (optionValue) => {
    if (optionValue === currentAnswer) {
      //Add +1 to score
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
    }

    //check if it's last number
    if (currentQueNumber === queMultiplier * 5 - 1) {
      setQuizOver(true);
      if (!hasTime) {
        await updateDoc(doc(db, "gameRoom", gameRoomId), {
          state: "Ended",
        });
      }
      return;
    }
    //change all values to next questions values
    const currentData = quizData[currentQueNumber];
    setCurrentOptions(currentData?.o);
    setCurrentAnswer(currentData?.a);
    setCurrentQue(currentData?.q);
    setCurrentQueNumber(currentQueNumber + 1);
  };

  return (
    <div>
      {!quizState ? (
        <Box display="flex" justifyContent="center">
          <Typography>Waiting for others to join—starting shortly.</Typography>
        </Box>
      ) : !quizOver ? (
        <div>
          {/* Question Header */}
          <Typography variant="subtitle1" color="textSecondary">
            Question {currentQueNumber} / {NumQues}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {currentQue}
          </Typography>

          {/* Options */}
          <Grid2 container spacing={2}>
            {currentOptions.map((option, index) => (
              <Grid2 item size={12} key={index}>
                <Card
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "#F9F9F9",
                      cursor: "pointer",
                    },
                  }}
                  key={index}
                  onClick={() => {
                    NextQuestion(option);
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#6A1B9A",
                        marginRight: "16px",
                      }}
                    >
                      {option}
                    </Typography>
                    {/* <Typography variant="body1">{option.text}</Typography> */}
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </div>
      ) : (
        <div>
          <Button
            variant="outlined"
            sx={{
              color: "#28a745",
              borderColor: "#28a745",
              "&:hover": { backgroundColor: "primary", borderColor: "primary" },
              borderRadius: "24px",
              padding: "8px 24px",
              fontWeight: "bold",
              textTransform: "none",
            }}
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
