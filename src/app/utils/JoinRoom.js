import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export const JoinRoom = async (roomCode) => {
  let gameRoomDoc = doc(db, "gameRoom", roomCode);
  let gameRoomData = await getDoc(gameRoomDoc);
  await updateDoc(gameRoomDoc, {
    playersData: arrayUnion({
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      score: 0,
    }),
  });

  return gameRoomData.data().chatRoomId;
};
