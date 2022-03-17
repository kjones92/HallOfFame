const getAuth = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  return JSON.parse(auth);
};

const setAuth = (auth) => {
  if (auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
  }
};

const removeAuth = () => {
  localStorage.removeItem("auth");
};

export default {
  getAuth,
  setAuth,
  removeAuth,
};
