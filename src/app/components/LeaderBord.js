import { useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default function Leaderbord({
  gameRoomId,
  timeBased = true,
  onWin,
  onLoose,
}) {
  const [data, setData] = useState([]);
  const [ended, setEnded] = useState(false);
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    if (gameRoomId === "") {
      return;
    }
    const unSub = onSnapshot(doc(db, "gameRoom", gameRoomId), async (e) => {
      const playerData = await e
        .data()
        .playersData.sort((a, b) => b.score - a.score);
      setData(playerData);

      if ((await e.data().state) === "Ended") {
        setEnded(true);
        if (
          playerData[0].id == auth.currentUser.uid ||
          playerData[1].score === playerData[0].score
        ) {
          setWinner(true);
          onWin();
        } else {
          onLoose();
        }
      }
    });

    return () => unSub();
  }, [gameRoomId, db]);

  return (
    <div
      style={{
        margin: "7px",
        textAlign: "center",
      }}
    >
      {ended && <div>{winner ? "Winner" : "Better Luck Next Time"}</div>}
      <h2>Leaderboard</h2>
      <table
        style={{
          tableLayout: "fixed",
          width: "300px",
          padding: "3px",
          textAlign: "center",
          border: "1px solid black",
        }}
      >
        <tbody>
          <tr style={{ border: "1px solid black" }}>
            <th style={{ borderRight: "1px solid black" }}>Name</th>
            <th>Score</th>
          </tr>
          {data.map((e, idx) => {
            return (
              <tr style={{ border: "1px solid black" }}>
                <td
                  style={{
                    width: "70px",
                    height: "30px",
                    borderRight: "1px solid black",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {e.name}
                </td>
                <td>{e.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
