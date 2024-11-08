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
} from "@mui/material";
import { auth } from "../../src/app/config/firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [result, setResult] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);

  const handleLogin = () => {
    console.log(email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        router.push("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in:", errorCode, errorMessage);
        setAlert(true);
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
      {alert && <Alert severity="error">Error message</Alert>}

      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2 item xs={12} sm={6} md={4}>
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
              Login
            </Typography>
            <Autocomplete
              freeSolo
              options={result}
              onInputChange={(event, newValue) => setEmail(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Don't have an account?{" "}
              <Box
                component="a"
                href="/signup"
                sx={{ color: "primary.main", cursor: "pointer" }}
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
