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
            padding: 2,
          }}
        >
          <Grid2 item xs={12} sm={8} md={4}>
            <Box
              sx={{
                bgcolor: "secondary.main",
                boxShadow: 3,
                borderRadius: 2,
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "white", marginBottom: 3 }}
              >
                Join Game
              </Typography>
              <TextField
                fullWidth
                label="Enter Room Code"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                      borderRadius: "12px", // Border color
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Border color when focused
                    },
                  },
                  marginBottom: 3,
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "primary",
                  color: "secondary.main",
                  fontWeight: "bold",
                  padding: "10px 16px",
                  textTransform: "none",
                  borderRadius: "8px",
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
            <Grid2 container display="flex" justifyContent="center">
              <Grid2
                size={{ xs: 12, md: 12, lg: 12 }}
                display="flex"
                justifyContent="center"
              >
                <Typography py={2} variant="h6" color="primary">
                  Waiting for Host To Start Game....
                </Typography>
              </Grid2>
            </Grid2>
          )}
          <Grid2
            container
            spacing={2}
            display="flex"
            justifyContent="center"
            sx={{ minHeight: "80vh" }}
          >
            <Grid2 size={{ xs: 12, md: 12, lg: 3 }}>
              <Card
                display="flex"
                justifyContent="center"
                sx={{ backgroundColor: "secondary.main" }}
              >
                <CardContent>
                  <Leaderbord
                    gameRoomId={roomCodeInput}
                    timeBased={true}
                    key="a"
                    onWin={() => {}}
                    onLoose={() => {}}
                  />
                  {gameStarted && (
                    <Box display="flex" justifyContent="center">
                      <Timer
                        key="555"
                        gameRoomId={roomCodeInput}
                        quizState={gameStarted}
                        overTime={time}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12, md: 6 }}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "secondary.main",
                }}
              >
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
