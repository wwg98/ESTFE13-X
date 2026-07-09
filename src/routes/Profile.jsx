import { signOut } from "firebase/auth";
import { authService } from "../firebase";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

function Profile() {
  const auth = authService;
  const navigate = useNavigate();

  const OnLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch(error => {
        // An error happened.
      });
  };
  return (
    <>
      <h1>Profile</h1>
      <Button sx={{ mt: 2 }} type="button" variant="contained" onClick={OnLogOut}>
        로그아웃
      </Button>
    </>
  );
}

export default Profile;
