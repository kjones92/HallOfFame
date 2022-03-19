import { FetchInstance } from "../utils/";

const getAllPendingReviews = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/reviews/pending"
    );
    return await response.json();
  } catch {
    return [];
  }
};

const updatePendingReview = async (reviewId, reviewStatusId) => {
  await FetchInstance(
    `http://localhost:8080/api.php/reviews/pending/${reviewId}`,
    {
      method: "PUT",
      body: JSON.stringify({ review_status_id: reviewStatusId }),
    }
  );
};

const getAllReviews = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/reviews"
    );
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllReviews,
  getAllPendingReviews,
  updatePendingReview,
};
