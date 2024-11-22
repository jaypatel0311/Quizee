// slices/storeDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storeDataSlice = createSlice({
  name: "storeData",
  initialState: {
    isOverlayLoading: false,
    // other state properties
  },
  reducers: {
    setOverlayLoading(state, action) {
      state.isOverlayLoading = action.payload;
    },
    // other reducers
  },
});

export const { setOverlayLoading } = storeDataSlice.actions;
export default storeDataSlice.reducer;
