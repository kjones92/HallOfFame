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

const Albums = () => {
  const { state } = AuthContext.useLogin();
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [subgenres, setSubgenres] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modelEditMode, setModelEditMode] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");

  const [editAlbumId, setEditAlbumId] = useState();
  const [title, setTitle] = useState();
  const [year, setYear] = useState();
  const [rank, setRank] = useState();
  const [artistId, setArtistId] = useState();
  const [genreId, setGenreId] = useState();
  const [subgenreId, setSubGenreId] = useState();

  const handleClose = () => {
    setEditAlbumId();
    setTitle();
    setYear();
    setRank();
    setArtistId();
    setGenreId();
    setSubGenreId();
    setModalOpen(false);
  };

  const handleClickAdd = () => {
    setModelEditMode("Add");
    setModalOpen(true);
  };

  const handleClickEdit = (albumId) => {
    const selectedAlbum = albums.find((x) => x.album_id == albumId);
    const artistText = selectedAlbum.artist.split(",")[0];
    const genreText = selectedAlbum.genre.split(",")[0];
    const subgenreText = selectedAlbum.subgenre.split(",")[0];

    const selectedArtist = artists.find((x) => x.name == artistText);
    const selectedGenre = genres.find((x) => x.description == genreText);
    const selectedSubgenre = subgenres.find(
      (x) => x.description == subgenreText
    );

    setEditAlbumId(albumId);
    setTitle(selectedAlbum.album);
    setYear(selectedAlbum.year);
    setRank(selectedAlbum.ranking);

    setArtistId(selectedArtist?.id);
    setGenreId(selectedGenre?.id);
    setSubGenreId(selectedSubgenre?.id);

    setModelEditMode("Edit");
    setModalOpen(true);
  };

  const handleAddAlbum = async () => {
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

  const handleEditAlbum = async () => {
    try {
      await AlbumService.editAlbum(
        editAlbumId,
        title,
        year,
        rank,
        artistId,
        genreId,
        subgenreId
      );
      await getAlbumsData();
      toast.success("Successfully edited album");
      handleClose();
    } catch {
      toast.error("Some has gone wrong with editing an album");
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

  const initialLoadData = async (isAdmin) => {
    if (isAdmin) {
      await Promise.all([
        getAlbumsData(),
        getArtistsData(),
        getGenreData(),
        getSubgenreData(),
      ]);
    } else {
      getAlbumsData();
    }
  };

  const getUserAlbumsData = async (selection) => {
    const favourite = selection === UserAlbumTypes.Favourite;
    const owned = selection === UserAlbumTypes.Owned;
    debugger;
    UserAlbumService.getUserAlbums(favourite, owned).then((data) =>
      setAlbums(data)
    );
  };

  const [searchParams] = useSearchParams();
  const album = searchParams.get("album");
  const isLoggedIn = !LoginUtils.isTokenExpired(state);
  const isAdmin = isLoggedIn && LoginUtils.isAdminUser(state?.access);

  useEffect(() => {
    initialLoadData(isAdmin);
  }, [isAdmin]);

  const albumFilterChanged = (e) => {
    const selection = e.target.value;
    if (albumFilter !== selection) {
      setAlbumFilter(selection);
      if (
        selection == UserAlbumTypes.Favourite ||
        selection == UserAlbumTypes.Owned
      ) {
        getUserAlbumsData(selection);
      } else {
        getAlbumsData();
      }
    }
  };

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
            {isAdmin && (
              <Button
                onClick={() => handleClickEdit(params.id)}
                color="inherit"
              >
                Edit
              </Button>
            )}
            <Button component={Link} to={navigationTarget} color="inherit">
              View
            </Button>
          </>
        );
      },
    },
  ];

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
              onClick={() => handleClickAdd()}
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
        <DialogTitle>{modelEditMode} Album</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details below to {modelEditMode} an album:
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
            InputProps={{ inputProps: { min: 1500 } }}
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
            InputProps={{ inputProps: { min: 1 } }}
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
                <MenuItem key={artist.id} value={artist.id}>
                  {artist.name}
                </MenuItem>
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
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.description}
                </MenuItem>
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
                <MenuItem key={subgenre.id} value={subgenre.id}>
                  {subgenre.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              modelEditMode == "Edit" ? handleEditAlbum() : handleAddAlbum();
            }}
          >
            {modelEditMode}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Albums;
