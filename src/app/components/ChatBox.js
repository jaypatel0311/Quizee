import { Button, TextField, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Message from "./Message";
import { times } from "lodash";

export default function ChatBox({ ChatRoomId }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ChatRoomId) return;

    const chatRoomRef = doc(db, "chatRooms", ChatRoomId);
    const unsub = onSnapshot(chatRoomRef, (snapshot) => {
      if (!snapshot.exists()) return;
      console.log(snapshot.data(), "chatbox");
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
      <Grid2 size={12} minHeight={"60vh"}>
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
      <Grid2 size={12} display={"flex"} alignItems={"center"} gap={1}>
        <Grid2 item xs={9} sm={9} md={9} bgcolor={"wheat"} borderRadius={2}>
          <TextField
            size="small"
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            onKeyPress={(e) => {
              if (e.code === "Enter") sendMessage();
            }}
          />
        </Grid2>
        <Grid2 item xs={3} sm={3} md={3}>
          <Button variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
