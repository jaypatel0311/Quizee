import Constants from "../helpers/Constants";

export const setIsOverlayLoading = (value) => {
  return {
    type: Constants.reducerActions.setOverlayLoading,
    value,
  };
};
