import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { db } from "../../src/app/config/firebaseConfig";
import { useRouter } from "next/router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { extend, validateAll } from "indicative/validator";
import Utils from "@/app/helpers/Utils";
import { useDispatch } from "react-redux";
import { setOverlayLoading } from "@/app/reducer/slices/storeDataSlice";

const RegistrationForm = () => {
  const auth = getAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  console.log(auth, "auth");

  const iState = {
    username: "",
    email: "",
    password: "",
    errors: {},
  };

  const [state, setState] = useState(iState);
  const [bday, setBday] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onInputChange = (e) => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
      errors: {
        ...state.errors,
        [e.target.id]: "",
      },
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  // const handleSearch = (value) => {
  //   let res = [];

  //   if (!value || value.indexOf("@") >= 0) {
  //     res = [];
  //   } else {
  //     res = ["gmail.com", "yahoo.com", "outlook.com"].map(
  //       (domain) => `${value}@${domain}`
  //     );
  //   }
  // };

  extend("validatePassword", {
    validate() {
      return Utils.isValidPassword(state.password);
    },
  });

  const createUser = async () => {
    const messages = {
      "username.required": "Please enter Name.",
      "username.max": "Please enter name between 1 to 100 characters.",
      "email.required": "Please enter Email.",
      "email.email": "Please enter valid Email.",
      "password.validatePassword":
        "Please enter password between 6 to 50 characters containing atleast one small leter, one capital letter and one number or special character.",
    };

    let rules = {
      username: "required|max:100",
      email: "required|email",
      password: "required|validatePassword",
    };

    // try {
    //   const values = await form.validateFields();
    //   return true;
    // } catch {
    //   return;
    // }
    //TODO: Check validateAll function

    validateAll(state, rules, messages)
      .then(async () => {
        dispatch(setOverlayLoading(true));
        createUserWithEmailAndPassword(auth, state.email, state.password);
        try {
          await setDoc(doc(db, "users", result.user.uid), {
            birthdate: bday,
            CasualGamesPlayed: 0,
            CasualamesWin: 0,
            CompetitiveGamesPlayed: 0,
            CompetitiveGamesWin: 0,
          });
        } catch (error) {
          console.log(error);
        }
        sendEmailVerification(auth?.currentUser);
        updateProfile(auth?.currentUser, {
          displayName: username,
        });
        dispatch(setIsOverlayLoading(false));
        router.push("/");
      })
      .catch((errors) => {
        const formattedErrors = {};
        errors.forEach(
          (error) => (formattedErrors[error.field] = error.message)
        );
        setState({
          ...state,
          errors: formattedErrors,
        });
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box
        component="form"
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          SignUp for Quizee
        </Typography>
        <TextField
          fullWidth
          label="Username"
          id="username"
          variant="outlined"
          margin="normal"
          value={state.username}
          onChange={onInputChange}
          error={!!state.errors.username}
          helperText={state.errors.username ? state.errors.username : ""}
        />
        <TextField
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={state.email}
          onChange={onInputChange}
          error={!!state.errors.email}
          helperText={state.errors.email ? state.errors.email : ""}
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={state.password}
          onChange={onInputChange}
          error={!!state.errors.password}
          helperText={state.errors.password ? state.errors.password : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          id="bday"
          label="Birthday"
          variant="outlined"
          margin="normal"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={bday}
          onChange={(e) => setBday(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={createUser}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
