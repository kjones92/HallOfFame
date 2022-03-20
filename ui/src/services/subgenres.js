import { FetchInstance } from "../utils/";

const getAllSubgenres = async () => {
  try {
    const response = await FetchInstance("subgenres");
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  getAllSubgenres,
};
