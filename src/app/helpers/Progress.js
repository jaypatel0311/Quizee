import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function OverlayProgress() {
  const isOverlayLoading = useSelector(
    (state) => state.storeData.isOverlayLoading
  );

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isOverlayLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

const Progress = {
  OverlayProgress,
};

export default Progress;
