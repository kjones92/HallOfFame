import jwtDecode from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token || !token.access || !token.refresh) return true;

  const accessToken = jwtDecode(token.access);
  const currentTime = new Date().getTime() / 1000;

  if (currentTime < accessToken.exp) return false;

  const refreshToken = jwtDecode(token.refresh);

  if (currentTime < refreshToken.exp) return false;

  return true;
};

const isAdminUser = (access) => {
  if (typeof access !== "string" || !access) return false;

  const { user_role_id } = jwtDecode(access);

  return user_role_id === 1;
};

const getUsername = (access) => {
  if (typeof access !== "string" || !access) return false;

  const { name } = jwtDecode(access);

  return name;
};

const getUserId = (access) => {
  if (typeof access !== "string" || !access) return false;

  const { sub } = jwtDecode(access);

  return sub;
};

const LoginUtils = {
  isTokenExpired,
  isAdminUser,
  getUsername,
  getUserId,
};

export default LoginUtils;
