import react, { useState } from "react";
import { Title } from "../../components";
import { Paper, Stack, Container, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { NavigationRoutes } from "../../constants";
import LoginService from "../../services/login";
import { AuthContext } from "../../contexts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = AuthContext.useLogin();

  const loginClicked = async () => {
    const loginResult = await LoginService.login(email, password);
    dispatch({
      type: "login",
      ...loginResult,
    });
  };

  //Katrina code to check
  const createAccountClicked = () => {
    console.log("Create Account");
  };

  return (
    <>
      <Title title="Login" />
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
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button
            variant="contained"
            onClick={async () => await loginClicked()}
          >
            Login
          </Button>
          <Link to={NavigationRoutes.CreateAccount}>Create an account</Link>
        </Stack>
      </Container>
    </>
  );
}
export default Login;
