import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const CardForGameMode = ({ imagePath, RedirectPath, name }) => {
  const router = useRouter();

  return (
    <Box position="relative" textAlign="center">
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardActionArea onClick={() => router.push(RedirectPath)}>
          <CardMedia
            component="img"
            height="250"
            image={imagePath}
            alt={name}
            sx={{ objectFit: "inherit" }}
          />
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default CardForGameMode;
