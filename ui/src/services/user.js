import { FetchInstance } from "../utils/";

const getAllUsers = async () => {
  try {
    const response = await FetchInstance("users");
    return await response.json();
  } catch {
    return [];
  }
};

const getUser = async (userId) => {
  try {
    const response = await FetchInstance(`users/${userId}`);
    return await response.json();
  } catch {
    return [];
  }
};

const addUser = async (email, username, password, user_role_id) => {
  return await FetchInstance("users/", {
    method: "POST",
    body: JSON.stringify({ email, username, password, user_role_id }),
  });
};

const registerUser = async (email, username, password) => {
  return await FetchInstance("users/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
};

const saveUser = async (userId, email, username, password, user_role_id) => {
  return await FetchInstance(`users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ email, username, password, user_role_id }),
  });
};

const deleteUser = async (userId) => {
  try {
    const response = await FetchInstance(`users/${userId}`, {
      method: "DELETE",
    });
  } catch {
    alert("something has gone wrong!");
  }
};

export default {
  addUser,
  getUser,
  saveUser,
  deleteUser,
  getAllUsers,
  registerUser,
};
