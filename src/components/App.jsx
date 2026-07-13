import "./App.css";
import Router from "./Router";
import { useEffect, useState } from "react";
import { authService } from "../firebase";
import { Container } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false); // 초기화 전
  const [userId, setUserId] = useState(null); // 초기화 전
  const auth = authService;

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <>
      <Container>
        <h1>ESTFE-X</h1>
        {init ? <Router isLoggedIn={isLoggedIn} userId={userId} /> : <h2>초기화 중입니다.</h2>}
      </Container>
    </>
  );
}

export default App;
