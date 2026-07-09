import Router from "./Router";
import { useState } from "react";
import { authService } from "../firebase";
import { Container } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = authService;

  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <>
      <Container>
        <h1>ESTFE-X</h1>
        <Router isLoggedIn={isLoggedIn} />
      </Container>
    </>
  );
}

export default App;
