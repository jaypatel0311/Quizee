import { auth, db } from "../config/firebaseConfig";
import createRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import {
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  doc,
  collection,
} from "firebase/firestore";

export default async function MatchQueue(
  type = "Casual",
  queCounts = 2,
  playerLimit = 3
) {
  const queuerRef = doc(db, "queue", type); // Access the specific document in the queue collection
  const dataSnapshot = await getDoc(queuerRef);
  const data = dataSnapshot.data();
  console.log(data, "Casual");

  if (data?.rooms === undefined || data?.rooms?.length === 0) {
    // if room queue is empty
    const roomData = await createRoom(type, queCounts * 5);
    await setDoc(queuerRef, {
      rooms: [roomData],
    });
    return [roomData.chatRoomId, roomData.gameRoomId];
  } else {
    // if some rooms are available
    const gameRoomId = data.rooms[0].gameRoomId;
    console.log(data, "gameRoomId");
    // join room
    const chatRoomId = await JoinRoom(data.rooms[0].gameRoomId);
    const roomData = { gameRoomId, chatRoomId };

    const gameRoomRef = doc(db, "gameRoom", roomData.gameRoomId);
    const gameRoomDataSnapshot = await getDoc(gameRoomRef);
    const gameRoomData = gameRoomDataSnapshot.data();

    if (gameRoomData.playersData.length >= playerLimit) {
      // if player limit is reached, close the room for other players
      await updateDoc(queuerRef, {
        rooms: arrayRemove(data.rooms[0]),
      });

      // set game room state to "Running"
      await updateDoc(gameRoomRef, {
        state: "Running",
      });
    }
    return [roomData.chatRoomId, roomData.gameRoomId];
  }
}
