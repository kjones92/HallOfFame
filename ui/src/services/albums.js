import { FetchInstance } from "../utils/";

const getAllAlbums = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/albums"
    );
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

export default {
  getAllAlbums,
};
