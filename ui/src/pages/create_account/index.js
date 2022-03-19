import react, { useState } from "react";
import { Title } from "../../components";
import { Paper, Stack, Container, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function CreateAccount() {
  const [email, setEmail] = useState("");

  const saveClicked = () => {
    alert(`hello ${email}`);
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
          />
          <TextField
            required
            id="outlined-required"
            label="Password"
            type="password"
          />
          <TextField
            required
            id="outlined-required"
            label="Confirm Password"
            type="password"
          />
          <Button variant="contained" onClick={() => saveClicked()}>
            Save
          </Button>
        </Stack>
      </Container>
    </>
  );
}
export default CreateAccount;
