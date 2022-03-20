import { FetchInstance } from "../utils/";

const getAllArtists = async () => {
  try {
    const response = await FetchInstance("artists");
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllArtists,
};
