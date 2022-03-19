import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Title } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  AlbumService,
  UserAlbumService,
  GenreService,
  SubgenreService,
  ArtistService,
} from "../../services";
import { LoginUtils, NavigationUtils } from "../../utils";
import { NavigationRoutes, UserAlbumTypes } from "../../constants";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts";
import toast from "react-hot-toast";

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
    field: "Actions",
    headerName: "Actions",
    renderCell: (params) => {
      const navigationTarget = NavigationUtils.replacePathNavigation(
        NavigationRoutes.AlbumDetails,
        params.id?.toString() ?? ""
      );

      return (
        <>
          <Button component={Link} to={navigationTarget} color="inherit">
            View
          </Button>
        </>
      );
    },
  },
];

const Albums = () => {
  const { state } = AuthContext.useLogin();
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [subgenres, setSubgenres] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [albumFilter, setAlbumFilter] = useState();

  const [title, setTitle] = useState();
  const [year, setYear] = useState();
  const [rank, setRank] = useState();
  const [artistId, setArtistId] = useState();
  const [genreId, setGenreId] = useState();
  const [subgenreId, setSubGenreId] = useState();

  const handleClose = () => {
    setTitle();
    setYear();
    setRank();
    setArtistId();
    setGenreId();
    setSubGenreId();
    setModalOpen(false);
  };

  const handleClickOpen = () => setModalOpen(true);

  const handleAddAlbum = async (e) => {
    try {
      await AlbumService.addAlbum(
        title,
        year,
        rank,
        artistId,
        genreId,
        subgenreId
      );
      await getAlbumsData();
      toast.success("Successfully added album");
      handleClose();
    } catch {
      toast.error("Some has gone wrong with adding a album");
    }
  };

  const getAlbumsData = async () => {
    AlbumService.getAllAlbums().then((data) => setAlbums(data));
  };

  const getArtistsData = async () => {
    ArtistService.getAllArtists().then((data) => setArtists(data));
  };

  const getGenreData = async () => {
    GenreService.getAllGenres().then((data) => setGenres(data));
  };

  const getSubgenreData = async () => {
    SubgenreService.getAllSubgenres().then((data) => setSubgenres(data));
  };

  const initialLoadData = async () => {
    await Promise.all([
      getAlbumsData(),
      getArtistsData(),
      getGenreData(),
      getSubgenreData(),
    ]);
  };

  const getUserAlbumsData = async () => {
    const favourite = albumFilter === UserAlbumTypes.Favourite;
    const owned = albumFilter === UserAlbumTypes.Owned;

    UserAlbumService.getUserAlbums(favourite, owned).then((data) =>
      setAlbums(data)
    );
  };

  useEffect(() => {
    initialLoadData();
  }, []);

  const [searchParams] = useSearchParams();
  const album = searchParams.get("album");
  const isLoggedIn = !LoginUtils.isTokenExpired(state);
  const isAdmin = isLoggedIn && LoginUtils.isAdminUser(state?.access);

  const albumFilterChanged = (e) => {
    const selection = e.target.value;
    if (albumFilter !== selection) {
      if (
        selection == UserAlbumTypes.Favourite ||
        selection == UserAlbumTypes.Owned
      ) {
        getUserAlbumsData();
      } else {
        getAlbumsData();
      }
      setAlbumFilter(selection);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <Title title="Top Albums Of All Time" />
        </Grid>
        <Grid
          item
          xs={4}
          style={{ alignSelf: "center", textAlign: "end", height: "100%" }}
        >
          {isLoggedIn && (
            <FormControl variant="standard" style={{ width: 150 }}>
              <InputLabel>My Albums</InputLabel>
              <Select
                label="Role"
                value={albumFilter}
                onChange={albumFilterChanged}
              >
                <MenuItem value="">
                  <em>Clear</em>
                </MenuItem>
                <MenuItem value={UserAlbumTypes.Favourite}>Favourite</MenuItem>
                <MenuItem value={UserAlbumTypes.Owned}>Owned</MenuItem>
              </Select>
            </FormControl>
          )}
          {isAdmin && (
            <Button
              variant="contained"
              style={{ marginLeft: 20, marginTop: 11 }}
              onClick={() => handleClickOpen()}
            >
              Add Album
            </Button>
          )}
        </Grid>
      </Grid>
      <div style={{ height: "900px", width: "100%" }}>
        <DataGrid
          rows={albums}
          columns={columns}
          getRowId={(row) => row.album_id}
          disableSelectionOnClick
          componentsProps={{
            admin: isAdmin,
          }}
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
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Add Album</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details below to add an album:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            required
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <TextField
            margin="dense"
            id="year"
            label="Year"
            required
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
          <TextField
            margin="dense"
            id="rank"
            label="Rank"
            required
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setRank(e.target.value)}
            value={rank}
          />
          <FormControl fullWidth required>
            <InputLabel variant="standard">Artist</InputLabel>
            <Select
              value={artistId}
              label="Artist"
              variant="standard"
              onChange={(e) => setArtistId(e.target.value)}
            >
              {artists.map((artist) => (
                <MenuItem value={artist.id}>{artist.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel variant="standard">Genre</InputLabel>
            <Select
              value={genreId}
              label="Genre"
              variant="standard"
              onChange={(e) => setGenreId(e.target.value)}
            >
              {genres.map((genre) => (
                <MenuItem value={genre.id}>{genre.description}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel variant="standard">Subgenre</InputLabel>
            <Select
              value={subgenreId}
              label="Subgenre"
              variant="standard"
              onChange={(e) => setSubGenreId(e.target.value)}
            >
              {subgenres.map((subgenre) => (
                <MenuItem value={subgenre.id}>{subgenre.description}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAlbum}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Albums;
