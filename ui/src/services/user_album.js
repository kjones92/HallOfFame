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

export default {
  getUserAlbums,
};
