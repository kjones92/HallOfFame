import { FetchInstance } from "../utils/";

const getAllGenres = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/genres"
    );
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllGenres,
};
