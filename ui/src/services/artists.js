import { FetchInstance } from "../utils/";

const getAllArtists = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/artists"
    );
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllArtists,
};
