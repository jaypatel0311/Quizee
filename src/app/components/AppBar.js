import { Grid2 } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { app } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Utils from "../helpers/Utils";
import SimpleDialog from "../utils/DialogBox";
import { useState } from "react";

const auth = getAuth(app);

function ResponsiveAppBar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <Grid2 container spacing={2} padding={2}>
      <Grid2 size={{ xl: 10, lg: 10, md: 10, xs: 10 }}>
        <Typography
          onClick={(e) => {
            router.push("/");
          }}
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            cursor: "pointer",
            display: { md: "flex" },
            fontFamily: "cursive",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Quizee
        </Typography>
      </Grid2>
      <Grid2
        size={{ xl: 2, lg: 2, md: 2 }}
        display={"flex"}
        justifyContent={"flex-end"}
      >
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={Utils.toTitleCase(auth?.currentUser?.displayName)}>
            <IconButton onClick={handleClickOpen} sx={{ p: 0 }}>
              <Avatar
                alt={Utils.toTitleCase(auth?.currentUser?.displayName)}
                src="/static/images/avatar/2.jpg"
              />
            </IconButton>
          </Tooltip>
        </Box>
        <SimpleDialog open={open} onClose={handleClose} />
      </Grid2>
    </Grid2>

    // {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}

    // {/* <Typography
    //   variant="h5"
    //   noWrap
    //   component="a"
    //   sx={{
    //     mr: 2,
    //     display: { xs: "flex", md: "none" },
    //     flexGrow: 1,
    //     fontFamily: "monospace",
    //     fontWeight: 700,
    //     letterSpacing: ".3rem",
    //     color: "inherit",
    //     textDecoration: "none",
    //   }}
    // >
    //   Quizee
    // </Typography> */}
  );
}
export default ResponsiveAppBar;
