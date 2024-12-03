import { useState } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import Quiz from "../../src/app/components/Quiz";
import createRoom from "../../src/app/utils/CreateRoom";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../src/app/config/firebaseConfig";
import {
  Box,
  Grid2,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { setOverlayLoading } from "@/app/reducer/slices/storeDataSlice";

export default function Host() {
  const [roomId, setRoomId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [started, setStarted] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [time, setTime] = useState(15);
  const [NumQues, setNumQues] = useState(10);
  const dispatch = useDispatch();

  //TO Create Room
  const MakeRoom = async () => {
    const roomRef = await createRoom("Custom", NumQues);
    const roomData = (await getDoc(roomRef)).data();

    const gameRoomRef = doc(db, "gameRoom", roomRef.id);
    await updateDoc(gameRoomRef, {
      time,
    });
    setChatRoomId(roomData.chatRoomId);
    setRoomId(roomRef.id);
    setRoomCreated(true);
  };

  const StartQuiz = async () => {
    dispatch(setOverlayLoading(true));
    const gameRoomRef = doc(db, "gameRoom", roomId);
    await updateDoc(gameRoomRef, {
      state: "Running",
    });
    setStarted(true);
    dispatch(setOverlayLoading(false));
  };

  function formatter(value) {
    return `${value}`;
  }

  return !roomCreated ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#f5f5f5", minHeight: "90vh", padding: 3 }}
    >
      <Grid2 container>
        <Grid2 item xs={12} sm={6} md={4} lg={4}>
          <Box
            component="form"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h4" align="center">
              Host Game
            </Typography>
            <TextField
              label="Number of Questions"
              type="number"
              value={NumQues}
              onChange={(e) => setNumQues(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Time per Question"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={MakeRoom}
              fullWidth
            >
              Create Room
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  ) : (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "80vh", padding: 3 }}>
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
              {started ? (
                <Timer
                  key="555"
                  gameRoomId={roomId}
                  quizState={started}
                  overTime={time}
                ></Timer>
              ) : (
                <></>
              )}

              <Box paddingX={1.5}>
                <Box>
                  <Typography>
                    <strong>Room ID :</strong> {roomId}
                  </Typography>
                </Box>
              </Box>
              <Leaderbord
                gameRoomId={roomId}
                timeBased={true}
                key="a"
                onWin={() => {}}
                onLoose={() => {}}
              ></Leaderbord>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 12, md: 6 }}>
          <Card sx={{ display: "flex", justifyContent: "center" }}>
            <CardContent>
              <Quiz
                queMultiplier={NumQues / 5}
                gameRoomId={roomId}
                quizState={started}
                hasTime={true}
                NumQues={NumQues}
                key="10"
              ></Quiz>
              {started ? (
                <></>
              ) : (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={StartQuiz}
                  >
                    Start Quiz
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
          <Card
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#282c34",
            }}
          >
            <CardContent>
              <Box>
                <Typography color="white">
                  <strong>Chat Room ID :</strong> {chatRoomId}
                </Typography>
              </Box>
              <ChatBox ChatRoomId={chatRoomId}></ChatBox>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
