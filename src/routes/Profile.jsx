import { signOut } from "firebase/auth";
import { authService, db } from "../firebase";
import { Typography, Button, Divider, List } from "@mui/material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import Comment from "../components/Comment";

function Profile() {
  const auth = authService;
  const userId = auth.currentUser.uid;

  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  const getComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("uid", "==", userId),
      orderBy("date", "desc"),
    );

    onSnapshot(q, querySnapshot => {
      const commentsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setComments(commentsArray);
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        // An error happened.
      });
  };
  return (
    <>
      <h2>Profile</h2>
      <Button sx={{ mt: 2 }} type="button" variant="contained" onClick={onLogout}>
        로그아웃
      </Button>
      <Divider sx={{ my: 3 }} />
      <List sx={{ width: "100%" }}>
        {comments.map(item => (
          <Comment key={item.id} item={item} isShown={true} />
        ))}
      </List>
    </>
  );
}

export default Profile;
