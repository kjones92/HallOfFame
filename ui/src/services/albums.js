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

const getAlbum = async (albumId) => {
  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/albums/${albumId}`
    );
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return {};
  }
};

const addAlbum = async (title, year, rank, artistId, genreId, subgenreId) => {
  await FetchInstance(`http://localhost:8080/api.php/albums/`, {
    method: "POST",
    body: JSON.stringify({ title, year, rank, artistId, genreId, subgenreId }),
  });
};

export default {
  getAllAlbums,
  addAlbum,
  getAlbum,
};
