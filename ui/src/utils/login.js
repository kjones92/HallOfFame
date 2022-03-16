import jwtDecode from "jwt-decode";

const isTokenExpired = (token) => {
  if (typeof token !== "string" || !token)
    throw new Error("Invalid token provided");

  const { exp } = jwtDecode(token);
  const currentTime = new Date().getTime() / 1000;

  return currentTime > exp;
};

const isAdminUser = (token) => {
  if (typeof token !== "string" || !token)
    throw new Error("Invalid token provided");

  const { user_role_id } = jwtDecode(token);

  return user_role_id === 1;
};

const LoginUtils = {
  isTokenExpired,
  isAdminUser,
};

export default LoginUtils;
