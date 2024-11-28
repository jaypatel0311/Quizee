import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export const createRoom = async (type, numberQues = 10) => {
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
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
        score: 0,
      },
    ],
  });
  console.log(gameRoomRef, "gameRoomRef");
  return gameRoomRef;
};

function GenrateQuestions(numberQues) {
  const arr = [];
  for (let i = 0; i < numberQues; i++) {
    let rand = Math.floor(Math.random() * 10) + 1;
    if (arr.length === 0) {
      arr.push(rand);
      continue;
    }
    if (arr[i - 1] === rand) {
      if (rand === 10) {
        arr.push(9);
      } else {
        rand++;
        arr.push(rand);
      }
    } else {
      arr.push(rand);
    }
  }
  return arr;
}
