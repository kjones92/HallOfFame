import { FetchInstance } from "../utils/";

const getAllAlbums = async () => {
  try {
    const response = await FetchInstance("albums");
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

const getAlbum = async (albumId) => {
  const response = await FetchInstance(`albums/${albumId}`);
  if (response.status === 200) {
    return await response.json();
  }
};

const deleteAlbum = async (albumId) => {
  return await FetchInstance(`albums/${albumId}`, {
    method: "DELETE",
  });
};

const addAlbum = async (title, year, rank, artistId, genreId, subgenreId) => {
  return await FetchInstance(`albums/`, {
    method: "POST",
    body: JSON.stringify({ title, year, rank, artistId, genreId, subgenreId }),
  });
};

const editAlbum = async (
  albumId,
  title,
  year,
  rank,
  artistId,
  genreId,
  subgenreId
) => {
  return await FetchInstance(`albums/${albumId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      year,
      rank,
      artistId,
      genreId,
      subgenreId,
    }),
  });
};

export default {
  getAllAlbums,
  addAlbum,
  getAlbum,
  deleteAlbum,
  editAlbum,
};
