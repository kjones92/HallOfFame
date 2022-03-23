import { FetchInstance } from "../utils/";

const login = async (email, password) => {
  return await FetchInstance("login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export default {
  login,
};
