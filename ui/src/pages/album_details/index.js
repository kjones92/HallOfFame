import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Title } from "../../components";
import {
  Paper,
  Stack,
  Container,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../contexts";
import { UserService, TokenService } from "../../services";
import { LoginUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function AlbumDetails() {
  const { state, dispatch } = AuthContext.useLogin();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [userRoleId, setUserRoleId] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userId = LoginUtils.getUserId(state.access);
  const navigate = useNavigate();

  const getProfileData = async (userId) => {
    UserService.getUser(userId).then(({ email, username, user_role_id }) => {
      setEmail(email);
      setUsername(username);
      setUserRoleId(user_role_id);
      setLoading(false);
    });
  };

  const saveProfileClicked = async () => {
    UserService.saveUser(userId, email, username, password, userRoleId).then(
      () => {
        toast.success("Profile Updated!");
      }
    );
  };

  useEffect(() => {
    getProfileData(userId);
  }, []);

  const deleteProfileClicked = () => {
    UserService.deleteUser(userId).then(() => {
      toast.success("Profile Deleted!");
      dispatch({ type: "logout" });
      TokenService.removeAuth();
      navigate(NavigationRoutes.Home);
    });
  };

  return (
    <>
      <Title title="Album Information" />
      {!loading && (
        <Container fixed>
          <Stack spacing={2}>
            <TextField id="standard-basic" label="Title" value={email} />
            <TextField
              id="standard-basic"
              label="Summary"
              type="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <TextField
              id="standard-basic"
              label="Reviews"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Grid container>
              <Grid item xs={5} style={{ textAlign: "end" }}>
                <Button
                  style={{ width: 200 }}
                  size="medium"
                  variant="contained"
                  onClick={() => deleteProfileClicked()}
                >
                  Delete Album
                </Button>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={5}>
                <Button
                  style={{ width: 200 }}
                  size="medium"
                  variant="contained"
                  onClick={() => saveProfileClicked()}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      )}
    </>
  );
}
export default AlbumDetails;
