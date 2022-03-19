import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Title } from "../../components";
import { Button, Grid, Box } from "@mui/material";
import { ReviewService } from "../../services";
import { ReviewStatuses } from "../../constants";
import toast from "react-hot-toast";

const columns = [
  { field: "album_title", headerName: "Album", width: 280 },
  { field: "title", headerName: "Review Title", width: 280 },
  { field: "description", headerName: "Review Comment", width: 450 },
  {
    field: "username",
    headerName: "Username",
    type: "number",
    width: 150,
  },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 200,
  },
  { field: "score", headerName: "Score", width: 70 },
];

export default function PendingReviews() {
  const [selection, setSelection] = useState([]);
  const [reviews, setReviews] = useState([]);

  const getReviewData = async () => {
    ReviewService.getAllPendingReviews().then((data) => setReviews(data ?? []));
  };

  const handleReviewProcessing = async (reviewStatus, reviewText) => {
    const approvals = selection.map((reviewId) =>
      ReviewService.updatePendingReview(reviewId, reviewStatus)
    );

    await Promise.all(approvals);
    toast.success(`Reviews have been ${reviewText}`);
    await getReviewData();
    setSelection([]);
  };

  useEffect(() => {
    getReviewData();
  }, []);

  const handleApproveReviews = async () =>
    handleReviewProcessing(ReviewStatuses.Approved, "Approved");
  const handleRejectReviews = async () =>
    handleReviewProcessing(ReviewStatuses.Rejected, "Rejected");

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Title title="Pending Reviews" />
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
              disabled={selection.length === 0}
              onClick={() => handleRejectReviews()}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              style={{ marginRight: 15 }}
              disabled={selection.length === 0}
              onClick={() => handleApproveReviews()}
            >
              Approve
            </Button>
          </Box>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={reviews}
          onSelectionModelChange={(selections) => setSelection(selections)}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </>
  );
}
