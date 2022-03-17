const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8080/api.php/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

export default {
  login,
};
