import React, { useState } from "react";
import { Title } from "../../components";
import { Stack, Container, TextField, Button, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { NavigationRoutes } from "../../constants";
import { LoginService, TokenService } from "../../services";
import { AuthContext } from "../../contexts";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = AuthContext.useLogin();
  const navigate = useNavigate();

  const loginClicked = async () => {
    const loginResult = await LoginService.login(email, password);
    if (loginResult) {
      TokenService.setAuth(loginResult);
      dispatch({
        type: "login",
        ...loginResult,
      });
      navigate(NavigationRoutes.Home);
    } else {
      toast.error("Login Failed");
    }
  };

  return (
    <>
      <Title title="Login" />
      <Container fixed>
        <Stack spacing={3}>
          <Alert severity="info">
            <p>
              For demonstrative purposes why not try an admin account?
              <ul>
                <li>
                  Email: <strong>root@qub.ac.uk</strong>
                </li>
                <li>
                  Password: <strong>Hello1234!</strong>
                </li>
              </ul>
            </p>
          </Alert>
          <Alert severity="info">
            <p>
              Normal member accounts can be created with the{" "}
              <strong>Create an account</strong> link below.
            </p>
          </Alert>
        </Stack>

        <Stack spacing={2} style={{ marginTop: 50 }}>
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
