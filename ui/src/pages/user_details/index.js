import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Title } from "../../components";
import {
  Stack,
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Typography,
  Link,
} from "@mui/material";
import { UserService, TokenService } from "../../services";
import { NavigationRoutes } from "../../constants";
import { AuthContext } from "../../contexts";
import { LoginUtils } from "../../utils";

function UserDetails() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [userRoleId, setUserRoleId] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = AuthContext.useLogin();

  const navigate = useNavigate();
  const { userId } = useParams();

  const getUserData = async (userId) => {
    UserService.getUser(userId).then(({ email, username, user_role_id }) => {
      setEmail(email);
      setUsername(username);
      setUserRoleId(user_role_id);
      setLoading(false);
    });
  };

  const saveUserClicked = async () => {
    const response = await UserService.saveUser(userId, email, username, password, userRoleId);
    if (response.status == 204) {
      toast.success("Profile Updated!");
    }
    else {
      toast.error((await response.text()));
    }
    
  };

  const deleteUserClicked = () => {
    UserService.deleteUser(userId).then(() => {
      toast.success("User Deleted!");
      const loggedInUserId = LoginUtils.getUserId(state.access);
      if (userId == loggedInUserId) {
        dispatch({ type: "logout" });
        TokenService.removeAuth();
        navigate(NavigationRoutes.Home);
      } else {
        navigate(NavigationRoutes.Users);
      }
    });
  };

  useEffect(() => {
    getUserData(userId);
  }, []);

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        style={{ marginTop: 25, marginBottom: 50 }}
      >
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to={NavigationRoutes.Users}
        >
          Users
        </Link>
        <Typography color="text.primary">User Details - {username}</Typography>
      </Breadcrumbs>

      {!loading && (
        <Container fixed>
          <Stack spacing={2}>
            <TextField
              disabled
              id="outlined-required"
              label="Email"
              value={email}
            />
            <TextField
              required
              id="outlined-required"
              label="Username"
              type="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={userRoleId}
                onChange={(e) => setUserRoleId(e.target.value)}
              >
                <MenuItem value={1}>Administrator</MenuItem>
                <MenuItem value={2}>Member</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-required"
              label="Password"
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
                  onClick={() => deleteUserClicked()}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={5}>
                <Button
                  style={{ width: 200 }}
                  size="medium"
                  variant="contained"
                  onClick={() => saveUserClicked()}
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
export default UserDetails;
