import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Box,
  Rating,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AuthContext } from "../../contexts";
import { AlbumService, ReviewService, UserAlbumService } from "../../services";
import { LoginUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";
import toast from "react-hot-toast";
import noImage from "../../assets/no-album.jpeg";

function AlbumDetails() {
  const { state } = AuthContext.useLogin();
  const [modalOpen, setModalOpen] = useState(false);
  const [album, setAlbum] = useState();
  const [userAlbum, setUserAlbum] = useState();
  const [reviews, setReviews] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [reviewTitle, setReviewTitle] = useState();
  const [reviewDescription, setReviewDescription] = useState();
  const [reviewRating, setReviewRating] = useState();

  const isLoggedIn = state.access && !LoginUtils.isTokenExpired(state);
  const isAdmin = isLoggedIn && LoginUtils.isAdminUser(state.access);

  const { albumId } = useParams();

  const getAlbumData = async () =>
    AlbumService.getAlbum(albumId).then((data) => setAlbum(data));

  const getReviewsData = async (albumId) =>
    ReviewService.getAllAlbumReviews(albumId).then((data) => setReviews(data));

  const getUserAlbumData = async (albumId) =>
    UserAlbumService.getUserAlbum(albumId).then((data) => setUserAlbum(data));

  const initialLoadData = async (albumId) => {
    await Promise.all([
      getAlbumData(albumId),
      getReviewsData(albumId),
      getUserAlbumData(albumId),
    ]);

    setLoading(false);
  };

  const handleClickOpen = () => setModalOpen(true);

  const handleClose = () => {
    setModalOpen(false);
    setReviewTitle();
    setReviewDescription();
    setReviewRating();
  };

  const handleAddReview = async (e) => {
    try {
      await ReviewService.addReview(
        albumId,
        reviewTitle,
        reviewDescription,
        reviewRating
      );
      await getReviewsData(albumId);
      toast.success("Successfully added pending review. Awaiting approval!");
      handleClose();
    } catch {
      toast.error("Something has gone wrong with adding a review");
    }
  };

  const handleDeleteAlbum = async (e) => {
    try {
      await AlbumService.deleteAlbum(albumId);
      navigate(NavigationRoutes.Home);
      toast.success("Successfully deleted album!");
    } catch {
      toast.error("Something has gone wrong with deleting this album");
    }
  };

  useEffect(() => {
    initialLoadData(albumId);
  }, [albumId]);

  useEffect(() => {
    if (!loading && !album) {
      navigate(NavigationRoutes.Home);
    }
  }, [loading, album]);

  return (
    <>
      {!loading && album && (
        <>
          <Grid container>
            <Grid item xs={6}>
              <Breadcrumbs
                aria-label="breadcrumb"
                style={{ marginTop: 25, marginBottom: 50 }}
              >
                <Link
                  underline="hover"
                  color="inherit"
                  component={RouterLink}
                  to={NavigationRoutes.Home}
                >
                  Top Albums Of All Time
                </Link>
                <Typography color="text.primary">
                  {album.artist} - {album.album}
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={6} style={{ alignSelf: "centre", textAlign: "end" }}>
              {isLoggedIn && (
                <Box
                  style={{ width: "100%", marginTop: 20 }}
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    bgcolor: "background.paper",
                  }}
                >
                  {isAdmin && (
                    <Button
                      variant="contained"
                      style={{ marginRight: 15 }}
                      onClick={() => handleDeleteAlbum()}
                    >
                      Delete Album
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    style={{ marginRight: 15 }}
                    onClick={() => handleClickOpen()}
                  >
                    Add Review
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>

          {!loading && album && (
            <Grid container>
              <Grid
                item
                xs={12}
                md={3}
                style={{
                  justifyContent: "center",
                  display: "flex",
                  marginTop: 130,
                }}
              >
                <Stack spacing={2}>
                  <Box
                    component="img"
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt="No Album Cover Found"
                    src={noImage}
                  />
                  <Box
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Rating
                      name="size-large"
                      readOnly
                      defaultValue={album.score}
                      size="large"
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                md={9}
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Stack spacing={2} style={{ width: "100%" }}>
                  <h2>{album.album}</h2>
                  <Grid container>
                    <Grid item xs={4}>
                      Genre: {album.genre}
                    </Grid>
                    <Grid item xs={4}>
                      Subgenre: {album.subgenre}
                    </Grid>
                    <Grid item xs={4}>
                      Year: {album.year}
                    </Grid>
                  </Grid>
                  <p
                    style={{
                      marginLeft: 70,
                      marginTop: 70,
                      marginBottom: 70,
                      marginRight: 150,
                    }}
                  >
                    "Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. Nemo
                    enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                    aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                    qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                    velit, sed quia non numquam eius modi tempora incidunt ut
                    labore et dolore magnam aliquam quaerat voluptatem. Ut enim
                    ad minima veniam, quis nostrum exercitationem ullam corporis
                    suscipit laboriosam, nisi ut aliquid ex ea commodi
                    consequatur? Quis autem vel eum iure reprehenderit qui in ea
                    voluptate velit esse quam nihil molestiae consequatur, vel
                    illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                  </p>
                  {reviews.length !== 0 && (
                    <>
                      <h2>Reviews</h2>
                      {reviews.map((review) => (
                        <Stack
                          key={review.id}
                          spacing={2}
                          style={{ marginLeft: 70, marginRight: 150 }}
                        >
                          <b>{review.title}</b>
                          <div>{review.description}</div>
                          <Grid container>
                            <Grid item xs={4}>
                              <Rating
                                name="size-large"
                                readOnly
                                defaultValue={review.score}
                                size="large"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              User: {review.username}
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              Date: {review.date}
                            </Grid>
                          </Grid>
                          <hr style={{ marginLeft: 70, marginRight: 70 }} />
                        </Stack>
                      ))}
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
          <Dialog open={modalOpen} onClose={handleClose}>
            <DialogTitle>Add Review</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the details below to add a review:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                inputProps={{ maxLength: 50 }}
                required
                fullWidth
                variant="standard"
                onChange={(e) => setReviewTitle(e.target.value)}
                value={reviewTitle}
              />
              <TextField
                margin="dense"
                id="description"
                label="Description"
                inputProps={{ maxLength: 250 }}
                required
                multiline
                fullWidth
                variant="standard"
                onChange={(e) => setReviewDescription(e.target.value)}
                value={reviewDescription}
              />

              <Typography
                style={{ marginTop: 20 }}
                component="legend"
                value={reviewRating}
              >
                Rating
              </Typography>
              <Rating
                onChange={(_, v) => setReviewRating(v)}
                name="size-large"
                size="large"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddReview}>Add</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
export default AlbumDetails;
