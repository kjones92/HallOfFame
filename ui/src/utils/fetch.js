import fetchIntercept from "fetch-intercept";
import { TokenService } from "../services";
import LoginUtils from "./login";

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
  const result = await fetch(url, ...params);

  return result;
};

export default fetchInstance;
