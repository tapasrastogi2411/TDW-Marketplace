import axios from 'axios'
import Config from "./config.json";

export default axios.create({ 
  baseURL: process.env.REACT_APP_BASE_URL,
})