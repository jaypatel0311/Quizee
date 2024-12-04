import { useState, useEffect } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import { db } from "../../src/app/config/firebaseConfig";
import JoinRoom from "../../src/app/utils/JoinRoom";
import Quiz from "../../src/app/components/Quiz";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import { doc, onSnapshot } from "firebase/firestore";
import {
  Button,
  TextField,
  Grid2,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function Join() {
  const [isConnected, setIsConnected] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [chatRoomCode, setChatRoomCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [queNums, setQueNums] = useState(10);
  const [time, setTime] = useState(15);
  const [text, setText] = useState("");
  useEffect(() => {
    const connectRoom = async () => {
      if (roomCodeInput !== "") {
        const chatId = await JoinRoom(roomCodeInput);
        setChatRoomCode(chatId);
        setIsConnected(true);
      }
    };
    connectRoom();
  }, [roomCodeInput]);

  useEffect(() => {
    if (roomCodeInput === "") {
      return;
    }
    const unsub = onSnapshot(doc(db, "gameRoom", roomCodeInput), (s) => {
      const data = s.data();
      setTime(data.time);
      setQueNums(data.queNums.length / 5);
      console.error(data);
      if (data.state === "Running") {
        setGameStarted(true);
      }
    });
    return () => {
      unsub();
    };
  }, [roomCodeInput]);

  return (
    <div>
      {!isConnected ? (
        <Grid2
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "80vh",
            backgroundColor: "#f5f5f5",
            padding: 2,
          }}
        >
          <Grid2 item xs={12} sm={8} md={4}>
            <Box
              sx={{
                bgcolor: "white",
                boxShadow: 3,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#343a40", marginBottom: 3 }}
              >
                Join Game
              </Typography>
              <TextField
                fullWidth
                label="Enter Room Code"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  marginBottom: 3,
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "primary",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px 16px",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#218838",
                  },
                }}
                onClick={() => {
                  JoinRoom(roomCodeInput);
                }}
              >
                Join Room
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      ) : (
        <div>
          {gameStarted ? (
            <></>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ padding: 2 }}
            >
              <Typography variant="h3">
                Waiting for Host To Start Game....
              </Typography>
            </Box>
          )}
          <Grid2
            container
            spacing={3}
            display="flex"
            justifyContent="center"
            alignItems="baseline"
            sx={{ backgroundColor: "#f5f5f5", minHeight: "80vh", padding: 3 }}
          >
            <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
              <Card sx={{ display: "flex", justifyContent: "center" }}>
                <CardContent>
                  <Leaderbord
                    gameRoomId={roomCodeInput}
                    timeBased={true}
                    key="a"
                    onWin={(e) => {}}
                    onLoose={() => {}}
                  ></Leaderbord>
                  {gameStarted ? (
                    <div>
                      <Timer
                        key="555"
                        gameRoomId={roomCodeInput}
                        quizState={gameStarted}
                        overTime={time}
                      ></Timer>
                    </div>
                  ) : (
                    <></>
                  )}
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12, md: 6 }}>
              <Card sx={{ display: "flex", justifyContent: "center" }}>
                <CardContent>
                  <Quiz
                    queMultiplier={queNums}
                    gameRoomId={roomCodeInput}
                    quizState={gameStarted}
                    hasTime={true}
                    key="10"
                  ></Quiz>
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12, md: 3 }}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#282c34",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box>
                    <Typography color="white" fontWeight={600}>
                      Welcome to Your Interactive Chat Room
                    </Typography>
                    <Divider variant="fullWidth" sx={{ color: "white" }} />
                  </Box>
                  <ChatBox ChatRoomId={chatRoomCode}></ChatBox>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </div>
      )}
    </div>
  );
}
