import axios from "axios";

const API = axios.create({
  baseURL: ,
  withCredentials: true, // IMPORTANT for cookies
});

export default API;
