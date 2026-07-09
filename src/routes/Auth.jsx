import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

function Auth() {
  const [newAccount, setNewAccount] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Typography variant="h2" component="h2">
        Login Form
      </Typography>
      <Box component={"form"} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          name="email"
          id="filled-hidden-label-small"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="Password"
          type="password"
          name="password"
          id="filled-hidden-label-small"
          variant="outlined"
          onChange={handleChange}
        />
        <Button sx={{ mt: 2 }} type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </>
  );
}

export default Auth;
