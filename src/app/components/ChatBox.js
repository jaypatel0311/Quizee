import { Button, TextField, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

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
    };

    const chatRoomRef = doc(db, "chatRooms", ChatRoomId);
    await updateDoc(chatRoomRef, {
      chats: [...chats, newMessage],
    });

    setMessage("");
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={12}>
        <Typography variant="h6">Chat Room</Typography>
      </Grid2>
      <Grid2 item xs={12}>
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          onKeyPress={(e) => {
            if (e.code === "Enter") sendMessage();
          }}
        />
      </Grid2>
      <Grid2 item xs={12}>
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Grid2>
    </Grid2>
  );
}

function Message({ content, name, isMe }) {
  return (
    <Row justify={isMe ? "end" : "start"}>
      <Col
        span={10}
        style={{
          maxWidth: "60%",
          padding: "10px",
          backgroundColor: "rgb(58, 58, 58)",
          borderRadius: "10px",
          color: "white",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Text
          style={{
            fontSize: "12px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {content}
        </Text>
        <Text
          style={{
            color: "wheat",
            fontSize: "10px",
            display: "block",
          }}
          type="secondary"
        >
          {name}
        </Text>
      </Col>
    </Row>
  );
}
