import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Title } from "../../components";
import {
  Paper,
  Stack,
  Breadcrumbs,
  Link,
  Typography,
  Grid,
  Box,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../../contexts";
import { AlbumService, ReviewService, UserAlbumService } from "../../services";
import { LoginUtils } from "../../utils";
import { NavigationRoutes } from "../../constants";
import noImage from "../../assets/no-album.jpeg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function AlbumDetails() {
  const { state, dispatch } = AuthContext.useLogin();
  const [album, setAlbum] = useState();
  const [userAlbum, setUserAlbum] = useState();
  const [reviews, setReviews] = useState();
  const [loading, setLoading] = useState(true);

  const userId = LoginUtils.getUserId(state.access);
  const navigate = useNavigate();

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

  useEffect(() => {
    initialLoadData(albumId);
  }, [albumId]);

  return (
    <>
      {!loading && (
        <>
          <Stack spacing={2}>
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
          </Stack>
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
        </>
      )}
    </>
  );
}
export default AlbumDetails;
