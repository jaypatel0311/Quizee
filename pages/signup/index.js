import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { db } from "../../src/app/config/firebaseConfig";
import { useRouter } from "next/router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegistrationForm = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bday, setBday] = useState("");
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        router.push("/");
      }
    });
  }, []);

  const handleSearch = (value) => {
    let res = [];

    if (!value || value.indexOf("@") >= 0) {
      res = [];
    } else {
      res = ["gmail.com", "yahoo.com", "outlook.com"].map(
        (domain) => `${value}@${domain}`
      );
    }
  };

  const createUser = async () => {
    //TODO: Add form validation

    // try {
    //   const values = await form.validateFields();
    //   return true;
    // } catch {
    //   return;
    // }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async function (result) {
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
        sendEmailVerification(auth.currentUser);
        updateProfile(auth.currentUser, {
          displayName: username,
        });
        router.push("/");
      })
      .catch(function (error) {});
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
          Registration Form
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
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
