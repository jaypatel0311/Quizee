import { Grid2, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { app } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import Utils from "../helpers/Utils";
import { useState } from "react";
import { Logout } from "@mui/icons-material";

const auth = getAuth(app);

function ResponsiveAppBar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    auth.signOut();
    router.push("/login");
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
            <IconButton
              onClick={handleClick}
              size="large"
              sx={{ p: 0, ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>J</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
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
