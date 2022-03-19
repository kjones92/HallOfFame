import React, { useEffect, useState } from "react";
import { Title } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { UserService } from "../../services";
import { NavigationUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const columns = [
  {
    field: "username",
    headerName: "Username",
    width: 350,
  },
  { field: "email", headerName: "Email", width: 650 },
  { field: "user_role", headerName: "Role", width: 300 },

  {
    disableColumnMenu: true,
    flex: 0.5,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => {
      const navigationTarget = NavigationUtils.replacePathNavigation(
        NavigationRoutes.UserDetails,
        params.id?.toString() ?? ""
      );
      return (
        <>
          <Button component={Link} to={navigationTarget} color="inherit">
            Edit
          </Button>
        </>
      );
    },
  },
];

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [userRoleId, setUserRoleId] = useState(1);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const handleClickOpen = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setUserRoleId();
    setUsername();
    setPassword();
    setEmail();
  };
  const getUserData = async () =>
    UserService.getAllUsers().then((data) => setUsers(data));

  const handleAddUser = async (e) => {
    try {
      const response = await UserService.addUser(
        email,
        username,
        password,
        userRoleId
      );
      debugger;

      if (response.status == 201) {
        await getUserData();
        toast.success("Successfully added user");
        handleClose();
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Something has gone wrong with adding a user");
    }
  };

  useEffect(() => getUserData(), []);

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Title title="Users" />
        </Grid>
        <Grid item xs={6} style={{ alignSelf: "centre", textAlign: "end" }}>
          <Box
            style={{ width: "100%", marginTop: 20 }}
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              bgcolor: "background.paper",
            }}
          >
            <Button
              variant="contained"
              style={{ marginRight: 15 }}
              onClick={handleClickOpen}
            >
              Add User
            </Button>
          </Box>
        </Grid>
      </Grid>

      <div style={{ height: "900px", width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details below to add a user:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            required
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            margin="dense"
            id="username"
            label="Username"
            type="username"
            required
            fullWidth
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <FormControl fullWidth required>
            <InputLabel variant="standard">Role</InputLabel>
            <Select
              label="Role"
              variant="standard"
              value={userRoleId}
              onChange={(e) => setUserRoleId(e.target.value)}
            >
              <MenuItem value={1}>Administrator</MenuItem>
              <MenuItem value={2}>Member</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="password"
            required
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Users;
