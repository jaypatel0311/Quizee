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
    <Box padding="0 4px" position="relative" textAlign="center">
      <Card>
        <CardActionArea onClick={() => router.push(RedirectPath)}>
          <CardMedia
            component="img"
            height="200"
            image={imagePath}
            alt={name}
          />
          <Typography variant="h6" component="p" p={2}>
            {name}
          </Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default CardForGameMode;
