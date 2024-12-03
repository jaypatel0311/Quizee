import { Box, Grid2, Typography } from "@mui/material";
import React from "react";

const Message = ({ content, name, isMe }) => {
  return (
    <Grid2 container justifyContent={isMe ? "flex-end" : "flex-start"}>
      <Grid2 item xs={12} md={12}>
        <Box my={2} p={1} borderRadius={2} bgcolor={"#3a3a3a"}>
          <Typography
            color="white"
            sx={{
              fontSize: "12px",
            }}
          >
            {name}
          </Typography>
          <Typography color="white">{content}</Typography>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default Message;
