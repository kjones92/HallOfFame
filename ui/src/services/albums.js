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
  const response = await FetchInstance(
    `http://localhost:8080/api.php/albums/${albumId}`
  );
  if (response.status === 200) {
    return await response.json();
  }
};

const deleteAlbum = async (albumId) => {
  try {
    await FetchInstance(`http://localhost:8080/api.php/albums/${albumId}`, {
      method: "DELETE",
    });
  } catch {
    alert("something has gone wrong!");
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
  deleteAlbum,
};
