import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid2,
  Alert,
  Autocomplete,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { auth } from "../../src/app/config/firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setOverlayLoading } from "@/app/reducer/slices/storeDataSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const iState = {
    email: "",
    password: "",
    errors: {},
  };

  const [state, setState] = useState(iState);
  const [result, setResult] = useState([]);
  const [alert, setAlert] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
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

  const handleLogin = () => {
    dispatch(setOverlayLoading(true));
    const messages = {
      "email.required": "Please enter Email.",
      "email.email": "Please enter valid Email.",
      "password.validatePassword":
        "Please enter password between 6 to 50 characters containing atleast one small leter, one capital letter and one number or special character.",
    };

    let rules = {
      email: "required|email",
      password: "required|validatePassword",
    };

    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        dispatch(setOverlayLoading(false));
        router.push("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlert(true);
        dispatch(setOverlayLoading(false));
      });
  };

  return (
    <Container
      sx={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid2 container justifyContent="center" alignItems="center" spacing={4}>
        {alert && (
          <Alert variant="filled" severity="error">
            Username or Password is incorrect!!
          </Alert>
        )}
        <Grid2 size={{ xs: 12, md: 10, lg: 10 }}>
          <Box
            component="form"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 2,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Login
            </Typography>

            <TextField
              id="email"
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={state.email}
              onChange={onInputChange}
              error={!!state.errors.email}
              helperText={state.errors.email ? state.errors.email : ""}
              onKeyPress={(e) => {
                if (e.code === "Enter") handleLogin();
              }}
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
              onKeyPress={(e) => {
                if (e.code === "Enter") handleLogin();
              }}
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
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            >
              Don't have an account?{""}
              <Box
                component="a"
                href="/signup"
                sx={{ color: "secondary.main", cursor: "pointer" }}
              >
                Sign up
              </Box>
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default LoginForm;
