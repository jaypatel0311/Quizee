import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Leaderboard({
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
          playerData[0].id === auth.currentUser.uid ||
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
    <Box>
      {ended && (
        <Typography
          variant="h6"
          sx={{
            color: winner ? "#28a745" : "#d32f2f",
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          {winner ? (
            <>
              <Typography display="flex" justifyContent="center" pt={2}>
                Congratulations!!
              </Typography>
              <Typography display="flex" justifyContent="center">
                You are the Winner
              </Typography>
            </>
          ) : (
            <Typography display="flex" justifyContent="center" pt={2}>
              Better Luck Next Time
            </Typography>
          )}
        </Typography>
      )}
      <Typography
        variant="h4"
        display="flex"
        justifyContent="center"
        sx={{ fontWeight: "bold", marginBottom: 3, color: "primary.main" }}
      >
        Leaderboard
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", borderRight: "1px solid #ddd" }}
              >
                Name
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((e, idx) => (
              <TableRow
                key={idx}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#e0f7fa" },
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #ddd",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {e.name}
                </TableCell>
                <TableCell align="center">{e.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
