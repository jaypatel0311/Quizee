import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default async function createRoom(type, numberQues = 10) {
  let chatroomRef = await addDoc(collection(db, "chatRooms"), {
    chats: [],
  });

  //select que from que pool
  let gameRoomRef = await addDoc(collection(db, "gameRoom"), {
    queNums: GenrateQuestions(numberQues),
    state: "Waiting",
    type: type,
    chatRoomId: chatroomRef.id,
    playersData: [
      {
        name: auth?.currentUser?.displayName,
        id: auth?.currentUser?.uid,
        score: 0,
      },
    ],
  });
  return gameRoomRef;
}

function GenrateQuestions(numberQues) {
  const questionIds = Array.from({ length: 103 }, (_, i) => i + 2);

  for (let i = questionIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionIds[i], questionIds[j]] = [questionIds[j], questionIds[i]];
  }

  return questionIds.slice(0, numberQues);
}
