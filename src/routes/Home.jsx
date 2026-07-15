import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  useScrollTrigger,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db, storageService } from "../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Comment from "../components/Comment";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Home({ userId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attachment, setAttachmentm] = useState(null);
  const fileInputRef = useRef(null);

  const storage = storageService; // 스토리지 초기화
  const storageRef = ref(storage); // 참조 초기화

  const getComments = async () => {
    const q = query(collection(db, "comments"), orderBy("date", "desc"), limit(5));

    onSnapshot(q, querySnapshot => {
      const commentsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setComments(commentsArray);
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleChange = e => {
    setComment(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      let imageURL = null;
      if (attachment) {
        const storageRef = ref(storage, `${userId}/${uuidv4()}`);
        const snapshot = await uploadString(storageRef, attachment, "data_url");
        imageURL = await getDownloadURL(storageRef); //이미지 절대 경로 할당
      }

      const data = {
        comment,
        date: serverTimestamp(),
        uid: userId,
        image: imageURL,
      };

      const docRef = await addDoc(collection(db, "comments"), data); // 글 추가
      setComment("");
      onClearFile();
    } catch (e) {
      console.error("글 추가시 에러가 발생했습니다.", e);
    }
  };

  const onFileChange = e => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = e => {
      setAttachmentm(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onClearFile = () => {
    setAttachmentm(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Typography variant="h2" component="h2">
        Home{" "}
      </Typography>

      <Box component="form" sx={{ mt: 2 }} onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="Comment"
          placeholder="글을 입력해주세요."
          type="text"
          name="comment"
          variant="outlined"
          multiline
          rows={5}
          value={comment}
          onChange={handleChange}
        />
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Button component="label" type="button" variant="outlined" startIcon={<UploadFileIcon />}>
            이미지 선택
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={onFileChange} />
          </Button>
          {attachment && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={attachment}
                alt="미리보기"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                }}></Box>
              <Button type="button" variant="outlined" size="small" onClick={onClearFile}>
                파일 첨부 취소
              </Button>
            </Box>
          )}
        </Box>
        <Button sx={{ mt: 2 }} type="submit" variant="contained">
          글쓰기
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />
      <List sx={{ width: "100%" }}>
        {comments.map(item => (
          <Comment key={item.id} item={item} isShown={userId === item.uid} />
        ))}
      </List>
    </>
  );
}

export default Home;
