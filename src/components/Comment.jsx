import { Divider, ListItem, ListItemText, Stack, Button, Box, TextField } from "@mui/material";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function Comment({ item, isShown }) {
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState(item.comment); // 글만 수정한다.

  const handleDelete = async () => {
    const isConfirmed = window.confirm("정말 삭제할까요?");
    if (isConfirmed) {
      await deleteDoc(doc(db, "comments", item.id));
    }
  };

  const toggleEditMode = () => {
    setEdit(prev => !prev);
  };

  const onSubmit = async e => {
    e.preventDefault();

    const commentRef = doc(db, "comments", item.id);
    await updateDoc(commentRef, {
      comment,
    });
    setEdit(false);
  };

  const handleChange = e => {
    setComment(e.target.value);
  };

  return (
    <ListItem key={item.id} alignItems="flex-center" divider>
      {edit ? (
        <Box component="form" onSubmit={onSubmit}>
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
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button sx={{ mt: 2 }} type="submit" variant="contained" size="small">
              글쓰기
            </Button>
            <Button variant="outlined" size="small" onClick={toggleEditMode}>
              취소
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <ListItemText
            primary={item.comment}
            secondary={item.date?.toDate ? item.date.toDate().toLocaleString() : "작성시간 없음"}
          />
          {isShown && (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={toggleEditMode}>
                수정
              </Button>
              <Button variant="contained" color="error" size="small" onClick={handleDelete}>
                삭제
              </Button>
            </Stack>
          )}
        </>
      )}
    </ListItem>
  );
}
