import axios from "axios";

const instance = axios.create({
  baseURL: "https://apiv2.entegrabilisim.com",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const url = config.url;

  if (url?.includes("/api")) {
    return config;
  }

  const user_data = window.localStorage.getItem("user_data_e");
  const parsedUser = user_data ? JSON.parse(user_data) : null;

  if (parsedUser) {
    config.headers.Authorization = `JWT ${parsedUser.token}`;
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*, *";
  }

  return config;
}, Promise.reject);

export default instance;
