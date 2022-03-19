import { FetchInstance } from "../utils/";

const getAllUsers = async () => {
  try {
    const response = await FetchInstance(`http://localhost:8080/api.php/users`);
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

const getUser = async (userId) => {
  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/users/${userId}`
    );
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

const saveUser = async (userId, email, username, password, user_role_id) => {
  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/users/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify({ email, username, password, user_role_id }),
      }
    );
  } catch {
    alert("something has gone wrong!");
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await FetchInstance(
      `http://localhost:8080/api.php/users/${userId}`,
      {
        method: "DELETE",
      }
    );
  } catch {
    alert("something has gone wrong!");
  }
};

export default {
  getUser,
  saveUser,
  deleteUser,
  getAllUsers,
};
