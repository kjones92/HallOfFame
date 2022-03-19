import React, { useState } from "react";
import { Title } from "../../components";
import { useNavigate } from "react-router-dom";
import { Stack, Container, TextField, Button } from "@mui/material";
import { UserService } from "../../services";
import { NavigationRoutes } from "../../constants";
import toast from "react-hot-toast";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const saveClicked = async () => {
    if (password === confirmPassword) {
      const response = await UserService.registerUser(
        email,
        username,
        password
      );
      debugger;
      if (response.status == 201) {
        toast.success("Account created! You can now login.");
        navigate(NavigationRoutes.Login);
      } else {
        const error = await response.text();
        toast.error(error);
      }
    } else {
      toast.error("Passwords must match!");
    }
  };

  return (
    <>
      <Title title="Create An Account" />
      <Container fixed>
        <Stack spacing={2}>
          <TextField
            required
            id="outlined-required"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            required
            id="outlined-required"
            label="Username"
            type="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <TextField
            required
            id="outlined-required"
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <TextField
            required
            id="outlined-required"
            label="Confirm Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <Button variant="contained" onClick={() => saveClicked()}>
            Save
          </Button>
        </Stack>
      </Container>
    </>
  );
};
export default CreateAccount;
