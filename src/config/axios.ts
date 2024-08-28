import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_REMOTE_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
export default instance