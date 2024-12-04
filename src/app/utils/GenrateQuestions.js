import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // Assuming db is already initialized in firebaseConfig

export const questionTypes = ["CSE"];

export const GenrateQuestions = async (questionNums) => {
  const questionsArr = [];
  for (let n = 0; n < questionNums.length; n++) {
    const QueType =
      questionTypes[
        Math.floor(n / (questionNums.length / questionTypes.length))
      ];
    const questionRef = doc(
      db,
      `questions/all/${QueType}`,
      `${questionNums[n]}`
    );
    const questionSnap = await getDoc(questionRef);

    if (questionSnap.exists()) {
      questionsArr.push(questionSnap.data());
    } else {
      console.error("No such document!");
    }
  }
  return questionsArr;
};
