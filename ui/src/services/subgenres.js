import { FetchInstance } from "../utils/";

const getAllSubgenres = async () => {
  try {
    const response = await FetchInstance(
      "http://localhost:8080/api.php/subgenres"
    );
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllSubgenres,
};
