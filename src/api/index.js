import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' }
})
request.interceptors.request.use((config) => {
  const tokenStr = localStorage.getItem('token')
  config.headers.Authorization = tokenStr
  return config
})

export default request