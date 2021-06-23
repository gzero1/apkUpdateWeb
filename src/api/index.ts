import url from './url';
import axios from 'axios';

const api = axios.create({
  baseURL: url,
})

axios.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem('authToken');

  if (token) {
    config.headers['token'] = `${token}`;
  }
  return config;
})

export default api