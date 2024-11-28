import { useState } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import Quiz from "../../src/app/components/Quiz";
import { createRoom } from "../../src/app/utils/CreateRoom";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../src/app/config/firebaseConfig";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function Host() {
  const [roomId, setRoomId] = useState("");
  const [chatRoomId, setChatRoomId] = useState("");
  const [started, setStarted] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [time, setTime] = useState(15);
  const [NumQues, setNumQues] = useState(10);
  //TO Create Room
  const MakeRoom = async () => {
    const roomRef = await createRoom("Custom", NumQues);
    const roomData = (await getDoc(roomRef)).data();
    console.log(roomData, "roomData");
    const gameRoomRef = doc(db, "gameRoom", roomRef.id);
    await updateDoc(gameRoomRef, {
      time,
    });
    setChatRoomId(roomData.chatRoomId);
    setRoomId(roomRef.id);
    setRoomCreated(true);
  };

  const StartQuiz = async () => {
    const gameRoomRef = doc(db, "gameRoom", roomId);
    await updateDoc(gameRoomRef, {
      state: "Running",
    });
    setStarted(true);
  };

  function formatter(value) {
    return `${value}`;
  }

  return !roomCreated ? (
    <Box
      sx={{
        backgroundColor: "rgba(187,147,83,0.25)",
        width: "100%",
        height: "680px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container>
        <Typography variant="h4" align="center">
          Host a Game
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
      </Container>
    </Box>
  ) : (
    <div
      style={{
        backgroundColor: "rgba(187,147,83,25)",
        width: "100%",
        height: "680px",
      }}
    >
      {started ? (
        <div>
          <Timer
            key="555"
            gameRoomId={roomId}
            quizState={started}
            overTime={time}
          ></Timer>
        </div>
      ) : (
        <Container>
          <Typography variant="h6">Room Created: {roomId}</Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Room ID</TableCell>
                <TableCell>{roomId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Chat Room ID</TableCell>
                <TableCell>{chatRoomId}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            variant="contained"
            color="primary"
            sx={{ position: "relative", top: "13vw", left: "47vw" }}
            onClick={StartQuiz}
          >
            Start Quiz
          </Button>
        </Container>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Leaderbord
            gameRoomId={roomId}
            timeBased={true}
            key="a"
            onWin={() => {}}
            onLoose={() => {}}
          ></Leaderbord>
        </div>
        <div>
          <Quiz
            queMultiplier={NumQues / 5}
            gameRoomId={roomId}
            quizState={started}
            hasTime={true}
            key="10"
          ></Quiz>
        </div>
        <div>
          <ChatBox ChatRoomId={chatRoomId}></ChatBox>
        </div>
      </div>
    </div>
  );
}
