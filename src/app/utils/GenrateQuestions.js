import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // Assuming db is already initialized in firebaseConfig

export const questionTypes = ["CSE"];

export const GenrateQuestions = async (questionNums) => {
  console.log(questionNums, "questionNums");
  const questionsArr = [];
  for (let n = 0; n < questionNums.length; n++) {
    console.log("in for loop");
    const QueType =
      questionTypes[
        Math.floor(n / (questionNums.length / questionTypes.length))
      ];
    console.log(QueType, "QueType in GenrateQuestions");
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
  console.log(questionsArr, "questionsArr");
  return questionsArr;
};
