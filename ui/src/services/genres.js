import { FetchInstance } from "../utils/";

const getAllGenres = async () => {
  try {
    const response = await FetchInstance("genres");
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllGenres,
};
