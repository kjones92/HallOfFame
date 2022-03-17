//Mark's code

// import { Title } from "../../components";

// function Profile() {
//   return (
//     <>
//       <Title title="Profile" />
//     </>
//   );
// }
// export default Profile;

// could use the same code as login page

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

function Profile() {
  const [email, setEmail] = useState("");

  const saveProfileClicked = () => {
    console.log("Save Account");
  };

  const deleteProfileClicked = () => {
    console.log("Delete Account");
  };

  return (
    <>
      <Title title="Profile Information" />
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
            type="Username"
          />
          <TextField
            required
            id="outlined-required"
            label="Password"
            type="password"
          />
          <Button
            size="medium"
            variant="contained"
            onClick={() => saveProfileClicked()}
          >
            Save
          </Button>

          <Button
            size="medium"
            variant="contained"
            onClick={() => deleteProfileClicked()}
          >
            Delete Account
          </Button>
        </Stack>
      </Container>
    </>
  );
}
export default Profile;
