import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Container } from "@mui/material";
import { app } from "../src/app/config/firebaseConfig";
import HomePage from "../src/app/components/HomePage";
import LoginForm from "./login";

const auth = getAuth(app);

export default function Home() {
  const [isauth, setIsAuth] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuth(true);
      }
    });
  }, [auth.onAuthStateChanged]);

  return (
    <Container>
      {isauth ? <HomePage isauth={isauth} /> : <LoginForm />}
    </Container>
  );
}
