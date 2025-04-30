import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import requests from "../agent";
export const AuthService = {

    getCurrentUser: () => {
      return requests.get("/users/me");
    }
  };