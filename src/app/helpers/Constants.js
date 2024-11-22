const Constants = {
  usPhoneRegex: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
  emailPattern:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  urlPattern:
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  smallLetter: /[a-z]/,
  capitalLetter: /[A-Z]/,
  digits: /[0-9]/,
  specialLetter: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,

  friendlyErrorMessage: "Oops !!! Something Went Wrong !!!",
  reducerActions: {
    login: "LOGIN",
    logout: "LOGOUT",
    showToast: "SHOW_TOAST",
    hideToast: "HIDE_TOAST",
    setContext: "SET_CONTEXT",
    setStore: "SET_STORE",
    unauthorized: "UNAUTHORIZED",
    setOverlayLoading: "SET_OVERLAY_LOADING",
  },
};

export default Constants;
