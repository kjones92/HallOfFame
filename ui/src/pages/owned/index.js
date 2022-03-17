//Mark code
// import { Title } from "../../components";

// function Owned() {
//   return (
//     <>
//       <Title title="Owned" />
//     </>
//   );
// }
// export default Owned;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Title } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid } from "@mui/material";
import AlbumsService from "../../services/albums";
import { NavigationUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";
import { Link } from "react-router-dom";

const columns = [
  {
    field: "ranking",
    headerName: "Ranking",
    type: "number",
    width: 160,
  },
  { field: "album", headerName: "Album", width: 300 },
  { field: "artist", headerName: "Artist", width: 150 },
  { field: "year", headerName: "Year", width: 80 },
  {
    field: "genre",
    headerName: "Genre",
    sortable: false,
    width: 200,
  },
  {
    field: "subgenre",
    headerName: "Subgenre",
    sortable: false,
    width: 300,
  },
  {
    disableColumnMenu: true,
    flex: 0.5,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => {
      const navigationTarget = NavigationUtils.replacePathNavigation(
        NavigationRoutes.AlbumDetails,
        params.id?.toString() ?? ""
      );

      return (
        <Button component={Link} to={navigationTarget} color="inherit">
          View
        </Button>
      );
    },
  },
];

const OwnedAlbums = () => {
  const [albums, setAlbums] = useState([]);

  const getAlbumsData = async () => {
    AlbumsService.getAllAlbums().then((data) => setAlbums(data));
  };

  useEffect(() => {
    getAlbumsData();
  }, []);

  const [searchParams] = useSearchParams();
  const album = searchParams.get("album");

  const addAlbumClicked = () => {
    console.log("Add Album");
  };

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <Title title="Owned Albums" />
        </Grid>
        <Grid item xs={4} style={{ alignSelf: "center", textAlign: "end" }}>
          <Button variant="contained" onClick={() => addAlbumClicked()}>
            Add Album
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: "400px", width: "100%" }}>
        <DataGrid
          rows={albums}
          columns={columns}
          getRowId={(row) => row.album_id}
          disableSelectionOnClick
          initialState={
            album && {
              filter: {
                filterModel: {
                  items: [
                    {
                      columnField: "album",
                      operatorValue: "contains",
                      value: album,
                    },
                  ],
                },
              },
            }
          }
        />
      </div>
    </>
  );
};
export default OwnedAlbums;
