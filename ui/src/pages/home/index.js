import { useEffect, useState } from "react";
import { Title } from "../../components";
import AlbumsService from "../../services/albums";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  const getAlbumsData = async () => {
    AlbumsService.getAllAlbums().then((data) => setAlbums(data));
  };

  useEffect(() => {
    getAlbumsData();
  }, []);

  return (
    <>
      <Title title="Top 500" />
      <table>
        <tbody>
          {albums.map((album, i) => (
            <tr key={i}>
              <td>{album.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Albums;
