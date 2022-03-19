import { FetchInstance } from "../utils";

const getUserAlbums = async (favourite, owned) => {
  const favouriteValue = favourite ? "true" : "false";
  const ownedValue = owned ? "true" : "false";

  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/users/albums?favourite=${favouriteValue}&owned=${ownedValue}`
    );
    return await response.json();
  } catch {
    return [];
  }
};

const getUserAlbum = async (albumId) => {
  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/users/albums/${albumId}`
    );
    return await response.json();
  } catch {
    return { is_favourite: 0, is_owned: 0 };
  }
};

const setUserAlbum = async (is_owned, is_favourite, albumId) => {
  return await FetchInstance(
    `http://localhost:8080/api.php/users/albums/${albumId}`,
    {
      method: "PUT",
      body: JSON.stringify({ is_owned, is_favourite }),
    }
  );
};

export default {
  getUserAlbums,
  getUserAlbum,
  setUserAlbum,
};
