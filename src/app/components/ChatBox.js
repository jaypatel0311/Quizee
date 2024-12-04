import { Button, TextField, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";

export default function ChatBox({ ChatRoomId }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ChatRoomId) return;

    const chatRoomRef = doc(db, "chatRooms", ChatRoomId);
    const unsub = onSnapshot(chatRoomRef, (snapshot) => {
      if (!snapshot.exists()) return;
      setChats(snapshot.data().chats || []);
    });

    return () => {
      unsub();
    };
  }, [ChatRoomId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      content: message,
      timestamp: Date.now(),
    };

    const chatRoomRef = doc(db, "chatRooms", ChatRoomId);
    await updateDoc(chatRoomRef, {
      chats: [...chats, newMessage],
    });

    setMessage("");
  };

  return (
    <Grid2
      container
      rowSpacing={1}
      justifyContent="center"
      alignItems="center"
      mt={2}
    >
      <Grid2 size={12} minHeight={"58vh"}>
        {chats.length > 0
          ? chats.map((c) => (
              <Message
                content={c.content}
                name={c.name}
                key={c.content + Date.now()}
                isMe={c.uid === auth.currentUser.uid}
              ></Message>
            ))
          : null}
      </Grid2>
      <Grid2 display={"flex"} alignItems={"center"} gap={1}>
        <Grid2 item xs={10} sm={10} md={10} borderRadius={2}>
          <TextField
            size="small"
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
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
            }}
            onKeyPress={(e) => {
              if (e.code === "Enter") sendMessage();
            }}
          />
        </Grid2>
        <Grid2
          item
          xs={2}
          sm={2}
          md={2}
          borderRadius={2}
          p={1}
          sx={{ cursor: "pointer" }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={sendMessage}
          color={"primary.main"}
        >
          <SendIcon />
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
