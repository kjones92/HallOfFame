import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Title } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { UserService } from "../../services";
import { NavigationUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";
import { Link } from "react-router-dom";

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
          <Button color="inherit">Delete</Button>
        </>
      );
    },
  },
];

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    UserService.getAllUsers().then((data) => setUsers(data));
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Title title="Users" />
      <div style={{ height: "900px", width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id}
          disableSelectionOnClick
        />
      </div>
    </>
  );
};
export default Users;
