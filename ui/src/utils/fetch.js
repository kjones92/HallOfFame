import fetchIntercept from "fetch-intercept";
import { TokenService } from "../services";
import LoginUtils from "./login";

// use this for remote.
// const configureUrl = (url) =>
// `http://kjones15.webhosting6.eeecs.qub.ac.uk/api.php/${url}`;

// use this for local
const configureUrl = (url) => ` http://localhost:8080/api.php/${url}`;

fetchIntercept.register({
  request: function (url, config) {
    const token = TokenService.getAuth();
    if (token && !LoginUtils.isTokenExpired(token)) {
      config = {
        ...config,
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      };
    }

    return [url, config];
  },
});

const fetchInstance = async (url, ...params) => {
  return await fetch(configureUrl(url), ...params);
};

export default fetchInstance;
