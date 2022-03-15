import { useEffect, useState } from "react";
import { Title } from "../../components";
import AlbumsService from "../../services/albums";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  const getAlbumsData = async () => {
    debugger;
    AlbumsService.getAllAlbums().then((data) => setAlbums(data));
  };

  useEffect(() => {
    getAlbumsData();
  }, []);

  return (
    <>
      <Title title="Top 500" />
      <table>
        <tr>name</tr>
        {albums.map((album) => (
          <td>{album.name}</td>
        ))}
      </table>
    </>
  );
};
export default Albums;
