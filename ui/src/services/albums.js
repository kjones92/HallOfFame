const getAllAlbums = async () => {
  try {
    const response = await fetch("http://localhost:8080/api.php/albums");
    return await response.json();
  } catch {
    alert("something has gone wrong!");
    return [];
  }
};

export default {
  getAllAlbums,
};
