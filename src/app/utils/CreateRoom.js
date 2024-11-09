import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { GenrateQuestions } from "./GenrateQuestions";

const createRoom = async (type, numberQues = 10) => {
  let chatroomRef = await addDoc(collection(db, "chatRooms"), {
    chats: [],
  });

  //select que from que pool
  let gameRoomRef = await addDoc(collection(db, "gameRoom"), {
    queNums: await GenrateQuestions(numberQues),
    state: "Waiting",
    type: type,
    chatRoomId: chatroomRef.id,
    playersData: [
      {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
        score: 0,
      },
    ],
  });

  return gameRoomRef;
};

export default createRoom;
