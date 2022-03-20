import { FetchInstance } from "../utils/";

const login = async (email, password) => {
  try {
    const response = await FetchInstance("login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch {
    return null;
  }
};

export default {
  login,
};
