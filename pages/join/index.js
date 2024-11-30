import { useState, useEffect } from "react";
import ChatBox from "../../src/app/components/ChatBox";
import { db } from "../../src/app/config/firebaseConfig";
import { JoinRoom } from "../../src/app/utils/JoinRoom";
import Quiz from "../../src/app/components/Quiz";
import Leaderbord from "../../src/app/components/LeaderBord";
import Timer from "../../src/app/components/Timer";
import { doc, onSnapshot } from "firebase/firestore";
import { Button, TextField,Grid2 , Box} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function Join() {
  const [roomCode, setRoomCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [chatRoomCode, setChatRoomCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [queNums, setQueNums] = useState(10);
  const [time, setTime] = useState(15);
  useEffect(() => {
    const connectRoom = async () => {
      if (roomCode !== "") {
        const chatId = await JoinRoom(roomCode);
        setChatRoomCode(chatId);
        setIsConnected(true);
      }
    };
    connectRoom();
  }, [roomCode]);

  useEffect(() => {
    if (roomCode === "") {
      return;
    }
    const unsub = onSnapshot(doc(db, "gameRoom", roomCode), (s) => {
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
  }, [roomCode]);

  return (
    <div
    >
      {!isConnected ? (
         <Grid2 container display='flex' justifyContent="center">
         <Grid2 item xs={12} sm={6} md={4}>  
         <Box
               sx={{
                 bgcolor: "background.paper",
                 boxShadow: 2,
                 borderRadius: 1,
                 p: 3,
               }}
             >
              <Box>
          <TextField
            label="Room Code"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
          />
          </Box>
          <Box display={"flex"} justifyContent={"center"} mt={2}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => JoinRoom(roomCodeInput)}
          >
            Join Room
          </Button>
          </Box>
          </Box>      
        </Grid2>
        </Grid2>
      ) : (
        <div>
          {gameStarted ? (
            <div>
              <Timer
                key="555"
                gameRoomId={roomCode}
                quizState={gameStarted}
                overTime={time}
              ></Timer>
            </div>
          ) : (
            <h2 style={{ marginLeft: "15px" }}>
              Waiting for Host To Start Game
            </h2>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Leaderbord
                gameRoomId={roomCode}
                timeBased={true}
                key="a"
                onWin={() => {}}
                onLoose={() => {}}
              ></Leaderbord>
            </div>
            <div>
              <Quiz
                queMultiplier={queNums}
                gameRoomId={roomCode}
                quizState={gameStarted}
                hasTime={true}
                key="10"
              ></Quiz>
            </div>
            <div>
              <ChatBox ChatRoomId={chatRoomCode}></ChatBox>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
