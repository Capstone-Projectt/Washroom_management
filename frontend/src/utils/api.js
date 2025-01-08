import axios from 'axios';//common
//axios is for sending and fetching data
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default api;