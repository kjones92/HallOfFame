import { FetchInstance } from "../utils/";

const getAllPendingReviews = async () => {
  try {
    const response = await FetchInstance("reviews/pending");
    return await response.json();
  } catch {
    return [];
  }
};

const addReview = async (albumId, title, description, score) => {
  await FetchInstance(`albums/${albumId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ title, description, score }),
  });
};

const updatePendingReview = async (reviewId, reviewStatusId) => {
  await FetchInstance(`reviews/pending/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ review_status_id: reviewStatusId }),
  });
};

const getAllAlbumReviews = async (albumId) => {
  try {
    const response = await FetchInstance(`albums/${albumId}/reviews`);
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllPendingReviews,
  updatePendingReview,
  getAllAlbumReviews,
  addReview,
};
